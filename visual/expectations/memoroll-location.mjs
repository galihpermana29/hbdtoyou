/**
 * The location gate, in both the states the design draws: the ask (guest-07,
 * Figma node 434:7429) and the refusal (guest-08, node 434:7485).
 *
 * They are one screen with two sets of words and two pieces of artwork, so the
 * two lists below differ only where the design does. The artwork itself carries
 * no copy and is asserted only by being present: it runs off the bottom and
 * both sides, and a check that pinned its size would be asserting a dimension.
 */

import { body, COLOUR, cta, memoifyFooter } from './memoroll.mjs';

const screen = (heading, line, button) => [
  {
    name: 'the heading',
    withText: heading,
    style: body(20, 700, COLOUR.black),
  },
  {
    name: 'the line under it',
    withText: line,
    style: body(12, 500, COLOUR.black),
  },
  cta(button),
  memoifyFooter,
];

export const asking = screen(
  'Made it to the function?',
  'We’ll use your location to check that you’re at the event, so you can capture and share moments with everyone.',
  'Allow My Location'
);

export const blocked = screen(
  'Looks like you’re a little too far',
  'Head over and you’ll be able to join in and share your moments with everyone.',
  'Check Again'
);
