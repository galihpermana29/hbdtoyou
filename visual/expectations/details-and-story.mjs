/**
 * What the design says the details-and-story step is, in each of its four
 * states.
 *
 * The step has four designed frames, and they are the same screen with a
 * different set of Sections open:
 *
 *   304-6174   "Collapsed"           every Section closed
 *   332-10572  "Edit Cover"          the Cover Header open
 *   332-11752  "Edit Other Section"  the Love Story open
 *   332-14392  "Expanded All"        every Section open
 *
 * Everything but which Sections are open is the same frame four times, so it is
 * written here once and each state's file names the Sections its frame draws
 * open. Every value below was read from those frames. The design is literal
 * truth, including its copy errors: see
 * `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * The order of the list this builds is the order the design arranges the screen
 * in, and the check asserts it. Nothing here says how wide or how tall anything
 * is.
 *
 * ## Where the four frames disagree
 *
 * The three collapsed frames stack Venue Details above Love Story and name the
 * seventh Section "Photo Collection"; "Expanded All" stacks Love Story above
 * Venue Details and names it "Photo Showcase". A screen cannot restack itself
 * when a Section opens, so the two cannot both be followed.
 *
 * Settled by the designer, one answer each way: the stack follows "Expanded
 * All", so Love Story sits above Venue Details, and the name follows the other
 * three, so the seventh Section is "Photo Collection". Recorded in
 * `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * ## How an element is found
 *
 * Two handles are used, and the choice matters for what a failure reads like.
 *
 * A structural selector says where an element sits, and lets its copy be checked
 * as a claim, so a typo reports as the copy it should have said against the copy
 * it did. Those selectors use nothing but ordinary HTML and the standard ARIA
 * patterns, which is the whole contract this screen has to satisfy:
 *
 *   header                          the site navigation
 *   nav[aria-label="Breadcrumb"]    the breadcrumb, its last item aria-current
 *   h1                              the page title, its description the p after
 *   form section                    one per Section, in the designed order
 *   :is(h2, h3) + p                 a Section's name, then its description
 *   button[aria-expanded]           the control that opens and closes a Section
 *   label                           one per field, associated with its control
 *   [role="group"]                  a field built from more than one element
 *   button                          an action
 *   aside                           the Site Preview, beside the form
 *   figure                          the phone, holding the glass as its one child
 *   footer                          the site footer
 *
 * The chrome above a screen's own content is the same on every step, so it is
 * written once in `page-chrome.mjs` and spread in below rather than repeated.
 *
 * `withText` is the other handle, for elements whose only distinguishing feature
 * is what they say. Copy is the locator there, so wrong copy reports as a missing
 * element - naming the copy that was looked for, and the nearest copy the page
 * does render.
 *
 * ## Why a closed Section takes so much of this file's shape
 *
 * An element nobody can see is not an element the design placed there, so the
 * check skips hidden markup. A closed Section's fields are therefore not on the
 * page as far as anything here is concerned - which is what makes a closed
 * Section read as closed rather than as a screen full of wrongly placed fields.
 *
 * The cost is that every position counted down the page is counted among the
 * OPEN Sections only. The nth of a label, of a group, and of a repeated piece of
 * copy all move when a Section closes. Nothing below writes such a number down:
 * each Section declares the labels, the groups and the switches it holds, and
 * the numbers are derived from whichever Sections a state draws open.
 *
 * ## What is deliberately not asserted here
 *
 * The site navigation and the footer are checked for presence only. Their design
 * is out of scope for this epic and the existing components win, so asserting
 * their type would contradict the spec.
 *
 * The Site Preview's contents are the live invitation rather than part of this
 * screen's design, so the panel, its heading, its control and the phone they
 * stand over are asserted and what is drawn on the phone's glass is not. The
 * design's mockup adds phone furniture of its own - a status bar reading 9:41 -
 * which is Figma's furniture rather than a decision about this screen and is
 * neither asserted nor drawn. `published.mjs` draws the same line.
 *
 * The panel comes after the two actions here because the design's left column
 * holds the Sections and the actions together, and the panel is the column
 * beside it. The design also rules a hairline down the middle of the 120px
 * between the two columns, which is not drawn yet: `hbd-byb.25`.
 *
 * The MemoRoll Section's card is washed with a gradient and has a camera printed
 * behind its words. Neither is asserted, because the harness compares background
 * colours rather than background images and has no way to describe an
 * illustration at all. Both are the design's and both are drawn; they are
 * covered by review rather than by this manifest.
 *
 * ## The three switches
 *
 * The design draws one, on MemoRoll. Two more are drawn beyond it - on the Gift
 * Registry Section and on the Background Track field - because the invitation
 * carries a flag for each and a couple had no way to answer either. The
 * deviation is recorded in `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * A switch says nothing, so copy cannot find one: it is a shape and a colour,
 * and the words beside it belong to whatever it turns off. All three are
 * therefore found by the standard ARIA pattern and told apart by position, and
 * that position is derived rather than written down for the same reason every
 * other position on this screen is. Two of them sit in a Section's header and
 * are on the page whether it is open or closed, and one is a field of a Section
 * and goes when it closes, so which switch is second depends on the state: a
 * Section declares the first kind as `headerSwitch` and the second in
 * `switches`, beside the labels and the groups it declares the same way.
 *
 * A Section's control is asserted for its colour and its insets rather than for
 * the shape drawn inside it. The design draws two different marks - a pencil on
 * a closed Section, a chevron on an open one - and no computed style can tell
 * one path from another. The colours can, and they differ, so a control showing
 * the wrong mark in the right colour is left to review.
 */

