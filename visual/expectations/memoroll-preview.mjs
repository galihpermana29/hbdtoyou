/**
 * The preview over the gallery, one photo at a time (guest-19/20 in the
 * capture, Figma nodes 470:7628 and 472:7952).
 *
 * A deck of prints on a half-black sheet over the gallery: the front one
 * sharp and swipeable, the next two fanned behind it at the design's own
 * blurs. The front print is unsigned - who took it is the secret "Who took
 * this?" keeps - and its Date Stamp steps up to 10px at this size.
 *
 * Two states, one file. `secret` is the preview as it opens: the hand cue the
 * designer asked for "pas awal awal aja" over the print, the signature's
 * landing place empty. `told` is after the button is pressed: the shooter's
 * name landed under the deck, the hand gone. The capture's own descriptions
 * have these two swapped; the trees are the truth built from.
 */

import { body, COLOUR, cta } from './memoroll.mjs';
import { backPill, GALLERY_COLOUR } from './memoroll-gallery.mjs';

const deckPhoto = (name, nth, filter) => ({
  name,
  select: '[role="dialog"] span[role="img"] > span',
  nth,
  style: { filter },
});

/** What both states of the preview share, in document order. */
const preview = (...ownExpectations) => [
  {
    name: 'the sheet over the gallery',
    select: '[role="dialog"]',
    style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  },
  backPill('Back to the gallery'),
  deckPhoto('the deck’s furthest print', 0, 'blur(6.98px)'),
  deckPhoto('the deck’s middle print', 1, 'blur(11.64px)'),
  deckPhoto('the front print, sharp', 2, 'none'),
  {
    name: 'the front print’s Date Stamp',
    // Scoped to the sheet: the revealed gallery behind it is full of stamps.
    select: '[role="dialog"] span',
    withText: '5 3 ‘26',
    nth: 2,
    style: body(10, 500, GALLERY_COLOUR.stamp),
  },
  ...ownExpectations,
  cta('Who took this?'),
];

export const secret = preview({
  name: 'the swipe hand cue',
  select: 'svg[aria-label="Swipe to the next shot"]',
});

export const told = preview({
  name: 'the shooter’s name, told',
  withText: 'Zidane',
  style: body(20, 500, COLOUR.white),
});
