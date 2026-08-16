/**
 * The MemoRoll film roster (hbd-15j integration).
 *
 * Two visible films: Wedding Film (the engine in src/lib/wedding-film.ts,
 * per docs/research/memoroll-film-look.md) and None. The fifteen legacy
 * looks of hbd-xs7 are gone from the selector - their recipes died with
 * ctx.filter on iPhones (report §0) - but shots they already developed
 * stay valid forever: pixels are baked (ADR 0006) and Shot.film is a label.
 *
 * Wedding Film has two processing variants. Daylight is provisionally
 * approved. Party is experimental - it lacks a representative low-light
 * phone input - so it is exposed only off-production for real-device
 * testing and never ships to production until explicitly approved.
 */

import type { WeddingFilmVariant } from '@/lib/wedding-film';

export type RollFilmId = 'wedding' | 'none';
export type WeddingVariant = Exclude<WeddingFilmVariant, 'none'>;

export interface RollFilm {
  id: RollFilmId;
  /** Chip label on the camera. */
  name: string;
}

export const ROLL_FILMS: RollFilm[] = [
  { id: 'wedding', name: 'Wedding Film' },
  { id: 'none', name: 'None' },
];

export const DEFAULT_FILM: RollFilmId = 'wedding';
export const DEFAULT_VARIANT: WeddingVariant = 'daylight';

/** The env-flip convention the repo already uses (CLAUDE.md). */
export const IS_PRODUCTION_ENV =
  process.env.NEXT_PUBLIC_APP_ENV === 'production';

/**
 * The stored id a developed Shot carries and the selection key persists:
 * 'wedding-daylight' | 'wedding-party' | 'none'.
 */
export function storedFilmId(
  film: RollFilmId,
  variant: WeddingVariant
): string {
  return film === 'none' ? 'none' : `wedding-${variant}`;
}

/**
 * Map any persisted film id - including the fifteen legacy ids of hbd-xs7 -
 * onto today's selection. 'none' stays None; wedding ids keep their variant
 * (Party only where it is exposed); every legacy or unknown id becomes
 * Wedding Film Daylight, so an old localStorage can never break selection.
 */
export function normalizeStoredFilm(raw: string | null): {
  film: RollFilmId;
  variant: WeddingVariant;
} {
  if (raw === 'none') return { film: 'none', variant: DEFAULT_VARIANT };
  if (raw === 'wedding-party' && !IS_PRODUCTION_ENV) {
    return { film: 'wedding', variant: 'party' };
  }
  return { film: 'wedding', variant: DEFAULT_VARIANT };
}

/**
 * The live preview is an ordinary CSS approximation of the developed look
 * (report §9): grain and bloom are not previewed, and preview and export
 * are NOT pixel-identical - the canvas pixel pipeline is the truth.
 */
export const PREVIEW_CSS: Record<WeddingVariant, string> = {
  daylight: 'saturate(1.1) contrast(1.05) brightness(1.02) sepia(0.08)',
  party: 'saturate(1.15) contrast(1.1) brightness(1.03)',
};

/** Approximate preview vignette strength per variant (report §9 gains). */
export const PREVIEW_VIGNETTE: Record<WeddingVariant, number> = {
  daylight: 0.1,
  party: 0.16,
};
