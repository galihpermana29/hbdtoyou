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
 * `details-and-story.mjs` and not repeated here.
 *
 * ## What is deliberately not asserted here
 *
 * The Invitation Preview's message is the couple's own writing rather than the
 * design's copy, so its type is asserted and its words are not. The chat around
 * it is designed, so the guest's name, their status and the timestamp are.
 *
 * ## The field the design draws as the couple's to type
 *
 * The web domain field is read-only. There is no endpoint that can say whether
 * a slug is free, so a couple choosing one could only be told it was taken
 * after failing; the backend generates it and the field shows it. Nothing is
 * printed under the box either, because rules for typing something nobody types
 * are words a couple cannot act on. The design draws no hint there, so the
 * screen and the frame agree again; the deviation that used to live here is
 * recorded, withdrawn, in `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * What the box holds is not asserted. The slug belongs to the invitation rather
 * than to the design, the same way the couple's own writing in the message does,
 * so its type and its box are claimed and its characters are not.
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
    // Not in the design, and agreed and recorded in
    // `docs/adr/0002-figma-is-literal-truth.md`.
    //
    // The same control the step before carries, in the same place: above the
    // fields and outside the form, so the position-addressed labels below do
    // not renumber. Captured showing English, which is the choice the check
    // makes for itself; see `READ_IN_ENGLISH` in `capture.mjs`.
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
    // After the box, as the design draws it: the slug is served as the subdomain, so the
    // fixed part of the address follows it. The deviation that put a path
    // prefix ahead of the box is withdrawn: see
    // `docs/adr/0005-an-invitation-answers-at-its-own-subdomain.md`.
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

/** The outlined action the design draws beside the filled one. */
const OUTLINED_ACTION = {
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
};

/**
 * The actions that end the step, in the order the design ranges them.
 *
 * "Save as draft" is in neither frame. Every other save in this flow happens on
 * the way past, so a couple who wants to stop for the evening has nowhere to say
 * so, and the design was drawn for a flow that saved nothing at all. It is
 * asserted rather than left out so that it cannot quietly disappear or become
 * something else, and the deviation is agreed and recorded in
 * `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * It wears the shape the design does state for the action beside the filled one,
 * so it is claimed with the same style block as Previous step.
 */
export const stepActions = [
  {
    name: 'Previous step action',
    select: 'button',
    withText: 'Previous step',
    style: OUTLINED_ACTION,
  },
  {
    // Not in the design. See the note above.
    name: 'Save as draft action',
    select: 'button',
    withText: 'Save as draft',
    style: OUTLINED_ACTION,
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
