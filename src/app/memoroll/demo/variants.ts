import type { Variants } from 'framer-motion';

/**
 * Shared Framer Motion pieces for the MemoRoll guest demo, following the
 * wedding template's motion conventions: ease-out entrances, identity at
 * rest, and a gentle opacity-only fade left behind for reduced motion.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** What reduced motion leaves behind: a brief opacity-only crossfade. */
export const REDUCED_FADE = { duration: 0.12, ease: EASE } as const;

/** Whole-screen transition between walkthrough steps. */
export const screenVariants: Variants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: EASE } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/** Press feedback for anything a guest presses; identity at rest. */
export const pressTap = {
  scale: 0.96,
  transition: { duration: 0.15, ease: EASE },
} as const;
