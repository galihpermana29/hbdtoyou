'use client';

import { useInView } from 'framer-motion';
import { useRef, type CSSProperties, type ReactNode } from 'react';

import Eyebrow from '@/components/memoroll/landing/eyebrow';
import { RevealHeading } from '@/components/memoroll/landing/reveal-words';

/**
 * The home landing's shared pieces. The page is drawn in the MemoRoll design
 * system (owner, 2026-11-17): the paper grounds, the ink, the flame, the
 * eyebrow pill and the word-by-word headings are MemoRoll's own.
 *
 * Motion follows Emil Kowalski's rules (emilkowalski/skills: animate,
 * choreograph, review-animations STANDARDS), the same ones MemoRoll's
 * `ui/motion.ts` copies:
 * - entering: the strong ease-out; moving on screen: the strong ease-in-out;
 * - transform and opacity only;
 * - a group enters as a wave, lead first, with gaps that shrink - never a
 *   uniform stagger, never a parent and its children both entering;
 * - reduced motion keeps the fade and drops the movement.
 */

export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
export const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';

export const ink = '#1b1b1b';
export const flame = '#ff3e09';

/**
 * One element of a scroll-in wave: it fades and rises once, the first time
 * it is seen. `delay` places it in its group's wave (ms); `distance` is how
 * far it travels - the lead moves most, support less, decoration 0.
 */
export function Rise({
  children,
  delay = 0,
  distance = 16,
  className = '',
  style,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  return (
    <div
      ref={ref}
      className={`motion-reduce:!translate-y-0 ${className}`}
      style={{
        ...style,
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : `translateY(${distance}px)`,
        transition: `opacity 600ms ${EASE_OUT} ${delay}ms, transform 600ms ${EASE_OUT} ${delay}ms`,
      }}>
      {children}
    </div>
  );
}

/** A section's eyebrow, heading and optional line under it. */
export function SectionHead({
  eyebrow,
  title,
  body,
  align = 'center',
  tone = 'ink',
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: 'center' | 'left';
  tone?: 'ink' | 'paper';
}) {
  const centred = align === 'center';
  return (
    <div
      className={`flex flex-col gap-5 ${centred ? 'items-center text-center' : 'items-start'}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <RevealHeading
        className={`max-w-[760px] text-[32px] font-bold leading-[1.1] tracking-[-0.04em] md:text-[48px] ${
          tone === 'paper' ? 'text-[#fbf4ec]' : 'text-[#1b1b1b]'
        }`}>
        {title}
      </RevealHeading>
      {body ? (
        <p
          className={`max-w-[560px] text-[16px] leading-[1.6] md:text-[18px] ${
            tone === 'paper' ? 'text-[#cfc7bd]' : 'text-[#4a4642]'
          }`}>
          {body}
        </p>
      ) : null}
    </div>
  );
}

/** Press feedback every pressable thing on the page shares: 0.97, 160ms. */
export const press =
  'transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]';

export const ctaPrimary = `inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#ff3e09] px-6 text-[16px] font-semibold text-white shadow-[inset_2px_3px_3.2px_rgba(255,255,255,0.25)] md:h-14 md:px-7 md:text-[17px] ${press}`;

export const ctaGhost = `inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] px-6 text-[16px] font-semibold text-[#1b1b1b] md:h-14 md:px-7 md:text-[17px] ${press}`;
