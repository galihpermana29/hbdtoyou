import type { Transition, Variants } from 'framer-motion';

/**
 * MemoRoll's motion, named once (2026-11-12, owner: "closer to native mobile
 * apps"). Values are Emil Kowalski's (emilkowalski/skills, animate +
 * review-animations STANDARDS), copied rather than approximated:
 *
 * - entering / exiting UI: a strong ease-out, never ease-in
 * - things moving on screen: a strong ease-in-out
 * - full-width, edge-attached surfaces (screens, sheets): the iOS drawer curve
 * - press feedback 100-160ms; UI under 300ms; sheets and screens up to 500ms
 * - reduced motion keeps a short opacity change and drops the movement
 *
 * Transforms are written as full `transform` strings where nothing drags
 * them: framer-motion 12's `x`/`y` shorthands run on the main thread, a full
 * transform string is hardware accelerated (animation-performance).
 */

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/** Press feedback: the instant a finger lands, 120ms. */
export const PRESS: Transition = { duration: 0.12, ease: EASE_OUT };

/** What reduced motion leaves: a brief opacity change, no movement. */
export const REDUCED: Transition = { duration: 0.12, ease: EASE_OUT };

/** A bottom sheet arriving and leaving - Vaul's iOS sheet timing. */
export const SHEET_IN: Transition = { duration: 0.5, ease: EASE_DRAWER };
export const SHEET_OUT: Transition = { duration: 0.3, ease: EASE_DRAWER };

/** A toast: in and out along the axis it lives on. */
export const TOAST: Transition = { duration: 0.24, ease: EASE_OUT };

/**
 * Screen-to-screen, the way a native navigation stack moves.
 *
 * `custom` is the direction: 1 is a push (the new screen slides in from the
 * right over the old one, which drifts a third of the way left beneath it),
 * -1 is a pop (the reverse), 0 is a change that is not navigation - the
 * Dark Room handing over to the developed gallery - and simply crossfades.
 *
 * Both screens move at once, so the AnimatePresence these feed runs in
 * `popLayout` mode, and every screen paints its own ground so the one
 * underneath never shows through.
 */
const PUSH: Transition = { duration: 0.42, ease: EASE_DRAWER };
const FADE: Transition = { duration: 0.24, ease: EASE_OUT };

export const pushVariants: Variants = {
  enter: (direction: number) =>
    direction === 0
      ? { opacity: 0, transform: 'translateX(0%)', zIndex: 1 }
      : {
          opacity: 1,
          transform: direction > 0 ? 'translateX(100%)' : 'translateX(-30%)',
          zIndex: direction > 0 ? 2 : 1,
        },
  center: (direction: number) => ({
    opacity: 1,
    transform: 'translateX(0%)',
    transition: direction === 0 ? FADE : PUSH,
  }),
  exit: (direction: number) =>
    direction === 0
      ? { opacity: 0, zIndex: 0, transition: FADE }
      : {
          transform: direction > 0 ? 'translateX(-30%)' : 'translateX(100%)',
          zIndex: direction > 0 ? 1 : 2,
          transition: PUSH,
        },
};

/** The reduced-motion stand-in for `pushVariants`: opacity alone. */
export const reducedScreenVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: REDUCED },
  exit: { opacity: 0, transition: REDUCED },
};

/** Which way a move between two ranked screens goes. */
export function directionBetween(from: number, to: number): number {
  return Math.sign(to - from);
}

/** A light tick under the finger where the phone has a motor (Android);
 *  silently nothing elsewhere. Feedback, not decoration: shutter only. */
export function tick(ms = 8) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // Not every browser lets a page vibrate; the press still landed.
  }
}
