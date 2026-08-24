/**
 * The camera's behaviour, which no amount of computed style can speak for.
 *
 * `npm run visual` asserts that the camera looks like the design. This asserts
 * that it still works: a shot bakes at 960x1280 through the film pipeline and
 * lands in IndexedDB, and the strip opens on Wedding Natural. Re-skinning the
 * camera (hbd-qti.2) could have broken any of that without moving a pixel.
 *
 * Drives the demo the way a guest does - gate, Check Again, Got it, SHOOT -
 * because a probe that reached the shutter another way would not be evidence
 * that a guest can.
 *
 *   node visual/shot-e2e.mjs
 */
import { chromium } from 'playwright';
import { ensureAppServed, HARNESS_BASE_URL } from './dev-server.mjs';

const server = await ensureAppServed(HARNESS_BASE_URL);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

try {
  await page.goto(`${HARNESS_BASE_URL}/memoroll/demo`);
  await page.getByRole('button', { name: 'Get me in' }).click();
  await page.getByRole('button', { name: 'Continue with Google' }).click();
  await page.getByRole('button', { name: 'Yup, let’s shoot!' }).click();
  await page.getByRole('button', { name: 'Allow My Location' }).click();
  await page.getByRole('button', { name: 'Check Again' }).click();
  await page.getByRole('button', { name: 'Got it' }).click();

  // Ten shots on a fresh roll, and the strip opens on Wedding Natural.
  const before = await page
    .locator('section[aria-label="Camera"] >> text=/^10$/')
    .first()
    .textContent();
  const opensOn = await page
    .getByRole('radio', { checked: true })
    .textContent();

  await page.getByRole('button', { name: 'Take a shot' }).click();

  // The counter falls to 9 once the bake lands in the store.
  await page
    .locator('section[aria-label="Camera"]')
    .getByText('9', { exact: true })
    .waitFor({ timeout: 20000 });

  const shot = await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const open = indexedDB.open('memoroll-demo');
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    const rows = await new Promise((resolve, reject) => {
      const tx = db.transaction('shots', 'readonly');
      const all = tx.objectStore('shots').getAll();
      all.onsuccess = () => resolve(all.result);
      all.onerror = () => reject(all.error);
    });
    if (rows.length !== 1) return { rows: rows.length };
    const blob = rows[0].blob ?? rows[0];
    const bitmap = await createImageBitmap(blob);
    return {
      rows: rows.length,
      film: rows[0].film,
      type: blob.type,
      width: bitmap.width,
      height: bitmap.height,
    };
  });

  const badge = await page
    .locator('button[aria-label="Open the gallery"] span span')
    .last()
    .textContent();

  console.log(
    JSON.stringify({ before, opensOn, shot, badgeAfter: badge }, null, 2)
  );
  const pass =
    before === '10' &&
    opensOn === 'Wedding Natural' &&
    shot.rows === 1 &&
    shot.type === 'image/jpeg' &&
    shot.width === 960 &&
    shot.height === 1280 &&
    badge === '11';
  console.log(pass ? 'SHOT E2E: PASS' : 'SHOT E2E: FAIL');
  process.exitCode = pass ? 0 : 1;
} finally {
  await browser.close();
  await server.stop();
}
