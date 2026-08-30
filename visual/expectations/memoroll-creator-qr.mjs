/**
 * The QR a guest scans, in the sheet that hands it over (creator-12 in the
 * capture, Figma node 472:9444).
 *
 * A sheet over the screen it came from, so two things are asserted that no
 * other MemoRoll screen has: the scrim behind it at half black, and the sheet's
 * own corners - rounded 20 at the top and square at the bottom, because it is
 * the bottom of the phone rather than the bottom of a card.
 *
 * The event's name is under the code, in bold at 14. It is asked for at a
 * position rather than by its words, for two reasons: it is also on the Cover
 * behind the sheet in script, and it is the creator's own answer rather than
 * the design's copy. The design owns the type it is set in and the code above
 * it; the words are whatever was typed on step two.
 *
 * The design draws a second round pill at the far right of the sheet's top row
 * at no opacity, which is a spacer holding that row symmetrical rather than a
 * control. Nothing is asserted about it, because nothing renders it.
 */

import { body, COLOUR } from './memoroll.mjs';
import { outlineCta } from './memoroll-creator.mjs';

export const expectations = [
  {
    name: 'the scrim',
    select: 'button[aria-label="Close"]',
    style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  },
  {
    name: 'the sheet',
    select: '[role="dialog"]',
    style: {
      backgroundColor: COLOUR.paper,
      borderRadius: '20px 20px 0px 0px',
      padding: '20px 16px 58px',
    },
  },
  {
    name: 'the way back out',
    select: '[role="dialog"] button[aria-label="Back"]',
    style: {
      backgroundColor: COLOUR.flame,
      borderRadius: '9999px',
    },
  },
  {
    name: 'the heading',
    withText: 'Share QR Code',
    style: body(20, 700, COLOUR.ink),
  },
  {
    name: 'the line under it',
    withText:
      'Anyone can join this Memoroll by scanning the QR Code. No app download required!',
    style: body(12, 500, COLOUR.ink),
  },
  {
    // The one box in the sheet that directly holds a drawing, which is the
    // code's own card: the way back out holds its chevron in a button.
    name: 'the card the code sits in',
    select: '[role="dialog"] div:has(> svg)',
    style: {
      borderRadius: '10px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(33, 33, 33, 0.2)',
      padding: '12px',
    },
  },
  {
    // The sheet holds two paragraphs: the line under the heading, and this.
    name: 'the event’s name under the code',
    select: '[role="dialog"] p',
    nth: 1,
    style: {
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: '21px',
      letterSpacing: '-0.154px',
      color: COLOUR.ink,
    },
  },
  outlineCta('Share Link'),
];
