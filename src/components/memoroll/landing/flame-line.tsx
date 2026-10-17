'use client';

import { motion, type MotionValue } from 'framer-motion';

/**
 * The line in the middle of the arc, where a print goes from undeveloped to
 * developed. Three things, taken from how the reference carousel draws its
 * own centre line, in the flame orange instead of its violet:
 *
 *  - a resting line with a wide soft glow, built from three stacked shadows
 *    rather than one blur so it falls off in steps and not in a ring;
 *  - a brighter strip with a white core that fades in only while a print is on
 *    the line, and sways a few degrees as the print goes past, the way the
 *    reference's does;
 *  - a few sparks drifting off it.
 *
 * `crossing` is how much a print is on the line right now (0 to 1) and `sway`
 * is the strip's tilt in degrees. Both come from the carousel's own clock, so
 * the line lights up exactly when a print is there rather than on a timer of
 * its own that could drift out of step with it.
 */
const FLAME = '255, 62, 9';

const RESTING_GLOW = [
  `0 0 20px 0 rgba(${FLAME}, 0.6)`,
  `0 0 30px 16px rgba(${FLAME}, 0.4)`,
  `0 0 40px 30px rgba(${FLAME}, 0.2)`,
].join(', ');

const STRIP_GLOW = [
  '0 0 15px 5px rgba(255, 255, 255, 0.6)',
  `0 0 30px 10px rgba(${FLAME}, 0.4)`,
].join(', ');

const STRIP_FILL = `linear-gradient(90deg, rgba(${FLAME}, 0), rgba(255, 255, 255, 0.8) 15%, #ffd9cc 50%, rgba(255, 190, 172, 0.8) 85%, rgba(${FLAME}, 0))`;

/**
 * Where each spark starts, as an offset from the line and a height down it,
 * with its size and how long it lives. Written out rather than random so the
 * server and the browser draw the same sparks.
 */
const SPARKS = [
  { dx: -38, y: 24, size: 2, seconds: 3.4 },
  { dx: 22, y: 60, size: 1.5, seconds: 4.2 },
  { dx: -14, y: 98, size: 2, seconds: 3.0 },
  { dx: 46, y: 130, size: 1.5, seconds: 4.6 },
  { dx: -56, y: 160, size: 1.5, seconds: 3.8 },
  { dx: 12, y: 190, size: 2, seconds: 3.2 },
  { dx: -28, y: 228, size: 1.5, seconds: 4.4 },
  { dx: 34, y: 262, size: 2, seconds: 3.6 },
  { dx: -48, y: 296, size: 1.5, seconds: 4.0 },
  { dx: 18, y: 322, size: 1.5, seconds: 3.3 },
  { dx: -8, y: 120, size: 1.5, seconds: 4.8 },
  { dx: 58, y: 210, size: 1.5, seconds: 3.9 },
];

export default function FlameLine({
  height,
  crossing,
  sway,
}: {
  height: number;
  crossing: MotionValue<number>;
  sway: MotionValue<number>;
}) {
  return (
    <div className="absolute top-0" style={{ height }}>
      <div
        className="absolute inset-y-0 -left-px w-px bg-[#ff3e09] opacity-75"
        style={{ boxShadow: RESTING_GLOW }}
      />
      <motion.div
        className="absolute inset-y-0 -left-[1.5px] w-[3px]"
        style={{
          opacity: crossing,
          rotate: sway,
          background: STRIP_FILL,
          boxShadow: STRIP_GLOW,
        }}
      />
      {SPARKS.map((spark, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-[#ffd9cc]"
          style={{
            left: spark.dx,
            top: spark.y,
            width: spark.size,
            height: spark.size,
            boxShadow: `0 0 4px 1px rgba(${FLAME}, 0.7)`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [0, -26] }}
          transition={{
            duration: spark.seconds,
            delay: index * 0.37,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
