'use client';

/**
 * Wedding Template 1 — Gallery. Figma node 312:1807.
 * A photo collage: five images absolutely positioned and cropped by the
 * frame's overflow. Fixed 375-wide mobile composition, 570px tall.
 * Animation: the five photos fade up in a subtle stagger on scroll; their
 * absolute left/top positions are untouched (motion adds only opacity + y).
 */

import { motion } from 'framer-motion';

import { fadeUp, staggerContainer } from './variants';
import { useWeddingReveal } from './use-wedding-reveal';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  pickPhoto,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

const ASSET = '/templates/wedding-template-1';

const GALLERY_FALLBACKS = [
  `${ASSET}/gallery-1.png`,
  `${ASSET}/gallery-2.png`,
  `${ASSET}/gallery-3.png`,
  `${ASSET}/gallery-4.png`,
  `${ASSET}/gallery-5.png`,
];

export default function Gallery({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: {
  content?: WeddingTemplate1Content;
}) {
  const staggerReveal = useWeddingReveal(staggerContainer);
  const photos = GALLERY_FALLBACKS.map((fallback, index) =>
    pickPhoto(content.galleryPhotos, index, fallback)
  );

  return (
    <motion.section
      className="relative h-[570px] w-full overflow-hidden bg-[#fafafa]"
      {...staggerReveal}>
      <motion.div
        variants={fadeUp}
        className="absolute left-[-3px] top-[-83px] h-[279px] w-[186px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={photos[0]}
        />
      </motion.div>
      <motion.div
        variants={fadeUp}
        className="absolute left-[-19px] top-[191px] h-[138px] w-[207px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={photos[1]}
        />
      </motion.div>
      <motion.div
        variants={fadeUp}
        className="absolute left-[164px] top-0 h-[315px] w-[210px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={photos[2]}
        />
      </motion.div>
      <motion.div
        variants={fadeUp}
        className="absolute left-[-13px] top-[315px] h-[300px] w-[238px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={photos[3]}
        />
      </motion.div>
      <motion.div
        variants={fadeUp}
        className="absolute left-[188px] top-[315px] h-[311px] w-[233px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={photos[4]}
        />
      </motion.div>
    </motion.section>
  );
}
