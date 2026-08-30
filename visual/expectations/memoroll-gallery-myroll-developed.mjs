/**
 * My Roll, developed, mid-event (guest-18 in the capture, node 470:6601).
 *
 * The two gates, independent, on one screen: the guest's own prints sharp,
 * stamped and signed while "Ends in" still counts beside them - their Roll
 * came out of the Dark Room without waiting for anybody's Reveal.
 *
 * The signature is the guest's own handle, the one confirmed on "This you?".
 * The design signs these prints "Zidane", which is the print component's
 * placeholder shooter: one guest has one name (see memoroll-gallery.mjs).
 */

import {
  body,
  COLOUR,
  endsInClock,
  firstPrintPaper,
  firstPrintPhoto,
  galleryHeader,
  gridStamp,
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
  firstPrintPhoto(false),
  gridStamp,
  {
    name: 'the first print’s signature',
    withText: 'dhilafadhila',
    nth: 0,
    style: body(8, 500, COLOUR.white),
  },
  groupHeading('May 3 at 08:15pm'),
  memoifyFooter,
];
