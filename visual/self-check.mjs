#!/usr/bin/env node
/**
 * Check the comparator itself, without a browser or a server.
 *
 *   npm run visual:self-check
 *
 * Every screen reports red until the epic is finished, so "differs" on its own
 * cannot tell a reviewer whether the screen is wrong or the comparison is. This
 * answers that question.
 *
 * This is not a second seam into the product. The spec's rule that there is
 * exactly one seam, the rendered route, is about testing the application, and
 * nothing here touches the application. It checks the harness, which the spec
 * says is worth more care than the screens it checks because everything after it
 * depends on it.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { PNG } from 'pngjs';

import { compare } from './compare.mjs';
import { BASELINE_DIR } from './paths.mjs';
import { screens } from './screens.mjs';

const failures = [];

function expect(condition, description) {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${description}`);
  if (!condition) {
    failures.push(description);
  }
}

/** Invert a rectangle in the middle of a copy of the image. */
function withInvertedPatch(buffer) {
  const image = PNG.sync.read(buffer);
  const patch = {
    x: Math.floor(image.width / 4),
    y: Math.floor(image.height / 4),
    width: Math.max(1, Math.floor(image.width / 8)),
    height: Math.max(1, Math.floor(image.height / 8)),
  };

  for (let y = patch.y; y < patch.y + patch.height; y += 1) {
    for (let x = patch.x; x < patch.x + patch.width; x += 1) {
      const at = (image.width * y + x) << 2;
      image.data[at] = 255 - image.data[at];
      image.data[at + 1] = 255 - image.data[at + 1];
      image.data[at + 2] = 255 - image.data[at + 2];
      image.data[at + 3] = 255;
    }
  }

  return { patch, buffer: PNG.sync.write(image) };
}

/**
 * A pair of images whose only difference is the shading of one edge row.
 *
 * Pixelmatch reads that as antialiasing: it paints those pixels in the diff image
 * so a person can see them, but excludes them from the count. The reported region
 * must follow the count, not the paint, or every screen with text on it reports a
 * full-page region even when it passes.
 */
function edgeShadedPair() {
  const size = 60;
  const draw = (edgeShade) => {
    const image = new PNG({ width: size, height: size });
    image.data.fill(0xff);
    const set = (x, y, value) => {
      const at = (size * y + x) << 2;
      image.data[at] = value;
      image.data[at + 1] = value;
      image.data[at + 2] = value;
      image.data[at + 3] = 255;
    };
    for (let y = 20; y < 40; y += 1) {
      for (let x = 20; x < 40; x += 1) {
        set(x, y, 0);
      }
    }
    for (let x = 20; x < 40; x += 1) {
      set(x, 19, edgeShade);
    }
    return PNG.sync.write(image);
  };
  return { sharp: draw(255), shaded: draw(128) };
}

function encloses(region, patch) {
  return (
    region !== null &&
    region.x <= patch.x &&
    region.y <= patch.y &&
    region.x + region.width >= patch.x + patch.width &&
    region.y + region.height >= patch.y + patch.height
  );
}

async function main() {
  const withBaseline = screens.filter((screen) => screen.baseline);
  if (withBaseline.length === 0) {
    throw new Error(
      'no screen in visual/screens.mjs has a baseline to check against'
    );
  }

  for (const screen of withBaseline) {
    console.log(screen.baseline);
    const baseline = await readFile(join(BASELINE_DIR, screen.baseline));

    const identical = compare(baseline, baseline);
    expect(
      identical.differingPixels === 0,
      `an image compared against itself differs nowhere (got ${identical.differingPixels})`
    );
    expect(identical.region === null, 'and reports no region');

    const { patch, buffer } = withInvertedPatch(baseline);
    const changed = compare(baseline, buffer);
    expect(
      changed.differingPixels > 0,
      'a painted-over image is reported as differing'
    );
    expect(
      encloses(changed.region, patch),
      'and the reported region encloses the change'
    );
  }

  console.log('antialiasing');
  const { sharp, shaded } = edgeShadedPair();
  const antialiased = compare(sharp, shaded);
  expect(
    antialiased.differingPixels === 0,
    `antialiasing alone is not counted as a difference (got ${antialiased.differingPixels})`
  );
  expect(
    antialiased.region === null,
    'and does not drag the reported region across the page'
  );

  if (failures.length > 0) {
    throw new Error(`${failures.length} self-check(s) failed`);
  }
  console.log(
    '\nThe comparator behaves. A red screen means the screen, not the harness.'
  );
}

main().catch((error) => {
  console.error(`\nSelf-check failed: ${error.message}`);
  process.exitCode = 1;
});
