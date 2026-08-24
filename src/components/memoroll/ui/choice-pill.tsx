'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { colour, type } from './tokens';

/**
 * One answer among several, in the design's one way of saying "this one".
 *
 * Two screens use it and they look like different controls until you read the
 * values: a vibe is a full-width row with an emoji in it, a Cover Style is a
 * pill that hugs its word, and both are the same corner, the same 7-and-16 of
 * padding, the same twelve-point regular type, and the same two states. So they
 * are one component whose width its caller decides, rather than two that would
 * disagree the first time somebody restyled one of them.
 *
 * Chosen is a wash of the flame under a hairline of it, with the word in it.
 * Unchosen is the warm grey the design keeps for everything nobody picked. The
 * unchosen pill carries a transparent border of the same width, so choosing one
 * moves nothing.
 *
 * The wash is the design's own gradient - `#efeae9` at no opacity into the
 * flame - read across the fraction of it the pill is wide. The design stretches
 * that gradient nearly four times the pill's width, so only its first quarter
 * ever shows; writing the whole ramp here and letting a browser take the same
 * quarter would land somewhere else, because a browser interpolates a
 * see-through stop premultiplied and Figma does not.
 */
const CHOSEN_WASH =
  'linear-gradient(90deg, rgba(239, 234, 233, 0) 0%, rgba(243, 188, 173, 0.268) 100%)';

export default function ChoicePill({
  chosen,
  onClick,
  className = '',
  children,
}: {
  chosen: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={chosen}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.12, ease: [0.32, 0.72, 0, 1] }}
      className={`flex items-center gap-[10px] rounded-full px-[16px] py-[7px] ${type.button} ${className}`}
      style={{
        backgroundColor: chosen ? 'rgba(0, 0, 0, 0)' : colour.unchosen,
        backgroundImage: chosen ? CHOSEN_WASH : 'none',
        border: `1px solid ${chosen ? colour.flame : 'transparent'}`,
        color: chosen ? colour.flame : colour.unchosenInk,
        fontFamily: 'var(--font-mr-body)',
      }}>
      {children}
    </motion.button>
  );
}
