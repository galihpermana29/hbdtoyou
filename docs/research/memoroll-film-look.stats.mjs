/* eslint-disable no-console -- CLI harness; stdout is the deliverable. */
// Channel statistics for the hbd-15j reference set, via headless Chromium.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = resolve(ROOT, 'src/assets/filter-camera');
const files = readdirSync(DIR).filter((f) => !f.startsWith('.'));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('about:blank');

for (const f of files) {
  const b64 = readFileSync(`${DIR}/${f}`).toString('base64');
  const stats = await page.evaluate(async (dataUrl) => {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });
    const w = 300, h = Math.round((img.naturalHeight / img.naturalWidth) * 300);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    const n = d.length / 4;
    const lum = new Float32Array(n);
    let r = 0, g = 0, b = 0;
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      r += d[i]; g += d[i + 1]; b += d[i + 2];
      lum[p] = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    }
    const sorted = [...lum].sort((a, z) => a - z);
    const pct = (q) => Math.round(sorted[Math.floor(q * (n - 1))]);
    // Shadow cast: mean RGB of darkest decile. Highlight cast: brightest decile.
    const loCut = sorted[Math.floor(0.1 * (n - 1))], hiCut = sorted[Math.floor(0.9 * (n - 1))];
    let lr = 0, lg = 0, lb = 0, ln = 0, hr = 0, hg = 0, hb = 0, hn = 0, clipHi = 0, clipLo = 0;
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      if (lum[p] <= loCut) { lr += d[i]; lg += d[i + 1]; lb += d[i + 2]; ln++; }
      if (lum[p] >= hiCut) { hr += d[i]; hg += d[i + 1]; hb += d[i + 2]; hn++; }
      if (lum[p] >= 250) clipHi++;
      if (lum[p] <= 5) clipLo++;
    }
    // Mean saturation (HSL-ish: (max-min)/max on non-dark pixels).
    let sat = 0, sn = 0;
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      const mx = Math.max(d[i], d[i + 1], d[i + 2]);
      if (mx > 25) { sat += (mx - Math.min(d[i], d[i + 1], d[i + 2])) / mx; sn++; }
    }
    const f1 = (x) => Math.round(x * 1000) / 1000;
    return {
      mean: [Math.round(r / n), Math.round(g / n), Math.round(b / n)],
      p: { p5: pct(0.05), p25: pct(0.25), p50: pct(0.5), p75: pct(0.75), p95: pct(0.95) },
      shadowRGB: [Math.round(lr / ln), Math.round(lg / ln), Math.round(lb / ln)],
      highlightRGB: [Math.round(hr / hn), Math.round(hg / hn), Math.round(hb / hn)],
      clipHiPct: f1((clipHi / n) * 100), clipLoPct: f1((clipLo / n) * 100),
      meanSat: f1(sat / sn),
    };
  }, `data:image/jpeg;base64,${b64}`);
  console.log(f, JSON.stringify(stats));
}
await browser.close();
