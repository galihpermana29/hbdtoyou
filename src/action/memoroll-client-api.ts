/**
 * The memoroll calls a browser makes for itself.
 *
 * Same reason and same shape as `wedding-client-api.ts` (2026-08-30): a
 * person actively waiting - a creator publishing, a guest joining, a Shot
 * registering - must not have their call ride a Vercel server action with a
 * ten-second ceiling against a backend we have twice clocked hanging for
 * ninety. Browser to backend, `/api/session` for the bearer, no middleman
 * with a clock.
 *
 * The server actions in `memoroll-api.ts` stay for what renders on the
 * server: the dashboard listings, the console's page load, the guest page's
 * unauthenticated preview.
 */

import type {
  IMemorollCreatedResponse,
  IMemorollEventResponse,
  IMemorollGalleryPhoto,
  IMemorollGalleryResponse,
  IMemorollPayload,
  IMemorollUpdatePayload,
  Meta,
} from './interfaces';
import type { IGlobalResponse } from './user-api';

const baseUri =
  process.env.NEXT_PUBLIC_APP_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URI
    : process.env.NEXT_PUBLIC_STAGING_API;

type MemorollResult<T> = IGlobalResponse<null | T> & { meta: Meta | null };

/**
 * An abort signal that fires after `ms`. `AbortSignal.timeout` is missing
 * before iOS 16, and calling it there throws - which would turn every call
 * into a failure - so older phones get the same thing by hand.
 */
export function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/** How long the bearer lookup may take before the call gives up. */
const SESSION_TIMEOUT_MS = 15_000;

/**
 * How long a Shot's registration may take (2026-11-27). Without a ceiling a
 * hung request held the whole upload queue - every later Shot waited behind
 * it. Generous, because a registration that lands after we gave up is
 * retried and registered twice.
 */
export const REGISTER_TIMEOUT_MS = 30_000;

/**
 * One memoroll call, browser to backend, every failure an answer.
 *
 * `auth: false` is the unauthenticated preview's mode; everything else
 * carries the session, and a browser without one gets a refusal in the
 * envelope rather than a throw.
 */
