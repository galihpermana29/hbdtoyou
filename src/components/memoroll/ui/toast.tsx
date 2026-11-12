'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

import { REDUCED, TOAST } from './motion';

/**
 * The one-sentence notice MemoRoll shows above the thumb - a problem, or a
 * success - looking exactly as it always has, but arriving and leaving the
 * way a native toast does: up from where it sits, and back down the same way
 * (a toast exits along the axis it entered). It used to appear and vanish in
 * a single frame.
 *
 * The live region stays mounted while the notice comes and goes, so a screen
 * reader is already listening when the sentence lands.
 */
export default function Toast({
  role,
  message,
  background,
  color,
  onDismiss,
}: {
  role: 'alert' | 'status';
  /** The sentence, or null when there is nothing to say. */
  message: ReactNode | null;
  background: string;
  color: string;
  /** Tap to dismiss early; absent when the toast is not tappable. */
  onDismiss?: () => void;
}) {
  const reduce = useReducedMotion();
  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, transform: 'translateY(12px) scale(0.97)' };

  return (
    <div
      role={role}
      className="pointer-events-none absolute inset-x-[16px] bottom-[96px] z-30">
      <AnimatePresence initial={false}>
        {message ? (
          <motion.p
            key={role}
            initial={hidden}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={hidden}
            transition={reduce ? REDUCED : TOAST}
            className={`${
              onDismiss ? 'pointer-events-auto' : ''
            } rounded-[12px] px-[16px] py-[12px] text-[13px] font-semibold leading-[150%] shadow-lg`}
            style={{
              background,
              color,
              fontFamily: 'var(--font-mr-body)',
            }}
            onClick={onDismiss}>
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