import { declaredPositions } from './declared-positions.mjs';
import { FIELD_SHADOW, pageChrome, siteFooter, TYPE } from './page-chrome.mjs';

/**
 * The two treatments only the photo drop zone uses.
 *
 * Both colours were first recorded as `#000000`, which is the fill Figma names
 * on those two layers, and neither is what the design paints: the layers carry
 * an opacity as well, and dropping it made a grey line black and a near-black
 * one pure. The baseline image settles it: over the area's own (250, 250, 250)
 * ground, the title's darkest pixel is (30, 30, 30) and the prompt's is
 * (137, 137, 137), which are 88% and 45% of black. It is the same drop zone the
 * guest invites step draws, and `guest-invites-empty.mjs` already records those
 * two values for it.
 */
const UPLOAD_TYPE = {
  title: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '22.4px',
    color: 'rgba(0, 0, 0, 0.88)',
  },
  prompt: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '16.8px',
    color: 'rgba(0, 0, 0, 0.45)',
  },
};

/** A Section's card: the box every Section is presented in. */
const SECTION_CARD = {
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: '#d0d5dd',
  borderRadius: '8px',
  padding: '24px 12px',
  gap: '24px',
};

/**
 * The one Section whose card the design draws differently.
 *
 * MemoRoll asks a single question rather than holding a card of fields, and the
 * design pads it 12px all round instead of 24px and 12px - measured off the
 * baseline as 19px from the card's top edge to the cap of its name, against the
 * 31px every other Section's name sits at. It has no body to be kept apart from
 * its header either, so there is no gap to assert.
 */
const MEMO_ROLL_CARD = {
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: '#d0d5dd',
  borderRadius: '8px',
  padding: '12px',
};

/**
 * The control at the end of a Section's header, in each of its two states.
 *
 * The design pads it 10px around a 20px mark in both, and colours it by what
 * pressing it would do: the flow's orange on a closed Section, inviting a couple
 * to edit it, and the grey the design gives every chevron on an open one.
 */
const SECTION_TOGGLE = {
  open: { color: '#98a2b3', padding: '10px' },
  closed: { color: '#e34013', padding: '10px' },
};

/**
 * A switch saying whether a block appears on the invitation.
 *
 * The design draws one and draws it on, and draws nothing at all for off, so
 * this is the only state with a design behind it. Every screen here is at rest
 * with nothing turned off, which is what a couple who has not touched a switch
 * sees.
 */
const SWITCH_ON = {
  backgroundColor: '#e34013',
  borderRadius: '9999px',
  padding: '2px',
};

/**
 * A text field.
 *
 * The design's field colour is the placeholder's, not the value's, so `color` is
 * left out rather than asserted from a sample the design never meant as one.
 */
