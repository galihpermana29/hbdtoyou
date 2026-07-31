'use client';

/**
 * Wedding Template 1 — Photo Sharing block ("We want your perspective..."). Figma node 312:1734.
 * Dark band inviting guests to submit their wedding photos via a paper-textured
 * card with a "Get My Disposable Camera" button.
 * Animation: the centered content fades up on scroll (centre preserved via x:-50%).
 */

import { motion } from 'framer-motion';

import { fadeUpCenter } from '@/components/wedding/wedding-template-1/variants';
import { useWeddingReveal } from './use-wedding-reveal';
import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  type WeddingTemplate1Content,
} from '../wedding-invitation-types';

const ASSET = '/templates/wedding-template-1';

export default function PhotoShare({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: {
  content?: WeddingTemplate1Content;
}) {
  const reveal = useWeddingReveal(fadeUpCenter);

  const cover =
    content.photoShareCover || `${ASSET}/photoshare-card.jpg`;

  return (
    <section className="relative h-[257px] w-full overflow-hidden bg-[#292929]">
      <motion.div
        className="absolute left-1/2 top-[41px] flex w-[343px] flex-col items-center gap-[24px]"
        {...reveal}>
        <p className="w-full text-center font-[family-name:var(--font-wt1-mono)] text-[12px] leading-normal text-white">
          We want your perspective from our wedding! Join through the link below
          to submit all the moments once the wedding concludes
        </p>
        <p className="w-full text-center font-[family-name:var(--font-wt1-mono)] text-[12px] font-medium leading-normal text-white">
          No app download required
        </p>

        <div className="flex w-full flex-col items-start">
          <div className="relative flex w-full flex-col items-start rounded-[2px] p-[12px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[2px] object-cover"
              src={cover}
            />
            <div className="relative flex w-full items-center justify-center border border-solid border-[#fafafa] bg-black p-[10px]">
              <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] leading-normal text-[#fafafa]">
                Get My Disposable Camera
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
