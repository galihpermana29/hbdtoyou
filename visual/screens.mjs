/**
 * The Create Flow screens the visual harness knows about.
 *
 * Each entry names one designed screen, the Figma node it was exported from,
 * and how to drive a browser into that state. The Figma file key is deliberately
 * absent: it changes between plugin bridge sessions and is read at run time.
 * See `visual/README.md`.
 */

/**
 * Fraction of pixels allowed to differ before a screen is reported as failing.
 *
 * Default 0.002 (0.2%). Reason, per the epic's requirement that the threshold
 * start strict and only be relaxed with a recorded justification:
 *
 *   Figma's rasteriser and Chromium never agree on glyph edges, so a screen that
 *   is genuinely correct still differs. `COLOUR_TOLERANCE` plus pixelmatch's
 *   antialiasing detection absorbs most of that noise, leaving a residue well
 *   under a tenth of a percent on a text-heavy page.
 *
 *   0.2% of the tallest baseline (1440x5801) is roughly 16,700 pixels, about the
 *   area of one form field. So the gate passes rasteriser noise and fails on
 *   anything the size of a misplaced field or larger.
 *
 * A screen that genuinely needs more room gets its own `maxDiffRatio` here, with
 * a comment saying why, where a reviewer will see it. `--threshold` on the
 * command line is for exploring a screen you are working on; it leaves no record,
 * so it is not a way to land one.
 */
export const DEFAULT_MAX_DIFF_RATIO = 0.002;

/**
 * Per-pixel colour distance below which two pixels count as the same, on
 * pixelmatch's 0-1 scale. Its own default, which is tuned for exactly this
 * problem: absorbing rasteriser differences without hiding real colour changes.
 */
export const COLOUR_TOLERANCE = 0.1;

/** The width the design is defined at. Nothing below this is pixel-checked. */
export const DESIGN_WIDTH = 1440;

/** The Figma file the baselines come from, for the regeneration instructions. */
export const FIGMA_FILE_NAME = 'Wedding Invitations';

const DETAILS_AND_STORY_ROUTE = '/create/wedding-invitation';

/**
 * Expand every Section, top to bottom.
 *
 * The form is currently an antd accordion, so at most one Section can be open and
 * this leaves the last one open rather than all of them. That is not worked
 * around: it is one of the differences from the design, and hiding it here would
 * hide it from the diff as well. The screen's `note` says so in the report.
 */
async function expandEverySection(page) {
  const headers = page.locator('.ant-collapse-item > .ant-collapse-header');
  const count = await headers.count();
  for (let index = 0; index < count; index += 1) {
    const header = headers.nth(index);
    const isOpen = (await header.getAttribute('aria-expanded')) === 'true';
    if (!isOpen) {
      await header.click();
    }
  }
}

/**
 * Three of the seven states have no `figmaNodeId` because no frame has been
 * exported for them. Only four frames accompany the spec. Exporting the missing
 * three is design-side work; add the node id here once they exist and the screen
 * stops being skipped.
 */
export const screens = [
  {
    id: 'details-and-story-collapsed',
    title: 'Fill in the details & story, every Section collapsed',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: null,
    baseline: null,
  },
  {
    id: 'details-and-story-expanded',
    title: 'Fill in the details & story, every Section expanded',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: '332-14392',
    baseline: 'details-and-story-expanded.png',
    prepare: expandEverySection,
    note:
      'the form is an accordion, so only one Section can be open at a time. ' +
      'The capture is the page trying to reach this state and failing, which is ' +
      'part of what the percentage above measures.',
  },
  {
    id: 'details-and-story-cover-header',
    title: 'Fill in the details & story, Cover Header being edited',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: null,
    baseline: null,
  },
  {
    id: 'details-and-story-section',
    title: 'Fill in the details & story, a later Section being edited',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: null,
    baseline: null,
  },
  {
    id: 'guest-invites-empty',
    title: 'Guest invites details, Guest List still empty',
    route: null,
    figmaNodeId: '332-12440',
    baseline: 'guest-invites-empty.png',
  },
  {
    id: 'guest-invites-populated',
    title: 'Guest invites details, Guest List uploaded',
    route: null,
    figmaNodeId: '356-3062',
    baseline: 'guest-invites-populated.png',
  },
  {
    id: 'published',
    title: 'Published, with the link to share',
    route: null,
    figmaNodeId: '305-8972',
    baseline: 'published.png',
  },
];

/**
 * Why a screen cannot be compared yet, or null when it can be.
 *
 * A screen is skipped rather than failed when the thing it would compare does
 * not exist yet. That keeps a run's red output meaning "this screen does not
 * match the design" rather than "this screen has not been built".
 */
export function skipReason(screen) {
  if (!screen.route && !screen.baseline) {
    return 'no route and no baseline yet';
  }
  if (!screen.route) {
    return 'route not built yet';
  }
  if (!screen.baseline) {
    return 'no baseline exported from Figma yet';
  }
  return null;
}
