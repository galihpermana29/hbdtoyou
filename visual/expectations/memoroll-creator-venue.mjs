/**
 * Step five: where the party is (creator-08 in the capture, Figma node
 * 442:11622).
 *
 * The step as the product now draws it (owner, 2026-11-13), which departs
 * from the frame in two places on purpose:
 *
 * - No "Only at the venue" switch, and the blurb no longer promises the
 *   geofence. The product dropped the switch on 2026-11-12 because the guest
 *   flow does not enforce it, and the demo shows what the product does.
 * - No "We get this from your digital invitation" notes: a roll made in the
 *   demo, like a standalone roll, comes from no invitation. The product still
 *   shows them when a roll is made from a wedding (`fromInvitation`).
 *
 * Both fields are still shaded, the design's mark of an answer that came from
 * somewhere else; the padlock drawn over it is not, as ADR 0002 records.
 */

import {
  creatorStep,
  fieldLabel,
  fieldPill,
  fieldValue,
} from './memoroll-creator.mjs';

export const expectations = creatorStep(
  {
    step: 5,
    name: 'Venue & Location',
    heading: 'Where’s the party?',
    blurb: 'Tell your guests where the party is',
  },
  [
    fieldLabel('Venue'),
    fieldPill(0, { shaded: true }),
    fieldValue('Venue'),
    fieldLabel('Address'),
    fieldPill(1, { shaded: true }),
    fieldValue('Address'),
  ]
);
