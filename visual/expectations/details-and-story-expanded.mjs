/**
 * What the design says the details-and-story step is, with every Section open.
 *
 * Exported from Figma node 332-14392, "Expanded All", in the Wedding Invitations
 * file. Every value below was read from that frame. The design is literal truth,
 * including its copy errors: see `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * The order of this list is the order the design arranges the screen in, and the
 * check asserts it. Nothing here says how wide or how tall anything is.
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
 */

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
 * How many earlier elements in a list say exactly what the one at `index` says.
 *
 * The design writes the same words in more than one place - four fields invite
 * a couple to "Add More Photos", and two recommend the same ratios - and copy
 * is the only handle those elements have. Counting the repeats is what keeps
 * each expectation about one of them rather than about all of them at once.
 */
const nthByCopy = (copies, index) =>
  copies.slice(0, index).filter((copy) => copy === copies[index]).length;

/** The eight Sections, in the order the design stacks them. */
const SECTIONS = [
  {
    name: 'Cover Header',
    description:
      'The general details about the event and what your guests will see when opening the invitation',
  },
  {
    name: 'Holy Verse',
    description: 'Verses or prayers you and your partner love',
  },
  {
    name: 'Bride & Groom’s Introduction',
    description:
      'Introduction to the Bride & Groom’s family and/or education background',
  },
  {
    name: 'Love Story',
    description:
      'Tell the world how you & your partner’s met and what leads your both to this lifetime commitment (in short, ofc)',
  },
  {
    name: 'Venue Details',
    description: 'Details on the wedding venue location & reception time',
  },
  {
    name: 'Gift Registry',
    description:
      'Include Bank Account/e-Wallet Information for gift collection',
  },
  {
    name: 'Photo Showcase',
    description: 'Showcase all your pre-wedding photos',
  },
  {
    name: 'Enable MemoRoll?',
    description:
      "Create a collective photo experience for the wedding. Capture your wedding through every guest's lens.",
    card: MEMO_ROLL_CARD,
  },
];

/**
 * The nth Section, counted in document order rather than by `:nth-of-type`.
 *
 * `:nth-of-type` counts among an element's siblings, so wrapping the Sections in
 * anything would silently make every one of these selectors mean something else.
 * `nth` here counts matches down the page, which is what "the Sections in the
 * order the design stacks them" actually means.
 */
