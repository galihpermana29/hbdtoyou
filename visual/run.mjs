#!/usr/bin/env node
/**
 * Check the Create Flow and the wedding invitation it makes against the design.
 *
 *   npm run visual
 *   npm run visual -- --screen=details-and-story-expanded
 *   npm run visual -- --base-url=http://127.0.0.1:3000
 *
 * Each screen is rendered in a real browser at the design width, driven into its
 * designed state, and asked what it is: the copy each element renders, where it
 * sits in the document, and how it is styled. That is compared against values
 * taken from the design. Nothing is measured, and nothing is scored.
 *
 * Exit codes are the whole point of this command, so they are kept distinct:
 *   0  every checkable screen matches the design
 *   1  at least one screen differs from the design
 *   2  the harness itself could not run
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { withBrowser } from './capture.mjs';
import { check, validateExpectations } from './check.mjs';
import { ensureAppServed, HARNESS_BASE_URL } from './dev-server.mjs';
import { observe } from './inspect.mjs';
import { asRepoPath, OUTPUT_DIR } from './paths.mjs';
import { DESIGN_WIDTH, screens, skipReason } from './screens.mjs';

const EXIT_MATCHES = 0;
const EXIT_DIFFERS = 1;
const EXIT_HARNESS_BROKEN = 2;

function parseArguments(argv) {
  const options = {
    screen: null,
    baseUrl: process.env.VISUAL_BASE_URL || HARNESS_BASE_URL,
  };

  for (const argument of argv) {
    const [flag, value] = argument.split(/=(.*)/s);
    switch (flag) {
      case '--screen':
        options.screen = value;
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

async function checkScreen(screen, { visit, baseUrl }) {
  const { screenshot, observed, failure } = await visit(
    {
      url: new URL(screen.route, baseUrl).href,
      prepare: screen.prepare,
    },
    (page) => observe(page, screen.expectations)
  );

  // The evidence is written before anything can go wrong with the verdict. A
  // run that failed is exactly when someone wants to see what the page was.
  await writeFile(join(OUTPUT_DIR, `${screen.id}.actual.png`), screenshot);
  if (failure) {
    throw failure;
  }

  const failures = check(screen.expectations, observed);

  return {
    id: screen.id,
    title: screen.title,
    note: screen.note ?? null,
    status: failures.length === 0 ? 'matches' : 'differs',
    checked: screen.expectations.length,
    failures,
    screenshot: asRepoPath('output', `${screen.id}.actual.png`),
  };
}

/** Split the chosen screens into the ones that can be checked and the rest. */
function partition(chosen) {
  const checkable = [];
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
      checkable.push(screen);
    }
  }
  return { checkable, skipped };
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
    throw new Error(`"${requestedId}" cannot be checked yet: ${reason}`);
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
    if (result.status === 'matches') {
      console.log(
        `MATCHES ${result.id}: all ${result.checked} elements match the design`
      );
    } else {
      console.log(
        `DIFFERS ${result.id}: ${result.failures.length} failure(s) across ` +
          `${result.checked} checked elements`
      );
      for (const failure of result.failures) {
        const found = failure.found ? ` ${failure.found}` : '';
        console.log(`        ${failure.element}${found} - ${failure.property}`);
        console.log(`          expected: ${failure.expected}`);
        console.log(`          actual:   ${failure.actual}`);
      }
    }
    console.log(`        screenshot: ${result.screenshot}`);
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
  const { checkable, skipped } = partition(chooseScreens(options.screen));

  if (checkable.length === 0) {
    throw new Error(
      'nothing to check: every screen is missing its route or its expectations'
    );
  }

  // A manifest that cannot be checked is the harness being broken, not a screen
  // differing from the design, so it stops the run here rather than reporting a
  // red screen - and it stops before a dev server is started for nothing.
  for (const screen of checkable) {
    const authoring = validateExpectations(screen.expectations);
    if (authoring.length > 0) {
      throw new Error(
        `${screen.id} has expectations that cannot be checked:\n` +
          authoring
            .map(
              (entry) =>
                `  ${entry.element} - ${entry.property}: ${entry.actual}`
            )
            .join('\n')
      );
    }
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
    results = await withBrowser(async (visit) => {
      const collected = [];
      for (const screen of checkable) {
        process.stdout.write(`Checking ${screen.id}... `);
        try {
          const result = await checkScreen(screen, {
            visit,
            baseUrl: options.baseUrl,
          });
          console.log(
            result.status === 'matches'
              ? 'matches'
              : `${result.failures.length} failure(s)`
          );
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
