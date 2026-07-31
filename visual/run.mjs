#!/usr/bin/env node
/**
 * Compare the Create Flow against the design.
 *
 *   npm run visual
 *   npm run visual -- --screen=details-and-story-expanded
 *   npm run visual -- --threshold=0.01 --base-url=http://127.0.0.1:3000
 *
 * Exit codes are the whole point of this command, so they are kept distinct:
 *   0  every comparable screen is within its threshold
 *   1  at least one screen differs from the design by more than its threshold
 *   2  the harness itself could not run
 */

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { withBrowser } from './capture.mjs';
import { compare } from './compare.mjs';
import { ensureAppServed, HARNESS_BASE_URL } from './dev-server.mjs';
import { asRepoPath, BASELINE_DIR, OUTPUT_DIR } from './paths.mjs';
import {
  DEFAULT_MAX_DIFF_RATIO,
  DESIGN_WIDTH,
  screens,
  skipReason,
} from './screens.mjs';

const EXIT_MATCHES = 0;
const EXIT_DIFFERS = 1;
const EXIT_HARNESS_BROKEN = 2;

function parseArguments(argv) {
  const options = {
    screen: null,
    threshold: null,
    baseUrl: process.env.VISUAL_BASE_URL || HARNESS_BASE_URL,
  };

  for (const argument of argv) {
    const [flag, value] = argument.split(/=(.*)/s);
    switch (flag) {
      case '--screen':
        options.screen = value;
        break;
      case '--threshold':
        options.threshold = Number(value);
        if (!Number.isFinite(options.threshold) || options.threshold < 0) {
          throw new Error(
            `--threshold must be a fraction between 0 and 1, got "${value}"`
          );
        }
        break;
      case '--base-url':
        options.baseUrl = value;
        break;
      default:
        throw new Error(`unknown option "${flag}"`);
    }
  }

  return options;
}

const asPercent = (ratio) => `${(ratio * 100).toFixed(3)}%`;

function describeRegion(region) {
  if (!region) {
    return 'nowhere';
  }
  return `${region.width}x${region.height} at (${region.x}, ${region.y})`;
}

function describeSizes({ baselineSize, actualSize }) {
  if (
    baselineSize.width === actualSize.width &&
    baselineSize.height === actualSize.height
  ) {
    return `both ${baselineSize.width}x${baselineSize.height}`;
  }
  return (
    `design ${baselineSize.width}x${baselineSize.height}, ` +
    `page ${actualSize.width}x${actualSize.height}`
  );
}

/**
 * The threshold a screen is judged against.
 *
 * An explicit `--threshold` wins over everything, because someone typed it on
 * purpose for this run. Otherwise a screen's own recorded allowance applies, and
 * failing that the default.
 */
function thresholdFor(screen, requested) {
  return requested ?? screen.maxDiffRatio ?? DEFAULT_MAX_DIFF_RATIO;
}

async function compareScreen(screen, { capture, baseUrl, threshold }) {
  const baselineBuffer = await readFile(join(BASELINE_DIR, screen.baseline));
  const actualBuffer = await capture({
    url: new URL(screen.route, baseUrl).href,
    prepare: screen.prepare,
  });

  const result = compare(baselineBuffer, actualBuffer);
  const maxDiffRatio = thresholdFor(screen, threshold);

  await writeFile(join(OUTPUT_DIR, `${screen.id}.actual.png`), actualBuffer);
  await writeFile(join(OUTPUT_DIR, `${screen.id}.diff.png`), result.diffImage);

  return {
    id: screen.id,
    title: screen.title,
    note: screen.note ?? null,
    status: result.diffRatio <= maxDiffRatio ? 'matches' : 'differs',
    diffRatio: result.diffRatio,
    differingPixels: result.differingPixels,
    maxDiffRatio,
    sizes: describeSizes(result),
    region: result.region,
    baseline: asRepoPath('baseline', screen.baseline),
    actual: asRepoPath('output', `${screen.id}.actual.png`),
    diff: asRepoPath('output', `${screen.id}.diff.png`),
  };
}

