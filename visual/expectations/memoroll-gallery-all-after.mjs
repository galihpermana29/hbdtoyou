/**
 * ALL after the Reveal (guest-14 in the capture, Figma node 470:6015).
 *
 * The same screen with the first gate open: the clock now reads "Ended on"
 * with the reveal's moment beside it, and every print is sharp with its Date
 * Stamp burned orange into the corner. No print is signed here - in the
 * Collective Gallery who took a shot is the preview's secret, not the grid's.
 */

import {
  endedOnClock,
  firstPrintPaper,
  firstPrintPhoto,
  galleryHeader,
  gridStamp,
  groupHeading,
  memoifyFooter,
  tab,
} from './memoroll-gallery.mjs';

export const expectations = [
  ...galleryHeader(endedOnClock()),
  tab('ALL', true),
  tab('My Roll', false),
  groupHeading('May 3 at 07:30pm'),
  firstPrintPaper,
  firstPrintPhoto(false),
  gridStamp,
  groupHeading('May 3 at 08:15pm'),
  memoifyFooter,
];
