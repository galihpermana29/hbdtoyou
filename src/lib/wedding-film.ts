/**
 * Wedding Film rendering engine (hbd-15j phase one).
 *
 * Implements docs/research/memoroll-film-look.md §9 exactly: per-channel
 * 256-entry LUT tone curves (Fritsch-Carlson monotone cubic), saturation
 * around Rec. 709 luma, per-shot spatially-correlated grain weighted by
 * w(L) = 1 - 0.85*smoothstep(0.45, 0.98, L), a cos4-shaped vignette gain,
 * and a luminance-masked highlight bloom for the Party variant.
 *
 * Compatibility invariants (report §9): no ctx.filter anywhere, no SVG
 * filters, blurs only via scale-down/up draws - every pass runs on Safari.
 * The pixel pass mutates ImageData so callers can assert on it pre-JPEG.
 *
 * Not integrated into the MemoRoll camera yet; date stamp and watermark
 * remain the camera's job at integration time.
 */

export type WeddingFilmVariant = 'daylight' | 'party' | 'none';

interface VariantParams {
  master: [number, number][];
  redOffset: (x: number) => number;
  blueOffset: (x: number) => number;
  saturation: number;
  grainAmplitude: number; // in 1/255 units
  grainScale: number;
  vignetteMinGain: number;
  bloom: { threshold: number; tint: [number, number, number]; alpha: number } | null;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const VARIANTS: Record<Exclude<WeddingFilmVariant, 'none'>, VariantParams> = {
  daylight: {
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
      x <= 0.5 ? lerp(-0.055, -0.02, x / 0.5) : lerp(-0.02, -0.04, (x - 0.5) / 0.5),
    saturation: 0.15,
    grainAmplitude: 5,
    grainScale: 2,
    vignetteMinGain: 0.9,
    bloom: null,
  },
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
    // The fog lives in the shadows: refs 2/3 have blue-dead toes but only
    // mildly warm highlights, and a kill that lingered into the mids pushed
    // skin warmth past the report's band on the first contact sheet.
    blueOffset: (x) => -0.1 + 0.07 * smoothstep(0.2, 0.7, x),
    saturation: 0.22,
    grainAmplitude: 8,
    grainScale: 1.5,
    vignetteMinGain: 0.84,
    bloom: { threshold: 240, tint: [255, 140, 90], alpha: 0.15 },
  },
};

/* ----------------------- tone curves ----------------------- */

/**
 * Fritsch-Carlson monotone cubic through the control points: tangents are
 * clamped so the interpolant can neither overshoot nor oscillate (§8).
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
      h00 * ys[i] + h10 * dx[i] * m[i] + h01 * ys[i + 1] + h11 * dx[i] * m[i + 1]
    );
  };
}

interface Luts {
  r: Uint8Array;
  g: Uint8Array;
  b: Uint8Array;
}

const lutCache: Partial<Record<string, Luts>> = {};

/** §9: R = m + redOffset, G = m, B = m + blueOffset, each clamped. */
function lutsFor(variant: Exclude<WeddingFilmVariant, 'none'>): Luts {
  const cached = lutCache[variant];
  if (cached) return cached;
  const params = VARIANTS[variant];
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
  lutCache[variant] = luts;
  return luts;
}

/* ----------------------- grain ----------------------- */

const GRAIN_W = 240;
const GRAIN_H = 320;

/** mulberry32: small, seedable, good enough for grain. */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let seedCounter = 0;

/** Per-shot seed: crypto when available, timestamp+counter otherwise (§4). */
function freshSeed(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0];
  }
  seedCounter += 1;
  return (Date.now() + seedCounter * 7919) >>> 0;
}

/**
 * One grain tile per developed shot (§4): seeded noise, one wrapped 3x3
 * box-smoothing pass for spatial correlation, then normalized to unit RMS
 * so amplitudes describe output noise rather than the unsmoothed source.
 */