const TEXT_FIELD = {
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  backgroundColor: '#ffffff',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: '#d0d5dd',
  borderRadius: '8px',
  padding: '8px 12px',
  boxShadow: FIELD_SHADOW,
};

/**
 * The same field once the design draws a mark inside it.
 *
 * A calendar before a year, a clock before a time, a pin before a place: the
 * box then holds more than one thing, so the box is what carries the border and
 * the insets, and the answer inside carries the type. The two are asserted
 * separately for that reason, and the box is found by `role="group"` because a
 * `<label>` points at the control rather than at what is drawn around it.
 */
const MARKED_FIELD = {
  backgroundColor: '#ffffff',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: '#d0d5dd',
  borderRadius: '8px',
  padding: '8px 12px',
  gap: '8px',
  boxShadow: FIELD_SHADOW,
};

/** The answer a couple types inside such a box. */
const MARKED_ANSWER = {
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
};

/**
 * The answer a couple chooses instead of typing.
 *
 * Colour is asserted here where the typed fields leave it out, and the
 * difference is real rather than an oversight. A `<input>`'s example is painted
 * by the placeholder, which no computed style of the element reports; a
 * `<select>` showing its example is wearing that grey itself, so it is the one
 * field on the screen whose unanswered colour can be claimed at all.
 */
const CHOSEN_ANSWER = { ...MARKED_ANSWER, color: '#667085' };

/**
 * What an uploader says it wants.
 *
 * Built by the drop zone from the number it enforces rather than written beside
 * the field, so the two cannot disagree. The design's own guidance did: it said
 * "more than 2 images" over a field that takes one. See
 * `docs/adr/0002-figma-is-literal-truth.md`.
 */
const one = (ratio) => `One photograph, in the ratio of ${ratio}`;
const exactly = (count, ratio) =>
  `Exactly ${count} photographs, in the ratio of ${ratio}`;
const upTo = (most, ratio) =>
  `Up to ${most} photographs, in the ratio of ${ratio}`;
const between = (count, most, ratio) =>
  `Between ${count} and ${most} photographs, in the ratio of ${ratio}`;

const WIDE = '4:3 or 16:9';
const STANDARD = '4:3';

/**
 * Every dashed area the form takes a file in, keyed by the field it belongs to,
 * with the words the design writes in and under each.
 *
 * Four of the seven invite a couple to "Add More Photos" and two recommend the
 * same ratios, so copy alone cannot say which one an expectation is about.
 * Whichever of them a state draws are counted down the page at build time.
 */
const UPLOAD_AREAS = {
  'Couples Photos': {
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 1 images from your gallery',
    hint: one(WIDE),
  },
  'Polaroid Photos': {
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 3 images from your gallery',
    hint: exactly(3, STANDARD),
  },
  // The one area the design prints no guidance under: it takes a single photo,
  // and the prompt inside it already says so. It says it in the design's own
  // words, which do not change for a field that takes one - "Add More Photos"
  // over "up to 1 images", both read off the frame. See
  // `docs/adr/0002-figma-is-literal-truth.md`.
  'Proposal Photo': {
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 1 images from your gallery',
    hint: one(STANDARD),
  },
  // The two areas the design draws no field for at all. The invitation prints a
  // portrait of each partner and the design never asks for either, so these two
  // are ours: see `docs/adr/0002-figma-is-literal-truth.md`. They take the same
  // words every other single-photo area takes, because the drop zone writes them
  // rather than the design, and they carry the guidance the field itself states.
  'Bride Photo': {
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 1 images from your gallery',
    hint: one(STANDARD),
  },
  'Groom Photo': {
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 1 images from your gallery',
    hint: one(STANDARD),
  },
  'Wedding Teaser Video': {
    title: 'Add a Video',
    prompt: 'Drag & drop video file from your gallery',
    hint: 'Max video size 15MB',
  },
  'Venue Photos': {
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 5 images from your gallery',
    hint: upTo(5, WIDE),
  },
  // The design drew this area saying "up to 1 images" with the guidance for
  // three printed underneath it, which was the frame disagreeing with itself.
  // It takes three now - the invitation cross-fades between them - so the
  // prompt and the guidance finally say the same thing. See
  // `docs/adr/0002-figma-is-literal-truth.md`.
  'Gift Section Photo': {
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 3 images from your gallery',
    hint: exactly(3, STANDARD),
  },
  'Photo Gallery': {
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 15 images from your gallery',
    hint: between(5, 15, STANDARD),
  },
};

