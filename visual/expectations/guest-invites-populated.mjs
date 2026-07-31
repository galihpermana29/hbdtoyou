/**
 * What the design says the guest invites step is once a Guest List is uploaded.
 *
 * Exported from Figma node 356-3062, "Guest invites details", in the Wedding
 * Invitations file. Everything this state shares with the empty one is in
 * `guest-invites.mjs`; what is below is the Add Guest List Section as this frame
 * draws it, which is the only place the two frames differ.
 *
 * The order of this list is the order the design arranges the screen in, and the
 * check asserts it. Nothing here says how wide or how tall anything is - the
 * design's two columns are 560 and 131 wide, and a Guest List of longer names
 * that pushes them about is still correct.
 *
 * ## The upload date is found rather than read
 *
 * The design's card says "Date uploaded Jan 4, 2025", and a couple's says the
 * day they uploaded their own file. The date is therefore their data rather than
 * the design's copy, so it is found by where it sits and its type is asserted
 * while its words are not - the same treatment the Invitation Preview's message
 * gets, and for the same reason.
 *
 * ## The two things this screen has that the design does not
 *
 * A file that cannot be read is said so underneath the Guest List, and Edit
 * opens the guest's name as a field with Cancel and Save in place of the row's
 * two actions. The design draws neither: it gives an Edit action and no picture
 * of what it opens, and it never draws a file being refused.
 *
 * Neither is asserted below, because neither is on this screen. They belong to
 * states the design has no frame for, and this file records only what the frame
 * it names says. They are written down here so that they are known to be
 * unchecked rather than assumed to be checked, which is the same reason "Slug
 * rules" in `guest-invites.mjs` is written down the other way round.
 *
 * ## The design's second shadow layer
 *
 * The card carries two drop shadows in the design and the second is at zero
 * opacity, which is Figma's shadow token rather than anything a person drew. It
 * is written out all the same, because a layer that paints nothing is still a
 * difference as far as any comparison is concerned, and leaving it out here
 * would only move the disagreement rather than settle it.
 */

import {
  guestInvitesIntroduction,
  invitationPreview,
  stepActions,
} from './guest-invites.mjs';
import { pageChrome, siteFooter } from './page-chrome.mjs';

/** The guest the design lists, and how many times it lists them. */
export const DESIGNED_GUEST = 'Olivia Rhye';
const DESIGNED_GUEST_COUNT = 7;

/**
 * The file the harness uploads to reach this state.
 *
 * A heading row and then the design's seven guests, so that the screen under
 * check is the frame that was drawn, and so that a CSV written the way a
 * spreadsheet writes one is what the parsing is exercised with.
 */
export const DESIGNED_GUEST_LIST = [
  'Guest',
  ...Array.from({ length: DESIGNED_GUEST_COUNT }, () => DESIGNED_GUEST),
].join('\n');

/** The hairline the design draws under the column headings and under each row. */
const RULE = {
  borderStyle: 'solid',
  borderColor: '#e5e5e5',
  borderWidth: '0px 0px 1px 0px',
};

/** The design's column heading, and the line saying when the list arrived. */
const TYPE_SMALL_GREY = {
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '18px',
  color: '#525252',
};

/** The design's row action, in the two colours it gives them. */
const TYPE_ROW_ACTION = {
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '20px',
};

/** The card the design draws the whole Guest List in. */
const guestListCard = [
  {
    name: 'Guest List card',
    select: 'form [role="group"]',
    nth: 1,
    style: {
      backgroundColor: '#ffffff',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#e5e5e5',
      borderRadius: '12px',
      boxShadow:
        'rgba(0, 0, 0, 0.06) 0px 1px 2px 0px, rgba(0, 0, 0, 0) 0px 1px 3px 0px',
    },
  },
  {
    name: 'Guest List card header',
    select: 'form [role="group"] > div',
    style: { padding: '20px 24px 19px 24px', gap: '16px' },
  },
  {
    name: 'Guest List card title',
    select: 'form h4',
    text: 'Guest List',
    style: {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: '28px',
      color: '#171717',
    },
  },
  {
    // The words are the couple's own date. See the note at the top of this file.
    name: 'Guest List upload date',
    select: 'form h4 + p',
    style: TYPE_SMALL_GREY,
  },
  {
    name: 'Upload File action',
    select: 'button',
    withText: 'Upload File',
    style: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '20px',
      color: '#ffffff',
      backgroundColor: '#f82900',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#f82900',
      borderRadius: '8px',
      padding: '10px 16px',
      gap: '8px',
      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
    },
  },
  {
    name: 'Guest column heading',
    select: 'thead th',
    nth: 0,
    text: 'Guest',
    style: { ...TYPE_SMALL_GREY, ...RULE, padding: '12px 24px' },
  },
  {
    name: 'Action column heading',
    select: 'thead th',
    nth: 1,
    text: 'Action',
    style: { ...TYPE_SMALL_GREY, ...RULE, padding: '12px 24px' },
  },
];

/**
 * One guest's row, as the design draws it.
 *
 * The design stripes the rows, so the background alternates and the first row is
 * the shaded one. Every other value repeats, and it is asserted on every row
 * rather than only on the first, because a table that styles its first row
 * correctly and the rest of them differently is exactly the fault worth catching
 * here.
 */
const guestRow = (index) => [
  {
    name: `Guest ${index + 1} row`,
    select: 'tbody tr',
    nth: index,
    style: { backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff' },
  },
  {
    name: `Guest ${index + 1} name`,
    select: 'tbody td:first-child',
    nth: index,
    text: DESIGNED_GUEST,
    style: {
      ...RULE,
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      color: '#171717',
      padding: '16px 24px',
    },
  },
  {
    name: `Guest ${index + 1} actions`,
    select: 'tbody td:last-child',
    nth: index,
    style: { ...RULE, padding: '16px 24px' },
  },
  {
    name: `Guest ${index + 1} actions row`,
    select: 'tbody td:last-child > div',
    nth: index,
    style: { gap: '12px' },
  },
  {
    name: `Guest ${index + 1} Delete action`,
    select: 'tbody button',
    nth: index * 2,
    text: 'Delete',
    style: { ...TYPE_ROW_ACTION, color: '#525252' },
  },
  {
    name: `Guest ${index + 1} Edit action`,
    select: 'tbody button',
    nth: index * 2 + 1,
    text: 'Edit',
    style: { ...TYPE_ROW_ACTION, color: '#f82900' },
  },
];

export const expectations = [
  ...pageChrome('Guest invites details'),
  ...guestInvitesIntroduction,
  ...guestListCard,
  ...Array.from({ length: DESIGNED_GUEST_COUNT }, (_, index) =>
    guestRow(index)
  ).flat(),
  ...stepActions,
  ...invitationPreview,
  siteFooter,
];
