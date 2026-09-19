/**
 * Step five: where the party is (creator-08 in the capture, Figma node
 * 442:11622).
 *
 * Both fields carry the note "We get this from your digital invitation", and it
 * is asserted exactly as written. MemoRoll is standalone and the wedding link
 * is deliberately later, so today that note describes a connection nothing
 * makes - which is the design's copy and ships as the design's copy (ADR 0002,
 * ADR 0007). A run that found it rewritten into something true would be
 * reporting a design change nobody made.
 *
 * Both fields are shaded where every other field on the flow is on the paper,
 * and that shading is the design's mark of an answer that came from somewhere
 * else. It is kept; the padlock drawn over it is not, and that departure is
 * recorded in ADR 0002.
 *
 * The line under the switch is one string in two colours, so the distance is
 * asserted on its own: 500m is the rule, and the design writes it in the flame
 * and in bold to say so.
 */

import { body, COLOUR } from './memoroll.mjs';
import {
  creatorStep,
  CREATOR_COLOUR,
  fieldLabel,
  fieldNote,
  fieldPill,
  fieldValue,
} from './memoroll-creator.mjs';

export const expectations = creatorStep(
  {
    step: 5,
    name: 'Venue & Location',
    heading: 'Where’s the party?',
    blurb:
      'Being there is the ticket, nobody shoots the rolloutside the function',
  },
  [
    fieldLabel('Venue'),
    fieldPill(0, { shaded: true }),
    fieldValue('Venue'),
    fieldNote(
      'We get this from your digital invitation',
      'the note under Venue',
      0
    ),
    fieldLabel('Address'),
    fieldPill(1, { shaded: true }),
    fieldValue('Address'),
    fieldNote(
      'We get this from your digital invitation',
      'the note under Address',
      1
    ),
    {
      name: 'the switch’s own label',
      withText: 'Only at the venue',
      style: body(14, 600, COLOUR.black),
    },
    {
      name: 'the rule under it',
      withText: 'Phones 500m outside the venue aren’t allowed to shoot',
      style: body(12, 500, CREATOR_COLOUR.muted),
    },
    {
      name: 'the distance, in the accent',
      withText: '500m',
      style: { ...body(12, 700, COLOUR.flame) },
    },
    {
      name: 'the switch',
      select: '[role="switch"]',
      style: {
        backgroundColor: COLOUR.flame,
        borderRadius: '9999px',
      },
    },
  ]
);
