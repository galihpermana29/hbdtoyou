/**
 * The Cover, the first screen a guest meets (guest-01 in the capture, Figma
 * node 450:13476).
 *
 * The design draws six Covers. They differ only in how the photographs above
 * are arranged - Collage, Taped wall, Simple - so everything asserted here is
 * what all six share, and the Cover Style is checked by the arrangement above
 * rather than by any of these values.
 *
 * The wordmark is outlines rather than text and carries no copy, so it cannot
 * be held by what it says. It is held by being an image with an accessible
 * name, which is also what a screen reader gets.
 */

import { body, COLOUR, cta, memoifyFooter } from './memoroll.mjs';

export const expectations = [
  {
    // The screen's own root, not the demo's wrapper behind it: the paper is the
    // Cover's, and the real product has no wrapper to inherit it from.
    name: 'the paper ground',
    select: 'main div.min-h-full',
    nth: 0,
    style: { backgroundColor: COLOUR.paper },
  },
  {
    name: 'MemoRoll wordmark',
    select: 'svg[role="img"]',
    nth: 0,
  },
  {
    name: 'the event name, in script',
    withText: 'Elias & Freya’s wedding',
    style: {
      fontSize: '32px',
      lineHeight: '38px',
      color: COLOUR.black,
    },
  },
  {
    name: 'the invitation line',
    withText: 'join others capture the moments',
    style: body(14, 400, COLOUR.black),
  },
  cta('Get me in'),
  memoifyFooter,
];
