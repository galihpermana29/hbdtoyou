/**
 * Step six: how many shots each guest gets (creator-09 in the capture, Figma
 * node 442:11697).
 *
 * The number is the largest thing in the whole design at 64, and the design
 * gives it a box 48 tall rather than the 96 that 150% would make - so its
 * caption sits twelve pixels under the digits instead of thirty-six. That
 * leading is asserted, because it is the difference between a counter and a
 * number floating in air.
 *
 * The minus is grey at ten and the plus is the flame, which is the design's
 * only statement about where the floor is. Both are held, so a build that let a
 * creator hand out nine shots would fail here rather than in somebody's wedding.
 */

import { body, COLOUR } from './memoroll.mjs';
import { creatorStep } from './memoroll-creator.mjs';

export const expectations = creatorStep(
  {
    step: 6,
    name: 'Shots per guest',
    heading: 'How many shots does everyone get?',
    blurb:
      "Every photo counts. Guests can't preview their shots until the roll develops.",
  },
  [
    {
      name: 'one fewer, unavailable at the floor',
      select: 'button[aria-label="One fewer shot each"]',
      style: {
        backgroundColor: '#d9d9d9',
        borderRadius: '9999px',
      },
    },
    {
      name: 'the count',
      withText: '10',
      style: {
        fontSize: '64px',
        fontWeight: 700,
        lineHeight: '48px',
        letterSpacing: '-0.704px',
        color: COLOUR.ink,
      },
    },
    {
      name: 'one more',
      select: 'button[aria-label="One more shot each"]',
      style: {
        backgroundColor: COLOUR.flame,
        borderRadius: '9999px',
      },
    },
    {
      name: 'what the count counts',
      withText: 'Shots per guest',
      nth: 1,
      style: body(12, 600, COLOUR.ink),
    },
  ]
);
