/**
 * ALL while the event runs (guest-13 in the capture, Figma node 434:7907).
 *
 * The Collective Gallery behind the first gate: every print veiled at the
 * design's LAYER_BLUR 4 under the 80% dark, with "Ends in" counting on the
 * countdown screen's own flip tiles beside prints nobody may see yet. The ALL
 * pill is the cream one; nothing on a veiled print is legible, and nothing is
 * printed on one either - no stamp, no signature.
 */

import {
  endsInClock,
  firstPrintPaper,
  firstPrintPhoto,
  firstPrintVeil,
  galleryHeader,
  groupHeading,
  memoifyFooter,
  tab,
} from './memoroll-gallery.mjs';

export const expectations = [
  ...galleryHeader(endsInClock()),
  tab('ALL', true),
  tab('My Roll', false),
  groupHeading('May 3 at 07:30pm'),
  firstPrintPaper,
  firstPrintPhoto(true),
  firstPrintVeil,
  groupHeading('May 3 at 08:15pm'),
  memoifyFooter,
];
