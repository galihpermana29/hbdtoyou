'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { pressTap } from './variants';

/**
 * What is left of the demo's first visual vocabulary, kept only for the two
 * guest screens still drawn in it - the sign-in and the onboarding - which
 * hbd-qti.2 and hbd-qti.3 replace along with this file.
 *
 * Everything the creator side used went with the five-step creator demo the
 * designer's finished flow replaced. The design this is measured from is the
 * old one; the current design is `docs/design/memoroll/`, and its own
 * vocabulary lives in `src/components/memoroll/ui/`.
 */

export function HandHeading({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`text-center text-[26px] leading-[1.9] text-[#212121] ${className}`}
      style={{ fontFamily: 'var(--font-mr-hand)' }}>
      {children}
    </h1>
  );
}

export function BodyText({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-center text-[16px] leading-relaxed text-[#212121] ${className}`}
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      {children}
    </p>
  );
}

export function PillButton({
  children,
  onClick,
  variant = 'orange',
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'orange' | 'white';
  className?: string;
}) {
  const reduce = useReducedMotion();
  const palette =
    variant === 'orange'
      ? 'bg-[#ff3e09] text-white shadow-[0_6px_18px_rgba(255,62,9,0.35)]'
      : 'bg-white text-[#212121] border border-[#212121]/20 shadow-sm';
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduce ? undefined : pressTap}
      className={`h-[52px] w-full rounded-full text-[16px] ${palette} ${className}`}
      style={{ fontFamily: 'var(--font-mr-ui)' }}>
      {children}
    </motion.button>
  );
}
