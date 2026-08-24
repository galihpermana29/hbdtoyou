'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { colour, type } from './tokens';

/**
 * The one button the design uses to move a guest forward: flame fill, fully
 * round, and an inner shadow set down and to the right so the pill reads as
 * something pressed out of the paper rather than laid on top of it.
 *
 * Its width is the only thing that changes between screens - 220 on the
 * location ask, the full 343 column on the username confirm - so width is the
 * caller's to set and everything else is fixed here.
 *
 * The layer is named "I'm in, let's go!" everywhere in the design and says
 * something different on every screen; the name is the component it came from,
 * not the copy. The copy is whatever is passed in.
 */
export default function Cta({
  children,
  onClick,
  className = '',
  type: buttonType = 'button',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type={buttonType}
      onClick={onClick}
      disabled={disabled}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12, ease: [0.32, 0.72, 0, 1] }}
      className={`inline-flex items-center justify-center rounded-full px-[10px] py-[10px] text-white disabled:opacity-60 ${type.button} ${className}`}
      style={{
        background: colour.flame,
        fontFamily: 'var(--font-mr-body)',
        boxShadow: 'inset 2px 3px 3.2px rgba(0, 0, 0, 0.25)',
      }}>
      {children}
    </motion.button>
  );
}
