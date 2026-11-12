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
 *
 * 2026-11-13 (owner): the roster a guest picks from is now four film-compact
 * looks - Gold, Green, Clean, Teal - rendered by the look pipeline further
 * down, which DOES have grain, by the owner's decision, seeded from the
 * frame so a render is still deterministic. The six recipes above the looks
 * are retired from the camera's strip, not deleted: their code stays and
 * still runs (docs/research/memoroll-film-look.proof.mjs exercises it).
 */

/** The film-compact looks of 2026-11-13: what the camera offers today. */
export type MemoRollLookId = 'gold' | 'green' | 'clean' | 'teal';

/** The recipes of hbd-sk4: retired from the strip, kept in the code. */
export type MemoRollLegacyFilmId =
  | 'wedding-natural'
  | 'soft-pastel'
  | 'clean-cool'
  | 'bold-color'
  | 'black-white'
  | 'party';

export type MemoRollFilmId = 'none' | MemoRollLookId | MemoRollLegacyFilmId;

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
const PRESETS: Record<MemoRollLegacyFilmId, PresetParams> = {
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
function lutsFor(preset: MemoRollLegacyFilmId): Luts {
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

/* ----------------------- the film-compact looks ----------------------- */

/**
 * The look pipeline (owner, 2026-11-13).
 *
 * The owner's references are 35mm point-and-shoot and disposable prints, and
 * what was measured from them is what this draws: blue sitting under green
 * through the shadows and mids, whites that stop short of paper white,
 * tinted blacks, modest saturation, a soft lens, and grain. Every look is an
 * original MemoRoll recipe tuned by eye against those references on the
 * owner's own photographs - no third-party LUT or preset is copied.
 *
 * One pass over float channels, in this order: soften (a plastic lens is
 * never sharp), bend blues and greens, tone curve with split toning,
 * saturation, halation (bright areas glow into their surroundings), grain,
 * vignette. Still no ctx.filter and no canvas at all - it is arithmetic on
 * ImageData, so it runs anywhere the legacy pass runs.
 *
 * Grain is back, deliberately. hbd-sk4 removed it for determinism; here the
 * generator is seeded from the frame's own pixels, so the same frame and
 * look still always produce the same render.
 */
type Rgb = [number, number, number];

interface LookParams {
  master: [number, number][];
  /** Channel offsets in the shadows, the mids, and the highlights. */
  tone: [Rgb, Rgb, Rgb];
  /** What blues do: an RGB offset, then a pull toward luminance. */
  blue: [number, number, number, number];
  /** What greens do: an RGB offset, then a lift or a deepening. */
  green: [number, number, number, number];
  saturation: number;
  /** Grain strength relative to Gold. */
  grain: number;
  /** The colour bright areas bleed. */
  halo: Rgb;
}

const COMPACT_LOOKS: Record<MemoRollLookId, LookParams> = {
  // Warm consumer stock: yellow-green shadows, cream whites.
  gold: {
    master: [
      [0, 0.032],
      [0.08, 0.048],
      [0.22, 0.145],
      [0.45, 0.44],
      [0.7, 0.79],
      [0.88, 0.93],
      [1, 0.972],
    ],
    tone: [
      [0.004, 0.016, -0.045],
      [0.022, 0.004, -0.05],
      [0.008, 0, -0.028],
    ],
    blue: [0, 0.035, -0.05, 0.18],
    green: [0.03, -0.005, -0.035, -0.03],
    saturation: 1.06,
    grain: 1,
    halo: [0.13, 0.045, 0],
  },
  // Cooler, green-leaning stock: cyan-green shadows, deep greens, bluer
  // skies, clean whites with a hint of pink.
  green: {
    master: [
      [0, 0.03],
      [0.08, 0.05],
      [0.22, 0.15],
      [0.45, 0.445],
      [0.7, 0.78],
      [0.88, 0.925],
      [1, 0.975],
    ],
    tone: [
      [-0.014, 0.014, 0.012],
      [-0.004, 0.008, -0.012],
      [0.012, -0.002, 0.004],
    ],
    blue: [-0.01, 0.02, 0, 0.05],
    green: [-0.025, 0.012, 0.012, -0.035],
    saturation: 1,
    grain: 1,
    halo: [0.11, 0.05, 0.03],
  },
  // Bright and clean: green through shadows and mids, neutral paper white.
  clean: {
    master: [
      [0, 0.025],
      [0.1, 0.07],
      [0.3, 0.3],
      [0.5, 0.54],
      [0.75, 0.82],
      [0.9, 0.945],
      [1, 0.985],
    ],
    tone: [
      [-0.024, 0.012, -0.004],
      [-0.012, 0.008, -0.02],
      [0.004, 0, 0.002],
    ],
    blue: [-0.01, 0.015, 0, 0.1],
    green: [-0.03, 0.015, 0, -0.04],
    saturation: 1.02,
    grain: 0.9,
    halo: [0.08, 0.05, 0.04],
  },
  // Cinematic: brown-black shadows, teal mids, whites that bloom.
  teal: {
    master: [
      [0, 0.03],
      [0.1, 0.05],
      [0.3, 0.22],
      [0.5, 0.5],
      [0.72, 0.8],
      [0.9, 0.93],
      [1, 0.962],
    ],
    tone: [
      [0.02, 0, -0.03],
      [-0.04, 0.006, 0.004],
      [-0.015, 0.004, -0.006],
    ],
    blue: [-0.02, 0.02, 0, 0.1],
    green: [-0.03, 0, 0.02, -0.03],
    saturation: 0.95,
    grain: 1.05,
    halo: [0.26, 0.22, 0.17],
  },
};

const LOOK_IDS = new Set<string>(Object.keys(COMPACT_LOOKS));

export function isLook(preset: MemoRollFilmId): preset is MemoRollLookId {
  return LOOK_IDS.has(preset);
}

/** The corner gain every look shares: a compact's lens falls off hard. */
const LOOK_VIGNETTE = 0.74;

const lookLutCache: Partial<Record<MemoRollLookId, Float32Array[]>> = {};

/** Tone curve plus split toning, as three 256-entry float tables. */
function lookLuts(look: MemoRollLookId): Float32Array[] {
  const cached = lookLutCache[look];
  if (cached) return cached;
  const { master, tone } = COMPACT_LOOKS[look];
  const curve = monotoneCubic(master);
  const luts = [0, 1, 2].map(() => new Float32Array(256));
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    const m = curve(x);
    const shadow = Math.pow(clamp01(1 - x / 0.35), 1.2);
    const high = clamp01((x - 0.7) / 0.3);
    const mid = 1 - shadow - high * 0.8;
    for (let c = 0; c < 3; c++) {
      luts[c][i] = clamp01(
        m + tone[0][c] * shadow + tone[1][c] * mid + tone[2][c] * high
      );
    }
  }
  lookLutCache[look] = luts;
  return luts;
}

/** Separable Gaussian blur over one float plane, edges clamped. */
function blurPlane(
  src: Float32Array,
  width: number,
  height: number,
  sigma: number
): Float32Array {
  // 2.5 sigma holds 98.8% of the bell; a wider kernel costs more than it shows.
  const radius = Math.max(1, Math.ceil(sigma * 2.5));
  const kernel = new Float32Array(radius * 2 + 1);
  let sum = 0;
  for (let i = -radius; i <= radius; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    kernel[i + radius] = v;
    sum += v;
  }
  for (let i = 0; i < kernel.length; i++) kernel[i] /= sum;

  // Interior pixels take the branch-free path; only the `radius` columns and
  // rows at each edge pay for clamping. This pass is most of a look's cost.
  const taps = kernel.length;
  const tmp = new Float32Array(src.length);
  const xEnd = width - radius;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      let acc = 0;
      if (x >= radius && x < xEnd) {
        const base = row + x - radius;
        for (let k = 0; k < taps; k++) acc += src[base + k] * kernel[k];
      } else {
        for (let k = -radius; k <= radius; k++) {
          const xx = x + k < 0 ? 0 : x + k >= width ? width - 1 : x + k;
          acc += src[row + xx] * kernel[k + radius];
        }
      }
      tmp[row + x] = acc;
    }
  }
  const out = new Float32Array(src.length);
  const yEnd = height - radius;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    if (y >= radius && y < yEnd) {
      // Row-wise accumulation keeps the reads sequential.
      for (let k = 0; k < taps; k++) {
        const weight = kernel[k];
        const from = (y - radius + k) * width;
        for (let x = 0; x < width; x++) out[row + x] += tmp[from + x] * weight;
      }
    } else {
      for (let x = 0; x < width; x++) {
        let acc = 0;
        for (let k = -radius; k <= radius; k++) {
          const yy = y + k < 0 ? 0 : y + k >= height ? height - 1 : y + k;
          acc += tmp[yy * width + x] * kernel[k + radius];
        }
        out[row + x] = acc;
      }
    }
  }
  return out;
}