/** What the design asks in each of the Love Story's three chapters. */
const LOVE_STORY_YEARS = [
  'The year when you first met',
  'The year you both getting closer',
  'The year they asked the BIG question!',
];
const LOVE_STORY_STORIES = [
  'How you first met?',
  'How you both getting closer?',
  'Finally, the happy ending',
];

/**
 * The eight Sections, in the order the design stacks them.
 *
 * Each one declares the labels, the groups and the switches it holds, in its own
 * order, and what to expect of its contents once it is open. Those three lists
 * are what every position counted down the page is derived from, so a field
 * added to a Section is one line in that Section's list rather than a
 * renumbering of every field under it. A switch drawn in the Section's header
 * rather than among its fields is `headerSwitch`, because closing the Section
 * does not take it away.
 */
const SECTIONS = [
  {
    name: 'Cover Header',
    description:
      'The general details about the event and what your guests will see when opening the invitation',
    labels: [
      'Couples Photos',
      'Bride Nickname',
      'Groom Nickname',
      'Wedding Place Name',
      'Wedding Date',
      'Background Track',
    ],
    groups: [],
    switches: ['Background Track'],
    fields: (form) => [
      ...form.uploadArea('Couples Photos'),
      ...form.textField('Bride Nickname'),
      ...form.textField('Groom Nickname'),
      ...form.textField('Wedding Place Name'),
      ...form.textField('Wedding Date'),
      form.labelFor('Background Track'),
      // Beyond the design, which draws no way to leave the track off. See
      // `docs/adr/0002-figma-is-literal-truth.md`.
      form.switchFor('Background Track'),
      {
        name: 'Background Track hint',
        withText:
          'Add a backtrack that represent you & your partner story or something that you both shared',
        style: TYPE.fieldHint,
      },
      {
        name: 'Background Track field',
        control: 'Background Track',
        style: TEXT_FIELD,
      },
    ],
  },
  {
    name: 'Holy Verse',
    description: 'Verses or prayers you and your partner love',
    labels: ['Verse Name', 'Verse'],
    groups: [],
    switches: [],
    // The design puts the citation above the verse itself, and the check asserts
    // that order rather than only that both are present.
    fields: (form) => [
      ...form.textField('Verse Name'),
      ...form.textField('Verse'),
    ],
  },
  {
    name: 'Bride & Groom’s Introduction',
    description:
      'Introduction to the Bride & Groom’s family and/or education background',
    labels: [
      'Bride Photo',
      'Bride Name',
      'Bride’s Father',
      'Bride’s Mother',
      'Groom Photo',
      'Groom Name',
      'Groom’s Father',
      'Groom’s Mother',
    ],
    groups: [],
    switches: [],
    // Each partner is asked for in the same shape - a portrait, their own name
    // across the card, then their father and their mother side by side - and
    // the bride comes first. A father and a mother are two fields because they
    // are two people; the invitation joins them for display.
    //
    // The two portraits are beyond the design, which draws no field for either
    // while the invitation prints both. See
    // `docs/adr/0002-figma-is-literal-truth.md`.
    fields: (form) => [
      ...form.uploadArea('Bride Photo'),
      ...form.textField('Bride Name'),
      ...form.textField('Bride’s Father'),
      ...form.textField('Bride’s Mother'),
      ...form.uploadArea('Groom Photo'),
      ...form.textField('Groom Name'),
      ...form.textField('Groom’s Father'),
      ...form.textField('Groom’s Mother'),
    ],
  },
  {
    name: 'Love Story',
    description:
      'Tell the world how you & your partner’s met and what leads your both to this lifetime commitment (in short, ofc)',
    labels: [
      'Polaroid Photos',
      LOVE_STORY_YEARS[0],
      LOVE_STORY_STORIES[0],
      LOVE_STORY_YEARS[1],
      LOVE_STORY_STORIES[1],
      'Proposal Photo',
      LOVE_STORY_YEARS[2],
      LOVE_STORY_STORIES[2],
      'Wedding Teaser Video',
    ],
    groups: LOVE_STORY_YEARS,
    switches: [],
    // Three chapters, each a year and the story of it, with the Proposal Photo
    // between the second and the third where the design puts it and the teaser
    // video at the end. The design offers no way to add a chapter or remove one,
    // and this list is the whole of what it draws.
    fields: (form) => [
      ...form.uploadArea('Polaroid Photos'),
      ...form.markedField(LOVE_STORY_YEARS[0]),
      ...form.textField(LOVE_STORY_STORIES[0]),
      form.storyCount(0),
      ...form.markedField(LOVE_STORY_YEARS[1]),
      ...form.textField(LOVE_STORY_STORIES[1]),
      form.storyCount(1),
      ...form.uploadArea('Proposal Photo'),
      ...form.markedField(LOVE_STORY_YEARS[2]),
      ...form.textField(LOVE_STORY_STORIES[2]),
      form.storyCount(2),
      ...form.uploadArea('Wedding Teaser Video'),
    ],
  },
  {
    name: 'Venue Details',
    description: 'Details on the wedding venue location & reception time',
    labels: ['Venue Photos', 'Wedding Address', 'Wedding Location'],
    groups: ['Wedding Reception Time', 'Start', 'End', 'Wedding Location'],
    switches: [],
    // The reception's start and its end share one name, so they are a group with
    // a name over a pair of boxes rather than two labelled fields - which is
    // exactly what the design draws. The Wedding Location carries an action
    // inside its box, divided off by a hairline the design draws full height.
    fields: (form) => [
      ...form.uploadArea('Venue Photos'),
      {
        name: 'Wedding Reception Time field',
        select: 'form [role="group"]',
        nth: form.groupNth('Wedding Reception Time'),
        style: { gap: '6px' },
      },
      {
        name: 'Wedding Reception Time label',
        withText: 'Wedding Reception Time',
        style: TYPE.fieldLabel,
      },
      {
        name: 'Reception start field',
        select: 'form [role="group"]',
        nth: form.groupNth('Start'),
        style: MARKED_FIELD,
      },
      {
        name: 'Reception end field',
        select: 'form [role="group"]',
        nth: form.groupNth('End'),
        style: MARKED_FIELD,
      },
      // Added beyond the design: the invitation prints a written address, and
      // the design draws only a link. See `docs/adr/0002-figma-is-literal-truth.md`.
      ...form.textField('Wedding Address', 'Jl. Imam Bonjol, Menteng'),
      form.labelFor('Wedding Location'),
      {
        name: 'Wedding Location hint',
        withText:
          'Open Google Maps, find your venue, then choose Share, Embed a map, Copy HTML. Paste it here. What you paste starts with <iframe.',
        style: TYPE.fieldHint,
      },
      {
        name: 'Wedding Location field',
        select: 'form [role="group"]',
        nth: form.groupNth('Wedding Location'),
        style: MARKED_FIELD,
      },
      {
        name: 'Wedding Location answer',
        control: 'Wedding Location',
        style: MARKED_ANSWER,
      },
      {
        name: 'Save Location action',
        select: 'button',
        withText: 'Save Location',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: '20px',
          color: '#344054',
          borderColor: '#d0d5dd',
          borderWidth: '0px 0px 0px 1px',
          padding: '0px 16px',
        },
      },
    ],
  },
  {
    name: 'Gift Registry',
    description:
      'Include Bank Account/e-Wallet Information for gift collection',
    labels: [
      'Gift Section Photo',
      'Gift Headline',
      'Bank/e-Wallet Provider',
      'Account Number',
      'Account Holder Name',
    ],
    groups: ['Bank/e-Wallet Provider'],
    switches: [],
    // Beyond the design, which draws no way to leave the gift block off. In the
    // header rather than among the fields, so it is on the page whether the
    // Section is open or closed. See `docs/adr/0002-figma-is-literal-truth.md`.
    headerSwitch: 'Gift Registry',
    always: (form) => [form.switchFor('Gift Registry')],
    // The provider is asked for on its own, above the account, and it is the one
    // answer in the flow that is chosen rather than typed - a box with the answer
    // in it and a chevron after, which is a group for the same reason a marked
    // field is. The design draws all three empty, so the grey in each box is its
    // example rather than anybody's account.
    fields: (form) => [
      ...form.uploadArea('Gift Section Photo'),
      // Added beyond the design: the invitation prints words above the account,
      // and the design draws no field for them. See
      // `docs/adr/0002-figma-is-literal-truth.md`.
      ...form.textField(
        'Gift Headline',
        'Your presence is the greatest gift of all'
      ),
      ...form.markedField('Bank/e-Wallet Provider', CHOSEN_ANSWER),
      ...form.textField('Account Number', '3331 0908 1766'),
      ...form.textField('Account Holder Name'),
    ],
  },
  {
    name: 'Photo Collection',
    description: 'Showcase all your pre-wedding photos',
    labels: ['Photo Gallery'],
    groups: [],
    switches: [],
    fields: (form) => form.uploadArea('Photo Gallery'),
  },
  {
    name: 'Enable MemoRoll?',
    description:
      "Create a collective photo experience for the wedding. Capture your wedding through every guest's lens.",
    card: MEMO_ROLL_CARD,
    labels: [],
    groups: [],
    switches: [],
    headerSwitch: 'Enable MemoRoll?',
    /**
     * The one Section with nothing to open.
     *
     * The design asks one question and draws a switch to answer it, with a line
     * under the description offering to explain it, and no control to expand.
     * Its parts are therefore always on the page rather than only when it is
     * open.
     *
     * The switch is found by the standard ARIA pattern rather than by copy,
     * because it says nothing - a switch is a shape and a colour, and the words
     * beside it are the Section's name. The distance under the description is
     * written as the link's own margin rather than as a gap on the box around
     * them, because the harness can only assert spacing it can name an element
     * for.
     */
    withoutToggle: true,
    always: (form) => [
      {
        name: 'MemoRoll Learn more',
        withText: 'Learn more',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: '20px',
          color: '#e34013',
          margin: '6px 0px 0px 0px',
        },
      },
      form.switchFor('Enable MemoRoll?'),
    ],
  },
];

