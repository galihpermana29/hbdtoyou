import { chromium } from 'playwright';

import { DESIGN_WIDTH } from './screens.mjs';

/**
 * Stylesheet applied to every capture.
 *
 * The Site Preview renders the live invitation, so it animates and it would
 * otherwise never hold still long enough to be compared. Everything here removes
 * a source of frame-to-frame variation without removing anything from the design:
 * the panel is frozen, never masked, so the comparison still sees it.
 *
 * The last rule hides the Next.js dev overlay, which belongs to the dev server
 * rather than to the design.
 */
const FREEZE_STYLES = `
  *, *::before, *::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    animation-play-state: paused !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
    scroll-behavior: auto !important;
    caret-color: transparent !important;
  }
  nextjs-portal { display: none !important; }
`;

/** Wait until every font and image the page asked for has arrived. */
async function waitForPaintedAssets(page) {
  await page.evaluate(() => document.fonts.ready);
  await page
    .waitForFunction(
      () =>
        Array.from(document.images).every(
          (image) => image.complete && image.naturalWidth > 0
        ),
      undefined,
      { timeout: 15000 }
    )
    .catch(() => {
      // An image that never loads is a difference worth seeing in the diff,
      // not a reason to abandon the capture.
    });
}

/**
 * Screenshot the page repeatedly until two in a row are identical.
 *
 * Freezing CSS stops CSS animation, but the Site Preview is also driven from
 * JavaScript, and remote imagery arrives when it arrives. Waiting for the page
 * to stop changing is the only check that covers all of it, and it is a check
 * rather than an assumption: if the page never settles the capture fails loudly
 * instead of quietly comparing one arbitrary frame.
 */
async function captureWhenSettled(page, { attempts = 8, quietMs = 400 } = {}) {
  const shot = () =>
    page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' });

  let previous = await shot();
  for (let attempt = 1; attempt < attempts; attempt += 1) {
    await page.waitForTimeout(quietMs);
    const current = await shot();
    if (current.equals(previous)) {
      return current;
    }
    previous = current;
  }

  throw new Error(
    `page never stopped changing after ${attempts} captures ${quietMs}ms apart`
  );
}

/**
 * Open a browser once, hand a capture function to the caller, and always close it.
 *
 * One browser serves every screen in a run, because launching Chromium costs
 * more than every comparison in this harness put together.
 */
export async function withBrowser(run) {
  const browser = await chromium.launch();

  /** Capture one screen at the design width, full page. */
  async function capture({ url, prepare }) {
    const context = await browser.newContext({
      viewport: { width: DESIGN_WIDTH, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      colorScheme: 'light',
    });
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'load', timeout: 120000 });
      await page.addStyleTag({ content: FREEZE_STYLES });
      if (prepare) {
        await prepare(page);
        // Anything the preparation step mounted needs freezing too.
        await page.addStyleTag({ content: FREEZE_STYLES });
      }
      await waitForPaintedAssets(page);
      return await captureWhenSettled(page);
    } finally {
      await context.close();
    }
  }

  try {
    return await run(capture);
  } finally {
    await browser.close();
  }
}
