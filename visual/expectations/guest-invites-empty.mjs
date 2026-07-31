/**
 * What the design says the guest invites step is, before a Guest List exists.
 *
 * Exported from Figma node 332-12440, "Guest invites details", in the Wedding
 * Invitations file. Every value below was read from that frame. The design is
 * literal truth, including its copy errors: see
 * `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * The order of this list is the order the design arranges the screen in, and the
 * check asserts it. Nothing here says how wide or how tall anything is.
 *
 * How an element is found is written out once in
 * `details-and-story-expanded.mjs` and not repeated here. Everything above this
 * step's own content is the same on all four steps and comes from
 * `page-chrome.mjs`.
 *
 * ## What is deliberately not asserted here
 *
 * The Invitation Preview's message is the couple's own writing rather than the
 * design's copy, so its type is asserted and its words are not. The chat around
 * it is designed, so the guest's name, their status and the timestamp are.
 *
 * ## The one element the design does not have
 *
 * "Slug rules" below is not in the frame. The design shows no hint under the
 * web domain field, and a couple who cannot see what characters a slug may
 * contain can only discover the rules by failing. It is asserted rather than
 * left out so that it cannot quietly disappear, and it wears the design's own
 * hint treatment so it belongs to the screen it was added to.
 */

import { FIELD_SHADOW, pageChrome, siteFooter, TYPE } from './page-chrome.mjs';

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
const FIELD_BOX = {
  backgroundColor: '#ffffff',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: '#d0d5dd',
  borderRadius: '8px',
  boxShadow: FIELD_SHADOW,
};

/** The value a couple types, wherever they type it. */
const FIELD_VALUE = {
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  color: '#101828',
};

export const expectations = [
  ...pageChrome('Guest invites details'),
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
  {
    name: 'Guest List label',
    withText: 'Guest List',
    style: TYPE.fieldLabel,
  },
  {
    name: 'Guest List drop zone',
    select: 'form [role="group"]',
    nth: 1,
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      borderStyle: 'dashed',
      borderWidth: '1px',
      borderColor: '#d9d9d9',
      borderRadius: '8px',
      padding: '16px',
      gap: '16px',
    },
  },
  {
    name: 'Guest List drop zone prompt',
    withText: 'Drag & drop up your list here',
    style: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '22.4px',
      color: 'rgba(0, 0, 0, 0.88)',
    },
  },
  {
    name: 'Guest List accepted format',
    withText: 'Upload in format .CSV',
    style: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '16.8px',
      color: 'rgba(0, 0, 0, 0.45)',
    },
  },
  {
    name: 'Guest List size limit',
    withText: 'Max file size 5MB',
    style: TYPE.fieldHint,
  },
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
  siteFooter,
];