function makeGrainTile(seed: number): Float32Array {
  const rand = prng(seed);
  const raw = new Float32Array(GRAIN_W * GRAIN_H);
  for (let i = 0; i < raw.length; i++) {
    raw[i] = rand() * 2 - 1;
  }
  const smooth = new Float32Array(GRAIN_W * GRAIN_H);
  for (let y = 0; y < GRAIN_H; y++) {
    const yUp = ((y - 1 + GRAIN_H) % GRAIN_H) * GRAIN_W;
    const yMid = y * GRAIN_W;
    const yDown = ((y + 1) % GRAIN_H) * GRAIN_W;
    for (let x = 0; x < GRAIN_W; x++) {
      const xL = (x - 1 + GRAIN_W) % GRAIN_W;
      const xR = (x + 1) % GRAIN_W;
      smooth[yMid + x] =
        (raw[yUp + xL] + raw[yUp + x] + raw[yUp + xR] +
          raw[yMid + xL] + raw[yMid + x] + raw[yMid + xR] +
          raw[yDown + xL] + raw[yDown + x] + raw[yDown + xR]) / 9;
    }
  }
  // Zero-mean first, then unit RMS, so the grain never shifts exposure and
  // the amplitude numbers describe pure noise energy.
  let sum = 0;
  for (let i = 0; i < smooth.length; i++) {
    sum += smooth[i];
  }
  const mean = sum / smooth.length;
  let sumSq = 0;
  for (let i = 0; i < smooth.length; i++) {
    smooth[i] -= mean;
    sumSq += smooth[i] * smooth[i];
  }
  const rms = Math.sqrt(sumSq / smooth.length) || 1;
  for (let i = 0; i < smooth.length; i++) {
    smooth[i] /= rms;
  }
  return smooth;
}

/** Exposed for the proof harness: grain tiles must be ~zero-mean, unit-RMS. */
export function makeGrainTileForTest(seed: number): Float32Array {
  return makeGrainTile(seed);
}

/** Bilinear sample of the wrapped tile at (u, v) in tile coordinates. */
function sampleTile(tile: Float32Array, u: number, v: number): number {
  const x0 = Math.floor(u);
  const y0 = Math.floor(v);
  const fx = u - x0;
  const fy = v - y0;
  const xa = ((x0 % GRAIN_W) + GRAIN_W) % GRAIN_W;
  const xb = (xa + 1) % GRAIN_W;
  const ya = ((y0 % GRAIN_H) + GRAIN_H) % GRAIN_H;
  const yb = (ya + 1) % GRAIN_H;
  const top = tile[ya * GRAIN_W + xa] * (1 - fx) + tile[ya * GRAIN_W + xb] * fx;
  const bottom = tile[yb * GRAIN_W + xa] * (1 - fx) + tile[yb * GRAIN_W + xb] * fx;
  return top * (1 - fy) + bottom * fy;
}

/** Per-channel wrapped coordinate offsets decorrelate the color layers (§4). */
const CHANNEL_OFFSET = [0, 7919, 15859];

/* ----------------------- vignette ----------------------- */

const vignetteCache: Record<string, Float32Array> = {};

/**
 * cos4-shaped radial gain (§9): the natural-falloff curve, rescaled so the
 * corner sits exactly at the variant's minimum gain. Half-angle 30 degrees.
 */
