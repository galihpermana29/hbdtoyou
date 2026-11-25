import posthog from 'posthog-js';

/**
 * What MemoRoll tells PostHog (owner, 2026-11-23). Before this the product
 * sent nothing of its own: a guest who gave up at the sign-in and a guest
 * whose ten shots never uploaded looked the same from here, which is to say
 * like nothing.
 *
 * One door, so the names stay in one place and nothing personal slips out
 * through a second one. Every event carries where it happened (`surface`:
 * the demo or the product), whose side (`role`), and, where there is one,
 * the roll's own code (`roll_code`) and where its clock stands (`phase`).
 * The roll's code is how an event is read back per wedding: PostHog's group
 * analytics would do that natively but is a paid add-on, and a property
 * breaks down and filters just as well.
 *
 * Never a name, an email, a handle or a photo's address. The code of a roll
 * is on a sign at the venue; nothing here is more private than that.
 */

export type MemoRollSurface = 'demo' | 'product';
/** `admin` is the product's administrator inside somebody else's roll. */
export type MemoRollRole = 'guest' | 'creator' | 'admin';

export interface MemoRollContext {
  surface: MemoRollSurface;
  role: MemoRollRole;
  roll_code?: string;
  /** upcoming, ongoing or revealed (the backend also knows 'locked'). */
  phase?: string;
}

type Value = string | number | boolean | null | undefined;

export type MemoRollEvent =
  // The guest's way in, one per screen they reach.
  | 'memoroll_screen_viewed'
  | 'memoroll_enter_pressed'
  | 'memoroll_joined'
  | 'memoroll_join_failed'
  | 'memoroll_camera_ready'
  | 'memoroll_camera_failed'
  // Shooting, and the shot's way to the server.
  | 'memoroll_shot_taken'
  | 'memoroll_shot_failed'
  | 'memoroll_upload_succeeded'
  | 'memoroll_upload_failed'
  | 'memoroll_left_with_pending'
  // The gallery and the Reveal.
  | 'memoroll_locked_print_tapped'
  | 'memoroll_photo_previewed'
  | 'memoroll_photo_downloaded'
  | 'memoroll_story_shared'
  | 'memoroll_developed'
  // The demo's one job.
  | 'memoroll_demo_phase_changed'
  | 'memoroll_demo_cta_clicked'
  // The creator's side.
  | 'memoroll_create_step_viewed'
  | 'memoroll_create_published'
  | 'memoroll_create_failed'
  | 'memoroll_qr_downloaded'
  | 'memoroll_link_shared'
  | 'memoroll_console_opened'
  | 'memoroll_console_refreshed'
  | 'memoroll_zip_downloaded'
  | 'memoroll_photo_deleted';

/**
 * Where we are, said once by whichever surface is on the page (the guest
 * flow, the demo, the create flow, the console) and read by every event
 * after it. One MemoRoll surface is mounted at a time, so the page's own
 * memory is enough and no screen has to be handed its context to pass down.
 */
let current: MemoRollContext | null = null;
export function setMemoRollContext(context: MemoRollContext) {
  current = context;
}

/**
 * Events said before PostHog has started. The app starts it in an effect of
 * its provider, and a child's effects run before its parent's, so the very
 * first thing a page says (the Cover being seen, which is the top of the
 * whole funnel) would otherwise be said to nobody. They wait here, with the
 * time they happened, and go out once it is up; after ten seconds of nothing
 * (an ad blocker, a missing key) they are let go.
 */
let waiting: Array<{
  event: string;
  properties: Record<string, unknown>;
  at: Date;
}> = [];
let waiter: number | null = null;
function flushWhenReady(tries = 0) {
  waiter = null;
  if ((posthog as unknown as { __loaded?: boolean }).__loaded) {
    const queued = waiting;
    waiting = [];
    queued.forEach(({ event, properties, at }) => {
      try {
        posthog.capture(event, properties, { timestamp: at });
      } catch {
        // Unwatched, as below.
      }
    });
    return;
  }
  if (tries >= 50) {
    waiting = [];
    return;
  }
  waiter = window.setTimeout(() => flushWhenReady(tries + 1), 200);
}

/**
 * Say it. Never in the way: analytics that throws inside a shutter press
 * has cost somebody a photograph, so a failure here is swallowed whole.
 */
export function trackMemoRoll(
  event: MemoRollEvent,
  properties: Record<string, Value> = {}
) {
  try {
    const said = { ...(current ?? {}), ...properties };
    if ((posthog as unknown as { __loaded?: boolean }).__loaded) {
      posthog.capture(event, said);
      return;
    }
    if (typeof window === 'undefined') return;
    waiting.push({ event, properties: said, at: new Date() });
    if (waiter === null) flushWhenReady();
  } catch {
    // Blocked, not loaded yet, or broken: the product carries on unwatched.
  }
}

/** How the phone is held as far as the browser knows, and the page's size. */
export function screenShape() {
  try {
    const angle = window.screen?.orientation?.angle;
    const type = window.screen?.orientation?.type;
    return {
      screen_orientation: type
        ? type.startsWith('landscape')
          ? 'landscape'
          : 'portrait'
        : window.innerWidth > window.innerHeight
          ? 'landscape'
          : 'portrait',
      screen_angle: typeof angle === 'number' ? angle : null,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    };
  } catch {
    return {};
  }
}

/** What kind of connection the browser admits to, where it says at all. */
export function connectionShape() {
  try {
    const connection = (
      navigator as Navigator & {
        connection?: { effectiveType?: string; downlink?: number };
      }
    ).connection;
    return {
      online: navigator.onLine,
      connection_type: connection?.effectiveType ?? null,
      connection_downlink: connection?.downlink ?? null,
    };
  } catch {
    return {};
  }
}
