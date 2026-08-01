/**
 * The screens the visual harness knows about.
 *
 * Each entry names one designed screen, the Figma node it was taken from, how to
 * drive a browser into that state, and what the design says the screen is. The
 * Figma file key is deliberately absent: it changes between plugin bridge
 * sessions and is read at run time. See `visual/README.md`.
 *
 * Two things are checked. The Create Flow, which is the seven screens a couple
 * fills their invitation in, and Wedding Template 1, which is the invitation
 * itself: once sealed, the way a guest is sent it, then once opened at each of
 * the three sets of Example Content, and once more with the RSVP a guest
 * replies on open over it.
 */

import { expectations as detailsAndStoryCollapsed } from './expectations/details-and-story-collapsed.mjs';
import { expectations as detailsAndStoryCoverHeader } from './expectations/details-and-story-cover-header.mjs';
import { expectations as detailsAndStoryExpanded } from './expectations/details-and-story-expanded.mjs';
import { expectations as detailsAndStorySection } from './expectations/details-and-story-section.mjs';
import { expectations as guestInvitesEmpty } from './expectations/guest-invites-empty.mjs';
import {
  DESIGNED_GUEST_LIST,
  expectations as guestInvitesPopulated,
} from './expectations/guest-invites-populated.mjs';
import {
  DESIGNED_SLUG,
  expectations as published,
} from './expectations/published.mjs';
import { expectations as weddingTemplate1Rsvp } from './expectations/wedding-template-1-rsvp.mjs';
import {
  expectations as weddingTemplate1,
  sealed as weddingTemplate1Sealed,
} from './expectations/wedding-template-1.mjs';

/** The width the design is defined at. Nothing below this is checked. */
export const DESIGN_WIDTH = 1440;

/**
 * The width the invitation itself is designed at.
 *
 * The template is drawn as a phone and renders as a fixed column at any window
 * width, so the browser is still driven at `DESIGN_WIDTH` and only the export of
 * its frames needs to know this.
 */
export const TEMPLATE_DESIGN_WIDTH = 375;

/** The Figma file the design is read from, for the export instructions. */
export const FIGMA_FILE_NAME = 'Wedding Invitations';

const DETAILS_AND_STORY_ROUTE = '/create/wedding-invitation';

/**
 * The three sets of Example Content the Showcase can render, and how each one
 * is asked for.
 *
 * The flattering set is asked for by asking for nothing, because that is the
 * URL a visitor lands on: the Showcase renders it to anybody who does not say
 * otherwise, and a screen that named it in a query would be checking a page
 * nobody visits. It is also the only one the design has a frame for - the
 * design draws the invitation once, with its own example wedding - and the
 * whole point of the other two is that they are content it was never drawn
 * against, so there is no image to export for them and there could not be one.
 */
const EXAMPLE_CONTENT_SETS = [
  {
    set: 'flattering',
    route: '/wedding-template-1',
    baseline: 'wedding-template-1.png',
  },
  { set: 'realistic', route: '/wedding-template-1?content=realistic' },
  { set: 'hostile', route: '/wedding-template-1?content=hostile' },
];

/**
 * Press every Section control that is still in one state, top to bottom, until
 * none is left in it.
 *
 * `open` is the state to press out of: `false` opens every closed Section,
 * `true` closes every open one. The value is also how the page spells it, since
 * a disclosure says which it is in `aria-expanded`.
 *
 * The list is re-read on every pass rather than once, because opening a Section
 * changes what is on the page beneath it, and a locator captured before the
 * first press would be pointing at the page as it was.
 *
 * One press per Section is all it can take, so that is the bound. A control that
 * does not do what it says it does would otherwise be pressed for ever, and a
 * hung run says far less than a run that stops and reports the screen.
 */
async function pressEverySection(page, open) {
  const sections = await page.locator('form section').count();
  const remaining = page.locator(
    `form section button[aria-expanded="${open}"]`
  );
  for (let press = 0; press < sections; press += 1) {
    if ((await remaining.count()) === 0) return;
    await remaining.first().click();
  }
  const stuck = await remaining.count();
  if (stuck > 0) {
    throw new Error(
      `${stuck} of ${sections} Sections would not ${open ? 'close' : 'open'}, ` +
        `after pressing every Section that was still ${
          open ? 'open' : 'closed'
        } once each`
    );
  }
}

/**
 * Expand every Section, which is the state the design draws every field in.
 *
 * Each Section is a disclosure that opens on its own, so pressing the closed
 * ones in turn leaves all of them open. An accordion could not reach this state
 * at all.
 */
const expandEverySection = (page) => pressEverySection(page, false);

/**
 * Close every Section, which is where the step's two editing states start from.
 *
 * The flow opens with the Cover Header expanded, so that is the only state a
 * couple lands on. Closing everything first is what makes the others reachable
 * from the same starting point whatever the flow opens with, and it is the
 * all-collapsed state in its own right.
 */
const collapseEverySection = (page) => pressEverySection(page, true);

/**
 * Press one Section's control, by the Section's name.
 *
 * A Section's control is named for the Section, so the button a couple would
 * press is the button this presses.
 */
const pressSection = (page, name) =>
  page.getByRole('button', { name, exact: true }).click();

/** Leave the Cover Header open and every other Section closed. */
async function editTheCoverHeader(page) {
  await collapseEverySection(page);
  await pressSection(page, 'Cover Header');
}

