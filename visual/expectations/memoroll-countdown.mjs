/**
 * The closed door: what a guest gets who follows the link before the roll opens
 * (guest-04 in the capture, Figma node 434:7640).
 *
 * The heading is semibold where the other screens' headings are bold, which is
 * the design's own distinction and is asserted rather than tidied away.
 *
 * The four unit words are the design's, including the capital M on "Minutes"
 * that its three neighbours do not have. That is exactly the kind of thing
 * ADR 0002 says to ship rather than improve, so the check holds it.
 */

import { body, COLOUR, memoifyFooter } from './memoroll.mjs';

/** The word under one flap group. */
const unit = (word) => ({
  name: `${word} label`,
  withText: word,
  style: {
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '18px',
    color: COLOUR.inkSoft,
  },
});

export const expectations = [
  {
    name: 'MemoRoll wordmark',
    select: 'svg',
    nth: 0,
  },
  {
    name: 'the heading',
    withText: 'Come back when the function begins.',
    style: { ...body(20, 600, COLOUR.black) },
  },
  unit('days'),
  unit('hours'),
  unit('Minutes'),
  unit('seconds'),
  memoifyFooter,
];
