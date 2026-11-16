/**
 * Free vs premium for gifts and scrapbooks: the one place that says what a
 * plan allows. Every gift and scrapbook form reads its caps from here, never
 * from its template, because the owner rotates which templates are free and
 * which are premium on the backend (owner, 2026-11-17). MemoRoll and the
 * wedding invitation have their own tokens and rules and do not use this.
 *
 * Two balances, never one (owner, 2026-11-17):
 * - gifts spend CREDITS - the profile's `quota`;
 * - scrapbooks spend TOKENS - the profile's `token_scrapbook`.
 *
 * What the backend enforces, checked against the live API on 2026-11-17 with
 * a free account:
 * - one free gift per 24 hours, counted from `last_gift_created_at`, and one
 *   free scrapbook per 24 hours from `last_scrapbook_created_at`; a second
 *   create answers `FREE_PLAN_GIFT_LIMIT_REACHED`;
 * - a DRAFT spends that free slot just as a published gift does;
 * - deleting a gift does not give the slot back;
 * - unlocking needs a credit (`INSUFFICIENT_BASIC_QUOTA` without one).
 * The caps below are NOT enforced by the backend yet: they are the frontend's
 * fence, and the numbers the backend should adopt when it does.
 *
 * Kept as constants in the frontend for now (owner, 2026-11-17: "simpen aja di
 * fe as json atau constants"); when the backend sends limits, this file is the
 * only thing to change.
 */
import type { IProfileResponse } from '@/action/interfaces';

export type Tier = 'free' | 'premium';

export interface PlanLimits {
  /** Photos in a gallery-style field (Netflix gallery, Magazine, Graduation,
   *  Spotify "Moment of You"...). */
  galleryPhotos: number;
  /** Rows in a repeated list (episodes, songs, memories, moments, cards). */
  repeatItems: number;
  /** Largest photo, in megabytes. */
  fileMB: number;
  /** Photos sent to the AI scrapbook generator. */
  scrapbookPhotos: number;
}

export const PLAN_LIMITS: Record<Tier, PlanLimits> = {
  free: {
    galleryPhotos: 5,
    repeatItems: 3,
    fileMB: 2,
    scrapbookPhotos: 4,
  },
  // Generous on purpose: an existing premium gift can hold this many, and
  // editing it must never strand what is already there.
  premium: {
    galleryPhotos: 20,
    repeatItems: 20,
    fileMB: 10,
    scrapbookPhotos: 15,
  },
};

/** How long one free gift or scrapbook blocks the next. */
export const FREE_COOLDOWN_MS = 24 * 60 * 60 * 1000;

type Profile = Pick<
  IProfileResponse,
  | 'type'
  | 'quota'
  | 'token_scrapbook'
  | 'last_gift_created_at'
  | 'last_scrapbook_created_at'
>;

export type Kind = 'gift' | 'scrapbook';

/** What this account can spend on `kind`: credits for a gift, tokens for a
 *  scrapbook. */
export function balanceOf(profile: Profile | null | undefined, kind: Kind) {
  if (!profile) return 0;
  return (kind === 'gift' ? profile.quota : profile.token_scrapbook) ?? 0;
}

/**
 * The tier `kind` is made on. Premium when the account is on a paid plan OR
 * still holds a balance for it - a paid plan whose credits ran out keeps the
 * premium caps until the backend moves it back to free.
 */
export function tierOf(profile: Profile | null | undefined, kind: Kind): Tier {
  if (!profile) return 'free';
  return profile.type === 'premium' || balanceOf(profile, kind) >= 1
    ? 'premium'
    : 'free';
}

export function limitsFor(
  profile: Profile | null | undefined,
  kind: Kind
): PlanLimits {
  return PLAN_LIMITS[tierOf(profile, kind)];
}

/**
 * Whether making this template would need a credit/token: a premium template
 * on an account with nothing to spend. Read from the template's label, which
 * the backend owns and rotates.
 */
export function needsBalance(
  profile: Profile | null | undefined,
  templateLabel: string | undefined,
  kind: Kind
) {
  return templateLabel === 'premium' && balanceOf(profile, kind) < 1;
}

/**
 * When the next free gift or scrapbook may be made, or null when one may be
 * made now (or the account does not live on the free allowance).
 */
export function nextFreeAt(
  profile: Profile | null | undefined,
  kind: Kind,
  now = Date.now()
): Date | null {
  if (!profile || tierOf(profile, kind) === 'premium') return null;
  const last =
    kind === 'gift'
      ? profile.last_gift_created_at
      : profile.last_scrapbook_created_at;
  const at = last ? Date.parse(last) : NaN;
  if (!Number.isFinite(at)) return null;
  const next = at + FREE_COOLDOWN_MS;
  return next > now ? new Date(next) : null;
}

/** "5h 12m" - how long until `when`. */
export function waitLabel(when: Date, now = Date.now()) {
  const minutes = Math.max(1, Math.ceil((when.getTime() - now) / 60000));
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}

/**
 * The backend's plan refusals, in words a person can act on. Anything else
 * comes back as null and the caller shows its own message.
 */
export function planRefusal(
  code: string | undefined,
  profile: Profile | null | undefined,
  kind: Kind
): { title: string; description: string } | null {
  if (!code) return null;
  if (/LIMIT_REACHED/.test(code)) {
    const next = nextFreeAt(profile, kind);
    return {
      title: `You have used today's free ${kind}`,
      description: `${
        next ? `Your next free ${kind} is ready in ${waitLabel(next)}. ` : ''
      }Go Premium to make as many as you like, on every template.`,
    };
  }
  if (/INSUFFICIENT/.test(code)) {
    return {
      title: `No ${kind === 'gift' ? 'credits' : 'tokens'} left`,
      description: `This needs 1 ${
        kind === 'gift' ? 'credit' : 'token'
      }. Get more with Premium.`,
    };
  }
  return null;
}