/** Every Section by name, which is the state "Expanded All" draws. */
export const EVERY_SECTION = SECTIONS.map((section) => section.name);

/**
 * How many earlier copies in a list say exactly what the one at `index` says.
 *
 * The design writes the same words in more than one place - four fields invite
 * a couple to "Add More Photos", and two recommend the same ratios - and copy
 * is the only handle those elements have. Counting the repeats is what keeps
 * each expectation about one of them rather than about all of them at once.
 */
const nthByCopy = (copies, index) =>
  copies.slice(0, index).filter((copy) => copy === copies[index]).length;

/**
 * The positions everything on one state of this screen is counted at.
 *
 * Every number here is derived from which Sections that state draws open,
 * because the check cannot see inside a closed one. The counting itself, and
 * both of the mistakes it guards against, are `declared-positions.mjs`.
 */
function positionsWithin(openSections, switches) {
  const labels = openSections.flatMap((section) => section.labels);
  const groups = openSections.flatMap((section) => section.groups);
  const uploads = labels.filter((label) => label in UPLOAD_AREAS);
  const titles = uploads.map((field) => UPLOAD_AREAS[field].title);
  const prompts = uploads.map((field) => UPLOAD_AREAS[field].prompt);
  const hints = uploads.map((field) => UPLOAD_AREAS[field].hint);

  const { at, everythingWasAskedFor } = declaredPositions({
    labels,
    groups,
    'upload areas': uploads,
    switches,
  });

  const labelNth = (label) => at('labels', label);
  const groupNth = (group) => at('groups', group);

  const labelFor = (label) => ({
    name: `${label} label`,
    select: 'form label',
    nth: labelNth(label),
    text: label,
    style: TYPE.fieldLabel,
  });

  return {
    labelFor,
    groupNth,
    everythingWasAskedFor,

    /**
     * One switch, found by the ARIA pattern and told apart by position.
     *
     * Named for what it turns off rather than for anything it renders, because
     * it renders nothing: the words beside it are the Section's or the field's.
     */
    switchFor: (name) => ({
      name: `${name} switch`,
      select: 'form [role="switch"]',
      nth: at('switches', name),
      style: SWITCH_ON,
    }),

    /**
     * A label and the text box under it, which is most of what the design draws.
     *
     * `placeholder` is the example the design writes into the empty box. It is
     * design copy like any other, so where it is given it is claimed, and a typo
     * in it fails rather than passing unread.
     */
    textField: (label, placeholder) => [
      labelFor(label),
      {
        name: `${label} field`,
        control: label,
        ...(placeholder === undefined ? {} : { placeholder }),
        style: TEXT_FIELD,
      },
    ],

    /**
     * A label, the box the design marks, and the answer a couple gives in it.
     *
     * `answer` is what the design says about the answer itself, which is the
     * same for every field of this shape but one: the gift provider is chosen
     * from a list rather than typed, and that is the one whose colour can be
     * claimed.
     */
    markedField: (label, answer = MARKED_ANSWER) => [
      labelFor(label),
      {
        name: `${label} field`,
        select: 'form [role="group"]',
        nth: groupNth(label),
        style: MARKED_FIELD,
      },
      { name: `${label} answer`, control: label, style: answer },
    ],

    /** One dashed area: its label, the words inside it, and the guidance under it. */
    uploadArea: (field) => {
      const index = at('upload areas', field);
      const area = UPLOAD_AREAS[field];
      return [
        labelFor(field),
        {
          name: `${field} upload title`,
          withText: area.title,
          nth: nthByCopy(titles, index),
          style: UPLOAD_TYPE.title,
        },
        {
          name: `${field} upload prompt`,
          withText: area.prompt,
          nth: nthByCopy(prompts, index),
          style: UPLOAD_TYPE.prompt,
        },
        ...(area.hint === null
          ? []
          : [
              {
                name: `${field} hint`,
                withText: area.hint,
                nth: nthByCopy(hints, index),
                style: TYPE.fieldHint,
              },
            ]),
      ];
    },

    /**
     * The count the design prints under one of the Love Story's long answers.
     *
     * The design draws its own sample counted - 320 of 320 characters, then 250 -
     * and a couple's field is empty, so what the same line says on the screen
     * this check drives is zero of the same limit. The sentence and the limit are
     * the design's; the number in front of the slash is whoever is typing. All
     * three are in one Section, so an open Love Story is the only thing their
     * positions depend on.
     */
    storyCount: (index) => ({
      name: `${LOVE_STORY_STORIES[index]} character count`,
      withText:
        'We know it’s hard, but keep it short please. (0/320 characters)',
      nth: index,
      style: TYPE.fieldHint,
    }),
  };
}

