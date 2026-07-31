import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { COLOUR_TOLERANCE } from './screens.mjs';

/** The colour pixelmatch paints over a pixel it counted as different. */
const DIFF_COLOUR = [255, 0, 0];

/**
 * The colour pixelmatch paints over a pixel it decided is antialiasing.
 *
 * These are drawn but deliberately not counted, so they must not be read back as
 * differences either. On a text-heavy page they are everywhere.
 */
const ANTIALIAS_COLOUR = [255, 255, 0];

/**
 * Composite an image onto an opaque white canvas of the given size.
 *
 * Two things happen here. Transparency is flattened, so a baseline exported with
 * an alpha channel does not read as a difference against an opaque capture. And
 * the image is padded to a shared size, so a capture that is the wrong height
 * still compares: the region one image has and the other does not shows up as a
 * difference, which is what a wrong height is.
 */
function compositeOntoWhite(source, width, height) {
  const canvas = new PNG({ width, height });
  canvas.data.fill(0xff);

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const from = (source.width * y + x) << 2;
      const to = (width * y + x) << 2;
      const alpha = source.data[from + 3] / 255;
      for (let channel = 0; channel < 3; channel += 1) {
        const over = source.data[from + channel] * alpha;
        const under = 255 * (1 - alpha);
        canvas.data[to + channel] = Math.round(over + under);
      }
      canvas.data[to + 3] = 255;
    }
  }

  return canvas;
}

/**
 * The rectangle enclosing every pixel pixelmatch counted as different.
 *
 * Only exactly DIFF_COLOUR counts. Antialiasing marks are painted in the diff
 * image so a person can see them, but they were excluded from the count, and a
 * region that included them would grow to the full page on any screen with text
 * on it, including screens that pass.
 */
function markedRegion(diff) {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  for (let y = 0; y < diff.height; y += 1) {
    for (let x = 0; x < diff.width; x += 1) {
      const at = (diff.width * y + x) << 2;
      const isDifference =
        diff.data[at] === DIFF_COLOUR[0] &&
        diff.data[at + 1] === DIFF_COLOUR[1] &&
        diff.data[at + 2] === DIFF_COLOUR[2];
      if (isDifference) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (right < left) {
    return null;
  }

  return {
    x: left,
    y: top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

/**
 * Compare a capture against a baseline.
 *
 * Returns the fraction of pixels that differ, where the differences are, and a
 * diff image highlighting them. Equality is never required: see the note on
 * DEFAULT_MAX_DIFF_RATIO in `screens.mjs`.
 */
export function compare(baselineBuffer, actualBuffer) {
  const baseline = PNG.sync.read(baselineBuffer);
  const actual = PNG.sync.read(actualBuffer);

  const width = Math.max(baseline.width, actual.width);
  const height = Math.max(baseline.height, actual.height);

  const expected = compositeOntoWhite(baseline, width, height);
  const received = compositeOntoWhite(actual, width, height);
  const diff = new PNG({ width, height });

  const differingPixels = pixelmatch(
    expected.data,
    received.data,
    diff.data,
    width,
    height,
    {
      threshold: COLOUR_TOLERANCE,
      includeAA: false,
      diffColor: DIFF_COLOUR,
      diffColorAlt: DIFF_COLOUR,
      aaColor: ANTIALIAS_COLOUR,
    }
  );

  return {
    differingPixels,
    diffRatio: differingPixels / (width * height),
    region: markedRegion(diff),
    baselineSize: { width: baseline.width, height: baseline.height },
    actualSize: { width: actual.width, height: actual.height },
    diffImage: PNG.sync.write(diff),
  };
}
