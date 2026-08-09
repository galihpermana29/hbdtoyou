'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { EASE, REDUCED_FADE } from './variants';

/**
 * The shell every demo affordance lives in: a small dashed chip pinned
 * bottom-right that expands into a panel. Deliberately styled as a tool, not
 * as part of the designed screens, and shared by both sides of the demo so
 * the guest and creator surfaces carry the same affordance.
 */
export default function DemoDock({
  chipLabel,
  children,
}: {
  chipLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div
      className="fixed bottom-3 right-3 z-50 flex flex-col items-end"
      style={{ fontFamily: 'var(--font-mr-ui)' }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={reduce ? REDUCED_FADE : { duration: 0.22, ease: EASE }}
            className="mb-2 w-[230px] rounded-[10px] border border-dashed border-[#ff3e09]/70 bg-white/95 p-3 shadow-xl backdrop-blur">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-dashed border-[#ff3e09] bg-[#212121]/90 px-3 py-1.5 text-[11px] text-white shadow-lg backdrop-blur">
        {chipLabel}
      </button>
    </div>
  );
}