/**
 * One Section's card, its name, its description and the control that opens it.
 *
 * `nth` counts matches down the page rather than using `:nth-of-type`, which
 * counts among an element's siblings and would silently mean something else the
 * moment the Sections were wrapped in anything.
 */
function sectionHeader(section, index, isOpen) {
  const header = [
    {
      name: `${section.name} Section card`,
      select: 'form section',
      nth: index,
      style: section.card ?? SECTION_CARD,
    },
    {
      name: `${section.name} Section name`,
      select: 'form section :is(h2, h3)',
      nth: index,
      text: section.name,
      style: TYPE.sectionName,
    },
    {
      name: `${section.name} Section description`,
      select: 'form section :is(h2, h3) + p',
      nth: index,
      text: section.description,
      style: TYPE.sectionDescription,
    },
  ];

  if (section.withoutToggle) return header;

  return [
    ...header,
    {
      name: `${section.name} Section control`,
      select: 'form section button[aria-expanded]',
      nth: SECTIONS.slice(0, index).filter((earlier) => !earlier.withoutToggle)
        .length,
      style: isOpen ? SECTION_TOGGLE.open : SECTION_TOGGLE.closed,
    },
  ];
}

/**
 * What the design says the details-and-story step is, with `open` drawn open.
 *
 * `open` is the Sections a state's frame shows expanded, named exactly as the
 * design names them. Anything else is closed, and a closed Section is its header
 * and nothing more.
 */
