'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

/** Scroll-reveal variant shared across landing pages: fade up into place. */
export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

interface RevealProps extends HTMLMotionProps<'div'> {
  /** Seconds to wait before the reveal starts — use to stagger siblings. */
  delay?: number;
  /** Fraction of the element that must be visible before triggering (0–1). */
  amount?: number;
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
  amount = 0.2,
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