const sectionExpectations = (index) => {
  const section = SECTIONS[index];
  return [
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
};

/**
 * Every field label the form draws, in the order the design stacks them.
 *
 * A label is found by counting down the whole form rather than within its
 * Section, because scoping to a Section would need a selector the implementation
 * has to provide, and everything this manifest asks of the page is ordinary
 * HTML. Counting by hand is what that costs, so the count is derived from this
 * one list instead: adding a field to an earlier Section moves every later
 * label, and putting it in its place here is the whole edit.
 */
const LABELS_IN_ORDER = [
  'Couples Photos',
  'Bride Nickname',
  'Groom Nickname',
  'Wedding Place Name',
  'Wedding Date',
  'Background Track',
  'Verse Name',
  'Verse',
  'Bride Name',
  'Bride’s Father',
  'Bride’s Mother',
  'Groom Name',
  'Groom’s Father',
  'Groom’s Mother',
  'Polaroid Photos',
  'The year when you first met',
  'How you first met?',
  'The year you both getting closer',
  'How you both getting closer?',
  'Proposal Photo',
  'The year they asked the BIG question!',
  'Finally, the happy ending',
  'Wedding Teaser Video',
  'More Photos',
  'Wedding Location',
  'Gift Section Photo',
  'Bank/e-Wallet Provider',
  'Account Number',
  'Account Holder Name',
  'Photo Gallery',
];

/**
 * Every box the form marks as a group, in the order the design stacks them.
 *
 * A group is a field built from more than one element, and there are three kinds
 * here. Most are a box with a mark and an answer in it. One is the reception
 * time, which is a name over two such boxes - it comes before both of them,
 * because it contains them. The last is the gift provider, whose mark is a
 * chevron after the answer rather than before it, because the answer is chosen
 * from a list rather than typed.
 */
const GROUPS_IN_ORDER = [
  'The year when you first met',
  'The year you both getting closer',
  'The year they asked the BIG question!',
  'Wedding Reception Time',
  'Start',
  'End',
  'Wedding Location',
  'Bank/e-Wallet Provider',
];

/** Where a group falls among the form's groups, counted down the page. */
const groupNth = (name) => {
  const nth = GROUPS_IN_ORDER.indexOf(name);
  if (nth === -1) {
    throw new Error(`"${name}" is not one of the form's groups`);
  }
  return nth;
};

/**
 * The words above a field, wherever they fall among the form's labels.
 *
 * A label this list has never heard of throws rather than resolving to `-1`,
 * which would silently become "the last label on the page" and fail somewhere
 * else entirely.
 */
const labelFor = (label) => {
  const nth = LABELS_IN_ORDER.indexOf(label);
  if (nth === -1) {
    throw new Error(`"${label}" is not one of the form's labels`);
  }
  return {
    name: `${label} label`,
    select: 'form label',
    nth,
    text: label,
    style: TYPE.fieldLabel,
  };
};

/** A label and the text box under it, which is most of what the design draws. */
const textField = (label) => [
  labelFor(label),
  { name: `${label} field`, control: label, style: TEXT_FIELD },
];

/**
 * A label, the box the design marks, and the answer a couple gives in it.
 *
 * `answer` is what the design says about the answer itself, which is the same
 * for every field of this shape but one: the gift provider is chosen from a list
 * rather than typed, and that is the one whose colour can be claimed.
 */
const markedField = (label, answer = MARKED_ANSWER) => [
  labelFor(label),
  {
    name: `${label} field`,
    select: 'form [role="group"]',
    nth: groupNth(label),
    style: MARKED_FIELD,
  },
  { name: `${label} answer`, control: label, style: answer },
];

/** The ratios the design recommends for a Section that shows several photos. */
const WIDE_PHOTO_HINT =
  'We recommend to add more than 2 images in the ratio of 4:3 or 16:9 for more interactivity';

/**
 * Every dashed area the form takes a file in, in the order the design stacks
 * them, with the words it writes in and under each.
 *
 * Four of the five invite a couple to "Add More Photos" and two recommend the
 * same ratios, so copy alone cannot say which one an expectation is about. The
 * repeats are counted from this list rather than written out, so adding an area
 * to an earlier Section is one line here.
 */
const UPLOAD_AREAS = [
  {
    field: 'Couples Photos',
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 5 images from your gallery',
    hint: WIDE_PHOTO_HINT,
  },
  {
    field: 'Polaroid Photos',
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 12 images from your gallery',
    hint: 'We recommend to add more than 3 images in the ratio of 4:3 for more interactivity',
  },
  {
    // The one area the design prints no guidance under: it takes a single
    // photo, and the prompt inside it already says so. It says it in the
    // design's own words, which do not change for a field that takes one -
    // "Add More Photos" over "up to 1 images", both read off the frame. See
    // `docs/adr/0002-figma-is-literal-truth.md`.
    field: 'Proposal Photo',
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 1 images from your gallery',
    hint: null,
  },
  {
    field: 'Wedding Teaser Video',
    title: 'Add a Video',
    prompt: 'Drag & drop video file from your gallery',
    hint: 'Max video size 15MB',
  },
  {
    field: 'More Photos',
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 5 images from your gallery',
    hint: WIDE_PHOTO_HINT,
  },
  {
    // A second area that takes one photo and still says "up to 1 images", and
    // this one is given the guidance for three underneath it. Both are read off
    // the frame: see `docs/adr/0002-figma-is-literal-truth.md`.
    field: 'Gift Section Photo',
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 1 images from your gallery',
    hint: 'We recommend to add more than 3 images in the ratio of 4:3 for more interactivity',
  },
  {
    field: 'Photo Gallery',
    title: 'Add More Photos',
    prompt: 'Drag & drop up to 20 images from your gallery',
    hint: 'We recommend to add more than 5 images in the ratio of 4:3 for more interactivity',
  },
];

const UPLOAD_TITLES = UPLOAD_AREAS.map((area) => area.title);
const UPLOAD_PROMPTS = UPLOAD_AREAS.map((area) => area.prompt);
const UPLOAD_HINTS = UPLOAD_AREAS.map((area) => area.hint);

/** One dashed area: its label, the words inside it, and the guidance under it. */
const uploadArea = (index) => {
  const area = UPLOAD_AREAS[index];
  return [
    labelFor(area.field),
    {
      name: `${area.field} upload title`,
      withText: area.title,
      nth: nthByCopy(UPLOAD_TITLES, index),
      style: UPLOAD_TYPE.title,
    },
    {
      name: `${area.field} upload prompt`,
      withText: area.prompt,
      nth: nthByCopy(UPLOAD_PROMPTS, index),
      style: UPLOAD_TYPE.prompt,
    },
    ...(area.hint === null
      ? []
      : [
          {
            name: `${area.field} hint`,
            withText: area.hint,
            nth: nthByCopy(UPLOAD_HINTS, index),
            style: TYPE.fieldHint,
          },
        ]),
  ];
};

/** The Cover Header's fields, the first Section this screen enumerates in full. */
const coverHeaderFields = [
  ...uploadArea(0),
  ...textField('Bride Nickname'),
  ...textField('Groom Nickname'),
  ...textField('Wedding Place Name'),
  ...textField('Wedding Date'),
  labelFor('Background Track'),
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
];

/**
 * The Holy Verse Section's fields.
 *
 * The design puts the citation above the verse itself, and the check asserts
 * that order rather than only that both are present.
 */
const holyVerseFields = [...textField('Verse Name'), ...textField('Verse')];

/**
 * The Bride & Groom's Introduction Section's fields.
 *
 * Each partner is asked for in the same shape - their own name across the card,
 * then their father and their mother side by side - and the bride comes first.
 * A father and a mother are two fields because they are two people; the
 * invitation joins them for display.
 */
const brideGroomIntroductionFields = [
  ...textField('Bride Name'),
  ...textField('Bride’s Father'),
  ...textField('Bride’s Mother'),
  ...textField('Groom Name'),
  ...textField('Groom’s Father'),
  ...textField('Groom’s Mother'),
];

/** What the design asks in each of the three chapters, in its own words. */
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
 * The count the design prints under each of the Love Story's long answers.
 *
 * The design draws its own sample counted - 320 of 320 characters, then 250 -
 * and a couple's field is empty, so what the same line says on the screen this
 * check drives is zero of the same limit. The sentence and the limit are the
 * design's; the number in front of the slash is whoever is typing.
 */
const storyCount = (index) => ({
  name: `${LOVE_STORY_STORIES[index]} character count`,
  withText: 'We know it’s hard, but keep it short please. (0/320 characters)',
  nth: index,
  style: TYPE.fieldHint,
});

/**
 * The Love Story Section's fields.
 *
 * Three chapters, each a year and the story of it, with the Proposal Photo
 * between the second and the third where the design puts it and the teaser
 * video at the end. The design offers no way to add a chapter or remove one,
 * and this list is the whole of what it draws.
 */
const loveStoryFields = [
  ...uploadArea(1),
  ...markedField(LOVE_STORY_YEARS[0]),
  ...textField(LOVE_STORY_STORIES[0]),
  storyCount(0),
  ...markedField(LOVE_STORY_YEARS[1]),
  ...textField(LOVE_STORY_STORIES[1]),
  storyCount(1),
  ...uploadArea(2),
  ...markedField(LOVE_STORY_YEARS[2]),
  ...textField(LOVE_STORY_STORIES[2]),
  storyCount(2),
  ...uploadArea(3),
];

/**
 * The Venue Details Section's fields.
 *
 * The reception's start and its end share one name, so they are a group with a
 * name over a pair of boxes rather than two labelled fields - which is exactly
 * what the design draws. The Wedding Location carries an action inside its box,
 * divided off by a hairline the design draws full height.
 */
const venueDetailsFields = [
  ...uploadArea(4),
  {
    name: 'Wedding Reception Time field',
    select: 'form [role="group"]',
    nth: groupNth('Wedding Reception Time'),
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
    nth: groupNth('Start'),
    style: MARKED_FIELD,
  },
  {
    name: 'Reception end field',
    select: 'form [role="group"]',
    nth: groupNth('End'),
    style: MARKED_FIELD,
  },
  labelFor('Wedding Location'),
  {
    name: 'Wedding Location hint',
    withText:
      'Go to Google Maps, find your wedding venue then copy the direction link',
    style: TYPE.fieldHint,
  },
  {
    name: 'Wedding Location field',
    select: 'form [role="group"]',
    nth: groupNth('Wedding Location'),
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
];

/**
 * The Gift Registry Section's fields.
 *
 * The provider is asked for on its own, above the account, and it is the one
 * answer in the flow that is chosen rather than typed - a box with the answer in
 * it and a chevron after, which is a group for the same reason a marked field
 * is. The design draws all three empty, so the grey in each box is its example
 * rather than anybody's account.
 */
const giftRegistryFields = [
  ...uploadArea(5),
  ...markedField('Bank/e-Wallet Provider', CHOSEN_ANSWER),
  ...textField('Account Number'),
  ...textField('Account Holder Name'),
];

/** The Photo Showcase Section's one field. */
const photoShowcaseFields = [...uploadArea(6)];

/**
 * The MemoRoll Section's own parts.
 *
 * It has no fields: the design asks one question and draws a switch to answer
 * it, with a line under the description offering to explain it. The switch is
 * found by the standard ARIA pattern rather than by copy, because it says
 * nothing - a switch is a shape and a colour, and the words beside it are the
 * Section's name.
 *
 * The distance under the description is written as the link's own margin rather
 * than as a gap on the box around them, because the harness can only assert
 * spacing it can name an element for.
 */
const memoRollFields = [
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
  {
    name: 'MemoRoll switch',
    select: 'form [role="switch"]',
    style: {
      backgroundColor: '#e34013',
      borderRadius: '9999px',
      padding: '2px',
    },
  },
];

export const expectations = [
  ...pageChrome('Fill in the details & story'),
  ...sectionExpectations(0),
  ...coverHeaderFields,
  ...sectionExpectations(1),
  ...holyVerseFields,
  ...sectionExpectations(2),
  ...brideGroomIntroductionFields,
  ...sectionExpectations(3),
  ...loveStoryFields,
  ...sectionExpectations(4),
  ...venueDetailsFields,
  ...sectionExpectations(5),
  ...giftRegistryFields,
  ...sectionExpectations(6),
  ...photoShowcaseFields,
  ...sectionExpectations(7),
  ...memoRollFields,
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
