/**
 * MemoRoll film renderer (hbd-sk4 quality iteration).
 *
 * Canvas 2D pixel pipeline, generalized from the Wedding Film engine of
 * hbd-15j: one preset registry, per-channel 256-entry LUT tone curves
 * (Fritsch-Carlson monotone cubic), saturation around Rec. 709 luma, a
 * cos4-shaped vignette gain, and a luminance-masked highlight bloom for the
 * parked low-light preset. Synthetic grain is GONE - not zeroed, removed:
 * the generation and application stages no longer exist, so every render is
 * deterministic (docs/research/memoroll-film-look.md records why).
 *
 * Compatibility invariants: no ctx.filter anywhere, no SVG filters, blurs
 * only via scale-down/up draws - every pass runs on Safari. The pixel pass
 * mutates ImageData so callers can assert on it pre-encode. Date stamp and
 * watermark remain the camera's job (ADR 0006's bake-at-capture contract
 * is unchanged; only the artifact's resolution grew to 960x1280).
 */

export type MemoRollFilmId =
  | 'none'
  | 'wedding-natural'
  | 'soft-pastel'
  | 'clean-cool'
  | 'bold-color'
  | 'black-white'
  | 'party';

interface PresetParams {
  master: [number, number][];
  redOffset: (x: number) => number;
  blueOffset: (x: number) => number;
  /** Saturation coefficient k in s' = s + k*s*(1-s); negative desaturates. */
  saturation: number;
  /** Convert to Rec. 709 luminance before the curve (Black & White). */
  mono?: boolean;
  vignetteMinGain: number;
  bloom: {
    threshold: number;
    tint: [number, number, number];
    alpha: number;
  } | null;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const NO_OFFSET = () => 0;

/**
 * The registry. 'party' is parked: kept for the pending low-light work of
 * hbd-sk4 but absent from every selector until a representative input
 * approves it. All color values are original MemoRoll recipes derived from
 * the reference study - no third-party LUTs or recipes are copied.
 */
const PRESETS: Record<Exclude<MemoRollFilmId, 'none'>, PresetParams> = {
  // The approved Wedding Daylight color and tone of hbd-15j, unchanged
  // except that grain no longer exists anywhere in the renderer.
  'wedding-natural': {
    master: [
      [0, 0.031],
      [0.06, 0.075],
      [0.25, 0.26],
      [0.5, 0.54],
      [0.75, 0.78],
      [0.92, 0.885],
      [1.0, 0.93],
    ],
    redOffset: (x) => (x <= 0.75 ? 0 : 0.02 * ((x - 0.75) / 0.25)),
    blueOffset: (x) =>
      x <= 0.5
        ? lerp(-0.055, -0.02, x / 0.5)
        : lerp(-0.02, -0.04, (x - 0.5) / 0.5),
    saturation: 0.15,
    vignetteMinGain: 0.9,
    bloom: null,
  },
  // Lifted shadows, soft contrast, gentle warmth in the upper mids that
  // returns to neutral at white, slight desaturation - skin-safe pastel.
  'soft-pastel': {
    master: [
      [0, 0.05],
      [0.08, 0.115],
      [0.3, 0.34],
      [0.55, 0.585],
      [0.8, 0.8],
      [1.0, 0.88],
    ],
    redOffset: (x) =>
      0.015 * (smoothstep(0.4, 0.65, x) - smoothstep(0.8, 1, x)),
    blueOffset: (x) => -0.02 * (1 - smoothstep(0.6, 1, x)),
    saturation: -0.12,
    vignetteMinGain: 0.94,
    bloom: null,
  },
  // Clean daylight, slightly cool through the mids, neutral skin and
  // whites; greens stay themselves because nothing rotates hue.
  'clean-cool': {
    master: [
      [0, 0.02],
      [0.25, 0.255],
      [0.5, 0.515],
      [0.75, 0.775],
      [0.92, 0.9],
      [1.0, 0.955],
    ],
    redOffset: (x) =>
      -0.008 * (smoothstep(0.1, 0.35, x) - smoothstep(0.7, 1, x)),
    blueOffset: (x) =>
      0.018 * (smoothstep(0.05, 0.3, x) - smoothstep(0.75, 1, x)),
    saturation: 0.06,
    vignetteMinGain: 0.95,
    bloom: null,
  },
  // Richer saturation with deeper - but not crushed - shadows; channel
  // offsets stay at zero so skin never drifts orange.
  'bold-color': {
    master: [
      [0, 0.012],
      [0.08, 0.06],
      [0.3, 0.3],
      [0.55, 0.6],
      [0.8, 0.82],
      [1.0, 0.945],
    ],
    redOffset: NO_OFFSET,
    blueOffset: NO_OFFSET,
    saturation: 0.3,
    vignetteMinGain: 0.92,
    bloom: null,
  },
  // Natural Rec. 709 luminance conversion, then an S-curve with a readable
  // toe and a controlled shoulder.
  'black-white': {
    master: [
      [0, 0.03],
      [0.15, 0.13],
      [0.4, 0.4],
      [0.65, 0.7],
      [0.9, 0.895],
      [1.0, 0.94],
    ],
    redOffset: NO_OFFSET,
    blueOffset: NO_OFFSET,
    saturation: 0,
    mono: true,
    vignetteMinGain: 0.93,
    bloom: null,
  },
  // Parked (hbd-sk4): the low-light candidate, grain removed like the rest,
  // highlight bloom kept. Not selectable anywhere.
  party: {
    master: [
      [0, 0.055],
      [0.08, 0.1],
      [0.3, 0.32],
      [0.55, 0.62],
      [0.8, 0.82],
      [1.0, 0.92],
    ],
    redOffset: (x) => (x <= 0.7 ? 0 : 0.02 * ((x - 0.7) / 0.3)),
    blueOffset: (x) => -0.1 + 0.07 * smoothstep(0.2, 0.7, x),
    saturation: 0.22,
    vignetteMinGain: 0.84,
    bloom: { threshold: 240, tint: [255, 140, 90], alpha: 0.15 },
  },
};

/* ----------------------- tone curves ----------------------- */

/**
 * Fritsch-Carlson monotone cubic through the control points: tangents are
 * clamped so the interpolant can neither overshoot nor oscillate.
 */
function monotoneCubic(points: [number, number][]): (x: number) => number {
  const n = points.length;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(xs[i + 1] - xs[i]);
    slope.push((ys[i + 1] - ys[i]) / dx[i]);
  }
  const m: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) {
      m.push(0);
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      m.push((w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]));
    }
  }
  m.push(slope[n - 2]);
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = n - 2;
    for (let k = 0; k < n - 1; k++) {
      if (x < xs[k + 1]) {
        i = k;
        break;
      }
    }
    const t = (x - xs[i]) / dx[i];
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return (
      h00 * ys[i] +
      h10 * dx[i] * m[i] +
      h01 * ys[i + 1] +
      h11 * dx[i] * m[i + 1]
    );
  };
}

