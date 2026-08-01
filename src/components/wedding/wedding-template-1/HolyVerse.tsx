'use client';

/**
 * Wedding Template 1 — Holy Verse. Figma node 312:1645.
 * Paper-textured band with a centered scripture (Q.S Ar-Rum : 21).
 * Animation: the text block reveals with a subtle fade-up on scroll. The
 * `-translate-x-1/2` centre is preserved via fadeUpCenter (x stays -50%).
 */

import { motion } from 'framer-motion';

import { fadeUpCenter } from './variants';
import { useWeddingReveal } from './use-wedding-reveal';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

const ASSET = '/templates/wedding-template-1';

export default function HolyVerse({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: {
  content?: WeddingTemplate1Content;
}) {
  const reveal = useWeddingReveal(fadeUpCenter);

  return (
    <section className="relative h-[206px] w-full overflow-hidden">
      {/* paper background + subtle cream tint overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/paper.jpg`}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.04) 100%), linear-gradient(90deg, rgba(239,233,226,0.3) 0%, rgba(239,233,226,0.3) 100%)',
          }}
        />
      </div>

      <motion.div
        className="absolute left-1/2 top-[24px] flex w-[343px] flex-col items-center gap-[20px] text-center leading-normal text-[#090909]"
        {...reveal}>
        <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[12px]">
          &ldquo;{content.verseText}&rdquo;
        </p>
        <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[14px] font-semibold">
          {content.verseCitation}
        </p>
      </motion.div>
    </section>
  );
}
