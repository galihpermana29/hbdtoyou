/**
 * Composes a matted catalog thumbnail from a screenshot of a template's preview route.
 *
 * The output is the product-shot treatment used by routes listed in MATTED_THUMBNAILS
 * (`src/lib/template-thumbnail.ts`): the preview framed in a thin dark browser window,
 * floated with a soft shadow on a flat mat, at 16:9 with ~9% padding.
 *
 * Capture the input first - the shot has to come from the real gift preview, not the
 * create form, and gift UI only (no Memoify marketing nav):
 *
 *   1. Open the preview route (e.g. http://localhost:3000/netflixv1) at a 1440x900
 *      viewport with a 2x device pixel ratio, so the screenshot lands at 2880x1800.
 *   2. Click through any entry gate. netflixv1 opens on "Who's watching?"; clicking the
 *      profile lands on the billboard with the first row below it.
 *   3. Save the full-viewport screenshot as a PNG.
 *
 * Then:
 *
 *   node scripts/thumbnails/mat-thumbnail.mjs <shot.png> public/thumbnails/<route>.jpg \
 *     [cropHeightCss]
 *
 * `cropHeightCss` is how much of the 900px-tall viewport to keep, in CSS pixels, and is
 * what decides the crop. It defaults to netflixv1's 790, which keeps the billboard and
 * cuts through the first row's artwork so the row reads as a hint of more below. Pick the
 * equivalent for another template by measuring where its first row sits.
 */

import sharp from 'sharp';

const [input, output, cropHeightArg] = process.argv.slice(2);

if (!input || !output) {
  console.error(
    'usage: node scripts/thumbnails/mat-thumbnail.mjs <shot.png> <out.jpg> [cropHeightCss]'
  );
  process.exit(1);
}

/** Delivered asset size. 16:9 also fits the fixed art box on the /create cards exactly. */
const OUT_W = 1600;
const OUT_H = 900;
/** Compose at 2x and downscale, so the gift UI's small type stays legible. */
const SCALE = 2;
const W = OUT_W * SCALE;
const H = OUT_H * SCALE;

/** Keep in sync with MATTED_THUMBNAIL_MAT in src/lib/template-thumbnail.ts. */
const MAT = { r: 0xf2, g: 0xf0, b: 0xed };

const PAD_X = Math.round(W * 0.095);
const WIN_W = W - PAD_X * 2;
const CHROME_H = 30 * SCALE;
const RADIUS = 18 * SCALE;

/** The capture viewport, at the 2x device pixel ratio the instructions above ask for. */
const SHOT_W = 1440 * 2;
const CROP_H = Number(cropHeightArg || 790) * 2;

const shot = await sharp(input).metadata();
if (shot.width !== SHOT_W) {
  console.error(
    `expected a ${SHOT_W}px-wide screenshot (1440 CSS px at 2x), got ${shot.width}px`
  );
  process.exit(1);
}
if (shot.height < CROP_H) {
  console.error(`screenshot is only ${shot.height}px tall, need ${CROP_H}px`);
  process.exit(1);
}

const CONTENT_H = Math.round((WIN_W * CROP_H) / SHOT_W);
const WIN_H = CONTENT_H + CHROME_H;
const WIN_X = PAD_X;
const WIN_Y = Math.round((H - WIN_H) / 2);

const dot = (cx) =>
  `<circle cx="${cx}" cy="${CHROME_H / 2}" r="${4.5 * SCALE}" fill="#57575c" />`;

/** Window chrome: a neutral dark bar, rounded on top, so the frame reads as one object. */
const chromeSvg = `<svg width="${WIN_W}" height="${CHROME_H}" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 ${CHROME_H} V ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} 0 H ${
    WIN_W - RADIUS
  } A ${RADIUS} ${RADIUS} 0 0 1 ${WIN_W} ${RADIUS} V ${CHROME_H} Z" fill="#1d1d1f" />
  ${dot(22 * SCALE)}${dot(40 * SCALE)}${dot(58 * SCALE)}
</svg>`;

/** Rounds off the two corners of the screenshot that sit on the window's bottom edge. */
const contentMaskSvg = `<svg width="${WIN_W}" height="${CONTENT_H}" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0 H ${WIN_W} V ${CONTENT_H - RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 ${
    WIN_W - RADIUS
  } ${CONTENT_H} H ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 0 ${
    CONTENT_H - RADIUS
  } Z" fill="#fff" />
</svg>`;

const content = await sharp(input)
  .extract({ left: 0, top: 0, width: SHOT_W, height: CROP_H })
  .resize(WIN_W, CONTENT_H, { fit: 'fill' })
  .composite([{ input: Buffer.from(contentMaskSvg), blend: 'dest-in' }])
  .png()
  .toBuffer();

const frame = await sharp({
  create: {
    width: WIN_W,
    height: WIN_H,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: Buffer.from(chromeSvg), top: 0, left: 0 },
    { input: content, top: CHROME_H, left: 0 },
  ])
  .png()
  .toBuffer();

/** Shadow: a blurred silhouette of the window, nudged down so the frame looks lifted. */
const SHADOW_BLUR = 20 * SCALE;
const SHADOW_PAD = Math.round(SHADOW_BLUR * 2.5);
const SHADOW_DROP = 20 * SCALE;

const shadow = await sharp(
  Buffer.from(
    `<svg width="${WIN_W + SHADOW_PAD * 2}" height="${
      WIN_H + SHADOW_PAD * 2
    }" xmlns="http://www.w3.org/2000/svg">
      <rect x="${SHADOW_PAD}" y="${SHADOW_PAD}" width="${WIN_W}" height="${WIN_H}" rx="${RADIUS}" fill="rgba(41,37,33,0.38)" />
    </svg>`
  )
)
  .blur(SHADOW_BLUR)
  .png()
  .toBuffer();

// Composed at full size first: sharp resizes before it composites, so scaling down in the
// same pipeline would shrink the mat out from under the frame.
const composed = await sharp({
  create: { width: W, height: H, channels: 3, background: MAT },
})
  .composite([
    {
      input: shadow,
      top: WIN_Y - SHADOW_PAD + SHADOW_DROP,
      left: WIN_X - SHADOW_PAD,
    },
    { input: frame, top: WIN_Y, left: WIN_X },
  ])
  .png()
  .toBuffer();

await sharp(composed)
  .resize(OUT_W, OUT_H, { kernel: 'lanczos3' })
  .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toFile(output);

console.log(
  `${output}: ${OUT_W}x${OUT_H}, frame ${WIN_W / SCALE}x${WIN_H / SCALE}`
);
