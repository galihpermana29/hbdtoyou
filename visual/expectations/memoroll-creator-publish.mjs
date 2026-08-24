/**
 * Step eight: the roll, finished (creator-11 in the capture, Figma node
 * 442:11832).
 *
 * The one step with no line under its heading, and the one whose footer is not
 * Back and Continue: three hairlined buttons and then the flame one. The middle
 * of the three carries a picture instead of a word, so it is asked for by the
 * name it is read out as, which is the only copy it has.
 *
 * The stepper's window has nothing after it here - the design pads that side
 * rather than closing up - so this is the one screen with two marks and both of
 * them lit.
 *
 * The Cover inside the phone is checked on its own screen and not again here.
 */

import { body, COLOUR, cta } from './memoroll.mjs';
import { creatorStep, outlineCta } from './memoroll-creator.mjs';

export const expectations = creatorStep(
  {
    step: 8,
    name: 'Ready to publish',
    heading: 'Your roll is ready',
    primary: null,
    back: false,
  },
  [
    outlineCta('Edit'),
    {
      name: 'the QR button',
      select: 'button[aria-label="Share QR Code"]',
      style: {
        ...body(12, 400, COLOUR.ink),
        backgroundColor: COLOUR.paper,
        borderRadius: '9999px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(33, 33, 33, 0.2)',
        padding: '10px',
        boxShadow: 'rgba(0, 0, 0, 0.25) 2px 3px 3.2px inset',
      },
    },
    outlineCta('Preview'),
    cta('Publish'),
  ]
);
