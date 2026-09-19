/**
 * Step two: what the event is called (creator-06 in the capture, Figma node
 * 442:11372).
 *
 * The hint under the label is the design telling the creator where this answer
 * ends up, and it is set at 12 in the design's grey rather than in the ink the
 * field's own words carry.
 *
 * What is typed in the field is not asserted. A creator's answer is their
 * content; the design owns the label above it, the hint under it and the type
 * it is set in, and those are what is held here.
 */

import { body } from './memoroll.mjs';
import {
  creatorStep,
  CREATOR_COLOUR,
  fieldLabel,
  fieldPill,
  fieldValue,
} from './memoroll-creator.mjs';

export const expectations = creatorStep(
  {
    step: 2,
    name: 'Name your roll',
    heading: 'What’s the event called?',
    blurb: 'A memorable occasion must have a name',
  },
  [
    fieldLabel('Event name'),
    {
      name: 'the hint under the label',
      withText:
        'This will be the first thing guests will see when they scan your QR',
      style: body(12, 500, CREATOR_COLOUR.muted),
    },
    fieldPill(0),
    fieldValue('Event name'),
  ]
);
