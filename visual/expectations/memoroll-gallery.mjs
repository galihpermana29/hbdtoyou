/**
 * What every screen of the MemoRoll gallery shares, taken from the captured
 * design in `docs/design/memoroll/` (guest-13 through guest-20).
 *
 * The gallery is one screen with two gates, so its header, tabs and prints are
 * recorded once here and each state names what its own frame draws: which tab
 * is cream, what the reveal clock says, and how far from sharp every print is.
 *
 * Two of the design's own disagreements are settled here rather than shipped
 * as two answers. The second time heading of guest-18 is `#000000` where every
 * other one is `#232323`: one element, one colour, and the majority ink wins.
 * And the prints of a guest's own Roll are signed "Zidane" in the design while
 * guest-05 names the guest "dhilafadhila": there is one guest and one handle,
 * the one they confirmed on "This you?", so their Roll signs with it - the
 * same one-name resolution the event's title already had (design README).
 */

import { body, COLOUR, memoifyFooter } from './memoroll.mjs';

export const GALLERY_COLOUR = {
  cream: '#e0dabf',
  pill: '#222222',
  stamp: '#f17e03',
  mauve: '#ae9ea6',
  redLight: '#c42a00',
};

/** The inner shadows every selection pill wears, chosen or not. */
export const PILL_SHADOW =
  'inset 4px 4px 40.9px 12px rgba(0, 0, 0, 0.1), inset 0 -3.6px 5.2px 1px rgba(0, 0, 0, 0.17)';

/** The five-stop shadow lifting a grid print off the paper. */
const GRID_PRINT_SHADOW = [
  '0.48px 0.48px 1.19px rgba(0, 0, 0, 0.12)',
  '1.66px 1.66px 2.38px rgba(0, 0, 0, 0.11)',
  '3.56px 3.8px 3.09px rgba(0, 0, 0, 0.06)',
  '6.18px 6.89px 3.8px rgba(0, 0, 0, 0.02)',
  '9.74px 10.69px 4.04px rgba(0, 0, 0, 0)',
].join(', ');

/** The orange circular back button, by what pressing it does. */
export const backPill = (label) => ({
  name: `${label} pill`,
  select: `button[aria-label="${label}"]`,
  style: {
    backgroundColor: COLOUR.flame,
    borderRadius: '9999px',
    padding: '10px 12px',
    boxShadow: PILL_SHADOW,
  },
});

/** One tab pill: the chosen one is cream on dark, the other dark with cream text. */
export const tab = (copy, chosen) => ({
  name: `${copy} tab, ${chosen ? 'chosen' : 'not chosen'}`,
  withText: copy,
  style: {
    ...body(12, 800, chosen ? COLOUR.ink : GALLERY_COLOUR.cream),
    backgroundColor: chosen ? GALLERY_COLOUR.cream : GALLERY_COLOUR.pill,
    borderRadius: '9999px',
    padding: '8px 12px',
    boxShadow: PILL_SHADOW,
  },
});

/** "Ends in" and the first of its flip tiles, mid-event. */
export const endsInClock = () => [
  {
    name: 'Ends in',
    withText: 'Ends in',
    style: body(12, 700, COLOUR.ink),
  },
  {
    name: 'the first flip tile',
    select: '[role="text"] > span',
    nth: 0,
    style: {
      backgroundColor: COLOUR.inkSoft,
      borderRadius: '2.5px',
    },
  },
  {
    name: 'the clock’s first colon',
    withText: ':',
    nth: 0,
    style: {
      fontSize: '12px',
      fontWeight: 700,
      lineHeight: '18px',
      // The design zeroes the colon's tracking where its neighbours are
      // -1.1%; a browser reports zero letter spacing as `normal`.
      letterSpacing: 'normal',
      color: COLOUR.inkSoft,
    },
  },
];

/** "Ended on" and the reveal's moment, once it has come. */
export const endedOnClock = () => [
  {
    name: 'Ended on',
    withText: 'Ended on',
    style: body(12, 700, COLOUR.ink),
  },
  {
    name: 'when the reveal came',
    withText: 'May 4th 2026, 12:00PM',
    style: body(12, 800, COLOUR.ink),
  },
];

/**
 * The header every gallery state carries: the back pill, the centred title,
 * whichever clock the state is in, the event's name and its tally.
 */
export const galleryHeader = (clock) => [
  backPill('Back'),
  {
    name: 'Gallery title',
    withText: 'Gallery',
    style: { ...body(20, 700, COLOUR.ink), textAlign: 'center' },
  },
  ...clock,
  {
    name: 'the event’s name',
    withText: 'Elias & Freya’s wedding',
    style: body(20, 800, COLOUR.ink),
  },
  {
    name: 'the photo tally',
    withText: '615 Photos',
    style: body(12, 500, COLOUR.ink),
  },
  {
    name: 'the tally’s dot',
    withText: '・',
    style: body(14, 500, COLOUR.ink),
  },
  {
    name: 'the participant tally',
    withText: '100 Participants',
    style: body(12, 500, COLOUR.ink),
  },
];

/** A time heading a group of prints sits under. */
export const groupHeading = (copy) => ({
  name: `the "${copy}" heading`,
  withText: copy,
  style: body(14, 500, COLOUR.ink),
});

/** The paper of the first print: white border, stacked shadow. */
export const firstPrintPaper = {
  name: 'the first print’s paper',
  select: 'span[role="img"]',
  nth: 0,
  style: {
    backgroundColor: COLOUR.white,
    padding: '3px',
    boxShadow: GRID_PRINT_SHADOW,
  },
};

/** The first print's photograph, at one of the two gates' verdicts. */
export const firstPrintPhoto = (veiled) => ({
  name: `the first print’s photograph, ${veiled ? 'veiled' : 'sharp'}`,
  select: 'span[role="img"] > span',
  nth: 0,
  style: { filter: veiled ? 'blur(4px)' : 'none' },
});

/** The 80% veil over an undeveloped print. */
export const firstPrintVeil = {
  name: 'the first print’s veil',
  select: 'span[role="img"] > span > span[aria-hidden]',
  nth: 0,
  style: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
};

/** The Date Stamp burned into a grid print's corner. */
export const gridStamp = {
  name: 'the first print’s Date Stamp',
  withText: '5 3 ‘26',
  nth: 0,
  style: body(5.5, 500, GALLERY_COLOUR.stamp),
};

export { body, COLOUR, memoifyFooter };
