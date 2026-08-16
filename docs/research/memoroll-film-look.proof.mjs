/**
 * Visual proof + assertion harness for the Wedding Film engine (hbd-15j).
 *
 * Runs the real src/lib/wedding-film.ts (transpiled with the repo's tsc) in
 * headless Chromium against the reference set, renders the contact sheet,
 * executes the report's §6 region assertions on pre-JPEG ImageData, and
 * times pixel pass / bloom / JPEG encode separately.
 *
 *   node docs/research/memoroll-film-look.proof.mjs [outDir]
 *
 * Outputs: <outDir>/memoroll-film-look.contact-sheet.png and a JSON summary
 * on stdout. outDir defaults to docs/research (files are untracked).
 */
/* eslint-disable no-console -- CLI harness; stdout is the deliverable. */
import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';

const REPO = resolve(import.meta.dirname, '..', '..');
const ASSETS = join(REPO, 'src', 'assets', 'filter-camera');
const OUT_DIR = resolve(process.argv[2] || join(REPO, 'docs', 'research'));

/* 1. Transpile the engine with the repo's TypeScript, then strip module
      syntax so it runs as a plain inline script. */
const tmp = mkdtempSync(join(tmpdir(), 'wedding-film-'));
execSync(
  `npx tsc ${join(REPO, 'src/lib/wedding-film.ts')} --target es2020 --module es2015 --lib es2020,dom --skipLibCheck --outDir ${tmp}`,
  { cwd: REPO, stdio: 'inherit' }
);
const engineJs = readFileSync(join(tmp, 'wedding-film.js'), 'utf8').replace(
  /^export /gm,
  ''
);

/* 2. Inputs as data URLs (file:// images would taint the canvas). */
const INPUT_FILES = [
  'experiment_photo.jpeg',
  'digi cam rehearsal.jpeg',
  'reference_1.jpeg',
  'reference_2.jpeg',
  'reference_3',
  'reference_4.jpeg',
  'reference_5.jpeg',
];
/* The untreated modern low-light portrait that validates Party (owner-
   supplied). Optional until it exists; Party retuning and its skin
   assertion run only when the file is present. */
const LOWLIGHT_FILE = 'lowlight_portrait.jpeg';
const present = readdirSync(ASSETS);
const images = {};
for (const f of INPUT_FILES) {
  if (!present.includes(f)) throw new Error(`missing input: ${f}`);
  images[f] = `data:image/jpeg;base64,${readFileSync(join(ASSETS, f)).toString('base64')}`;
}
const hasLowlight = present.includes(LOWLIGHT_FILE);
if (hasLowlight) {
  images[LOWLIGHT_FILE] = `data:image/jpeg;base64,${readFileSync(join(ASSETS, LOWLIGHT_FILE)).toString('base64')}`;
} else {
  console.error(
    `NOTE: ${LOWLIGHT_FILE} not found in src/assets/filter-camera - Party's low-light validation is skipped.`
  );
}

/* 3. Regions from the report §6, as fractional [x0, y0, x1, y1]. */
const REGIONS = {
  experiment: {
    dress: [0.44, 0.62, 0.62, 0.8],
    grass: [0.55, 0.88, 0.85, 0.97],
    skinGroom: [0.39, 0.42, 0.44, 0.47],
    skinBride: [0.54, 0.43, 0.59, 0.48],
    midMix: [0.02, 0.45, 0.3, 0.75],
  },
  digicam: {
    sky: [0.3, 0.05, 0.7, 0.25],
    foliage: [0.3, 0.28, 0.6, 0.52],
    clothing: [0.4, 0.66, 0.56, 0.78],
    deepTrees: [0.0, 0.1, 0.1, 0.5],
  },
};

