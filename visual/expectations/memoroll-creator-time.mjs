/**
 * Step four: when the roll opens (creator-07 in the capture, Figma node
 * 442:11556).
 *
 * The step is called "TIme" in the design, capital I and all, and it ships that
 * way like every other copy error in the file (ADR 0002). Asserting it is what
 * stops somebody quietly correcting it and the check quietly agreeing.
 *
 * Two fields, each with an icon inside it in the one accent the design has. The
 * dates in them are the creator's content and are not asserted.
 */

import {
  creatorStep,
  fieldLabel,
  fieldPill,
  fieldValue,
} from './memoroll-creator.mjs';

export const expectations = creatorStep(
  {
    step: 4,
    name: 'TIme',
    heading: 'When does the roll open?',
    blurb: 'Set the time the guest can join in',
  },
  [
    fieldLabel('Open on'),
    fieldPill(0),
    fieldValue('Open on'),
    fieldLabel('At'),
    fieldPill(1),
    fieldValue('At'),
  ]
);
