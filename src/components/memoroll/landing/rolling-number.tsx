'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

/** Delay between one digit starting to roll and the next, in ms. */
const DIGIT_STAGGER_MS = 120;

/** 0-9, then 0 again so a zero still gets a full turn before it lands. */
const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

function Digit({
  digit,
  rolled,
  delay,
}: {
  digit: number;
  rolled: boolean;
  delay: number;
}) {
  const stop = digit === 0 ? 10 : digit;
  return (
    <span aria-hidden className="inline-block h-12 overflow-hidden align-top">
      <span
        className="flex flex-col motion-reduce:!transition-none"
        style={{
          transform: `translateY(calc(${rolled ? -stop : 0} * 3rem))`,
          transition: rolled
            ? `transform 1600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
            : 'none',
        }}>
        {STRIP.map((n, i) => (
          <span key={i} className="block h-12 leading-[48px]">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * A figure whose digits roll up like an odometer when it scrolls into view and
 * start over when it leaves. Anything that is not a digit ("k", ".", "%", "+")
 * stays put. Rolling is skipped for reduced motion.
 */
export default function RollingNumber({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const rolled = useReducedMotion() || inView;

  let digitIndex = 0;

  return (
    <span ref={ref} className={`inline-flex h-12 ${className ?? ''}`}>
      <span className="sr-only">{value}</span>
      {value.split('').map((ch, i) =>
        /\d/.test(ch) ? (
          <Digit
            key={i}
            digit={Number(ch)}
            rolled={rolled}
            delay={digitIndex++ * DIGIT_STAGGER_MS}
          />
        ) : (
          <span key={i} aria-hidden className="leading-[48px]">
            {ch}
          </span>
        )
      )}
    </span>
  );
}