async function callMemoroll<T>(
  path: string,
  init?: {
    method?: string;
    body?: unknown;
    auth?: boolean;
    /** Abort after this long; the caller owns what happens next. */
    timeoutMs?: number;
  }
): Promise<MemorollResult<T>> {
  const headers: Record<string, string> = { 'X-Source': 'web' };
  if (init?.body !== undefined) headers['Content-Type'] = 'application/json';

  if (init?.auth !== false) {
    let session: { userId?: string; accessToken?: string } | null = null;
    try {
      session = await fetch('/api/session', {
        signal: timeoutSignal(SESSION_TIMEOUT_MS),
      }).then((res) => res.json());
    } catch {
      session = null;
    }
    if (!session?.accessToken) {
      return {
        success: false,
        message: 'You are not signed in',
        data: null,
        meta: null,
      };
    }
    headers['X-UserID'] = session.userId!;
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  let res: Response;
  try {
    res = await fetch(`${baseUri}/memoroll${path}`, {
      method: init?.method ?? 'GET',
      headers,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal:
        init?.timeoutMs !== undefined
          ? timeoutSignal(init.timeoutMs)
          : undefined,
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      data: null,
      meta: null,
    };
  }

  let parsed: {
    data?: T;
    meta?: Meta;
    message?: string;
    status?: string;
    errors?: string[];
  } | null = null;
  try {
    parsed = await res.json();
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    return {
      success: false,
      message: parsed?.errors?.[0] || parsed?.status || res.statusText,
      data: null,
      meta: null,
    };
  }

  return {
    success: true,
    message: parsed?.message ?? res.statusText,
    data: parsed?.data ?? null,
    meta: parsed?.meta ?? null,
  };
}

export async function createMemorollEventClient(
  payload: IMemorollPayload
): Promise<IGlobalResponse<null | IMemorollCreatedResponse>> {
  // Twenty seconds of patience, not ninety: the backend's create has hung
  // for ~90s three times (2026-08-30) while making the event anyway, so a
  // create that outlives this window is abandoned as ambiguous and the
  // caller's orphan hunt takes over - the listing answers in a second.
  return callMemoroll<IMemorollCreatedResponse>('', {
    method: 'POST',
    body: payload,
    timeoutMs: 20_000,
  });
}

export async function publishMemorollEventClient(
  eventId: string
): Promise<IGlobalResponse<null | { status: string }>> {
  return callMemoroll<{ status: string }>(
    `/${encodeURIComponent(eventId)}/publish`,
    { method: 'PUT' }
  );
}

export async function getOwnedMemorollEventClient(
  eventId: string
): Promise<IGlobalResponse<null | IMemorollEventResponse>> {
  return callMemoroll<IMemorollEventResponse>(
    `/${encodeURIComponent(eventId)}`
  );
}

export async function listOwnedMemorollEventsClient(
  limit: string,
  page: string
): Promise<MemorollResult<IMemorollEventResponse[]>> {
  return callMemoroll<IMemorollEventResponse[]>(
    `?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`
  );
}

/**
 * The gallery as this signed-in guest - the join, the refresh, the poll.
 * The unauthenticated preview stays a server-side read on the guest page;
 * nothing in the browser asks for it.
 */
export async function readMemorollGalleryClient(
  code: string,
  page = 1,
  limit = 100
): Promise<MemorollResult<IMemorollGalleryResponse>> {
  return callMemoroll<IMemorollGalleryResponse>(
    `/${encodeURIComponent(code)}/gallery?page=${page}&limit=${limit}`
  );
}

/**
 * Ask the backend to send this guest the MemoRoll welcome email (2026-11-13).
 * POST /memoroll/{code}/welcome, no body, as the signed-in guest. The guest
 * page calls it once a "Get me in" has joined, and only once per guest per
 * roll on this device; the email is a courtesy, so a failure is not shown.
 */
export async function sendMemorollWelcomeClient(
  code: string
): Promise<MemorollResult<unknown>> {
  return callMemoroll<unknown>(`/${encodeURIComponent(code)}/welcome`, {
    method: 'POST',
    timeoutMs: 15_000,
  });
}

export async function submitMemorollPhotoClient(
  code: string,
  photoUrl: string,
  displayName?: string
): Promise<IGlobalResponse<null | IMemorollGalleryPhoto>> {
  return callMemoroll<IMemorollGalleryPhoto>(
    `/${encodeURIComponent(code)}/photos`,
    {
      method: 'POST',
      body: displayName
        ? { photo_url: photoUrl, display_name: displayName }
        : { photo_url: photoUrl },
      timeoutMs: REGISTER_TIMEOUT_MS,
    }
  );
}

export async function updateMemorollEventClient(
  eventId: string,
  payload: IMemorollUpdatePayload
): Promise<IGlobalResponse<null>> {
  return callMemoroll<null>(`/${encodeURIComponent(eventId)}`, {
    method: 'PUT',
    body: payload,
  });
}

/**
 * Delete a whole event (admin guide, 2026-11-26, section 2.4). Permanent on
 * the backend: the event, its content, its participants and its photo
 * records go, and nothing brings them back. An owner may delete their own;
 * an administrator, anybody's. The one caller asks for the roll's code to be
 * typed first.
 */
export async function deleteMemorollEventClient(
  eventId: string
): Promise<IGlobalResponse<string>> {
  return callMemoroll<string>(`/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
  });
}

export async function deleteMemorollPhotoClient(
  eventId: string,
  photoId: string
): Promise<IGlobalResponse<null>> {
  return callMemoroll<null>(
    `/${encodeURIComponent(eventId)}/photos/${encodeURIComponent(photoId)}`,
    { method: 'DELETE' }
  );
}

/**
 * One page of every photo in an event the caller owns - veiled or not - from
 * the browser, for the console's Download all, which pages through the whole
 * roll rather than the hundred the console shows.
 */
export async function listMemorollPhotosClient(
  eventId: string,
  page: number,
  limit: number
): Promise<MemorollResult<IMemorollGalleryPhoto[]>> {
  return callMemoroll<IMemorollGalleryPhoto[]>(
    `/${encodeURIComponent(eventId)}/photos?page=${page}&limit=${limit}`
  );
}
