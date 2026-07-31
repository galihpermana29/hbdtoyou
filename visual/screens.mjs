/**
 * The Create Flow screens the visual harness knows about.
 *
 * Each entry names one designed screen, the Figma node it was taken from, how to
 * drive a browser into that state, and what the design says the screen is. The
 * Figma file key is deliberately absent: it changes between plugin bridge
 * sessions and is read at run time. See `visual/README.md`.
 */

import { expectations as detailsAndStoryExpanded } from './expectations/details-and-story-expanded.mjs';
import { expectations as guestInvitesEmpty } from './expectations/guest-invites-empty.mjs';
import {
  DESIGNED_GUEST_LIST,
  expectations as guestInvitesPopulated,
} from './expectations/guest-invites-populated.mjs';
import {
  DESIGNED_SLUG,
  expectations as published,
} from './expectations/published.mjs';

/** The width the design is defined at. Nothing below this is checked. */
export const DESIGN_WIDTH = 1440;

/** The Figma file the design is read from, for the export instructions. */
export const FIGMA_FILE_NAME = 'Wedding Invitations';

const DETAILS_AND_STORY_ROUTE = '/create/wedding-invitation';

/**
 * Expand every Section, top to bottom.
 *
 * Each Section is a disclosure that opens on its own, so pressing the closed
 * ones in turn leaves all of them open, which is the state the design draws. The
 * list is re-read on every pass rather than once, because opening a Section
 * changes what is on the page beneath it, and a locator captured before the
 * first press would be pointing at the page as it was.
 *
 * One press per Section is all it can take, so that is the bound. A control
 * that does not open what it says it opens would otherwise be pressed for ever,
 * and a hung run says far less than a run that stops and reports the screen.
 */
async function expandEverySection(page) {
  const sections = await page.locator('form section').count();
  const closed = page.locator('form section button[aria-expanded="false"]');
  for (let press = 0; press < sections; press += 1) {
    if ((await closed.count()) === 0) return;
    await closed.first().click();
  }
  const stillClosed = await closed.count();
  if (stillClosed > 0) {
    throw new Error(
      `${stillClosed} of ${sections} Sections would not open, after pressing ` +
        'the closed ones once each'
    );
  }
}

/**
 * Advance to the guest invites step.
 *
 * The Create Flow's steps do not each have a URL: every step stays mounted so
 * that what a couple entered survives moving between them, and the step they are
 * on is held in the page. Driving the flow is therefore pressing the button a
 * couple would press, which is also the only way to check that the step is
 * reachable at all.
 */
async function advanceToGuestInvites(page) {
  await page.getByRole('button', { name: 'Next', exact: true }).click();
}

/**
 * Advance to the guest invites step and upload the design's Guest List.
 *
 * The file is handed to the field rather than to anything the page exports,
 * because uploading is the only way this state exists: the CSV is read in the
 * browser and nothing is stored, so a Guest List that was never uploaded is a
 * Guest List that is not there. Nothing waits for a network, because nothing
 * reaches one - the table is rendered as soon as the file has been read.
 */
async function uploadGuestList(page) {
  await advanceToGuestInvites(page);
  await page.locator('input[accept=".csv"]').setInputFiles({
    name: 'guest-list.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(DESIGNED_GUEST_LIST, 'utf8'),
  });
  await page.locator('tbody tr').last().waitFor();
}

/**
 * Advance to the published step.
 *
 * Confirming is the only way on, and it will not advance while the slug has a
 * problem, so the slug is chosen first. It is the design's own name, so that the
 * link the screen shows is the link the frame was drawn with.
 */
async function advanceToPublished(page) {
  await advanceToGuestInvites(page);
  await page
    .getByRole('textbox', { name: 'Custom Your Web Domain' })
    .fill(DESIGNED_SLUG);
  await page.getByRole('button', { name: 'Confirm Create' }).click();
}

/**
 * Three of the seven states have no expectations recorded yet.
 *
 * None of the three has an exported frame at all, so they are blocked design
 * side. Recording a screen's expectations is the work of the bead that builds
 * it; the baseline image beside this manifest is what those values are read
 * from.
 */
export const screens = [
  {
    id: 'details-and-story-collapsed',
    title: 'Fill in the details & story, every Section collapsed',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: null,
    baseline: null,
    expectations: null,
  },
  {
    id: 'details-and-story-expanded',
    title: 'Fill in the details & story, every Section expanded',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: '332-14392',
    baseline: 'details-and-story-expanded.png',
    expectations: detailsAndStoryExpanded,
    prepare: expandEverySection,
  },
  {
    id: 'details-and-story-cover-header',
    title: 'Fill in the details & story, Cover Header being edited',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: null,
    baseline: null,
    expectations: null,
  },
  {
    id: 'details-and-story-section',
    title: 'Fill in the details & story, a later Section being edited',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: null,
    baseline: null,
    expectations: null,
  },
  {
    id: 'guest-invites-empty',
    title: 'Guest invites details, Guest List still empty',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: '332-12440',
    baseline: 'guest-invites-empty.png',
    expectations: guestInvitesEmpty,
    prepare: advanceToGuestInvites,
  },
  {
    id: 'guest-invites-populated',
    title: 'Guest invites details, Guest List uploaded',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: '356-3062',
    baseline: 'guest-invites-populated.png',
    expectations: guestInvitesPopulated,
    prepare: uploadGuestList,
  },
  {
    id: 'published',
    title: 'Published, with the link to share',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: '305-8972',
    baseline: 'published.png',
    expectations: published,
    prepare: advanceToPublished,
  },
];

/**
 * Why a screen cannot be checked yet, or null when it can be.
 *
 * A screen is skipped rather than failed when the thing it would check does not
 * exist yet. That keeps a run's red output meaning "this screen does not match
 * the design" rather than "this screen has not been built".
 */
export function skipReason(screen) {
  if (!screen.route && !screen.expectations) {
    return 'no route and nothing recorded from the design yet';
  }
  if (!screen.route) {
    return 'route not built yet';
  }
  if (!screen.expectations) {
    return 'nothing recorded from the design yet';
  }
  return null;
}