interface Luts {
  r: Uint8Array;
  g: Uint8Array;
  b: Uint8Array;
}

const lutCache: Partial<Record<string, Luts>> = {};

/** R = m + redOffset, G = m, B = m + blueOffset, each clamped to 0..255. */
function lutsFor(preset: Exclude<MemoRollFilmId, 'none'>): Luts {
  const cached = lutCache[preset];
  if (cached) return cached;
  const params = PRESETS[preset];
  const master = monotoneCubic(params.master);
  const r = new Uint8Array(256);
  const g = new Uint8Array(256);
  const b = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    const m = master(x);
    r[i] = Math.round(clamp01(m + params.redOffset(x)) * 255);
    g[i] = Math.round(clamp01(m) * 255);
    b[i] = Math.round(clamp01(m + params.blueOffset(x)) * 255);
  }
  const luts = { r, g, b };
  lutCache[preset] = luts;
  return luts;
}

/* ----------------------- vignette ----------------------- */

const vignetteCache: Record<string, Float32Array> = {};

/**
 * cos4-shaped radial gain: the natural-falloff curve, rescaled so the
 * corner sits exactly at the preset's minimum gain. Half-angle 30 degrees.
 */
function vignetteMap(
  width: number,
  height: number,
  minGain: number
): Float32Array {
  const key = `${width}x${height}:${minGain}`;
  const cached = vignetteCache[key];
  if (cached) return cached;
  const map = new Float32Array(width * height);
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  const tanMax = Math.tan(Math.PI / 6);
  const cos4 = (theta: number) => Math.cos(theta) ** 4;
  const floorAtCorner = cos4(Math.PI / 6);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
      const falloff = (1 - cos4(Math.atan(r * tanMax))) / (1 - floorAtCorner);
      map[y * width + x] = 1 - (1 - minGain) * falloff;
    }
  }
  vignetteCache[key] = map;
  return map;
}

/* ----------------------- the pixel pass ----------------------- */

export interface BakeTimings {
  /** LUT + saturation + vignette in one deterministic pass. */
  colorMs: number;
  /** Highlight bloom pass (0 when the preset has none). */
  bloomMs: number;
  /** putImageData back onto the working canvas. */
  finalizeMs: number;
}

/**
 * The color stage plus vignette, in one deterministic pass over the pixels.
 * Mutates `image` in place so callers can assert on it before any encode.
 * 'none' is a strict identity. Returns the elapsed milliseconds.
 */
