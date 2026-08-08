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
 * A one-pixel PNG, which is all a photograph has to be here.
 *
 * The check never asserts what a photograph looks like - it cannot, it asserts
 * computed style and copy - so the smallest valid image is the honest choice.
 * Anything larger would only be slower.
 */
const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

/**
 * Answer the photograph fields without a backend to upload to.
 *
 * The uploader posts to the wedding backend and hands back the address it
 * answers with. There is no backend here - the check drives a signed-out
 * browser against none - so the request is answered with an address instead,
 * and everything downstream of it is the real code doing the real thing with a
 * real value.
 *
 * Stubbed at the network rather than by writing into the form's store, because
 * the store is not something a couple can reach. Every field below is filled by
 * the same means a couple would fill it.
 */
async function answerUploadsWithAnAddress(page) {
  await page.route('**/uploads', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: 'https://example.invalid/a-photograph.png',
      }),
    })
  );
}

/**
 * Fill in everything the details-and-story step insists on.
 *
 * Next refuses an unfinished step, which is the whole point of it, so the only
 * way to the steps beyond is to answer what it asks for. This answers each
 * field the way a couple would: by typing into it or by choosing a file.
 *
 * The values are arbitrary and say nothing about the design. What matters is
 * that they are present, so the screens past this one can be reached at all.
 */
async function fillTheDetailsAndStory(page) {
  await answerUploadsWithAnAddress(page);
  await expandEverySection(page);

  // Every photograph field, given as many photographs as it asks for.
  //
  // Found by what the field accepts, which is file extensions rather than a
  // MIME pattern: `.jpg, .jpeg, .png`, as the design writes it. How many it
  // wants is read off the field's own prompt rather than listed here - each
  // drop zone prints its maximum once, so the prompts line up with the fields
  // in the order both appear, and neither can drift from the other.
  const photographs = page.locator('input[type="file"][accept*=".png"]');
  const prompts = await page
    .locator('p', { hasText: /Drag & drop up to/ })
    .allInnerTexts();
  const howManyPhotographs = await photographs.count();
  for (let index = 0; index < howManyPhotographs; index += 1) {
    const stated = (prompts[index] ?? '').match(/up to (\d+)/);
    const wanted = stated ? Number(stated[1]) : 1;
    await photographs.nth(index).setInputFiles(
      Array.from({ length: wanted }, (_, n) => ({
        name: `photograph-${index}-${n}.png`,
        mimeType: 'image/png',
        buffer: ONE_PIXEL_PNG,
      }))
    );
  }

  /**
   * Answer a field by the label a couple reads.
   *
   * Some labels point straight at a box and some point at a group holding one -
   * a field that draws a mark or a prefix beside its box is a group - so this
   * takes whichever it finds. Reaching for the box inside first and the label's
   * own target second means neither shape has to be remembered here.
   */
  const type = async (label, value) => {
    const found = page.getByLabel(label, { exact: true }).first();
    if ((await found.count()) === 0) return;
    const inner = found.locator('input, textarea');
    if ((await inner.count()) > 0) await inner.first().fill(value);
    else await found.fill(value);
  };

  await type('Bride Nickname', 'Freya');
  await type('Groom Nickname', 'Elias');
  await type('Wedding Place Name', 'Mandarin Hotel, Jakarta');
  await type('Bride Name', 'Freya Putri Magellan');
  await type('Groom Name', 'Elias Frank Simanjuntak');
  await type('Wedding Address', 'Jl. Imam Bonjol, Menteng');

  // The Love Story's three chapters, each a year and a story. All six are
  // required: a chapter with a year and no story is half a chapter.
  await type('The year when you first met', '2020');
  await type('How you first met?', 'We met while volunteering.');
  await type('The year you both getting closer', '2022');
  await type('How you both getting closer?', 'We liked the same maps.');
  await type('The year they asked the BIG question!', '2023');
  await type('Finally, the happy ending', 'She said yes.');

  // The Gift Registry is switched off rather than filled in.
  //
  // Its switch answers whether the block appears on the invitation at all, and
  // a Section that is off asks for nothing - so this is the shortest honest way
  // past it, and it exercises the exemption at the same time. Filling it in
  // instead would mean driving its Bank/e-Wallet Provider, which is a choice
  // rather than a typed answer and the one control here nothing else needs.
  await page
    .locator('form section')
    .filter({ hasText: 'Gift Registry' })
    .getByRole('switch')
    .click();

  // Fields that draw a mark or a prefix beside their box are a group, and the
  // box inside the group is what takes a value. They are reached by what the
  // design writes in them rather than by a label pointing at the group.
  const intoBox = async (placeholder, value) => {
    const box = page.getByPlaceholder(placeholder, { exact: true });
    if ((await box.count()) > 0) await box.first().fill(value);
  };

  await intoBox('Start', '19:00');
  await intoBox('End', '21:00');
  // The date picker keeps what was typed when it is committed, not when it is
  // typed, so this types into it and presses Enter while it still has focus.
  // The date picker commits what was typed on Enter rather than on blur, and it
  // only listens once its panel is open - so this opens it the way a couple
  // would, types, and confirms.
  // The date picker commits on Enter rather than on blur, so it is confirmed
  // rather than merely typed into.
  await intoBox('03/05/2026', '03/05/2026');
  await page.getByPlaceholder('03/05/2026', { exact: true }).press('Enter');
  // The markup Google Maps hands over under Share, Embed a map, Copy HTML. The
  // field keeps the address out of it and refuses anything else.
  await intoBox(
    'Paste the embed code from Google Maps',
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12" width="600" height="450"></iframe>'
  );

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
  await fillTheDetailsAndStory(page);
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // The step it lands on, rather than a fixed pause: a Next that was refused
  // leaves the couple where they were, and waiting for the thing that only
  // exists on the next step is how this notices.
  //
  // A refusal is reported in the step's own words. Without this the failure is
  // a timeout on a button, which says the step could not be left and not one
  // word about why - and why is always the same kind of thing: one more field
  // became required and nothing here fills it yet.
  const confirmCreate = page.getByRole('button', { name: 'Confirm Create' });
  try {
    await confirmCreate.waitFor({ timeout: 15000 });
  } catch (couldNotLeaveTheStep) {
    // Every message, not the first. The step used to refuse with one grouped
    // list and now refuses with a message under each field it is about, so
    // reading one of them would name a single field and hide the rest.
    const refusals = await page
      .locator('.ant-form-item-explain-error')
      .allInnerTexts();
    const said =
      refusals.length > 0
        ? refusals.join(' / ')
        : 'nothing, which means it was refused for some other reason';
    throw new Error(
      `The details-and-story step would not be left. It said: ${said}`,
      { cause: couldNotLeaveTheStep }
    );
  }
}

