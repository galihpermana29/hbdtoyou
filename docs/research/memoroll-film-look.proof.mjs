/**
 * Visual proof + assertion harness for the MemoRoll film renderer (hbd-sk4).
 *
 * Runs the real src/lib/memoroll-film.ts and memoroll-camera.ts
 * (transpiled with the repo's tsc) in headless Chromium against the
 * reference set. Renders the contact sheet (browse grid at 480 wide plus
 * the exact 960x1280 keeper row), executes the report's region assertions
 * on pre-encode ImageData, proves determinism and the absence of generated
 * grain, times color / bloom / finalize / encode, and exercises the
 * lighting-capability module across its five states.
 *
 *   node docs/research/memoroll-film-look.proof.mjs [outDir]
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

/* 1. Transpile the engine + capability module, strip module syntax. */
const tmp = mkdtempSync(join(tmpdir(), 'memoroll-film-'));
execSync(
  `npx tsc ${join(REPO, 'src/lib/memoroll-film.ts')} ${join(
    REPO,
    'src/lib/memoroll-camera.ts'
  )} --target es2020 --module es2015 --lib es2020,dom --skipLibCheck --outDir ${tmp}`,
  { cwd: REPO, stdio: 'inherit' }
);
const stripExports = (p) => readFileSync(p, 'utf8').replace(/^export /gm, '');
const engineJs = stripExports(join(tmp, 'memoroll-film.js'));
const capsJs = stripExports(join(tmp, 'memoroll-camera.js'));

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
const present = readdirSync(ASSETS);
const images = {};
for (const f of INPUT_FILES) {
  if (!present.includes(f)) throw new Error(`missing input: ${f}`);
  images[f] =
    `data:image/jpeg;base64,${readFileSync(join(ASSETS, f)).toString('base64')}`;
}

/* 3. Regions (report §6), fractional [x0, y0, x1, y1]. */
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

const LOOKS = [
  'wedding-natural',
  'soft-pastel',
  'clean-cool',
  'bold-color',
  'black-white',
];