/**
 * Leave the Love Story open and every other Section closed.
 *
 * The long way round is the point. The design draws this state with a Section
 * open and the Section above it closed, and the shortest route there - close
 * everything, open the Love Story - would be reached just as well by an
 * accordion, so it would say nothing about the thing this state exists to say.
 *
 * Opening the Cover Header first and closing it last exercises both halves of
 * that instead. The Love Story is opened while the Cover Header is still open,
 * which an accordion would answer by closing the Cover Header; the Cover Header
 * is then closed, which an accordion would answer by opening it again. Either
 * would leave two Sections in the wrong state, and the check would see the Cover
 * Header's fields on a screen the design draws without them.
 */
async function editTheLoveStory(page) {
  await collapseEverySection(page);
  await pressSection(page, 'Cover Header');
  await pressSection(page, 'Love Story');
  await pressSection(page, 'Cover Header');
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
 * Open the invitation, the way a guest does.
 *
 * An invitation arrives Sealed, so nothing below the envelope is on the screen
 * until somebody opens it. Every screen of the template therefore starts by
 * pressing the control a guest would press, which makes the seal load-bearing
 * for all of them: if it stops releasing, all three fail at once rather than
 * only the Hero. That is a fair trade, because it means the seal is genuinely
 * exercised on every run.
 */
const openTheInvitation = (page) =>
  page.getByRole('button', { name: 'Open invitation' }).click();

/**
 * Open the invitation and then the RSVP a guest replies on.
 *
 * The card is reached the way a guest reaches it, by pressing RSVP Now down in
 * Venue & Details, rather than by asking for a URL: it has none. Nothing waits
 * for it afterwards, because the capture only screenshots once two consecutive
 * frames are identical and the card is on one of them.
 */
async function openTheRsvp(page) {
  await openTheInvitation(page);
  await page.getByRole('button', { name: 'RSVP Now' }).click();
}

/**
 * The twelve designed screens.
 *
 * Seven are the Create Flow, in the order a couple reaches them, and the
 * details-and-story step is four of those - the same screen with a different set
 * of Sections open. The last five are the invitation the flow produces: the one
 * a guest is sent, sealed, then the opened one rendered with each set of Example
 * Content, and finally the RSVP a guest replies on. Each names the frame it was
 * read from and how to drive the page into it.
 */
export const screens = [
  {
    id: 'details-and-story-collapsed',
    title: 'Fill in the details & story, every Section collapsed',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: '304-6174',
    baseline: 'details-and-story-collapsed.png',
    expectations: detailsAndStoryCollapsed,
    prepare: collapseEverySection,
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
    figmaNodeId: '332-10572',
    baseline: 'details-and-story-cover-header.png',
    expectations: detailsAndStoryCoverHeader,
    prepare: editTheCoverHeader,
  },
  {
    id: 'details-and-story-section',
    title: 'Fill in the details & story, a later Section being edited',
    route: DETAILS_AND_STORY_ROUTE,
    figmaNodeId: '332-11752',
    baseline: 'details-and-story-section.png',
    expectations: detailsAndStorySection,
    prepare: editTheLoveStory,
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
  // The invitation as a guest is sent it, which is the only screen here that
  // is not driven anywhere first: sealed is how it arrives. It renders the
  // flattering set, because that is the URL a guest lands on, and it is the one
  // screen whose expectations claim the page itself - a sealed invitation holds
  // it still, and the three below prove it lets go again.
  {
    id: 'wedding-template-1-sealed',
    title: 'Wedding Template 1, sealed, as a guest is sent it',
    // Addressed, because a sealed envelope is the one screen that carries a
    // guest's own name. The parameter is scaffolding until a link per guest
    // exists: `hbd-a09.21`.
    route: '/wedding-template-1?guest=Galih%20%26%20Partner',
    figmaNodeId: '332-30919',
    designWidth: TEMPLATE_DESIGN_WIDTH,
    baseline: 'wedding-template-1-sealed.png',
    expectations: weddingTemplate1Sealed,
  },
  // One screen, rendered with each set of Example Content. They share a
  // manifest, because what the design owns is the type its words are set in,
  // the order they come in and the words around a couple's answers rather than
  // the answers - so the same list is the design's claim at all three lengths.
  ...EXAMPLE_CONTENT_SETS.map(({ set, route, baseline }) => ({
    id: `wedding-template-1-${set}`,
    title: `Wedding Template 1, opened, at the ${set} Example Content`,
    route,
    figmaNodeId: '312-1631',
    designWidth: TEMPLATE_DESIGN_WIDTH,
    ...(baseline ? { baseline } : {}),
    expectations: weddingTemplate1,
    prepare: openTheInvitation,
  })),
  // The card a guest replies on, which the design draws as a frame of its own
  // and which has no URL: it is reached by pressing RSVP Now on the invitation
  // above, the same way the Create Flow's editing states are reached by
  // pressing what a couple presses.
  {
    id: 'wedding-template-1-rsvp',
    title: 'Wedding Template 1, the RSVP a guest replies with',
    route: '/wedding-template-1',
    figmaNodeId: '312-3846',
    designWidth: TEMPLATE_DESIGN_WIDTH,
    baseline: 'wedding-template-1-rsvp.png',
    expectations: weddingTemplate1Rsvp,
    prepare: openTheRsvp,
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
