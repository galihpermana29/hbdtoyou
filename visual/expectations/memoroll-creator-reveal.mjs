/**
 * Step seven: when the roll develops (creator-10 in the capture, Figma node
 * 442:11766).
 *
 * Two of the design's own mistakes ship here and both are asserted, so a build
 * that tidies them up fails rather than passes quietly. The heading has no
 * question mark where every other question in the flow does, and the line under
 * it is the line from "Name your roll" left behind, describing a name and a
 * cover on a screen that asks for neither (ADR 0002).
 *
 * Its button says "Create Now" rather than Continue, which is the design saying
 * this is the last thing asked before the roll exists.
 */

import {
  creatorStep,
  fieldLabel,
  fieldPill,
  fieldValue,
} from './memoroll-creator.mjs';

export const expectations = creatorStep(
  {
    step: 7,
    name: 'Reveal timing',
    heading: 'When should the roll develop',
    blurb:
      'Give your Memoroll a name and customize what guests see when they join',
    primary: 'Create Now',
  },
  [
    fieldLabel('Reveal on'),
    fieldPill(0),
    fieldValue('Reveal on'),
    fieldLabel('At'),
    fieldPill(1),
    fieldValue('At'),
  ]
);