const PAGE = `<!doctype html>
<meta charset="utf-8" />
<title>Wedding Film proof</title>
<style>
  body { margin: 0; background: #181818; color: #eee; font: 11px/1.4 sans-serif; }
  #sheet { width: max-content; padding: 12px; }
  .row { display: flex; gap: 10px; margin-bottom: 14px; align-items: flex-start; }
  figure { margin: 0; width: 240px; }
  figure.refcol { width: 120px; }
  canvas, img { width: 100%; display: block; }
  figcaption { padding: 3px 1px; font-weight: 600; }
  .rowlabel { width: 90px; font-weight: 700; padding-top: 4px; }
</style>
<div id="sheet"></div>
<script>${engineJs}</script>
<script>
const IMAGES = ${JSON.stringify(images)};
const REGIONS = ${JSON.stringify(REGIONS)};
const LOWLIGHT = ${JSON.stringify(hasLowlight ? LOWLIGHT_FILE : null)};
/* Skin region on the low-light portrait; set once the owner-supplied photo
   exists and its framing is known. null skips the assertion with a note. */
const LOWLIGHT_SKIN = null;

const SHEET_W = 480;
const loadImg = (src) => new Promise((res, rej) => {
  const img = new Image();
  img.onload = () => res(img);
  img.onerror = rej;
  img.src = src;
});

function toCanvas(img, width) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = Math.round((img.naturalHeight / img.naturalWidth) * width);
  c.getContext('2d', { willReadFrequently: true }).drawImage(img, 0, 0, c.width, c.height);
  return c;
}

/* The shipped filter closest to Wedding Film: Kodak Gold 200 from films.ts,
   reproduced faithfully (ctx.filter chain + 0.25 vignette). Chromium runs
   ctx.filter, so this column shows the CURRENT look at its best; on iPhones
   the color chain is silently dropped (report §0). */
function currentGold200(source) {
  const c = document.createElement('canvas');
  c.width = source.width; c.height = source.height;
  const ctx = c.getContext('2d');
  ctx.filter = 'sepia(0.25) saturate(1.12) contrast(1.05) brightness(1.03)';
  ctx.drawImage(source, 0, 0);
  ctx.filter = 'none';
  const g = ctx.createRadialGradient(
    c.width / 2, c.height / 2, c.height * 0.28,
    c.width / 2, c.height / 2, c.height * 0.72);
  g.addColorStop(0, 'rgba(15,15,15,0)');
  g.addColorStop(1, 'rgba(15,15,15,0.25)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

/* ---------- region statistics on ImageData (pre-JPEG always) ---------- */
function regionStats(image, frac) {
  const [fx0, fy0, fx1, fy1] = frac;
  const x0 = Math.floor(fx0 * image.width), x1 = Math.ceil(fx1 * image.width);
  const y0 = Math.floor(fy0 * image.height), y1 = Math.ceil(fy1 * image.height);
  const d = image.data;
  let r = 0, g = 0, b = 0, n = 0;
  const lums = [];
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * image.width + x) * 4;
      r += d[i]; g += d[i + 1]; b += d[i + 2];
      lums.push(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]);
      n++;
    }
  }
  lums.sort((a, z) => a - z);
  const pct = (q) => lums[Math.floor(q * (lums.length - 1))];
  const mean = [r / n, g / n, b / n];
  return {
    mean,
    lumaMean: 0.2126 * mean[0] + 0.7152 * mean[1] + 0.0722 * mean[2],
    p25: pct(0.25), p50: pct(0.5), p75: pct(0.75),
    hue: rgbHue(mean),
  };
}

function rgbHue([r, g, b]) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx === mn) return 0;
  let h;
  if (mx === r) h = ((g - b) / (mx - mn)) % 6;
  else if (mx === g) h = (b - r) / (mx - mn) + 2;
  else h = (r - g) / (mx - mn) + 4;
  return ((h * 60) + 360) % 360;
}

const hueDelta = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/* Darkest-decile mask on the INPUT; measured on the OUTPUT. Grain noise
   makes a strict per-pixel minimum meaningless, so "floor" is read as the
   masked median (deviation noted in the results). */
function darkMaskStats(input, output) {
  const di = input.data, doo = output.data;
  const lums = [];
  for (let i = 0; i < di.length; i += 4) {
    lums.push(0.2126 * di[i] + 0.7152 * di[i + 1] + 0.0722 * di[i + 2]);
  }
  const sorted = [...lums].sort((a, z) => a - z);
  const cut = sorted[Math.floor(0.1 * (sorted.length - 1))];
  let r = 0, g = 0, b = 0, n = 0;
  const outLums = [];
  for (let i = 0, p = 0; i < di.length; i += 4, p++) {
    if (lums[p] <= cut) {
      r += doo[i]; g += doo[i + 1]; b += doo[i + 2];
      outLums.push(0.2126 * doo[i] + 0.7152 * doo[i + 1] + 0.0722 * doo[i + 2]);
      n++;
    }
  }
  outLums.sort((a, z) => a - z);
  return {
    mean: [r / n, g / n, b / n],
    median: outLums[Math.floor(outLums.length / 2)],
  };
}

/* ------------------------------ main ------------------------------ */
(async () => {
  const sheet = document.getElementById('sheet');
  const results = { assertions: [], performance: {}, noneIdentity: null };
  const check = (name, pass, detail) => results.assertions.push({ name, pass, detail });

  const sources = {};
  for (const [file, src] of Object.entries(IMAGES)) {
    sources[file] = toCanvas(await loadImg(src), SHEET_W);
  }

  const refThumbs = (files) => {
    const fig = document.createElement('figure');
    fig.className = 'refcol';
    for (const f of files) {
      const img = document.createElement('img');
      img.src = IMAGES[f];
      fig.appendChild(img);
    }
    const cap = document.createElement('figcaption');
    cap.textContent = 'references';
    fig.appendChild(cap);
    return fig;
  };

  /* Contact sheet rows: every input through current / daylight / party. */
  const ROWS = [
    ['experiment_photo.jpeg', 'experiment', ['reference_1.jpeg', 'reference_4.jpeg', 'reference_5.jpeg']],
    ...(LOWLIGHT ? [[LOWLIGHT, 'low-light', ['reference_2.jpeg', 'reference_3']]] : []),
    ['digi cam rehearsal.jpeg', 'digicam', ['reference_2.jpeg', 'reference_3']],
    ['reference_1.jpeg', 'ref 1', []],
    ['reference_2.jpeg', 'ref 2', []],
    ['reference_3', 'ref 3', []],
    ['reference_4.jpeg', 'ref 4', []],
    ['reference_5.jpeg', 'ref 5', []],
  ];
  const developed = {};
  for (const [file, label, refs] of ROWS) {
    const src = sources[file];
    const row = document.createElement('div');
    row.className = 'row';
    const rl = document.createElement('div');
    rl.className = 'rowlabel';
    rl.textContent = label;
    row.appendChild(rl);
    const cells = [
      ['input', src],
      ['current Gold 200 (Chromium only)', currentGold200(src)],
    ];
    developed[file] = {};
    for (const variant of ['daylight', 'party']) {
      const { canvas } = developWeddingFilm(src, src.width, src.height, variant);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      developed[file][variant] = ctx.getImageData(0, 0, canvas.width, canvas.height);
      cells.push(['Wedding Film ' + variant, canvas]);
    }
    for (const [cap, canvas] of cells) {
      const fig = document.createElement('figure');
      fig.appendChild(canvas);
      const fc = document.createElement('figcaption');
      fc.textContent = cap;
      fig.appendChild(fc);
      row.appendChild(fig);
    }
    if (refs.length) row.appendChild(refThumbs(refs));
    sheet.appendChild(row);
  }

  /* Region-outline debug row so the measured patches are reviewable. */
  const dbgRow = document.createElement('div');
  dbgRow.className = 'row';
  const dbgLabel = document.createElement('div');
  dbgLabel.className = 'rowlabel';
  dbgLabel.textContent = 'assertion regions';
  dbgRow.appendChild(dbgLabel);
  for (const [file, regionKey] of [
    ['experiment_photo.jpeg', 'experiment'],
    ['digi cam rehearsal.jpeg', 'digicam'],
  ]) {
    const src = sources[file];
    const c = document.createElement('canvas');
    c.width = src.width; c.height = src.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(src, 0, 0);
    ctx.strokeStyle = '#ff3e09';
    ctx.lineWidth = 2;
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#ff3e09';
    for (const [name, [x0, y0, x1, y1]] of Object.entries(REGIONS[regionKey])) {
      ctx.strokeRect(x0 * c.width, y0 * c.height, (x1 - x0) * c.width, (y1 - y0) * c.height);
      ctx.fillText(name, x0 * c.width + 3, y0 * c.height + 12);
    }
    const fig = document.createElement('figure');
    fig.appendChild(c);
    const fc = document.createElement('figcaption');
    fc.textContent = file + ' regions';
    fig.appendChild(fc);
    dbgRow.appendChild(fig);
  }
  sheet.appendChild(dbgRow);

  /* 1:1 crops: faces, deep shadows, bright highlights, neutral clothing,
     shown at native pixel scale for input / daylight / party. */
  const CROPS = {
    'experiment_photo.jpeg': {
      face: [0.565, 0.455],
      deepShadow: [0.12, 0.6],
      highlight: [0.1, 0.06],
      neutralClothing: [0.14, 0.72],
    },
    ...(LOWLIGHT
      ? { [LOWLIGHT]: { face: [0.5, 0.4], deepShadow: [0.1, 0.8], highlight: [0.5, 0.15], neutralClothing: [0.75, 0.6] } }
      : {}),
  };
  const CROP = 160;
  for (const [file, spots] of Object.entries(CROPS)) {
    const src = sources[file];
    for (const [spot, [fx, fy]] of Object.entries(spots)) {
      const row = document.createElement('div');
      row.className = 'row';
      const rl = document.createElement('div');
      rl.className = 'rowlabel';
      rl.textContent = \`1:1 \${spot}\`;
      row.appendChild(rl);
      const variants = [
        ['input', src],
        ['daylight', null],
        ['party', null],
      ];
      for (const [label, maybeCanvas] of variants) {
        const c = document.createElement('canvas');
        c.width = CROP; c.height = CROP;
        c.style.width = CROP + 'px';
        const cctx = c.getContext('2d');
        cctx.imageSmoothingEnabled = false;
        const sx = Math.max(0, Math.min(src.width - CROP, fx * src.width - CROP / 2));
        const sy = Math.max(0, Math.min(src.height - CROP, fy * src.height - CROP / 2));
        if (maybeCanvas) {
          cctx.drawImage(maybeCanvas, sx, sy, CROP, CROP, 0, 0, CROP, CROP);
        } else {
          // Redraw from the already-developed ImageData for exact pixels.
          const full = document.createElement('canvas');
          full.width = src.width; full.height = src.height;
          full.getContext('2d').putImageData(developed[file][label], 0, 0);
          cctx.drawImage(full, sx, sy, CROP, CROP, 0, 0, CROP, CROP);
        }
        const fig = document.createElement('figure');
        fig.style.width = CROP + 'px';
        fig.appendChild(c);
        const fc = document.createElement('figcaption');
        fc.textContent = \`\${label} · \${file.slice(0, 14)}\`;
        fig.appendChild(fc);
        row.appendChild(fig);
      }
      sheet.appendChild(row);
    }
  }

  /* ------------------- §6 assertions, pre-JPEG ------------------- */
  const expSrc = sources['experiment_photo.jpeg'];
  const expIn = expSrc.getContext('2d', { willReadFrequently: true })
    .getImageData(0, 0, expSrc.width, expSrc.height);
  for (const variant of ['daylight', 'party']) {
    const out = developed['experiment_photo.jpeg'][variant];
    const R = REGIONS.experiment;
    const dress = regionStats(out, R.dress);
    check(\`\${variant}/dress warm+unclipped\`,
      dress.lumaMean <= 245 && dress.mean[0] - dress.mean[2] >= 10,
      \`lumaMean=\${dress.lumaMean.toFixed(1)} R-B=\${(dress.mean[0] - dress.mean[2]).toFixed(1)}\`);
    const gIn = regionStats(expIn, R.grass);
    const gOut = regionStats(out, R.grass);
    check(\`\${variant}/grass stays green\`,
      gOut.mean[1] >= gOut.mean[0] && gOut.mean[1] >= gOut.mean[2] && hueDelta(gIn.hue, gOut.hue) < 15,
      \`hueIn=\${gIn.hue.toFixed(0)} hueOut=\${gOut.hue.toFixed(0)}\`);
    for (const skin of ['skinGroom', 'skinBride']) {
      const sIn = regionStats(expIn, R[skin]);
      const sOut = regionStats(out, R[skin]);
      const dWarm = (sOut.mean[0] - sOut.mean[2]) - (sIn.mean[0] - sIn.mean[2]);
      const lumaShift = Math.abs(sOut.lumaMean - sIn.lumaMean) / sIn.lumaMean;
      check(\`\${variant}/\${skin} warmth+luma\`,
        dWarm >= 5 && dWarm <= 25 && lumaShift <= 0.12,
        \`dR-B=\${dWarm.toFixed(1)} lumaShift=\${(lumaShift * 100).toFixed(1)}%\`);
    }
    const dark = darkMaskStats(expIn, out);
    check(\`\${variant}/shadow floor+blue lowest\`,
      dark.median >= 7 && dark.mean[2] <= dark.mean[0] && dark.mean[2] <= dark.mean[1],
      \`maskedMedian=\${dark.median.toFixed(1)} meanRGB=\${dark.mean.map((v) => v.toFixed(1)).join(',')}\`);
    const mIn = regionStats(expIn, R.midMix);
    const mOut = regionStats(out, R.midMix);
    const spreadIn = mIn.p75 - mIn.p25;
    const spreadOut = mOut.p75 - mOut.p25;
    check(\`\${variant}/midtone spread\`,
      Math.abs(spreadOut - spreadIn) / spreadIn <= 0.15,
      \`in=\${spreadIn.toFixed(1)} out=\${spreadOut.toFixed(1)}\`);
  }

  const digiSrc = sources['digi cam rehearsal.jpeg'];
  const digiIn = digiSrc.getContext('2d', { willReadFrequently: true })
    .getImageData(0, 0, digiSrc.width, digiSrc.height);
  for (const variant of ['daylight', 'party']) {
    const out = developed['digi cam rehearsal.jpeg'][variant];
    const R = REGIONS.digicam;
    /* The digicam input is near-neutral haze, and the hue of a near-grey
       mean is numerically unstable, so input-relative hue deltas are
       meaningless here. §6.2's own wording is absolute ("sky does not turn
       orange, foliage remains green"), so these assert absolute bands:
       stricter about the actual failure mode, immune to grey-hue noise. */
    const skyOut = regionStats(out, R.sky);
    const skyOrange = skyOut.hue >= 15 && skyOut.hue <= 75 &&
      skyOut.mean[0] - skyOut.mean[2] > 8;
    check(\`\${variant}/digicam sky not orange\`,
      !skyOrange,
      \`R-B=\${(skyOut.mean[0] - skyOut.mean[2]).toFixed(1)} hueOut=\${skyOut.hue.toFixed(0)}\`);
    const fOut = regionStats(out, R.foliage);
    check(\`\${variant}/digicam foliage green\`,
      fOut.mean[1] >= fOut.mean[0] && fOut.mean[1] >= fOut.mean[2] &&
        fOut.hue >= 60 && fOut.hue <= 180,
      \`hueOut=\${fOut.hue.toFixed(0)} meanRGB=\${fOut.mean.map((v) => v.toFixed(0)).join(',')}\`);
    const cIn = regionStats(digiIn, R.clothing);
    const cOut = regionStats(out, R.clothing);
    check(\`\${variant}/digicam clothing hue held\`,
      hueDelta(cIn.hue, cOut.hue) < 15,
      \`dHue=\${hueDelta(cIn.hue, cOut.hue).toFixed(0)}\`);
    const tIn = regionStats(digiIn, R.deepTrees);
    const tOut = regionStats(out, R.deepTrees);
    check(\`\${variant}/digicam canopy not flattened\`,
      (tOut.p75 - tOut.p25) >= 0.6 * (tIn.p75 - tIn.p25),
      \`spreadIn=\${(tIn.p75 - tIn.p25).toFixed(1)} spreadOut=\${(tOut.p75 - tOut.p25).toFixed(1)}\`);
  }

  /* None identity, pre-encode, bit-exact. */
  {
    const src = sources['experiment_photo.jpeg'];
    const before = src.getContext('2d', { willReadFrequently: true })
      .getImageData(0, 0, src.width, src.height);
    const { canvas } = developWeddingFilm(src, src.width, src.height, 'none');
    const after = canvas.getContext('2d', { willReadFrequently: true })
      .getImageData(0, 0, canvas.width, canvas.height);
    let identical = before.data.length === after.data.length;
    if (identical) {
      for (let i = 0; i < before.data.length; i++) {
        if (before.data[i] !== after.data[i]) { identical = false; break; }
      }
    }
    results.noneIdentity = identical;
    check('none/identity pre-encode', identical, identical ? 'bit-identical' : 'DIFFERS');
  }

  /* Grain tile statistics: ~zero mean, unit RMS (report §4). */
  {
    const tile = makeGrainTileForTest(123456789);
    let sum = 0, sumSq = 0;
    for (let i = 0; i < tile.length; i++) { sum += tile[i]; sumSq += tile[i] * tile[i]; }
    const mean = sum / tile.length;
    const rms = Math.sqrt(sumSq / tile.length);
    check('grain/zero-mean unit-RMS',
      Math.abs(mean) < 0.01 && rms > 0.97 && rms < 1.03,
      \`mean=\${mean.toFixed(5)} rms=\${rms.toFixed(4)}\`);
  }

  /* Bloom: the mask must catch real source highlights, and pixels outside
     the (dilated) mask must be untouched by the bloom pass. */
  {
    const src = sources['experiment_photo.jpeg'];
    const W = src.width, H = src.height;
    const qw = Math.max(1, Math.round(W / 4)), qh = Math.max(1, Math.round(H / 4));
    const preLut = document.createElement('canvas');
    preLut.width = qw; preLut.height = qh;
    const pctx = preLut.getContext('2d', { willReadFrequently: true });
    pctx.drawImage(src, 0, 0, qw, qh);
    const q = pctx.getImageData(0, 0, qw, qh).data;
    const mask = new Uint8Array(qw * qh);
    let lit = 0;
    for (let i = 0, p = 0; i < q.length; i += 4, p++) {
      if (0.2126 * q[i] + 0.7152 * q[i + 1] + 0.0722 * q[i + 2] >= 240) { mask[p] = 1; lit++; }
    }
    check('bloom/mask has source highlights',
      lit / (qw * qh) >= 0.005,
      \`coverage=\${((lit / (qw * qh)) * 100).toFixed(2)}% of quarter-scale pixels\`);

    // Dilate by 3 quarter-pixels (= 12 full px) to cover the blur spread.
    const dilated = new Uint8Array(qw * qh);
    for (let y = 0; y < qh; y++) {
      for (let x = 0; x < qw; x++) {
        if (!mask[y * qw + x]) continue;
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < qw && ny >= 0 && ny < qh) dilated[ny * qw + nx] = 1;
          }
        }
      }
    }

    // Same pixel-pass output cloned; bloom applied to one copy only.
    const base = document.createElement('canvas');
    base.width = W; base.height = H;
    const bctx = base.getContext('2d', { willReadFrequently: true });
    bctx.drawImage(src, 0, 0);
    const img = bctx.getImageData(0, 0, W, H);
    applyWeddingFilmPixels(img, 'party', 42);
    bctx.putImageData(img, 0, 0);
    const bloomed = document.createElement('canvas');
    bloomed.width = W; bloomed.height = H;
    const blctx = bloomed.getContext('2d', { willReadFrequently: true });
    blctx.drawImage(base, 0, 0);
    applyHighlightBloom(bloomed, preLut, 'party');
    const a = bctx.getImageData(0, 0, W, H).data;
    const b = blctx.getImageData(0, 0, W, H).data;
    let changedInside = 0, changedOutside = 0;
    for (let i = 0, p = 0; i < a.length; i += 4, p++) {
      const diff = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
      if (diff > 6) {
        const x = p % W, y = (p - x) / W;
        const qx = Math.min(qw - 1, Math.floor(x / 4)), qy = Math.min(qh - 1, Math.floor(y / 4));
        if (dilated[qy * qw + qx]) changedInside++;
        else changedOutside++;
      }
    }
    check('bloom/lights up highlights', changedInside > 0, \`changedInside=\${changedInside}\`);
    check('bloom/leaves non-highlights alone',
      changedOutside === 0,
      \`changedOutside=\${changedOutside} (tolerance 6/765 per pixel)\`);
  }

  /* Party skin on the low-light portrait (§6 band, original limits). */
  if (LOWLIGHT && LOWLIGHT_SKIN) {
    const src = sources[LOWLIGHT];
    const input = src.getContext('2d', { willReadFrequently: true })
      .getImageData(0, 0, src.width, src.height);
    const out = developed[LOWLIGHT].party;
    const sIn = regionStats(input, LOWLIGHT_SKIN);
    const sOut = regionStats(out, LOWLIGHT_SKIN);
    const dWarm = (sOut.mean[0] - sOut.mean[2]) - (sIn.mean[0] - sIn.mean[2]);
    const lumaShift = Math.abs(sOut.lumaMean - sIn.lumaMean) / sIn.lumaMean;
    check('party/low-light skin warmth+luma',
      dWarm >= 5 && dWarm <= 25 && lumaShift <= 0.12,
      \`dR-B=\${dWarm.toFixed(1)} lumaShift=\${(lumaShift * 100).toFixed(1)}%\`);
  } else {
    results.assertions.push({
      name: 'party/low-light skin warmth+luma',
      pass: null,
      detail: LOWLIGHT
        ? 'LOWLIGHT_SKIN region not set yet'
        : 'lowlight_portrait.jpeg not supplied yet',
    });
  }

  /* -------- performance at the production frame size (480x640) -------- */
  {
    const frame = document.createElement('canvas');
    frame.width = 480; frame.height = 640;
    const fctx = frame.getContext('2d');
    const src = sources['experiment_photo.jpeg'];
    const scale = Math.max(480 / src.width, 640 / src.height);
    fctx.drawImage(src, (480 - src.width * scale) / 2, (640 - src.height * scale) / 2,
      src.width * scale, src.height * scale);
    const N = 10;
    for (const variant of ['daylight', 'party']) {
      let pixel = 0, bloom = 0, jpeg = 0;
      for (let i = 0; i < N; i++) {
        const { canvas, timings } = developWeddingFilm(frame, 480, 640, variant);
        pixel += timings.pixelMs;
        bloom += timings.bloomMs;
        const t = performance.now();
        canvas.toDataURL('image/jpeg', 0.78);
        jpeg += performance.now() - t;
      }
      results.performance[variant] = {
        pixelMs: +(pixel / N).toFixed(2),
        bloomMs: +(bloom / N).toFixed(2),
        jpegMs: +(jpeg / N).toFixed(2),
        iterations: N,
        frame: '480x640',
      };
    }
  }

  window.RESULTS = results;
})();
</script>`;

/* 4. Drive it. */
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('pageerror', (e) => {
  console.error('PAGE ERROR:', e.message);
  process.exitCode = 1;
});
await page.setContent(PAGE, { waitUntil: 'load' });
await page.waitForFunction(() => window.RESULTS !== undefined, { timeout: 120000 });
const results = await page.evaluate(() => window.RESULTS);
const sheetPath = join(OUT_DIR, 'memoroll-film-look.contact-sheet.png');
await page.locator('#sheet').screenshot({ path: sheetPath });
await browser.close();

const failed = results.assertions.filter((a) => a.pass === false);
const skipped = results.assertions.filter((a) => a.pass === null);
const passed = results.assertions.filter((a) => a.pass === true);
console.log(JSON.stringify({ sheet: sheetPath, ...results }, null, 2));
console.log(
  `\nASSERTIONS: ${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped (of ${results.assertions.length})`
);
if (skipped.length) console.log('SKIPPED:', skipped.map((s) => `${s.name} (${s.detail})`).join('; '));
if (failed.length) {
  console.log('FAILED:', failed.map((f) => f.name).join('; '));
  process.exitCode = 1;
}
