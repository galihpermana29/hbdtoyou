'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { colour, type } from './tokens';

/**
 * The one button the design uses to move somebody forward: fully round, and an
 * inner shadow set down and to the right so the pill reads as something pressed
 * out of the paper rather than laid on top of it.
 *
 * Its width is the only thing that changes between screens - 220 on the
 * location ask, the full 343 column on the username confirm, half of it on
 * every creator step that has a Back beside it - so width is the caller's to
 * set and everything else is fixed here.
 *
 * Two tones, and they are one button rather than two: the same pill, the same
 * corner, the same inner shadow, differing only in whether it is filled with
 * the flame or drawn on the paper. The design pairs them on every creator step
 * from "Name your roll" onwards, which is exactly why they cannot be allowed to
 * drift apart.
 *
 * The layer is named "I'm in, let's go!" everywhere in the design and says
 * something different on every screen; the name is the component it came from,
 * not the copy. The copy is whatever is passed in.
 */
export type CtaTone = 'flame' | 'outline';

const TONES: Record<CtaTone, React.CSSProperties> = {
  flame: {
    background: colour.flame,
    border: '1px solid transparent',
    color: '#ffffff',
  },
  /** Back, Edit, Preview, Share Link: the paper itself, hairlined. */
  outline: {
    background: colour.paper,
    border: '1px solid rgba(33, 33, 33, 0.2)',
    color: colour.ink,
  },
};

export default function Cta({
  children,
  onClick,
  className = '',
  type: buttonType = 'button',
  tone = 'flame',
  disabled = false,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  tone?: CtaTone;
  disabled?: boolean;
  /** Read out when the button's own content is artwork rather than words. */
  label?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type={buttonType}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12, ease: [0.32, 0.72, 0, 1] }}
      className={`inline-flex items-center justify-center rounded-full px-[10px] py-[10px] disabled:opacity-60 ${type.button} ${className}`}
      style={{
        ...TONES[tone],
        fontFamily: 'var(--font-mr-body)',
        boxShadow: 'inset 2px 3px 3.2px rgba(0, 0, 0, 0.25)',
      }}>
      {children}
    </motion.button>
  );
}
