/**
 * Composes Apple-style catalog thumbnails from real template preview screenshots.
 *
 * Every output is a 1600x900 product shot: the preview sits in a thin dark browser
 * frame, floated with a soft shadow on the same #f2f0ed mat used by the catalog cards.
 *
 * Captures must come from the public preview route at 1440x900 with a 2x device pixel
 * ratio (2880x1800 PNG), never from /create. Keep only the gift UI:
 *
 * - Website gifts: capture the billboard/home plus a hint of content.
 * - Scrapbooks: flip once to an open spread, then hide the Memoify nav, controls, and
 *   footer before capture.
 * - Claw/photobox: center the machine or result as the single hero.
 * - A route with no live preview may use a restrained placeholder, not invented UI.
 *
 * `catalog-thumbnails.json` is the inventory and capture brief for every local thumb.
 *
 * One asset:
 *
 *   node scripts/thumbnails/mat-thumbnail.mjs capture.png \
 *     public/thumbnails/netflixv1.jpg 790
 *
 * The complete inventory (capture files are named <route>.png):
 *
 *   node scripts/thumbnails/mat-thumbnail.mjs --batch \
 *     scripts/thumbnails/catalog-thumbnails.json /tmp/catalog-captures \
 *     public/thumbnails
 *
 * `cropHeightCss` chooses how much of the 900px viewport is retained. The standard 790
 * keeps the hero and top of the next section while preserving 8.8% vertical mat.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/** Delivered asset size. 16:9 fills the fixed art box on /create exactly. */
const OUT_W = 1600;
const OUT_H = 900;
/** Compose at 2x and downscale, so small preview type stays crisp. */
const SCALE = 2;
const W = OUT_W * SCALE;
const H = OUT_H * SCALE;

/** Keep in sync with MATTED_THUMBNAIL_MAT in src/lib/template-thumbnail.ts. */
const MAT = { r: 0xf2, g: 0xf0, b: 0xed };

const PAD_X = Math.round(W * 0.095);
const WIN_W = W - PAD_X * 2;
const CHROME_H = 30 * SCALE;
const RADIUS = 18 * SCALE;

/** Capture dimensions at the required 1440x900 viewport and 2x device pixel ratio. */
const SHOT_W = 1440 * 2;
const DEFAULT_CROP_HEIGHT_CSS = 790;

