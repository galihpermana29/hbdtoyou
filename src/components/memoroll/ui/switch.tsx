'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { colour } from './tokens';

/**
 * The one switch in the design: whether a phone outside the venue may shoot.
 *
 * The design draws it on and never off, so the flame and the knob's two shadows
 * are its own and the grey it goes when it is off is the design's own hairline
 * grey, which is the nearest thing the file has to an answer.
 *
 * The knob slides rather than jumps, because a switch that teleports reads as a
 * redraw rather than as something being thrown - and it holds still under
 * reduced motion, where the colour change alone still says which way it is.
 */
export default function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  /** What is being switched, read out where the words beside it are not a label. */
  label: string;
}) {
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative h-[30px] w-[52px] shrink-0 rounded-full"
      style={{ background: on ? colour.flame : colour.hairline }}>
      <motion.span
        className="absolute top-[3px] h-[24px] w-[24px] rounded-full bg-white"
        initial={false}
        animate={{ left: on ? 25 : 3 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.2, ease: [0.32, 0.72, 0, 1] }
        }
        style={{
          boxShadow:
            '0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      />
    </button>
  );
}
