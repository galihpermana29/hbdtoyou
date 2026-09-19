'use client';

import type { Variants } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

import { useSealed } from './sealed-context';
import { revealViewport } from './variants';

/**
 * Scroll-reveal motion props for one element.
 *
 * A section only reveals itself in an invitation that arrived Sealed, which is
 * the one a guest scrolls through for the first time. The Site Preview beside
 * the form is a picture of the invitation rather than the invitation being
 * received, so it is drawn at rest and stays there.
 */
export function useWeddingReveal(variants: Variants) {
  const reduce = useReducedMotion();
  const sealed = useSealed();

  if (!sealed || reduce) {
    return { variants, initial: false as const, animate: 'show' as const };
  }

  return {
    variants,
    initial: 'hidden' as const,
    whileInView: 'show' as const,
    viewport: revealViewport,
  };
}
