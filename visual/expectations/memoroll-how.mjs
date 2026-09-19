/**
 * "Here's how Memoroll works" (guest-11 in the capture, Figma node 472:7895).
 *
 * The three rules of the product over a half-black veil, shown once on a
 * guest's first entry to the camera - the designer's note on the frame says
 * so ("Muncul sekali aja pas awal masuk") - and never again until the demo's
 * walkthrough restarts.
 *
 * The card wears the viewfinder's chrome, so its gradient stroke ships as
 * the same mid-grey stand-in the viewfinder asserts. The three rule
 * illustrations are the designer's own, cropped from the exported frame at
 * 2x because the capture holds them only as vectors; they carry no copy, so
 * presence is all the check can hold them to. Each rule sets a run of its
 * sentence in bold - the capture reports those texts' weights only as
 * "mixed", so the bold runs are read off the frame.
 */

import { body, cta } from './memoroll.mjs';

/** The popup's own off-white ink, used nowhere else in the design. */
const CHALK = '#eee9e8';

/** One rule's sentence, and the run of it the design sets in bold. */
const rule = (sentence, boldRun) => [
  {
    name: `the rule “${boldRun}” belongs to`,
    withText: sentence,
    style: body(14, 400, CHALK),
  },
  {
    name: `“${boldRun}”, in bold`,
    withText: boldRun,
    style: { fontWeight: 700, fontSize: '14px', color: CHALK },
  },
];

export const expectations = [
  {
    name: 'the veil over the camera',
    select: '[role="dialog"]',
    style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  },
  {
    name: 'the card, in the viewfinder’s chrome',
    select: '[role="dialog"] > div',
    nth: 0,
    style: {
      backgroundColor: '#3b3a3a',
      borderRadius: '16px',
      padding: '8px',
      borderColor: '#808080',
      borderWidth: '1px',
      boxShadow:
        'inset -2px 2px 6.1px rgba(35, 35, 35, 1), inset 2px -2px 6.1px rgba(35, 35, 35, 1)',
    },
  },
  {
    name: 'Here’s how Memoroll works',
    withText: 'Here’s how Memoroll works',
    style: { ...body(20, 700, CHALK), textAlign: 'center' },
  },
  {
    name: 'the first rule’s card',
    select: '[role="dialog"] > div > div > div > div',
    nth: 0,
    style: {
      backgroundColor: 'rgba(239, 234, 233, 0.3)',
      borderRadius: '20px',
      padding: '10px',
    },
  },
  {
    name: 'the first rule’s illustration',
    select: '[role="dialog"] img',
    nth: 0,
    style: {},
  },
  ...rule('Memoroll starts on the day of the event.', 'starts'),
  {
    name: 'the second rule’s card',
    select: '[role="dialog"] > div > div > div > div',
    nth: 1,
    style: {
      backgroundColor: 'rgba(239, 234, 233, 0.3)',
      borderRadius: '20px',
      padding: '10px',
    },
  },
  ...rule(
    // The capture writes this apostrophe straight where the title's is curly;
    // both ship as written (ADR 0002).
    "Each person gets 10 shots. That's it. No retakes, no camera roll uploads.",
    '10 shots'
  ),
  {
    name: 'the third rule’s card',
    select: '[role="dialog"] > div > div > div > div',
    nth: 2,
    style: {
      backgroundColor: 'rgba(239, 234, 233, 0.3)',
      borderRadius: '20px',
      padding: '10px',
    },
  },
  ...rule(
    'Nobody sees anything until the big reveal. Suspense is the point.',
    'Suspense is the point.'
  ),
  cta('Got it'),
];
