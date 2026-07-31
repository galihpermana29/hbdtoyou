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
 * screen's design, so the panel's heading and controls are asserted and what it
 * renders inside is not.
 *
 * The first three Sections' fields are enumerated. Every Section's card, name
 * and description is asserted, and the fields of the other five are added by the
 * beads that build them.
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
      style: SECTION_CARD,
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
];

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

/** The Cover Header's fields, the first Section this screen enumerates in full. */
const coverHeaderFields = [
  labelFor('Couples Photos'),
  {
    name: 'Couples Photos upload title',
    withText: 'Add More Photos',
    style: UPLOAD_TYPE.title,
  },
  {
    name: 'Couples Photos upload prompt',
    withText: 'Drag & drop up to 5 images from your gallery',
    style: UPLOAD_TYPE.prompt,
  },
  {
    name: 'Couples Photos hint',
    withText:
      'We recommend to add more than 2 images in the ratio of 4:3 or 16:9 for more interactivity',
    style: TYPE.fieldHint,
  },
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

export const expectations = [
  ...pageChrome('Fill in the details & story'),
  ...sectionExpectations(0),
  ...coverHeaderFields,
  ...sectionExpectations(1),
  ...holyVerseFields,
  ...sectionExpectations(2),
  ...brideGroomIntroductionFields,
  ...sectionExpectations(3),
  ...sectionExpectations(4),
  ...sectionExpectations(5),
  ...sectionExpectations(6),
  ...sectionExpectations(7),
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
    name: 'Site Preview heading',
    withText: 'Site Preview',
    style: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '28px',
      color: '#1b1b1b',
    },
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
  siteFooter,
];
