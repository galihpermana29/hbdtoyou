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
 * - Neither field is shaded (owner, 2026-11-13). The design's warmer ground
 *   marked an answer that came from somewhere else, and on a field the guest
 *   has to fill in it read as a disabled input.
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
    fieldPill(0),
    fieldValue('Venue'),
    fieldLabel('Address'),
    fieldPill(1),
    fieldValue('Address'),
  ]
);
