/**
 * My Roll at zero shots: "Develop My Roll" appears (guest-16, node 470:7092).
 *
 * The one thing this state adds to the undeveloped Roll before it is the door
 * to the Dark Room: the flame CTA riding above the fold, in the same pill
 * every other screen moves a guest forward with. The event is still running -
 * "Ends in" still counts - because a guest's own Roll waits for nobody.
 */

import { cta } from './memoroll.mjs';
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
  cta('Develop My Roll'),
  memoifyFooter,
];
