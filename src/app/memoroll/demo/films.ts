/**
 * The films a Shot can develop through (hbd-xs7). The guest picks one on the
 * camera, per shot, before the shutter - the couple has no say. Each recipe
 * imitates the real stock it is named after; ADR 0006 is why the look bakes
 * into the JPEG at capture instead of riding along as metadata.
 */

export interface Film {
  id: string;
  /** The stock or device the look imitates, shown on the chip. */
  name: string;
  /** CSS/canvas filter chain; empty means plain digital. */
  filter: string;
  /** 0..1 edge-darkening strength drawn after the filter pass. */
  vignette: number;
  /** A translucent color washed over the whole frame (800T cool, 600 fade). */
  wash?: string;
  /** 0..1 monochrome grain strength. */
  grain?: number;
  /** 0..1 alpha of a blurred copy over the sharp frame (toy-cam dreaminess). */
  softFocus?: number;
  /** 0..1 alpha of a bright blurred screen pass (on-camera flash bloom). */
  bloom?: number;
  /** Warm gradient leak screened in from a random edge, one corner per shot. */
  lightLeak?: boolean;
  /** Camcorder scan lines plus a hue-shifted ghost for the color bleed. */
  vhs?: boolean;
}

export const FILMS: Film[] = [
  {
    // The drugstore roll: warm, golden, forgiving.
    id: 'gold200',
    name: 'Kodak Gold 200',
    filter: 'sepia(0.25) saturate(1.12) contrast(1.05) brightness(1.03)',
    vignette: 0.25,
  },
  {
    // Soft pastel warmth, low contrast, flattering skin.
    id: 'portra400',
    name: 'Portra 400',
    filter: 'sepia(0.12) saturate(0.88) contrast(0.92) brightness(1.05)',
    vignette: 0.15,
  },
  {
    // Cooler, green-teal cast, punchy mids.
    id: 'superia400',
    name: 'Superia 400',
    filter: 'hue-rotate(-8deg) saturate(1.08) contrast(1.06)',
    vignette: 0.2,
  },
  {
    // Tungsten night film: cool blue, deep contrast. The real stock's red
    // halation glow has no honest canvas approximation, so it is left out.
    id: 'cinestill800t',
    name: 'CineStill 800T',
    filter: 'saturate(0.85) contrast(1.12) brightness(0.96)',
    vignette: 0.3,
    wash: 'rgba(56, 82, 160, 0.16)',
  },
  {
    // Washed, faded, creamy highlights, heavy vignette.
    id: 'polaroid600',
    name: 'Polaroid 600',
    filter: 'saturate(0.72) contrast(0.82) brightness(1.1)',
    vignette: 0.45,
    wash: 'rgba(255, 248, 238, 0.16)',
  },
  {
    // Cross-processed slide film: oversaturated, shifted, dark corners.
    id: 'lomoxpro',
    name: 'Lomo X-Pro',
    filter: 'saturate(1.45) contrast(1.25) hue-rotate(-4deg)',
    vignette: 0.55,
  },
  {
    // Black & white, grainy, high contrast.
    id: 'hp5',
    name: 'Ilford HP5',
    filter: 'grayscale(1) contrast(1.15)',
    vignette: 0.3,
    grain: 0.14,
  },
  // The Dazz-inspired device looks (hbd-xs7 follow-up): each imitates a
  // device category rather than a stock, and leans on texture passes -
  // leaks, bloom, soft focus, scan lines - more than on color alone.
  {
    // Warm consumer 35mm (Dazz's "135 SR" territory).
    id: 'warm35',
    name: '35mm',
    filter: 'sepia(0.22) saturate(1.15) contrast(1.06) brightness(1.02)',
    vignette: 0.2,
    grain: 0.08,
  },
  {
    // Clean late-90s compact ("D Classic" / "NT16" territory).
    id: 'pointshoot',
    name: 'Point & Shoot',
    filter: 'saturate(1.05) contrast(1.04) brightness(1.03) sepia(0.06)',
    vignette: 0.1,
    grain: 0.04,
  },
  {
    // Kodak Fun Saver energy: warm, harsh flash bloom, grain ("D Fun S").
    id: 'disposable',
    name: 'Disposable',
    filter: 'sepia(0.18) saturate(1.08) contrast(1.1) brightness(1.04)',
    vignette: 0.35,
    grain: 0.1,
    bloom: 0.28,
  },
  {
    // Holga-style toy camera: washed, dreamy, leaking light ("Hoga").
    id: 'toycam',
    name: 'Toy Cam',
    filter: 'saturate(0.8) contrast(0.85) brightness(1.08) sepia(0.1)',
    vignette: 0.5,
    grain: 0.09,
    softFocus: 0.45,
    lightLeak: true,
  },
  {
    // Shifted-hue experimental film, hotter than Lomo X-Pro ("D Exp").
    id: 'crossprocess',
    name: 'Cross-process',
    filter: 'saturate(1.5) contrast(1.28) hue-rotate(-12deg)',
    vignette: 0.45,
    grain: 0.12,
  },
  {
    // High-contrast street monochrome, grittier than HP5 ("FXN R").
    id: 'bwstreet',
    name: 'B&W Street',
    filter: 'grayscale(1) contrast(1.3) brightness(1.02)',
    vignette: 0.3,
    grain: 0.16,
  },
  {
    // 80s-90s camcorder: washed color, scan lines, channel bleed ("VHS").
    id: 'vhs',
    name: 'VHS',
    filter: 'saturate(0.75) contrast(0.92) brightness(1.05)',
    vignette: 0.2,
    grain: 0.1,
    vhs: true,
  },
  {
    // Plain digital, as shot. No filter, no date stamp - only the watermark.
    id: 'none',
    name: 'None',
    filter: '',
    vignette: 0,
  },
];

/** The camera opens on the drugstore roll and stays on the last pick. */
export const DEFAULT_FILM_ID = 'gold200';

export function filmById(id: string | undefined): Film {
  return (
    FILMS.find((f) => f.id === id) ?? FILMS.find((f) => f.id === 'none')!
  );
}
