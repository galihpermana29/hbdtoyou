'use client';

/**
 * Wedding Template 1 — Footer. Figma node 312:1813.
 * A slim orange band crediting Memoify with the small logo mark.
 * Fixed 375-wide mobile composition, 30px tall.
 * Animation: a plain opacity fade on scroll (opacity-only so the centering
 * -translate-x/y-1/2 transform is left untouched).
 */

import { motion } from 'framer-motion';

import { fade } from './variants';
import { useWeddingReveal } from './use-wedding-reveal';

const ASSET = '/templates/wedding-template-1';

export default function Footer() {
  const reveal = useWeddingReveal(fade);

  return (
    <section className="relative h-[30px] w-full overflow-hidden bg-[#e23f12]">
      <motion.div
        className="absolute left-1/2 top-[calc(50%+0.5px)] flex -translate-x-1/2 -translate-y-1/2 items-center gap-[12px]"
        {...reveal}>
        <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[10px] leading-[normal] text-[#fafafa]">
          Created by Memoify.live
        </p>
        <div className="relative size-[18px] shrink-0">
          <img
            alt="Memoify"
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
            src={`${ASSET}/footer-logo.png`}
          />
        </div>
      </motion.div>
    </section>
  );
}