export function detailsAndStory(open) {
  const isOpen = (section) => open.includes(section.name);

  for (const name of open) {
    if (!EVERY_SECTION.includes(name)) {
      throw new Error(`"${name}" is not one of the step's Sections`);
    }
  }

  // A switch that is a field of a Section goes when that Section closes; the
  // one in a Section's header stays, so which switch is second is a question
  // about the state rather than a number this file can write down. A header's
  // comes first within its own Section, because that is where the page draws
  // it.
  const switches = SECTIONS.flatMap((section) => [
    ...(section.headerSwitch ? [section.headerSwitch] : []),
    ...(isOpen(section) ? section.switches : []),
  ]);

  const form = positionsWithin(SECTIONS.filter(isOpen), switches);

  const sections = SECTIONS.flatMap((section, index) => [
    ...sectionHeader(section, index, isOpen(section)),
    ...(section.always?.(form) ?? []),
    // A Section with no control has nothing to open, so its parts are the ones
    // it always draws and there are no fields under them.
    ...(section.withoutToggle || !isOpen(section) ? [] : section.fields(form)),
  ]);
  form.everythingWasAskedFor();

  return [
    ...pageChrome('Fill in the details & story'),
    {
      // Not in the design, and agreed and recorded in
      // `docs/adr/0002-figma-is-literal-truth.md`.
      //
      // The design was drawn for a form that only existed in English. This
      // chooses which language the flow is read in, and it sits above the
      // Sections because it governs all of them - inside one, it would read as
      // that Section's setting. Captured showing English, which is the choice
      // the check makes for itself; see `READ_IN_ENGLISH` in `capture.mjs`.
      name: 'Language label',
      select: 'label',
      withText: 'Language',
      style: {
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '20px',
        color: '#344054',
      },
    },
    ...sections,
    {
      name: 'Previous step action',
      select: 'button',
      withText: 'Previous step',
      style: {
        ...TYPE.actionLabel,
        color: '#e34013',
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#e34013',
        borderRadius: '8px',
        padding: '12px 18px',
        gap: '6px',
        boxShadow: FIELD_SHADOW,
      },
    },
    {
      // Not in the design, and agreed and recorded in
      // `docs/adr/0002-figma-is-literal-truth.md`.
      //
      // The design was drawn for a flow that saved nothing, so it draws no way
      // to stop partway. Once this step's fields are required, Next stops
      // being a way out of it, and a couple with three Sections answered and
      // five to go could neither advance nor keep what they had written. It
      // wears the shape the design states for the action beside the filled
      // one, which is the same shape as Previous step.
      name: 'Save as draft action',
      select: 'button',
      withText: 'Save as draft',
      style: {
        ...TYPE.actionLabel,
        color: '#e34013',
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#e34013',
        borderRadius: '8px',
        padding: '12px 18px',
        gap: '6px',
        boxShadow: FIELD_SHADOW,
      },
    },
    {
      name: 'Next action',
      select: 'button',
      withText: 'Next',
      style: {
        ...TYPE.actionLabel,
        color: '#ffffff',
        backgroundColor: '#e34013',
        borderRadius: '8px',
        padding: '12px 18px',
        gap: '6px',
        boxShadow: FIELD_SHADOW,
      },
    },
    {
      // The design stands the panel in the column beside the form, with 24px
      // between its heading and the phone under it.
      name: 'Site Preview panel',
      select: 'aside',
      style: { gap: '24px' },
    },
    {
      name: 'Site Preview heading',
      withText: 'Site Preview',
      style: TYPE.panelHeading,
    },
    {
      name: 'Play Preview action',
      select: 'button',
      withText: 'Play Preview',
      style: {
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '20px',
        color: '#e34013',
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#e34013',
        borderRadius: '8px',
        padding: '10px 14px',
        gap: '4px',
        boxShadow: FIELD_SHADOW,
      },
    },
    {
      name: 'Site Preview phone frame',
      select: 'figure',
      style: {
        backgroundColor: '#f7f7f7',
        borderRadius: '12px',
        padding: '14px',
      },
    },
    {
      // The phone's glass, which is the one thing the tray holds. Its height is
      // the design's where a window is tall enough for it and less where it is
      // not, so only its corner is stated here.
      name: 'Site Preview screen',
      select: 'figure > div',
      style: { borderRadius: '10px' },
    },
    siteFooter,
  ];
}
