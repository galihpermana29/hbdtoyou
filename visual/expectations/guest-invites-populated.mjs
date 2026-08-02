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
 * ## Five columns the design does not draw, and the region that holds them
 *
 * The design's table has a Guest column and an Action column. The backend
 * accepts six things about a guest, and whatever the table does not show a
 * couple can neither check nor correct, so all six are drawn and the deviation
 * is recorded in `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * Six columns do not fit the width the design draws the card at, so they scroll
 * sideways inside it. "Guest List columns" below is what claims that: the region
 * scrolls on one axis and not the other, which is the whole of "inside its own
 * box rather than pushing the page sideways" said as a property.
 *
 * The five headings are also the only automated claim about the template file a
 * couple downloads. `guest-list.ts` writes the template, names a heading row's
 * words and draws this table from one list of columns, so a heading asserted
 * here is a heading the template writes and the parsing reads; there is no way
 * to change one of the three alone. The file itself reaches the browser as a
 * link's `download`, and the check reads copy and computed style rather than
 * attributes, so nothing here opens it.
 *
 * The control offering that file is on this state too, on the line under the
 * card, because uploading again is the only way to change a column the first
 * file never had. Under the card and not inside it: the design's card header
 * holds three things at a stated spacing, and a fourth crushes all three onto
 * two lines each - which no assertion here would catch, since none of them is a
 * dimension.
 *
 * ## What the uploaded file exercises
 *
 * The harness uploads the six headings and seven guests. Six of them answer
 * every column, one of them - the last - names a guest and stops, which is the
 * same thing as a file of nothing but names seen one row at a time: every column
 * the row does not reach reads as unanswered rather than as a refusal. One note
 * carries a comma so that the quoting a spreadsheet writes is read back rather
 * than cut into two columns.
 *
 * ## The two things this screen has that the design does not
 *
 * A file that cannot be read is said so underneath the Guest List, and Edit
 * opens every one of the guest's answers as a field with Cancel and Save in
 * place of the row's two actions. The design draws neither: it gives an Edit
 * action and no picture of what it opens, and it never draws a file being
 * refused.
 *
 * Neither is asserted below, because neither is on this screen. They belong to
 * states the design has no frame for, and this file records only what the frame
 * it names says. They are written down here so that they are known to be
 * unchecked rather than assumed to be checked, which is the same reason
 * `guest-invites.mjs` writes down that the web domain field's value is not
 * claimed.
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
 * The columns the table draws, in order, and what the uploaded file puts in
 * each of them.
 *
 * The heading is the product's own word for the column, which is also what the
 * template writes and what a heading row is recognised as. The answer is the
 * harness's data rather than the design's copy: the design draws one column, so
 * it has nothing to say about what is in the other five.
 */
const GUEST_COLUMNS = [
  { heading: 'Guest', answer: DESIGNED_GUEST },
  { heading: 'Group', answer: "Bride's family" },
  { heading: 'Phone', answer: '+62 812 3456 7890' },
  { heading: 'Email', answer: 'olivia@example.com' },
  { heading: 'Max Plus Ones', answer: '2' },
  { heading: 'Notes', answer: 'Vegetarian, no nuts' },
];

/** Every cell of a row, including the Action cell the design ends it with. */
const CELLS_PER_ROW = GUEST_COLUMNS.length + 1;

/** The last guest names themself and answers nothing else. */
const answersOf = (index) =>
  index === DESIGNED_GUEST_COUNT - 1
    ? [DESIGNED_GUEST]
    : GUEST_COLUMNS.map((column) => column.answer);

/** What a guest's row renders in one column, which is nothing where they stopped. */
const shownAt = (index, column) => answersOf(index)[column] ?? '';

/** One field as a spreadsheet writes it: quoted only where it has to be. */
const asCsvField = (value) =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

/**
 * The file the harness uploads to reach this state.
 *
 * The template's own heading row and then the design's seven guests, so that the
 * screen under check is the frame that was drawn, and so that the file a couple
 * is handed to fill in is the file the parsing is exercised with.
 */
export const DESIGNED_GUEST_LIST = [
  GUEST_COLUMNS.map((column) => column.heading),
  ...Array.from({ length: DESIGNED_GUEST_COUNT }, (_, index) =>
    answersOf(index)
  ),
]
  .map((row) => row.map(asCsvField).join(','))
  .join('\n');

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

/** The design's guest name, worn by every column that holds their answers. */
const TYPE_ANSWER = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  color: '#171717',
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
    nth: 0,
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
    // Not in the design. See the note at the top of this file. Sideways and not
    // downwards: a table that scrolled both ways would hide guests as well as
    // columns, and the card is as tall as its list on purpose.
    name: 'Guest List columns',
    select: 'form [role="group"] > div',
    nth: 1,
    style: { overflow: 'auto hidden' },
  },
  ...GUEST_COLUMNS.map((column, index) => ({
    name: `${column.heading} column heading`,
    select: 'thead th',
    nth: index,
    text: column.heading,
    style: { ...TYPE_SMALL_GREY, ...RULE, padding: '12px 24px' },
  })),
  {
    name: 'Action column heading',
    select: 'thead th',
    nth: GUEST_COLUMNS.length,
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
 *
 * Every cell is asked for by its place among all the cells on the page rather
 * than by its place in its row, because the check counts in document order.
 */
const guestRow = (index) => [
  {
    name: `Guest ${index + 1} row`,
    select: 'tbody tr',
    nth: index,
    style: { backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff' },
  },
  ...GUEST_COLUMNS.map((column, cell) => ({
    name: `Guest ${index + 1} ${column.heading}`,
    select: 'tbody td',
    nth: index * CELLS_PER_ROW + cell,
    text: shownAt(index, cell),
    style: { ...RULE, ...TYPE_ANSWER, padding: '16px 24px' },
  })),
  {
    name: `Guest ${index + 1} actions`,
    select: 'tbody td',
    nth: index * CELLS_PER_ROW + GUEST_COLUMNS.length,
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

/**
 * The control offering the template, on the line under the card.
 *
 * Not in the design. See the note at the top of this file. It is on this state
 * as well as on the empty one because uploading again is the only way to change
 * a column the first file never had.
 */
const guestListTemplate = {
  name: 'Guest List template',
  select: 'a',
  withText: 'Download CSV template',
  style: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    color: '#e34013',
  },
};

export const expectations = [
  ...pageChrome('Guest invites details'),
  ...guestInvitesIntroduction,
  ...guestListCard,
  ...Array.from({ length: DESIGNED_GUEST_COUNT }, (_, index) =>
    guestRow(index)
  ).flat(),
  guestListTemplate,
  ...stepActions,
  ...invitationPreview,
  siteFooter,
];
