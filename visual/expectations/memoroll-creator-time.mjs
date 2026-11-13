/**
 * Step four: when the roll opens (creator-07 in the capture, Figma node
 * 442:11556).
 *
 * The design calls the step "TIme", capital I and all. It shipped that way
 * under ADR 0002 until the owner asked for the copy errors to be fixed
 * (2026-11-13); it is asserted as "Time" now.
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
    name: 'Time',
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
