'use client';

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect } from 'react';

import FlameLine from './flame-line';
import PhotoCard, { PRINT_HEIGHT, PRINT_WIDTH } from './photo-card';

/**
 * The arc of prints behind the hero heading. Prints travel left to right along
 * the arc; each is undeveloped until it crosses the flame line in the middle,
 * and develops as it passes: the part of a print left of the line is still
 * dark and blurred, the part right of it is the photograph.
 *
 * That is done with two copies of the whole arc rather than a mask per print.
 * Underneath, every print is sharp. On top, every print is undeveloped, and
 * that copy is clipped to everything left of the line. Both copies are moved
 * by the same numbers, so a print is simply split by a vertical line in screen
 * space however far it has turned, which a per-print mask would have to work
 * out in the print's own rotated frame.
 *
 * The positions are the design's: the seven slots it draws, in order, with the
 * two either side of them that sit outside the hero's clip. A print is placed
 * between slots with a Catmull-Rom spline, so it keeps moving smoothly through
 * each slot instead of changing direction at it. The arc always moves,
 * whatever the visitor's reduced-motion setting: it is the hero's whole
 * picture, and a still arc would show the design's frozen frame as the page.
 *
 * The ring is laid out at the design's 1440px width and scaled down below it
 * rather than re-flowed, because an arc has no meaningful reflow: on a phone
 * it is the same picture, smaller.
 */

/** Centre and turn of a print standing in each slot, left to right. */
const SLOTS = [
  { x: -170, y: 960, angle: -75 }, // outside the clip
  { x: -0.52, y: 714.6, angle: -60 },
  { x: 206.49, y: 400.49, angle: -45 },
  { x: 543.06, y: 219.4, angle: -15 },
  { x: 871.78, y: 171, angle: 0 },
  { x: 1200.06, y: 219.4, angle: 15 },
  { x: 1537.49, y: 408.49, angle: 45 },
  { x: 1781.48, y: 707.63, angle: 60 },
  { x: 1900, y: 960, angle: 75 }, // outside the clip
];
const FIRST_SLOT = -4;
const COUNT = SLOTS.length;

/** Where the flame line stands, in the ring's own coordinates. */
const LINE_X = 876;
const RING = 1738;
const LINE_HEIGHT = 342;

/** How far from the line a print's middle can be and still light it: half a print, plus a lead. */
const REACH = PRINT_WIDTH / 2 + 34;
/** How far the line's bright strip tilts as a print goes by, in degrees. */
const SWAY = 2.5;

/**
 * How long a print takes to move one slot. A print needs roughly two of these
 * to cross the line, which is the pace the reveal is meant to be watched at.
 */
const SLOT_SECONDS = 2.5;

type Field = 'x' | 'y' | 'angle';

function spline(field: Field, index: number, t: number) {
  const last = COUNT - 1;
  const p0 = SLOTS[Math.max(index - 1, 0)][field];
  const p1 = SLOTS[index][field];
  const p2 = SLOTS[Math.min(index + 1, last)][field];
  const p3 = SLOTS[Math.min(index + 2, last)][field];

  return (
    0.5 *
    (2 * p1 +
      (p2 - p0) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
      (3 * p1 - p0 - 3 * p2 + p3) * t * t * t)
  );
}

/** Position of a print at `slot`, where 0 is the middle one and -4..4 span them all. */
function at(field: Field, slot: number) {
  const index = Math.min(Math.floor(slot - FIRST_SLOT), COUNT - 1);
  return spline(field, index, slot - FIRST_SLOT - index);
}

function Print({
  index,
  phase,
  undeveloped,
}: {
  index: number;
  phase: MotionValue<number>;
  undeveloped: boolean;
}) {
  const slot = useTransform(
    phase,
    (value) => ((index + value) % COUNT) + FIRST_SLOT
  );
  const x = useTransform(slot, (s) => at('x', s) - PRINT_WIDTH / 2);
  const y = useTransform(slot, (s) => at('y', s) - PRINT_HEIGHT / 2);
  const rotate = useTransform(slot, (s) => at('angle', s));

  return (
    <motion.div
      className="absolute left-0 top-0 will-change-transform"
      style={{ x, y, rotate }}>
      <PhotoCard undeveloped={undeveloped} />
    </motion.div>
  );
}

export default function HeroCarousel() {
  const phase = useMotionValue(0);
  const prints = Array.from({ length: COUNT }, (_, index) => index);

  // The signed distance from the line to whichever print is nearest it.
  const nearest = useTransform(phase, (value) => {
    let closest = Infinity;
    for (let index = 0; index < COUNT; index++) {
      const slot = ((index + value) % COUNT) + FIRST_SLOT;
      const distance = at('x', slot) - LINE_X;
      if (Math.abs(distance) < Math.abs(closest)) closest = distance;
    }
    return closest;
  });
  const crossing = useTransform(nearest, (distance) => {
    const t = Math.min(Math.max(1 - Math.abs(distance) / REACH, 0), 1);
    return t * t * (3 - 2 * t);
  });
  const sway = useTransform(nearest, (distance) =>
    Math.min(Math.max(distance / (PRINT_WIDTH / 2), -1), 1) * SWAY
  );

  useEffect(() => {
    const loop = animate(phase, COUNT, {
      duration: COUNT * SLOT_SECONDS,
      ease: 'linear',
      repeat: Infinity,
    });
    return () => loop.stop();
  }, [phase]);

  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-[25px] size-[1738px] origin-top -translate-x-1/2 scale-[0.45] sm:top-[39px] sm:scale-[0.7] lg:top-[56px] lg:scale-100">
      {/* The design's ring is centred 24px left of the hero (left -173 in a
          1440 frame), so the whole arc and its line shift together. */}
      <div className="absolute inset-0 -translate-x-6">
        <div className="absolute inset-0">
          {prints.map((index) => (
            <Print key={index} index={index} phase={phase} undeveloped={false} />
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(-2000px ${RING - LINE_X}px -2000px -2000px)` }}>
          {prints.map((index) => (
            <Print key={index} index={index} phase={phase} undeveloped />
          ))}
        </div>
        <div className="absolute top-0" style={{ left: LINE_X }}>
          <FlameLine height={LINE_HEIGHT} crossing={crossing} sway={sway} />
        </div>
      </div>
    </div>
  );
}