const PAGE = `<!doctype html>
<meta charset="utf-8" />
<title>MemoRoll film proof</title>
<style>
  body { margin: 0; background: #181818; color: #eee; font: 11px/1.4 sans-serif; }
  #sheet { width: max-content; padding: 12px; }
  .row { display: flex; gap: 8px; margin-bottom: 12px; align-items: flex-start; }
  figure { margin: 0; width: 200px; }
  canvas, img { width: 100%; display: block; }
  figcaption { padding: 3px 1px; font-weight: 600; }
  .rowlabel { width: 84px; font-weight: 700; padding-top: 4px; }
</style>
<div id="sheet"></div>
<script>${engineJs}</script>
<script>${capsJs}</script>
<script>
const IMAGES = ${JSON.stringify(images)};
const REGIONS = ${JSON.stringify(REGIONS)};
const LOOKS = ${JSON.stringify(LOOKS)};
const KEEPER_W = 960, KEEPER_H = 1280;
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

function coverCrop(source, sw, sh, w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  const scale = Math.max(w / sw, h / sh);
  ctx.drawImage(source, (w - sw * scale) / 2, (h - sh * scale) / 2, sw * scale, sh * scale);
  return c;
}

const imageDataOf = (c) =>
  c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height);

/* ---------- statistics on ImageData (pre-encode always) ---------- */
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
  return { mean: [r / n, g / n, b / n], median: outLums[Math.floor(outLums.length / 2)] };
}

/** Mean |L - 3x3 mean|: high-frequency energy, the no-grain instrument. */
function hfEnergy(image) {
  const { width: w, height: h, data: d } = image;
  const lums = new Float32Array(w * h);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    lums[p] = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
  }
  let acc = 0, cnt = 0;
  for (let y = 1; y < h - 1; y += 2) {
    for (let x = 1; x < w - 1; x += 2) {
      const p = y * w + x;
      let m = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) m += lums[p + dy * w + dx];
      acc += Math.abs(lums[p] - m / 9);
      cnt++;
    }
  }
  return acc / cnt;
}

/* ------------------------------ main ------------------------------ */
(async () => {
  const sheet = document.getElementById('sheet');
  const results = { assertions: [], performance: {}, capability: [] };
  const check = (name, pass, detail) => results.assertions.push({ name, pass, detail });

  const sources = {};
  for (const [file, src] of Object.entries(IMAGES)) {
    sources[file] = toCanvas(await loadImg(src), SHEET_W);
  }

  /* Browse grid: every input through the five looks, at sheet width. */
  const developed = {};
  for (const [file, label] of [
    ['experiment_photo.jpeg', 'experiment'],
    ['digi cam rehearsal.jpeg', 'digicam'],
    ['reference_1.jpeg', 'ref 1'],
    ['reference_2.jpeg', 'ref 2'],
    ['reference_3', 'ref 3'],
    ['reference_4.jpeg', 'ref 4'],
    ['reference_5.jpeg', 'ref 5'],
  ]) {
    const src = sources[file];
    const row = document.createElement('div');
    row.className = 'row';
    const rl = document.createElement('div');
    rl.className = 'rowlabel';
    rl.textContent = label;
    row.appendChild(rl);
    developed[file] = {};
    const cells = [['input', src]];
    for (const look of LOOKS) {
      const { canvas } = bakeMemoRollFilm(src, src.width, src.height, look);
      developed[file][look] = imageDataOf(canvas);
      cells.push([look, canvas]);
    }
    for (const [cap, canvas] of cells) {
      const fig = document.createElement('figure');
      fig.appendChild(canvas);
      const fc = document.createElement('figcaption');
      fc.textContent = cap;
      fig.appendChild(fc);
      row.appendChild(fig);
    }
    sheet.appendChild(row);
  }

  /* The keeper row: the exact 960x1280 contract, cover-cropped. */
  const keeperSrc = coverCrop(
    sources['experiment_photo.jpeg'],
    sources['experiment_photo.jpeg'].width,
    sources['experiment_photo.jpeg'].height,
    KEEPER_W, KEEPER_H
  );
  {
    const row = document.createElement('div');
    row.className = 'row';
    const rl = document.createElement('div');
    rl.className = 'rowlabel';
    rl.textContent = 'keeper 960x1280';
    row.appendChild(rl);
    for (const look of ['none', ...LOOKS]) {
      const { canvas } = bakeMemoRollFilm(keeperSrc, KEEPER_W, KEEPER_H, look);
      const fig = document.createElement('figure');
      fig.appendChild(canvas);
      const fc = document.createElement('figcaption');
      fc.textContent = look;
      fig.appendChild(fc);
      row.appendChild(fig);
    }
    sheet.appendChild(row);
  }

  /* 1:1 crops from the 960x1280 wedding-natural keeper. */
  {
    const CROPS = {
      face: [0.56, 0.35],
      deepShadow: [0.1, 0.52],
      highlight: [0.35, 0.06],
      neutralClothing: [0.12, 0.62],
    };
    const CROP = 220;
    const developedKeeper = {};
    for (const look of ['wedding-natural', 'bold-color']) {
      developedKeeper[look] = bakeMemoRollFilm(keeperSrc, KEEPER_W, KEEPER_H, look).canvas;
    }
    for (const [spot, [fx, fy]] of Object.entries(CROPS)) {
      const row = document.createElement('div');
      row.className = 'row';
      const rl = document.createElement('div');
      rl.className = 'rowlabel';
      rl.textContent = '1:1 ' + spot;
      row.appendChild(rl);
      const sx = Math.max(0, Math.min(KEEPER_W - CROP, fx * KEEPER_W - CROP / 2));
      const sy = Math.max(0, Math.min(KEEPER_H - CROP, fy * KEEPER_H - CROP / 2));
      for (const [label, source] of [
        ['input', keeperSrc],
        ['wedding-natural', developedKeeper['wedding-natural']],
        ['bold-color', developedKeeper['bold-color']],
      ]) {
        const c = document.createElement('canvas');
        c.width = CROP; c.height = CROP;
        c.style.width = CROP + 'px';
        const cctx = c.getContext('2d');
        cctx.imageSmoothingEnabled = false;
        cctx.drawImage(source, sx, sy, CROP, CROP, 0, 0, CROP, CROP);
        const fig = document.createElement('figure');
        fig.style.width = CROP + 'px';
        fig.appendChild(c);
        const fc = document.createElement('figcaption');
        fc.textContent = label;
        fig.appendChild(fc);
        row.appendChild(fig);
      }
      sheet.appendChild(row);
    }
  }

  /* --------- Wedding Natural retains the approved tone (§6) --------- */
  const expSrc = sources['experiment_photo.jpeg'];
  const expIn = imageDataOf(expSrc);
  {
    const out = developed['experiment_photo.jpeg']['wedding-natural'];
    const R = REGIONS.experiment;
    const dress = regionStats(out, R.dress);
    check('wedding-natural/dress warm+unclipped',
      dress.lumaMean <= 245 && dress.mean[0] - dress.mean[2] >= 10,
      \`lumaMean=\${dress.lumaMean.toFixed(1)} R-B=\${(dress.mean[0] - dress.mean[2]).toFixed(1)}\`);
    const gIn = regionStats(expIn, R.grass);
    const gOut = regionStats(out, R.grass);
    check('wedding-natural/grass stays green',
      gOut.mean[1] >= gOut.mean[0] && gOut.mean[1] >= gOut.mean[2] && hueDelta(gIn.hue, gOut.hue) < 15,
      \`hueIn=\${gIn.hue.toFixed(0)} hueOut=\${gOut.hue.toFixed(0)}\`);
    for (const skin of ['skinGroom', 'skinBride']) {
      const sIn = regionStats(expIn, R[skin]);
      const sOut = regionStats(out, R[skin]);
      const dWarm = (sOut.mean[0] - sOut.mean[2]) - (sIn.mean[0] - sIn.mean[2]);
      const lumaShift = Math.abs(sOut.lumaMean - sIn.lumaMean) / sIn.lumaMean;
      check(\`wedding-natural/\${skin} warmth+luma\`,
        dWarm >= 5 && dWarm <= 25 && lumaShift <= 0.12,
        \`dR-B=\${dWarm.toFixed(1)} lumaShift=\${(lumaShift * 100).toFixed(1)}%\`);
    }
    const dark = darkMaskStats(expIn, out);
    check('wedding-natural/shadow floor+blue lowest',
      dark.median >= 7 && dark.mean[2] <= dark.mean[0] && dark.mean[2] <= dark.mean[1],
      \`maskedMedian=\${dark.median.toFixed(1)} meanRGB=\${dark.mean.map((v) => v.toFixed(1)).join(',')}\`);
    const mIn = regionStats(expIn, R.midMix);
    const mOut = regionStats(out, R.midMix);
    const spreadIn = mIn.p75 - mIn.p25;
    const spreadOut = mOut.p75 - mOut.p25;
    check('wedding-natural/midtone spread',
      Math.abs(spreadOut - spreadIn) / spreadIn <= 0.15,
      \`in=\${spreadIn.toFixed(1)} out=\${spreadOut.toFixed(1)}\`);
  }

  /* Robustness of the flagship on the digicam input (§6.2 bands). */
  {
    const digiIn = imageDataOf(sources['digi cam rehearsal.jpeg']);
    const out = developed['digi cam rehearsal.jpeg']['wedding-natural'];
    const R = REGIONS.digicam;
    const skyOut = regionStats(out, R.sky);
    check('wedding-natural/digicam sky not orange',
      !(skyOut.hue >= 15 && skyOut.hue <= 75 && skyOut.mean[0] - skyOut.mean[2] > 8),
      \`R-B=\${(skyOut.mean[0] - skyOut.mean[2]).toFixed(1)} hueOut=\${skyOut.hue.toFixed(0)}\`);
    const fOut = regionStats(out, R.foliage);
    check('wedding-natural/digicam foliage green',
      fOut.mean[1] >= fOut.mean[0] && fOut.mean[1] >= fOut.mean[2] && fOut.hue >= 60 && fOut.hue <= 180,
      \`hueOut=\${fOut.hue.toFixed(0)}\`);
    const cIn = regionStats(digiIn, R.clothing);
    const cOut = regionStats(out, R.clothing);
    check('wedding-natural/digicam clothing hue held',
      hueDelta(cIn.hue, cOut.hue) < 15,
      \`dHue=\${hueDelta(cIn.hue, cOut.hue).toFixed(0)}\`);
    const tIn = regionStats(digiIn, R.deepTrees);
    const tOut = regionStats(out, R.deepTrees);
    check('wedding-natural/digicam canopy not flattened',
      (tOut.p75 - tOut.p25) >= 0.6 * (tIn.p75 - tIn.p25),
      \`spreadIn=\${(tIn.p75 - tIn.p25).toFixed(1)} spreadOut=\${(tOut.p75 - tOut.p25).toFixed(1)}\`);
  }

  /* Look sanity: Black & White is gray; Soft Pastel desaturates;
     Bold Color saturates without crushing shadows. */
  {
    const bw = developed['experiment_photo.jpeg']['black-white'];
    let maxChroma = 0;
    for (let i = 0; i < bw.data.length; i += 4) {
      const c = Math.max(bw.data[i], bw.data[i + 1], bw.data[i + 2]) -
        Math.min(bw.data[i], bw.data[i + 1], bw.data[i + 2]);
      if (c > maxChroma) maxChroma = c;
    }
    check('black-white/fully neutral', maxChroma <= 2, \`maxChroma=\${maxChroma}\`);
    const meanSat = (img) => {
      let sat = 0, n = 0;
      for (let i = 0; i < img.data.length; i += 4) {
        const mx = Math.max(img.data[i], img.data[i + 1], img.data[i + 2]);
        if (mx > 25) {
          sat += (mx - Math.min(img.data[i], img.data[i + 1], img.data[i + 2])) / mx;
          n++;
        }
      }
      return sat / n;
    };
    const satIn = meanSat(expIn);
    check('soft-pastel/desaturates', meanSat(developed['experiment_photo.jpeg']['soft-pastel']) < satIn,
      \`in=\${satIn.toFixed(3)} out=\${meanSat(developed['experiment_photo.jpeg']['soft-pastel']).toFixed(3)}\`);
    const bold = developed['experiment_photo.jpeg']['bold-color'];
    const boldDark = darkMaskStats(expIn, bold);
    check('bold-color/saturates without crush',
      meanSat(bold) > satIn && boldDark.median >= 3,
      \`sat=\${meanSat(bold).toFixed(3)} darkMedian=\${boldDark.median.toFixed(1)}\`);
  }

  /* None identity, pre-stamp/pre-encode, bit-exact. */
  {
    const before = imageDataOf(expSrc);
    const { canvas } = bakeMemoRollFilm(expSrc, expSrc.width, expSrc.height, 'none');
    const after = imageDataOf(canvas);
    let identical = before.data.length === after.data.length;
    if (identical) {
      for (let i = 0; i < before.data.length; i++) {
        if (before.data[i] !== after.data[i]) { identical = false; break; }
      }
    }
    check('none/identity pre-encode', identical, identical ? 'bit-identical' : 'DIFFERS');
  }

  /* Determinism + no generated grain, at the exact keeper resolution. */
  for (const look of LOOKS) {
    const a = imageDataOf(bakeMemoRollFilm(keeperSrc, KEEPER_W, KEEPER_H, look).canvas);
    const b = imageDataOf(bakeMemoRollFilm(keeperSrc, KEEPER_W, KEEPER_H, look).canvas);
    let identical = true;
    for (let i = 0; i < a.data.length; i++) {
      if (a.data[i] !== b.data[i]) { identical = false; break; }
    }
    check(\`determinism/\${look}\`, identical, identical ? 'repeat render bit-identical' : 'DIFFERS');
  }
  {
    const flat = document.createElement('canvas');
    flat.width = KEEPER_W; flat.height = KEEPER_H;
    const fctx = flat.getContext('2d', { willReadFrequently: true });
    fctx.fillStyle = 'rgb(128, 128, 128)';
    fctx.fillRect(0, 0, KEEPER_W, KEEPER_H);
    for (const look of LOOKS) {
      const out = imageDataOf(bakeMemoRollFilm(flat, KEEPER_W, KEEPER_H, look).canvas);
      const hf = hfEnergy(out);
      check(\`no-grain/\${look}\`, hf < 0.15,
        \`flat-input HF residual=\${hf.toFixed(4)} (grain would add >1)\`);
    }
  }

  /* -------- performance at the keeper resolution (960x1280) -------- */
  {
    const N = 6;
    for (const look of [...LOOKS, 'party']) {
      let color = 0, bloom = 0, finalize = 0, encode = 0;
      for (let i = 0; i < N; i++) {
        const { canvas, timings } = bakeMemoRollFilm(keeperSrc, KEEPER_W, KEEPER_H, look);
        color += timings.colorMs;
        bloom += timings.bloomMs;
        finalize += timings.finalizeMs;
        const t = performance.now();
        await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.78));
        encode += performance.now() - t;
      }
      results.performance[look] = {
        colorMs: +(color / N).toFixed(2),
        bloomMs: +(bloom / N).toFixed(2),
        finalizeMs: +(finalize / N).toFixed(2),
        encodeMs: +(encode / N).toFixed(2),
        iterations: N,
        frame: KEEPER_W + 'x' + KEEPER_H,
      };
    }
  }

  /* -------- lighting-capability module: the five states -------- */
  {
    const cap = (name, pass, detail) => results.capability.push({ name, pass, detail });
    const bareTrack = {};
    const torchTrack = { getCapabilities: () => ({ torch: true }), applyConstraints: async () => {} };
    const flashFactory = () => ({
      getPhotoCapabilities: async () => ({ fillLightMode: ['auto', 'flash'] }),
      takePhoto: async () => new Blob(),
    });
    const nullFactory = () => null;
    const failingFactory = () => ({
      getPhotoCapabilities: async () => { throw new Error('hardware gone'); },
      takePhoto: async () => new Blob(),
    });

    let r = await detectLightingCapabilities(bareTrack, nullFactory);
    cap('unsupported device', !r.flash && !r.torch, JSON.stringify(r));
    r = await detectLightingCapabilities(bareTrack, flashFactory);
    cap('flash-only device', r.flash && !r.torch, JSON.stringify(r));
    r = await detectLightingCapabilities(torchTrack, nullFactory);
    cap('torch-only device', !r.flash && r.torch, JSON.stringify(r));
    r = await detectLightingCapabilities(torchTrack, flashFactory);
    cap('both supported', r.flash && r.torch, JSON.stringify(r));
    r = await detectLightingCapabilities(torchTrack, failingFactory);
    let torchFailed = false;
    try {
      await setTorch({ applyConstraints: async () => { throw new Error('lost'); } }, true);
    } catch {
      torchFailed = true;
    }
    cap('runtime failure downgrades', !r.flash && r.torch && torchFailed,
      \`detect=\${JSON.stringify(r)} setTorch threw=\${torchFailed}\`);
  }

  window.RESULTS = results;
})();
</script>`;

/* 4. Drive it. */
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
page.on('pageerror', (e) => {
  console.error('PAGE ERROR:', e.message);
  process.exitCode = 1;
});
await page.setContent(PAGE, { waitUntil: 'load' });
await page.waitForFunction(() => window.RESULTS !== undefined, {
  timeout: 180000,
});
const results = await page.evaluate(() => window.RESULTS);
const sheetPath = join(OUT_DIR, 'memoroll-film-look.contact-sheet.png');
await page.locator('#sheet').screenshot({ path: sheetPath });
await browser.close();

const all = [...results.assertions, ...results.capability];
const failed = all.filter((a) => a.pass === false);
console.log(JSON.stringify({ sheet: sheetPath, ...results }, null, 2));
console.log(
  `\nASSERTIONS: ${all.length - failed.length}/${all.length} passed (${results.capability.length} capability checks included)`
);
if (failed.length) {
  console.log('FAILED:', failed.map((f) => f.name).join('; '));
  process.exitCode = 1;
}
