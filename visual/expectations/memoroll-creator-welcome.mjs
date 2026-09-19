/**
 * The way in (creator-01 in the capture, Figma node 434:8531).
 *
 * The only MemoRoll screen drawn on the dark ground rather than the paper, and
 * the only one that sets anything at 44 - both of which is the design saying
 * this is the pitch rather than the product.
 *
 * Its leading is 53 where every other line in the file is 150%, because the
 * design hand-breaks this sentence into five lines 20 apart and 33 of line plus
 * 20 of gap is what a reader sees. Its tracking is 0 where everything else is
 * -1.1%.
 *
 * The footer says "Presented by" where every guest screen says "Created by".
 * That is the design's own distinction and it is asserted rather than
 * smoothed over: the guest is looking at something a couple made, and the
 * creator is being sold something Memoify made.
 */

import { COLOUR, cta } from './memoroll.mjs';

export const expectations = [
  {
    // The screen's own root, not the demo's wrapper behind it: the dark ground
    // is the welcome's, and the real product has no wrapper to inherit it from.
    name: 'the dark ground',
    select: 'main div.min-h-full',
    nth: 0,
    style: { backgroundColor: COLOUR.ink },
  },
  {
    name: 'MemoRoll wordmark',
    select: 'svg[role="img"]',
    nth: 0,
  },
  {
    name: 'the pitch',
    withText: 'Experience the function through everyone’s eyes',
    style: {
      fontSize: '44px',
      fontWeight: 700,
      lineHeight: '53px',
      // The design sets this heading's tracking at zero where every other line
      // in the file is -1.1%, and zero is what a browser calls normal.
      letterSpacing: 'normal',
      color: COLOUR.paper,
    },
  },
  cta('Setup My Memoroll'),
  {
    name: 'the Memoify line',
    withText: 'Presented by Memoify.live',
    style: {
      fontSize: '10px',
      fontWeight: 400,
      color: COLOUR.white,
    },
  },
];
