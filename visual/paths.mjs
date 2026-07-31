import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HARNESS_DIR = dirname(fileURLToPath(import.meta.url));

/** Committed Figma exports. The design, as this repository last saw it. */
export const BASELINE_DIR = join(HARNESS_DIR, 'baseline');

/** Captures, diffs and the report. Rewritten on every run, never committed. */
export const OUTPUT_DIR = join(HARNESS_DIR, 'output');

/** The same path relative to the repository root, for anything a human reads. */
export const asRepoPath = (...segments) => join('visual', ...segments);
