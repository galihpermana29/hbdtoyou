/**
 * What the design says the guest invites step is, in both of its states.
 *
 * The step has two designed frames - node 332-12440 with the Guest List still
 * empty and node 356-3062 with it uploaded - and they differ in one place: what
 * the Add Guest List Section holds. Everything above and below that is the same
 * frame twice, so it is written here once and each state's file spreads it in,
 * the way `page-chrome.mjs` does for what every step shares.
 *
 * Every value below was read from those frames. The design is literal truth,
 * including its copy errors: see `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * How an element is found is written out once in
 * `details-and-story-expanded.mjs` and not repeated here.
 *
 * ## What is deliberately not asserted here
 *
 * The Invitation Preview's message is the couple's own writing rather than the
 * design's copy, so its type is asserted and its words are not. The chat around
 * it is designed, so the guest's name, their status and the timestamp are.
 *
 * ## The one element the design does not have
 *
 * "Slug rules" below is not in either frame. The design shows no hint under the
 * web domain field, and a couple who cannot see what characters a slug may
 * contain can only discover the rules by failing. It is asserted rather than
 * left out so that it cannot quietly disappear, and it wears the design's own
 * hint treatment so it belongs to the screen it was added to.
 */

import { FIELD_SHADOW, TYPE } from './page-chrome.mjs';

/** The heading and the paragraph that open this step, which only it has. */
const STEP_TYPE = {
  heading: {
    fontSize: '36px',
    fontWeight: 600,
    lineHeight: '50px',
    color: '#1b1b1b',
  },
  description: {
    fontSize: '20px',
    fontWeight: 400,
    lineHeight: '30px',
    color: '#7b7b7b',
  },
};

/** The box a field is drawn in: white, hairline, rounded, barely shadowed. */
export const FIELD_BOX = {
  backgroundColor: '#ffffff',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: '#d0d5dd',
  borderRadius: '8px',
  boxShadow: FIELD_SHADOW,
};

/** The value a couple types, wherever they type it. */
export const FIELD_VALUE = {
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  color: '#101828',
};

/**
 * Everything from the step's heading down to the Add Guest List Section's
 * description, which both states draw identically.
 */
export const guestInvitesIntroduction = [
  {
    name: 'Step heading',
    select: 'h2',
    text: 'One more step & your invitation is ready to share',
    style: STEP_TYPE.heading,
  },
  {
    name: 'Step description',
    select: 'h2 + p',
    text:
      "We've created your wedding invitation website and it's now ready for " +
      'your final touches. Personalize your domain, review your details, and ' +
      'send it to the people who matter most.',
    style: STEP_TYPE.description,
  },
  {
    name: 'Customize your invitation Section name',
    select: 'form section :is(h2, h3)',
    nth: 0,
    text: 'Customize your invitation',
    style: TYPE.sectionName,
  },
  {
    name: 'Customize your invitation Section description',
    select: 'form section :is(h2, h3) + p',
    nth: 0,
    text: 'Personalize your invitation domain & message for your guests to see',
    style: TYPE.sectionDescription,
  },
  {
    name: 'Invitation Slug label',
    select: 'form label',
    nth: 0,
    text: 'Custom Your Web Domain',
    style: TYPE.fieldLabel,
  },
  {
    // The field is the input and the suffix together, in one box: the box
    // carries the border, the radius and the shadow, and the two things inside
    // it carry their own type.
    name: 'Invitation Slug field',
    select: 'form [role="group"]',
    nth: 0,
    style: FIELD_BOX,
  },
  {
    name: 'Invitation Slug input',
    control: 'Custom Your Web Domain',
    style: { ...FIELD_VALUE, backgroundColor: '#ffffff', padding: '12px 14px' },
  },
  {
    name: 'Invitation Slug suffix',
    withText: '.memoify.live',
    style: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '20px',
      color: '#e34013',
      backgroundColor: '#ffffff',
      borderColor: '#d0d5dd',
      borderWidth: '0px 0px 0px 1px',
      padding: '10px 20px',
    },
  },
  {
    // Not in the design. See the note at the top of this file.
    name: 'Slug rules',
    withText:
      'Letters, numbers and hyphens only, 3 to 63 characters, starting and ' +
      'ending with a letter or a number',
    style: TYPE.fieldHint,
  },
  {
    name: 'Invitation Greeting Message label',
    select: 'form label',
    nth: 1,
    text: 'Invitation Greeting Message',
    style: TYPE.fieldLabel,
  },
  {
    name: 'Invitation Greeting Message field',
    control: 'Invitation Greeting Message',
    style: { ...FIELD_BOX, ...FIELD_VALUE, padding: '8px 12px' },
  },
  {
    name: 'Add Guest List Section name',
    select: 'form section :is(h2, h3)',
    nth: 1,
    text: 'Add Guest List',
    style: TYPE.sectionName,
  },
  {
    name: 'Add Guest List Section description',
    select: 'form section :is(h2, h3) + p',
    nth: 1,
    text: 'Personalize your invitation domain & message for your guests to see',
    style: TYPE.sectionDescription,
  },
];

/** The pair of actions that ends the step. */
export const stepActions = [
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
    name: 'Confirm Create action',
    select: 'button',
    withText: 'Confirm Create',
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
];

/** The panel beside the form, showing the message as one guest receives it. */
export const invitationPreview = [
  {
    name: 'Invitation Preview heading',
    withText: 'Invitation Preview',
    style: TYPE.panelHeading,
  },
  {
    name: 'Invitation Preview guest',
    withText: 'Johnny',
    style: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      color: '#ffffff',
    },
  },
  {
    name: 'Invitation Preview guest status',
    withText: 'online',
    style: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
      color: '#d1d5dc',
    },
  },
  {
    name: 'Invitation Preview sent at',
    withText: '10:00 AM ✓',
    style: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
      color: '#6a7282',
    },
  },
];
