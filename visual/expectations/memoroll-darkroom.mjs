/**
 * The Dark Room (guest-17 in the capture, Figma node 470:7362).
 *
 * The screen a Roll develops in: the camera's counter pill saying
 * "Developing..." - the one place the design tracks type out at +12% - over a
 * window of red light with the guest's prints soaking in it, each at its own
 * stop of the design's develop: blur 6, blur 10, sharp. The stamp and the
 * signature sit inside the blurred layer, sharpening with the photograph.
 *
 * The checked pose is the design's own still. The live ceremony animates
 * through it and is recorded as an approximation pending the designer's
 * reference (design README, deviation 4); under the check's reduced motion
 * the room holds this still exactly.
 *
 * The counter's outer stroke is a gradient in the design, which the capture
 * cannot hand over; a half-white hairline stands in for it and is asserted as
 * what it is.
 */

import { body, COLOUR } from './memoroll.mjs';
import { GALLERY_COLOUR } from './memoroll-gallery.mjs';

const bathPrintPhoto = (position, filter) => ({
  name: `the ${position} print in the bath`,
  select: 'span[role="img"] > span',
  nth: position === 'first' ? 0 : position === 'second' ? 1 : 2,
  style: { filter },
});

export const expectations = [
  {
    name: 'the counter’s outer pill',
    select: 'section[aria-label="Dark Room"] > div > div',
    nth: 0,
    style: {
      backgroundColor: GALLERY_COLOUR.mauve,
      borderRadius: '16px',
      padding: '8px',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      borderWidth: '1px',
    },
  },
  {
    name: 'the counter’s inner card',
    select: 'section[aria-label="Dark Room"] > div > div > div',
    nth: 0,
    style: {
      backgroundColor: GALLERY_COLOUR.pill,
      borderRadius: '8px',
      padding: '10px 16px',
    },
  },
  {
    name: 'Developing...',
    withText: 'Developing...',
    style: {
      fontSize: '18px',
      fontWeight: 800,
      lineHeight: '27px',
      letterSpacing: '2.16px',
      color: GALLERY_COLOUR.cream,
    },
  },
  bathPrintPhoto('first', 'blur(6px)'),
  {
    name: 'the first print’s Date Stamp, mid-develop',
    withText: '5 3 ‘26',
    nth: 0,
    style: body(11.13, 500, GALLERY_COLOUR.stamp),
  },
  {
    name: 'the first print’s signature, mid-develop',
    withText: 'dhilafadhila',
    nth: 0,
    style: body(16.2, 500, COLOUR.white),
  },
  bathPrintPhoto('second', 'blur(10px)'),
  bathPrintPhoto('third', 'none'),
  {
    name: 'the red light over the bath',
    select: 'section[aria-label="Dark Room"] div[aria-hidden]',
    nth: 1,
    style: { backgroundColor: GALLERY_COLOUR.redLight },
  },
  {
    name: 'Memoify footer, in the dark',
    withText: 'Created by Memoify.live',
    style: { fontSize: '10px', fontWeight: 400, color: COLOUR.white },
  },
];
