'use client';

/**
 * Wedding Template 1 - Vinyl Widget. Figma node 312:1817.
 * A 67x67 spinning-record music toggle: the vinyl record masked into a ring
 * with the cover-art label at its centre.
 * Animation: only the record ring spins continuously (linear, ~10s/turn); the
 * centre cover-art label stays fixed. Respects prefers-reduced-motion (no spin).
 */

import { motion, useReducedMotion } from 'framer-motion';

const ASSET = '/templates/wedding-template-1';

export default function VinylWidget() {
  const reduce = useReducedMotion();

  return (
    <div className="relative h-[67px] w-[67px]">
      {/* vinyl record, masked into a donut ring so the centre reads through */}
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { repeat: Infinity, ease: 'linear', duration: 10 }
        }
        style={{
          WebkitMaskImage: `url(${ASSET}/vinyl-mask.svg)`,
          maskImage: `url(${ASSET}/vinyl-mask.svg)`,
          WebkitMaskSize: '67px 67px',
          maskSize: '67px 67px',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}>
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/vinyl-record.png`}
        />
      </motion.div>

      {/* cover-art label seated in the centre hole */}
      <div className="absolute left-[18.7px] top-[18.7px] h-[29.595px] w-[29.596px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/vinyl-exclude.png`}
        />
      </div>
    </div>
  );
}
