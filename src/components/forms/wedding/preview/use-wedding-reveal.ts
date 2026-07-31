'use client';

import type { Variants } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

import { revealViewport } from '@/components/wedding/wedding-template-1/variants';

import { useWeddingTemplate1RecipientMode } from './preview-context';

/** Scroll-reveal motion props; skipped in creator live preview (recipientMode off). */
export function useWeddingReveal(variants: Variants) {
  const reduce = useReducedMotion();
  const recipientMode = useWeddingTemplate1RecipientMode();

  if (!recipientMode || reduce) {
    return { variants, initial: false as const, animate: 'show' as const };
  }

  return {
    variants,
    initial: 'hidden' as const,
    whileInView: 'show' as const,
    viewport: revealViewport,
  };
}