/** Bilinear resize of one float plane. */
function resizePlane(
  src: Float32Array,
  sw: number,
  sh: number,
  dw: number,
  dh: number
): Float32Array {
  const out = new Float32Array(dw * dh);
  const fx = sw / dw;
  const fy = sh / dh;
  for (let y = 0; y < dh; y++) {
    const sy = Math.min(sh - 1, Math.max(0, (y + 0.5) * fy - 0.5));
    const y0 = Math.floor(sy);
    const y1 = Math.min(sh - 1, y0 + 1);
    const ty = sy - y0;
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(sw - 1, Math.max(0, (x + 0.5) * fx - 0.5));
      const x0 = Math.floor(sx);
      const x1 = Math.min(sw - 1, x0 + 1);
      const tx = sx - x0;
      const top = src[y0 * sw + x0] * (1 - tx) + src[y0 * sw + x1] * tx;
      const bottom = src[y1 * sw + x0] * (1 - tx) + src[y1 * sw + x1] * tx;
      out[y * dw + x] = top * (1 - ty) + bottom * ty;
    }
  }
  return out;
}

/** mulberry32: small, fast, and the same sequence in every browser. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The frame's own fingerprint: the same pixels always seed the same grain. */
function frameSeed(data: Uint8ClampedArray): number {
  let h = 0x811c9dc5;
  const step = Math.max(4, Math.floor(data.length / 4096) & ~3);
  for (let i = 0; i < data.length; i += step) {
    h ^= data[i] + (data[i + 1] << 8) + (data[i + 2] << 16);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * One plane of soft-edged noise with unit deviation: Gaussian white noise,
 * blurred, renormalised. `scale` below 1 generates it smaller and stretches
 * it, which is both cheaper and how coarse grain is made.
 */
function grainPlane(
  random: () => number,
  width: number,
  height: number,
  sigma: number,
  scale: number
): Float32Array {
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const white = new Float32Array(w * h);
  for (let i = 0; i < white.length; i += 2) {
    // Box-Muller, both halves used
    const u = Math.max(random(), 1e-7);
    const v = random();
    const mag = Math.sqrt(-2 * Math.log(u));
    white[i] = mag * Math.cos(2 * Math.PI * v);
    if (i + 1 < white.length) white[i + 1] = mag * Math.sin(2 * Math.PI * v);
  }
  let plane = blurPlane(white, w, h, sigma * scale);
  if (scale !== 1) plane = resizePlane(plane, w, h, width, height);
  let sq = 0;
  for (let i = 0; i < plane.length; i++) sq += plane[i] * plane[i];
  const deviation = Math.sqrt(sq / plane.length) || 1;
  for (let i = 0; i < plane.length; i++) plane[i] /= deviation;
  return plane;
}

/**
 * The grain itself is made once per frame size and kept: making it is a
 * third of a look's cost, and a guest shoots a roll, not a frame. What the
 * frame's seed decides is where in the sheet each layer starts, so every
 * Shot still gets its own grain and the same frame always gets the same.
 */
interface GrainSheet {
  width: number;
  height: number;
  /** Fine grain, full size. */
  fine: Float32Array;
  /** Dye clumps and the colour in the grain: made at half size. */
  coarse: Float32Array;
}

let grainSheet: GrainSheet | null = null;

function grainFor(width: number, height: number): GrainSheet {
  if (grainSheet && grainSheet.width === width && grainSheet.height === height)
    return grainSheet;
  const random = seededRandom(0x9e3779b9);
  grainSheet = {
    width,
    height,
    fine: grainPlane(random, width, height, 0.6, 1),
    coarse: grainPlane(random, width, height, 1.3, 0.5),
  };
  return grainSheet;
}

/**
 * Make the grain ahead of the first Shot. The camera calls this while it is
 * idle, so the first press of the shutter does not pay for it.
 */
export function warmMemoRollGrain(width: number, height: number): void {
  grainFor(width, height);
}

/** How far a hue (0..1) sits inside a band, scaled by how saturated it is. */
function hueBand(hue: number, sat: number, centre: number, width: number) {
  const d = Math.abs(((((hue - centre + 0.5) % 1) + 1) % 1) - 0.5);
  const inBand = 1 - d / width;
  return inBand <= 0 ? 0 : inBand * Math.min(1, sat * 3);
}

/**
 * A look, start to finish, on the pixels. Mutates `image` in place and
 * returns the elapsed milliseconds. `options.grain: false` leaves the grain
 * off - that is for the port check in docs/research, never for the camera.
 */
function applyLookPixels(
  image: ImageData,
  look: MemoRollLookId,
  options: { grain?: boolean } = {}
): number {
  const start = performance.now();
  const { width, height, data } = image;
  const count = width * height;
  const params = COMPACT_LOOKS[look];
  const seed = frameSeed(data);

  // 1. A compact's lens: a touch soft, never sharpened.
  const planes = [0, 1, 2].map((c) => {
    const plane = new Float32Array(count);
    for (let p = 0, i = c; p < count; p++, i += 4) plane[p] = data[i] / 255;
    return blurPlane(plane, width, height, 1.05);
  });
  const [red, green, blue] = planes;

  // 2-4. Blues and greens bent, tone curve with split toning, saturation.
  const luts = lookLuts(look);
  const [bR, bG, bB, bPull] = params.blue;
  const [gR, gG, gB, gLift] = params.green;
  const luminance = new Float32Array(count);
  for (let p = 0; p < count; p++) {
    let r = red[p];
    let g = green[p];
    let b = blue[p];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const chroma = mx - mn + 1e-6;
    let hue: number;
    if (mx === r) hue = ((((g - b) / chroma) % 6) + 6) % 6;
    else if (mx === g) hue = (b - r) / chroma + 2;
    else hue = (r - g) / chroma + 4;
    hue /= 6;
    const sat = chroma / (mx + 1e-6);
    const inBlue = hueBand(hue, sat, 0.6, 0.13);
    const inGreen = hueBand(hue, sat, 0.33, 0.14);
    if (inBlue > 0) {
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r += inBlue * (bR + bPull * (lum - r));
      g += inBlue * (bG + bPull * (lum - g));
      b += inBlue * (bB + bPull * (lum - b));
    }
    if (inGreen > 0) {
      r += inGreen * (gR + gLift);
      g += inGreen * (gG + gLift);
      b += inGreen * (gB + gLift);
    }
    r = luts[0][Math.round(clamp01(r) * 255)];
    g = luts[1][Math.round(clamp01(g) * 255)];
    b = luts[2][Math.round(clamp01(b) * 255)];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = lum + (r - lum) * params.saturation;
    g = lum + (g - lum) * params.saturation;
    b = lum + (b - lum) * params.saturation;
    red[p] = r;
    green[p] = g;
    blue[p] = b;
    luminance[p] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // 5. Halation: what is bright glows into what is next to it. The mask is
  // blurred at quarter size - the glow is far wider than a pixel.
  const qw = Math.max(1, Math.round(width / 4));
  const qh = Math.max(1, Math.round(height / 4));
  const mask = resizePlane(luminance, width, height, qw, qh);
  for (let i = 0; i < mask.length; i++) {
    mask[i] = clamp01((mask[i] - 0.8) / 0.16);
  }
  const glow = resizePlane(
    blurPlane(mask, qw, qh, 11 / 4),
    qw,
    qh,
    width,
    height
  );

  // 6. Grain: fine grain plus larger dye clumps, with a little colour in it;
  // strongest in the mids, thinner where the print is bright. Five layers
  // read from the kept sheet, each starting where this frame's seed puts it.
  const sheet = options.grain !== false ? grainFor(width, height) : null;
  const random = seededRandom(seed);
  let iFine = Math.floor(random() * count);
  let iClump = Math.floor(random() * count);
  let iRed = Math.floor(random() * count);
  let iGreen = Math.floor(random() * count);
  let iBlue = Math.floor(random() * count);

  // 7. Vignette, and back to bytes.
  const vig = vignetteMap(width, height, LOOK_VIGNETTE);
  for (let p = 0, i = 0; p < count; p++, i += 4) {
    const halo = glow[p];
    let r = red[p] + halo * params.halo[0] * (1 - red[p]);
    let g = green[p] + halo * params.halo[1] * (1 - green[p]);
    let b = blue[p] + halo * params.halo[2] * (1 - blue[p]);
    if (sheet) {
      const { fine, coarse } = sheet;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const amplitude =
        (0.013 + 0.014 * clamp01(1 - Math.abs(lum - 0.38) / 0.5)) *
        (1 - 0.35 * clamp01((lum - 0.6) / 0.4)) *
        params.grain;
      const shared = 0.9 * fine[iFine] + 0.28 * coarse[iClump];
      r += amplitude * (shared + 0.2 * coarse[iRed]);
      g += amplitude * (shared + 0.2 * coarse[iGreen]);
      b += amplitude * (shared + 0.2 * coarse[iBlue]);
      if (++iFine === count) iFine = 0;
      if (++iClump === count) iClump = 0;
      if (++iRed === count) iRed = 0;
      if (++iGreen === count) iGreen = 0;
      if (++iBlue === count) iBlue = 0;
    }
    const gain = vig[p] * 255;
    data[i] = Math.max(0, Math.min(255, clamp01(r) * gain + 0.5));
    data[i + 1] = Math.max(0, Math.min(255, clamp01(g) * gain + 0.5));
    data[i + 2] = Math.max(0, Math.min(255, clamp01(b) * gain + 0.5));
  }
  return performance.now() - start;
}

/** The look pass without grain, for docs/research's port check only. */
export function applyMemoRollLookWithoutGrain(
  image: ImageData,
  look: MemoRollLookId
): number {
  return applyLookPixels(image, look, { grain: false });
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
 * 'none' is a strict identity. Returns the elapsed milliseconds. A look
 * (Gold, Green, Clean, Teal) takes the look pipeline above instead.
 */
export function applyMemoRollFilmPixels(
  image: ImageData,
  preset: MemoRollFilmId
): number {
  if (preset === 'none') return 0;
  if (isLook(preset)) return applyLookPixels(image, preset);
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
  if (preset === 'none' || isLook(preset)) return 0;
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
