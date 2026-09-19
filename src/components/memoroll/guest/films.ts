/**
 * The MemoRoll film roster (hbd-sk4 quality iteration).
 *
 * Six visible films, all rendered by src/lib/memoroll-film.ts. Every look
 * is an original MemoRoll recipe; the parked low-light 'party' preset stays
 * out of every selector until a representative input approves it. Shots
 * baked under earlier rosters remain exactly what they are: pixels are
 * baked at capture (ADR 0006) and Shot.film is only a label.
 *
 * RAW is the label the 2026-08-24 design gives the no-film option (the id
 * stays 'none'): the design's own pills read "Portra 400" three times, which
 * is a placeholder wearing Kodak's trademark, so the roster ships as RAW plus
 * the five original recipes - the one film-naming deviation ADR 0002 records.
 */

import type { MemoRollFilmId } from '@/lib/memoroll-film';

/** The ids a guest can actually select. */
export type SelectableFilmId = Exclude<MemoRollFilmId, 'party'>;

export interface RollFilm {
  id: SelectableFilmId;
  /** Chip label on the camera. */
  name: string;
}

export const ROLL_FILMS: RollFilm[] = [
  { id: 'none', name: 'RAW' },
  { id: 'wedding-natural', name: 'Wedding Natural' },
  { id: 'soft-pastel', name: 'Soft Pastel' },
  { id: 'clean-cool', name: 'Clean Cool' },
  { id: 'bold-color', name: 'Bold Color' },
  { id: 'black-white', name: 'Black & White' },
];

export const DEFAULT_FILM: SelectableFilmId = 'wedding-natural';

const SELECTABLE = new Set<string>(ROLL_FILMS.map((f) => f.id));

/**
 * Map any persisted film id onto today's roster: current ids pass through,
 * 'none' stays RAW, and everything else - hbd-xs7's fifteen legacy ids,
 * hbd-15j's 'wedding-daylight'/'wedding-party', unknown values - becomes
 * Wedding Natural, so an old localStorage can never break selection.
 */
export function normalizeStoredFilm(raw: string | null): SelectableFilmId {
  if (raw && SELECTABLE.has(raw)) return raw as SelectableFilmId;
  if (raw === 'none') return 'none';
  return DEFAULT_FILM;
}

/** Films that burn the date stamp; RAW stays plain (watermark only). */
export function filmStamps(film: SelectableFilmId): boolean {
  return film !== 'none';
}

/**
 * The live preview is an ordinary CSS approximation of the baked look:
 * the canvas pixel pipeline is the truth, and preview and export are NOT
 * pixel-identical.
 */
export const PREVIEW_CSS: Record<SelectableFilmId, string | undefined> = {
  none: undefined,
  'wedding-natural':
    'saturate(1.1) contrast(1.05) brightness(1.02) sepia(0.08)',
  'soft-pastel': 'saturate(0.9) contrast(0.95) brightness(1.06) sepia(0.05)',
  'clean-cool': 'saturate(1.05) contrast(1.04) brightness(1.02)',
  'bold-color': 'saturate(1.35) contrast(1.12)',
  'black-white': 'grayscale(1) contrast(1.15)',
};

/** Approximate preview vignette strength per film (engine corner gains). */
export const PREVIEW_VIGNETTE: Record<SelectableFilmId, number> = {
  none: 0,
  'wedding-natural': 0.1,
  'soft-pastel': 0.06,
  'clean-cool': 0.05,
  'bold-color': 0.08,
  'black-white': 0.07,
};