export function applyMemoRollFilmPixels(
  image: ImageData,
  preset: MemoRollFilmId
): number {
  if (preset === 'none') return 0;
  const start = performance.now();
  const params = PRESETS[preset];
  const { r: lutR, g: lutG, b: lutB } = lutsFor(preset);
  const vig = vignetteMap(image.width, image.height, params.vignetteMinGain);
  const d = image.data;
  const k = params.saturation;
  const mono = params.mono === true;
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    let r0 = d[i];
    let g0 = d[i + 1];
    let b0 = d[i + 2];
    if (mono) {
      const l = Math.round(0.2126 * r0 + 0.7152 * g0 + 0.0722 * b0);
      r0 = l;
      g0 = l;
      b0 = l;
    }
    let r = lutR[r0];
    let g = lutG[g0];
    let b = lutB[b0];

    if (!mono && k !== 0) {
      // Saturation around Rec. 709 luma; negative k moves toward pastel.
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      const s = (mx - mn) / 255;
      if (s > 0) {
        const sTarget = clamp01(s + k * s * (1 - s));
        const factor = sTarget / s;
        r = lum + (r - lum) * factor;
        g = lum + (g - lum) * factor;
        b = lum + (b - lum) * factor;
      }
    }

    const gain = vig[p];
    d[i] = Math.max(0, Math.min(255, r * gain));
    d[i + 1] = Math.max(0, Math.min(255, g * gain));
    d[i + 2] = Math.max(0, Math.min(255, b * gain));
  }
  return performance.now() - start;
}

/**
 * Highlight bloom (parked 'party' preset only). The mask thresholds the
 * ORIGINAL pre-LUT frame - the party shoulder caps processed whites below
 * the threshold, so masking the processed image would starve the bloom.
 * Source highlights glow; the tinted, blurred mask screens over the
 * processed canvas. Touches highlights only, never the whole frame.
 * Conceptually distinct from Flash (synchronized fill light at capture),
 * Torch (continuous LED), and the shutter's white-screen feedback.
 */
export function applyHighlightBloom(
  canvas: HTMLCanvasElement,
  source: CanvasImageSource,
  preset: MemoRollFilmId
): number {
  if (preset === 'none') return 0;
  const params = PRESETS[preset];
  if (!params.bloom) return 0;
  const start = performance.now();
  const { threshold, tint, alpha } = params.bloom;

  const qw = Math.max(1, Math.round(canvas.width / 4));
  const qh = Math.max(1, Math.round(canvas.height / 4));
  const quarter = document.createElement('canvas');
  quarter.width = qw;
  quarter.height = qh;
  const qctx = quarter.getContext('2d', { willReadFrequently: true })!;
  qctx.drawImage(source, 0, 0, qw, qh);
  const mask = qctx.getImageData(0, 0, qw, qh);
  const md = mask.data;
  for (let i = 0; i < md.length; i += 4) {
    const lum = 0.2126 * md[i] + 0.7152 * md[i + 1] + 0.0722 * md[i + 2];
    if (lum >= threshold) {
      md[i] = tint[0];
      md[i + 1] = tint[1];
      md[i + 2] = tint[2];
    } else {
      md[i] = 0;
      md[i + 1] = 0;
      md[i + 2] = 0;
    }
  }
  qctx.putImageData(mask, 0, 0);

  // One down/up-scale cycle stands in for a blur.
  const eighth = document.createElement('canvas');
  eighth.width = Math.max(1, Math.round(qw / 2));
  eighth.height = Math.max(1, Math.round(qh / 2));
  eighth
    .getContext('2d')!
    .drawImage(quarter, 0, 0, eighth.width, eighth.height);
  qctx.clearRect(0, 0, qw, qh);
  qctx.drawImage(eighth, 0, 0, qw, qh);

  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(quarter, 0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  return performance.now() - start;
}

/**
 * Bake a full frame: color pass, then bloom where the preset has one.
 * Draws `source` onto a fresh canvas first, so the caller's canvas is never
 * mutated. Deterministic: the same source and preset always produce the
 * same pixels. The camera adds its date stamp, watermark and JPEG encode
 * after this returns.
 *
 * Named for what ADR 0006's amendment calls the pixel pipeline: a Shot is
 * baked at capture. Developing is the guest's ceremony in the Dark Room,
 * and happens long after this function has already settled the pixels.
 */
export function bakeMemoRollFilm(
  source: CanvasImageSource,
  width: number,
  height: number,
  preset: MemoRollFilmId
): { canvas: HTMLCanvasElement; timings: BakeTimings } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(source, 0, 0, width, height);

  const preLut = document.createElement('canvas');
  preLut.width = Math.max(1, Math.round(width / 4));
  preLut.height = Math.max(1, Math.round(height / 4));
  preLut.getContext('2d')!.drawImage(canvas, 0, 0, preLut.width, preLut.height);

  const image = ctx.getImageData(0, 0, width, height);
  const colorMs = applyMemoRollFilmPixels(image, preset);
  const finalizeStart = performance.now();
  ctx.putImageData(image, 0, 0);
  const finalizeMs = performance.now() - finalizeStart;
  const bloomMs = applyHighlightBloom(canvas, preLut, preset);
  return { canvas, timings: { colorMs, bloomMs, finalizeMs } };
}
