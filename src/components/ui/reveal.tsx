'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

/** Scroll-reveal variant shared across landing pages: fade up into place. */
export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

interface RevealProps extends HTMLMotionProps<'div'> {
  /** Seconds to wait before the reveal starts - use to stagger siblings. */
  delay?: number;
  /**
   * How much of the element must be visible before triggering: a fraction, or
   * `'some'` / `'all'`.
   *
   * Defaults to `'some'`. A numeric threshold is measured against the element's own
   * height, so anything taller than the viewport can never reach it and stays stuck at
   * `opacity: 0` forever - which is what left `/journal` rendering as a blank white page,
   * its 67,000px list of entries never revealing.
   */
  amount?: 'some' | 'all' | number;
}

/**
 * Wraps a section in a scroll-triggered fade-up reveal. Plays once, the first
 * time the element scrolls into view. Leaves Framer Motion's default spring on
 * the transform so it keeps the soft settle used across the landing pages.
 *
 * @example
 * <Reveal>
 *   <section>…</section>
 * </Reveal>
 */
export default function Reveal({
  children,
  delay = 0,
  amount = 'some',
  transition,
  ...props
}: RevealProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delay, ...transition }}
      {...props}>
      {children}
    </motion.div>
  );
}
