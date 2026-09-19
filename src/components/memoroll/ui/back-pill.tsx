'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeftIcon } from './icons';
import { colour, pillShadow } from './tokens';

/**
 * The orange circular back button the gallery and the preview carry at the top
 * left: a flame pill, fully round, with the same inner shadows as the tab
 * pills beside it, and a white chevron.
 *
 * The design mirrors an invisible copy of it on the right edge to centre the
 * title between them; that is a layout trick, not a control, so callers space
 * with an empty box rather than rendering a second button nobody can press.
 */
export default function BackPill({
  onClick,
  label,
}: {
  onClick: () => void;
  /** What pressing it does, read out: "Back to the camera", "Close the preview". */
  label: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      transition={{ duration: 0.12, ease: [0.32, 0.72, 0, 1] }}
      className="inline-flex items-center justify-center rounded-full px-[12px] py-[10px]"
      style={{ background: colour.flame, boxShadow: pillShadow }}>
      <ChevronLeftIcon className="h-[24px] w-[24px] text-[#fafafa]" />
    </motion.button>
  );
}
