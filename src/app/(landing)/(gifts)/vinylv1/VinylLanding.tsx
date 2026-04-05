'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import vinylBg from '@/assets/vinyl-bg.png';
import vinylCover from '@/assets/vinyl-cover.png';
import vinylDisk from '@/assets/vinyl-disk.png';

interface VinylLandingProps {
  recipientName: string;
  onComplete?: () => void;
}

type Stage = 0 | 1 | 2 | 3;

const discAnimations: Record<
  Stage,
  { x: string | number; y: string | number; rotate: number }
> = {
  0: { x: 0, y: 0, rotate: 0 },
  1: { x: 0, y: '45%', rotate: 90 },
  2: { x: '-45%', y: '45%', rotate: 180 },
  3: { x: 0, y: 0, rotate: 360 },
};

const discTransitions: Record<Stage, object> = {
  0: {},
  1: { duration: 0.8, ease: 'easeOut' },
  2: { duration: 0.7, ease: 'easeInOut' },
  3: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
};

export default function VinylLanding({
  recipientName,
  onComplete,
}: VinylLandingProps) {
  const [stage, setStage] = useState<Stage>(0);
  const [ctaVisible, setCtaVisible] = useState(true);

  const handleOpen = () => {
    if (stage !== 0) return;
    setCtaVisible(false);
    setStage(1);
  };

  const handleAnimationComplete = () => {
    if (stage === 1) {
      setStage(2);
    } else if (stage === 2) {
      setStage(3);
    } else if (stage === 3) {
      setTimeout(() => {
        onComplete?.();
      }, 800);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden select-none">
      <Image
        src={vinylBg}
        alt="Vinyl background"
        fill
        className="object-cover"
        priority
        quality={90}
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full flex-col items-center justify-between py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-serif text-3xl italic text-white md:text-5xl"
        >
          Dear {recipientName}
        </motion.h1>

        <div className="relative flex items-center justify-center">
          <div className="relative h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] md:h-[400px] md:w-[400px]">
            <motion.div
              className="absolute inset-0"
              style={{ zIndex: stage === 3 ? 20 : 5 }}
              animate={discAnimations[stage]}
              transition={discTransitions[stage]}
              onAnimationComplete={handleAnimationComplete}
            >
              <Image
                src={vinylDisk}
                alt="Vinyl disc"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>

            <motion.div
              className="absolute inset-0"
              style={{ zIndex: 10 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image
                src={vinylCover}
                alt="Vinyl sleeve"
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {ctaVisible && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={handleOpen}
              className="cursor-pointer border-b border-white/60 pb-1 text-lg tracking-wide text-white/90 transition-colors hover:text-white hover:border-white md:text-xl"
            >
              Click to open
            </motion.button>
          )}
        </AnimatePresence>

        {!ctaVisible && stage < 3 && (
          <div className="h-[28px] md:h-[32px]" />
        )}

        {stage === 3 && !onComplete && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-white/60"
          >
            Animation complete
          </motion.p>
        )}
      </div>
    </div>
  );
}