function vignetteMap(width: number, height: number, minGain: number): Float32Array {
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

export interface DevelopTimings {
  /** LUT + saturation + grain + vignette, including grain-tile generation. */
  pixelMs: number;
  /** Highlight bloom pass (0 when the variant has none). */
  bloomMs: number;
}

/**
 * The color stage plus grain and vignette, in one pass over the pixels.
 * Mutates `image` in place so callers can assert on it before any encode.
 * 'none' is a strict identity. Returns the elapsed milliseconds.
 */
export function applyWeddingFilmPixels(
  image: ImageData,
  variant: WeddingFilmVariant,
  seed: number = freshSeed()
): number {
  if (variant === 'none') return 0;
  const start = performance.now();
  const params = VARIANTS[variant];
  const { r: lutR, g: lutG, b: lutB } = lutsFor(variant);
  const tile = makeGrainTile(seed);
  const vig = vignetteMap(image.width, image.height, params.vignetteMinGain);
  const d = image.data;
  const k = params.saturation;
  const amp = params.grainAmplitude;
  const q = params.grainScale;
  const width = image.width;
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    let r = lutR[d[i]];
    let g = lutG[d[i + 1]];
    let b = lutB[d[i + 2]];

    // Saturation around Rec. 709 luma, exactly as §9 writes it.
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

    // Grain, weighted from post-saturation luma; full in shadows and mids,
    // fading only near white (§4).
    const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const w = (1 - 0.85 * smoothstep(0.45, 0.98, L)) * amp;
    const x = p % width;
    const y = (p - x) / width;
    const u = x / q;
    const v = y / q;
    r += sampleTile(tile, u + CHANNEL_OFFSET[0], v) * w;
    g += sampleTile(tile, u + CHANNEL_OFFSET[1], v + CHANNEL_OFFSET[1]) * w;
    b += sampleTile(tile, u + CHANNEL_OFFSET[2], v + CHANNEL_OFFSET[2]) * w;

    const gain = vig[p];
    d[i] = Math.max(0, Math.min(255, r * gain));
    d[i + 1] = Math.max(0, Math.min(255, g * gain));
    d[i + 2] = Math.max(0, Math.min(255, b * gain));
  }
  return performance.now() - start;
}

/**
 * Highlight bloom (§9, Party only). The mask is thresholded on the ORIGINAL
 * pre-LUT frame: the Party tone curve shoulders processed whites down to
 * ~235, below the 240 threshold, so masking the processed image would leave
 * the bloom permanently starved. Source highlights glow; the tinted, blurred
 * mask is then screened over the processed canvas. Touches highlights only.
 */
export function applyHighlightBloom(
  canvas: HTMLCanvasElement,
  source: CanvasImageSource,
  variant: WeddingFilmVariant
): number {
  if (variant === 'none') return 0;
  const params = VARIANTS[variant];
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

  // One down/up-scale cycle stands in for a blur; ~6px spread at 480 wide.
  const eighth = document.createElement('canvas');
  eighth.width = Math.max(1, Math.round(qw / 2));
  eighth.height = Math.max(1, Math.round(qh / 2));
  eighth.getContext('2d')!.drawImage(quarter, 0, 0, eighth.width, eighth.height);
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
 * Develop a full frame: pixel pass, then bloom. Draws `source` onto a fresh
 * canvas first, so the caller's canvas is never mutated. The camera adds
 * its date stamp, watermark and JPEG encode after this returns.
 */
export function developWeddingFilm(
  source: CanvasImageSource,
  width: number,
  height: number,
  variant: WeddingFilmVariant,
  seed?: number
): { canvas: HTMLCanvasElement; timings: DevelopTimings } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(source, 0, 0, width, height);

  // The bloom mask reads the untouched frame, so keep a copy from before
  // the pixel pass (quarter scale is all the mask ever uses).
  const preLut = document.createElement('canvas');
  preLut.width = Math.max(1, Math.round(width / 4));
  preLut.height = Math.max(1, Math.round(height / 4));
  preLut.getContext('2d')!.drawImage(canvas, 0, 0, preLut.width, preLut.height);

  const image = ctx.getImageData(0, 0, width, height);
  const pixelMs = applyWeddingFilmPixels(image, variant, seed);
  ctx.putImageData(image, 0, 0);
  const bloomMs = applyHighlightBloom(canvas, preLut, variant);
  return { canvas, timings: { pixelMs, bloomMs } };
}
