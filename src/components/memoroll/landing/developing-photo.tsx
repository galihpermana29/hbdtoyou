'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * The photograph on the Idea section's polaroid. It does what the roll does:
 * every few seconds a new photograph arrives dark and blurred and develops to
 * sharp over the one before it, so the print is always either waiting or being
 * revealed and never just a still.
 *
 * The first photograph is simply there, as the design draws it. A visitor who
 * has asked for reduced motion keeps it, and nothing changes. Off screen the
 * roll waits, and picks up where it left off when the print is back in view.
 */
const PHOTOS = [
  '/memoroll-landing/idea-photo.jpg',
  '/memoroll-landing/arc-1.jpg',
  '/memoroll-landing/arc-2.jpg',
  '/memoroll-landing/arc-3.jpg',
  '/memoroll-landing/arc-4.jpg',
  '/memoroll-landing/arc-5.jpg',
  '/memoroll-landing/arc-6.jpg',
];

/** How long a photograph stays before the next one starts to develop. */
const HOLD_SECONDS = 4.5;
/** How long a photograph takes to go from dark and blurred to sharp. */
const DEVELOP_SECONDS = 1.8;

const UNDEVELOPED = 'blur(12px) brightness(0.2)';
const DEVELOPED = 'blur(0px) brightness(1)';

export default function DevelopingPhoto() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [tick, setTick] = useState(0);

  // Load them all up front: a photograph that is still arriving when its turn
  // comes would show its blur-in as a flash of empty print.
  useEffect(() => {
    PHOTOS.forEach((src) => {
      new Image().src = src;
    });
  }, []);

  useEffect(() => {
    if (reduceMotion || !inView) return;

    const next = setInterval(() => setTick((t) => t + 1), HOLD_SECONDS * 1000);
    return () => clearInterval(next);
  }, [reduceMotion, inView]);

  const current = tick % PHOTOS.length;
  const previous = (current + PHOTOS.length - 1) % PHOTOS.length;

  return (
    <div ref={ref} className="relative size-full overflow-hidden">
      <img
        loading="lazy"
        decoding="async"
        src={PHOTOS[previous]}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <motion.img
        decoding="async"
        key={tick}
        src={PHOTOS[current]}
        alt=""
        className="absolute inset-0 size-full object-cover"
        initial={tick === 0 ? false : { filter: UNDEVELOPED }}
        animate={{ filter: DEVELOPED }}
        transition={{ duration: DEVELOP_SECONDS, ease: 'easeOut' }}
      />
    </div>
  );
}
