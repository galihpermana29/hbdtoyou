import type { Variants } from 'framer-motion';

/**
 * Shared Framer Motion variants for Wedding Template 1.
 * NOTE: Layout/CSS is built first and verified pixel-perfect before these are
 * wired in (animation is the final phase). Keep entrances ease-out and subtle;
 * everything is additionally gated behind prefers-reduced-motion at usage sites.
 *
 * GOLDEN RULE: every "show" target must resolve to the element's exact resting
 * state (opacity 1, y/x/scale/rotate identity). For elements centred via
 * `-translate-x-1/2`, use `fadeUpCenter` (which keeps x:'-50%' at rest) and drop
 * the Tailwind translate class so the transforms don't fight.
 */

/** Ease-out curve used everywhere in this template. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * What reduced motion leaves behind, wherever the gate fires on something a
 * guest would otherwise watch cut hard: one brief opacity-only fade - long
 * enough that states cross rather than jump, short enough that nobody is made
 * to wait. Gentler, not zero. Movement (y, scale, rotate, transform) is
 * dropped at the usage site rather than slowed, so nothing travels.
 */
export const REDUCED_FADE = { duration: 0.12, ease: EASE } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Like fadeUp, but preserves a `-translate-x-1/2` centre (x stays -50%). */
export const fadeUpCenter: Variants = {
  hidden: { opacity: 0, y: 28, x: '-50%' },
  show: {
    opacity: 1,
    y: 0,
    x: '-50%',
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Opacity-only fade - safe for elements whose position relies on a transform. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

/**
 * Press feedback for anything a guest presses: a subtle physical dip while the
 * finger is down, back to the exact designed state on release. Transform only,
 * and identity at rest, so no designed computed style changes.
 *
 * Gate it where it is spread, the same way every reveal is gated:
 * `whileTap={reduce ? undefined : pressTap}`.
 */
export const pressTap = {
  scale: 0.97,
  transition: { duration: 0.15, ease: EASE },
} as const;

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** Default whileInView viewport config so sections reveal once, a bit before fully on-screen. */
export const revealViewport = { once: true, amount: 0.35 } as const;
