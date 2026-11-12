/**
 * The MemoRoll film roster.
 *
 * 2026-11-13 (owner): the strip is RAW plus four film-compact looks - Gold,
 * Green, Clean, Teal - approved by the owner on their own photographs
 * against 35mm point-and-shoot references. They replace the five recipes of
 * hbd-sk4 (Wedding Natural, Soft Pastel, Clean Cool, Bold Color, Black &
 * White) in the strip only: those recipes are still in
 * src/lib/memoroll-film.ts, by the owner's instruction, just not offered.
 * Shots baked under any earlier roster remain exactly what they are: pixels
 * are baked at capture (ADR 0006) and Shot.film is only a label.
 *
 * RAW is the label the 2026-08-24 design gives the no-film option (the id
 * stays 'none'): the design's own pills read "Portra 400" three times, which
 * is a placeholder wearing Kodak's trademark, so the roster never shipped
 * those names - the one film-naming deviation ADR 0002 records.
 */

import type { MemoRollLookId } from '@/lib/memoroll-film';

/** The ids a guest can actually select. */
export type SelectableFilmId = 'none' | MemoRollLookId;

export interface RollFilm {
  id: SelectableFilmId;
  /** Chip label on the camera. */
  name: string;
}

export const ROLL_FILMS: RollFilm[] = [
  { id: 'none', name: 'RAW' },
  { id: 'gold', name: 'Gold' },
  { id: 'green', name: 'Green' },
  { id: 'clean', name: 'Clean' },
  { id: 'teal', name: 'Teal' },
];

export const DEFAULT_FILM: SelectableFilmId = 'gold';

const SELECTABLE = new Set<string>(ROLL_FILMS.map((f) => f.id));

/**
 * Map any persisted film id onto today's roster: current ids pass through,
 * 'none' stays RAW, and everything else - the retired recipes of hbd-sk4
 * ('wedding-natural' and its four siblings), hbd-xs7's fifteen legacy ids,
 * unknown values - becomes Gold, so an old localStorage can never break
 * selection or leave a guest on a film the strip no longer shows.
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
 * pixel-identical. Grain, halation and the soft lens are not previewed.
 */
export const PREVIEW_CSS: Record<SelectableFilmId, string | undefined> = {
  none: undefined,
  gold: 'saturate(1.05) contrast(1.1) brightness(0.98) sepia(0.22)',
  green: 'saturate(1) contrast(1.08) brightness(0.98) hue-rotate(-6deg)',
  clean: 'saturate(1.02) contrast(1.06) brightness(1.04) hue-rotate(-4deg)',
  teal: 'saturate(0.95) contrast(1.1) brightness(0.97) hue-rotate(-10deg)',
};

/** Approximate preview vignette strength per film (engine corner gains). */
export const PREVIEW_VIGNETTE: Record<SelectableFilmId, number> = {
  none: 0,
  gold: 0.22,
  green: 0.22,
  clean: 0.22,
  teal: 0.22,
};