async function composeThumbnail(input, output, cropHeightCss) {
  const cropHeight = Number(cropHeightCss || DEFAULT_CROP_HEIGHT_CSS);
  if (!Number.isFinite(cropHeight) || cropHeight <= 0 || cropHeight > 900) {
    throw new Error(
      `cropHeightCss must be between 1 and 900; got ${cropHeight}`
    );
  }

  const cropHeightPx = cropHeight * 2;
  const shot = await sharp(input).metadata();
  if (shot.width !== SHOT_W) {
    throw new Error(
      `${input}: expected a ${SHOT_W}px-wide screenshot (1440 CSS px at 2x), got ${shot.width}px`
    );
  }
  if (!shot.height || shot.height < cropHeightPx) {
    throw new Error(
      `${input}: screenshot is only ${shot.height}px tall, need ${cropHeightPx}px`
    );
  }

  const contentHeight = Math.round((WIN_W * cropHeightPx) / SHOT_W);
  const windowHeight = contentHeight + CHROME_H;
  const windowX = PAD_X;
  const windowY = Math.round((H - windowHeight) / 2);

  const dot = (cx) =>
    `<circle cx="${cx}" cy="${CHROME_H / 2}" r="${
      4.5 * SCALE
    }" fill="#57575c" />`;

  /** Neutral browser chrome makes the screenshot read as one floating subject. */
  const chromeSvg = `<svg width="${WIN_W}" height="${CHROME_H}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 ${CHROME_H} V ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} 0 H ${
      WIN_W - RADIUS
    } A ${RADIUS} ${RADIUS} 0 0 1 ${WIN_W} ${RADIUS} V ${CHROME_H} Z" fill="#1d1d1f" />
    ${dot(22 * SCALE)}${dot(40 * SCALE)}${dot(58 * SCALE)}
  </svg>`;

  /** Round the screenshot's lower corners to complete the browser frame. */
  const contentMaskSvg = `<svg width="${WIN_W}" height="${contentHeight}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 H ${WIN_W} V ${
      contentHeight - RADIUS
    } A ${RADIUS} ${RADIUS} 0 0 1 ${
      WIN_W - RADIUS
    } ${contentHeight} H ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 0 ${
      contentHeight - RADIUS
    } Z" fill="#fff" />
  </svg>`;

  const content = await sharp(input)
    .extract({ left: 0, top: 0, width: SHOT_W, height: cropHeightPx })
    .resize(WIN_W, contentHeight, { fit: 'fill' })
    .composite([{ input: Buffer.from(contentMaskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  const frame = await sharp({
    create: {
      width: WIN_W,
      height: windowHeight,
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

  /** A soft dropped silhouette lifts the subject without making the card busy. */
  const shadowBlur = 20 * SCALE;
  const shadowPad = Math.round(shadowBlur * 2.5);
  const shadowDrop = 20 * SCALE;
  const shadow = await sharp(
    Buffer.from(
      `<svg width="${WIN_W + shadowPad * 2}" height="${
        windowHeight + shadowPad * 2
      }" xmlns="http://www.w3.org/2000/svg">
        <rect x="${shadowPad}" y="${shadowPad}" width="${WIN_W}" height="${windowHeight}" rx="${RADIUS}" fill="rgba(41,37,33,0.38)" />
      </svg>`
    )
  )
    .blur(shadowBlur)
    .png()
    .toBuffer();

  // Composite first, then downscale. sharp otherwise resizes the mat before placing the
  // full-size frame and rejects the overlay as larger than its base.
  const composed = await sharp({
    create: { width: W, height: H, channels: 3, background: MAT },
  })
    .composite([
      {
        input: shadow,
        top: windowY - shadowPad + shadowDrop,
        left: windowX - shadowPad,
      },
      { input: frame, top: windowY, left: windowX },
    ])
    .png()
    .toBuffer();

  await sharp(composed)
    .resize(OUT_W, OUT_H, { kernel: 'lanczos3' })
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(output);

  console.log(
    `${output}: ${OUT_W}x${OUT_H}, frame ${WIN_W / SCALE}x${
      windowHeight / SCALE
    }`
  );
}

async function composeBatch(manifestPath, captureDirectory, outputDirectory) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw new Error(`${manifestPath}: expected a non-empty JSON array`);
  }

  const routes = new Set();
  for (const item of manifest) {
    if (!item.route || routes.has(item.route)) {
      throw new Error(
        `${manifestPath}: every entry needs a unique non-empty route`
      );
    }
    routes.add(item.route);

    await composeThumbnail(
      path.join(captureDirectory, `${item.route}.png`),
      path.join(outputDirectory, `${item.route}.jpg`),
      item.cropHeightCss
    );
  }

  console.log(`composed ${manifest.length} catalog thumbnails`);
}

const args = process.argv.slice(2);
if (args[0] === '--batch') {
  if (args.length !== 4) {
    console.error(
      'usage: node scripts/thumbnails/mat-thumbnail.mjs --batch <manifest.json> <capture-dir> <output-dir>'
    );
    process.exit(1);
  }
  await composeBatch(args[1], args[2], args[3]);
} else {
  if (args.length < 2 || args.length > 3) {
    console.error(
      'usage: node scripts/thumbnails/mat-thumbnail.mjs <shot.png> <out.jpg> [cropHeightCss]'
    );
    process.exit(1);
  }
  await composeThumbnail(args[0], args[1], args[2]);
}