/** Split the chosen screens into the ones that can be compared and the rest. */
function partition(chosen) {
  const comparable = [];
  const skipped = [];
  for (const screen of chosen) {
    const reason = skipReason(screen);
    if (reason) {
      skipped.push({
        id: screen.id,
        title: screen.title,
        status: 'skipped',
        reason,
      });
    } else {
      comparable.push(screen);
    }
  }
  return { comparable, skipped };
}

function chooseScreens(requestedId) {
  if (!requestedId) {
    return screens;
  }
  const screen = screens.find((candidate) => candidate.id === requestedId);
  if (!screen) {
    throw new Error(
      `no screen called "${requestedId}". Known screens: ${screens
        .map((candidate) => candidate.id)
        .join(', ')}`
    );
  }
  const reason = skipReason(screen);
  if (reason) {
    throw new Error(`"${requestedId}" cannot be compared yet: ${reason}`);
  }
  return [screen];
}

function report(results, skipped) {
  console.log('');
  for (const result of results) {
    if (result.status === 'errored') {
      console.log(`ERROR   ${result.id}: ${result.reason}`);
      continue;
    }
    const verdict = result.status === 'matches' ? 'MATCHES' : 'DIFFERS';
    console.log(
      `${verdict} ${result.id}: ${asPercent(result.diffRatio)} of pixels ` +
        `(${result.differingPixels.toLocaleString('en-US')}), ` +
        `threshold ${asPercent(result.maxDiffRatio)}`
    );
    console.log(`        size: ${result.sizes}`);
    console.log(`        differs across: ${describeRegion(result.region)}`);
    console.log(`        diff image: ${result.diff}`);
    if (result.note) {
      console.log(`        note: ${result.note}`);
    }
  }
  for (const skip of skipped) {
    console.log(`SKIPPED ${skip.id}: ${skip.reason}`);
  }
  console.log(`\nReport: ${asRepoPath('output', 'report.json')}`);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const { comparable, skipped } = partition(chooseScreens(options.screen));

  if (comparable.length === 0) {
    throw new Error(
      'nothing to compare: every screen is missing its route or its baseline'
    );
  }

  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const app = await ensureAppServed(options.baseUrl);
  console.log(
    app.startedHere
      ? `Started the app at ${options.baseUrl}`
      : `Using the app already serving ${options.baseUrl}`
  );

  let results;
  try {
    results = await withBrowser(async (capture) => {
      const collected = [];
      for (const screen of comparable) {
        process.stdout.write(`Capturing ${screen.id}... `);
        try {
          const result = await compareScreen(screen, {
            capture,
            baseUrl: options.baseUrl,
            threshold: options.threshold,
          });
          console.log(asPercent(result.diffRatio));
          collected.push(result);
        } catch (error) {
          console.log('failed');
          collected.push({
            id: screen.id,
            title: screen.title,
            status: 'errored',
            reason: error.message,
          });
        }
      }
      return collected;
    });
  } finally {
    await app.stop();
  }

  await writeFile(
    join(OUTPUT_DIR, 'report.json'),
    `${JSON.stringify(
      {
        designWidth: DESIGN_WIDTH,
        defaultMaxDiffRatio: DEFAULT_MAX_DIFF_RATIO,
        thresholdOverride: options.threshold,
        screens: [...results, ...skipped],
      },
      null,
      2
    )}\n`
  );

  report(results, skipped);

  if (results.some((result) => result.status === 'errored')) {
    return EXIT_HARNESS_BROKEN;
  }
  return results.every((result) => result.status === 'matches')
    ? EXIT_MATCHES
    : EXIT_DIFFERS;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(`\nThe visual harness could not run: ${error.message}`);
    if (/Executable doesn't exist|browserType.launch/.test(error.message)) {
      console.error(
        'Chromium has not been downloaded yet. Run: npx playwright install chromium'
      );
    }
    process.exitCode = EXIT_HARNESS_BROKEN;
  });
