/**
 * My Roll, undeveloped, shots still left (guest-15, Figma node 470:6458).
 *
 * The guest's own gate, still closed: their prints veiled exactly the way
 * ALL's are, with no way to peek and - the designer's own note, "CTA muncul
 * pas udah 0 shots nya" - no Develop CTA while a shot remains unspent. The
 * check cannot assert an absence, so what this screen holds is the veil and
 * the cream having moved to the My Roll pill; the CTA state beside it is the
 * next screen's claim.
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
  tab('ALL', false),
  tab('My Roll', true),
  groupHeading('May 3 at 07:30pm'),
  firstPrintPaper,
  firstPrintPhoto(true),
  firstPrintVeil,
  groupHeading('May 3 at 08:15pm'),
  memoifyFooter,
];
