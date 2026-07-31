#!/usr/bin/env node
/**
 * Print how to refresh the baselines the visual harness compares against.
 *
 *   FIGMA_FILE_KEY=<key> npm run visual:baselines
 *   npm run visual:baselines -- --file-key=<key>
 *
 * The file key is never stored here, and the script refuses to run without one.
 * The design is read through the Figma plugin bridge, whose file key changes
 * between sessions, so a key committed today is a silently wrong export tomorrow.
 * It has to be read at the start of every run.
 *
 * The export itself goes through the bridge rather than the REST API, because the
 * account's plan rate-limits the API partway through a session. The bridge needs a
 * person or an agent with the plugin open, so what this produces is the work list:
 * which node becomes which file, taken from the same manifest the comparison uses,
 * so the two can never drift apart.
 */

import { DESIGN_WIDTH, FIGMA_FILE_NAME, screens } from './screens.mjs';
import { asRepoPath } from './paths.mjs';

function readFileKey(argv) {
  const flag = argv.find((argument) => argument.startsWith('--file-key='));
  const key = flag
    ? flag.slice('--file-key='.length)
    : process.env.FIGMA_FILE_KEY;
  if (!key) {
    throw new Error(
      'no file key. Read the current one from the Figma plugin bridge, then pass it as ' +
        'FIGMA_FILE_KEY or --file-key=<key>. It is not hard-coded because it changes ' +
        'between bridge sessions.'
    );
  }
  return key;
}

function main() {
  const fileKey = readFileKey(process.argv.slice(2));
  const exportable = screens.filter(
    (screen) => screen.figmaNodeId && screen.baseline
  );
  if (exportable.length === 0) {
    throw new Error(
      'no screen in visual/screens.mjs has both a Figma node id and a baseline'
    );
  }

  console.log(
    `Export from "${FIGMA_FILE_NAME}" (${fileKey}) through the Figma plugin bridge.\n` +
      'Open the bridge plugin in the Figma desktop application first: it cannot read the\n' +
      `file otherwise. Export each frame at 1x, ${DESIGN_WIDTH}px wide, over the path shown.\n`
  );
  for (const screen of exportable) {
    console.log(
      `  node ${screen.figmaNodeId}  ->  ${asRepoPath('baseline', screen.baseline)}`
    );
    console.log(`    ${screen.title}`);
  }

  const missing = screens.filter((screen) => !screen.figmaNodeId);
  if (missing.length > 0) {
    console.log(
      `\nNo frame has been exported for ${missing.length} state(s) yet, so they cannot be\n` +
        'regenerated. Add the node id to visual/screens.mjs once the design has one:'
    );
    for (const screen of missing) {
      console.log(`  ${screen.id}: ${screen.title}`);
    }
  }
}

try {
  main();
} catch (error) {
  console.error(`Could not regenerate baselines: ${error.message}`);
  process.exitCode = 1;
}