/**
 * Advance to the guest invites step and upload the design's Guest List.
 *
 * The file is handed to the field rather than to anything the page exports,
 * because uploading is the only way this state exists: a Guest List that was
 * never uploaded is a Guest List that is not there.
 *
 * A real couple's upload is sent, and this one is not. Guests belong to an
 * invitation and an invitation belongs to an owner, and this run drives the flow
 * signed out - so it never creates one, and the list stays in the browser
 * exactly as the whole of it used to. That is the same reason the published
 * screen has to be handed a slug, and it is what keeps this screen a question
 * about the design rather than about a backend.
 */
async function uploadGuestList(page) {
  await advanceToGuestInvites(page);
  await page.locator('input[accept=".csv"]').setInputFiles({
    name: 'guest-list.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(DESIGNED_GUEST_LIST, 'utf8'),
  });
  // The list, once it has stopped growing.
  //
  // Waiting on the last row resolves the moment one row exists, so a run that
  // read the page between the first row and the rest saw a half-drawn list and
  // reported it as a design failure - which is what made this screen flake.
  // Waiting for a fixed count would be sharper still, but it would have to be
  // kept in step with the file by hand; settling asks the page instead.
  await page.locator('tbody tr').first().waitFor();
  await page.waitForFunction(() => {
    const now = document.querySelectorAll('tbody tr').length;
    const settled = window.__rowsLastSeen === now && now > 0;
    window.__rowsLastSeen = now;
    return settled;
  });
}

/**
 * Advance to the published step.
 *
 * Confirming is the only way on, and it is the only thing to do: the slug is
 * not a couple's to choose any more, so there is nothing to fill in on the way.
 */
async function advanceToPublished(page) {
  await advanceToGuestInvites(page);
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
    // Given a slug, because this run has none to be given. A real couple's
    // address is read back off the invitation their save created, and saving
    // needs an account: this drives the flow signed out, so it never creates
    // one. The parameter is how a screen whose whole subject is the address can
    // still be held against the frame, and the value is the design's own name.
    route: `${DETAILS_AND_STORY_ROUTE}?slug=${DESIGNED_SLUG}`,
    figmaNodeId: '305-8972',
    baseline: 'published.png',
    expectations: published,
    prepare: advanceToPublished,
  },
  // The invitation as a guest is sent it, which is the only screen here that
  // is not driven anywhere first: sealed is how it arrives. It renders the
  // flattering set, because that is the URL a guest lands on, and it is the one
  // screen whose expectations claim everything below the envelope is contained
  // out of the page - the three below prove it lets go again.
  {
    id: 'wedding-template-1-sealed',
    title: 'Wedding Template 1, sealed, as a guest is sent it',
    // Addressed, because a sealed envelope is the one screen that carries a
    // guest's own name. The name is the Showcase's Example Content, the design's
    // own; a real guest's comes from the token on their own link.
    route: '/wedding-template-1',
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
