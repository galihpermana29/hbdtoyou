'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * The dark strip above the navigation: Memoroll now ships with the wedding
 * plan. The line is a split-flap board - every letter flips through a few
 * random glyphs before it lands - and it re-flips every few seconds.
 */

const LONG_TEXT = 'NEW - Memoroll is now included free with the Wedding Plan';
const SHORT_TEXT = 'NEW - Memoroll free with the Wedding Plan';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const FLIP_MS = 100;
const STAGGER_MS = 28;
const CYCLE_MS = 7000;

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/** One letter of the board. `cycle` bumps each time the line should re-flip. */
function Flap({
  target,
  index,
  cycle,
}: {
  target: string;
  index: number;
  cycle: number;
}) {
  const [cur, setCur] = useState(target);
  const [prev, setPrev] = useState(target);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (cycle === 0 || target === ' ') return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const steps = 5 + (index % 5);
    let shown = target;

    const flipTo = (next: string) => {
      setPrev(shown);
      setCur(next);
      setTick((t) => t + 1);
      shown = next;
    };

    for (let s = 1; s <= steps; s++) {
      timers.push(
        setTimeout(
          () => flipTo(s === steps ? target : randomGlyph()),
          index * STAGGER_MS + s * FLIP_MS
        )
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [cycle, index, target]);

  if (target === ' ') return <span className="w-[0.9ch]" aria-hidden />;

  const animating = tick > 0;

  return (
    <span
      aria-hidden
      className="relative inline-block h-[20px] w-[1ch] [perspective:80px] md:w-[1.15ch]">
      {/* The face that is showing: new letter on top, old one below it. */}
      <Half pos="top" char={cur} />
      <Half pos="bottom" char={animating ? prev : cur} />
      {animating && (
        <>
          <Half
            key={`t${tick}`}
            pos="top"
            char={prev}
            className="mr-flap-top"
          />
          <Half
            key={`b${tick}`}
            pos="bottom"
            char={cur}
            className="mr-flap-bottom"
          />
        </>
      )}
    </span>
  );
}

function Half({
  pos,
  char,
  className = '',
}: {
  pos: 'top' | 'bottom';
  char: string;
  className?: string;
}) {
  const top = pos === 'top';
  return (
    <span
      className={`absolute inset-x-0 h-1/2 overflow-hidden bg-[#2a2a2a] [backface-visibility:hidden] ${
        top
          ? 'top-0 rounded-t-[2px] border-b border-[#1b1b1b] [transform-origin:bottom]'
          : 'bottom-0 rounded-b-[2px] [transform-origin:top]'
      } ${className}`}>
      <span
        className={`flex h-[20px] items-center justify-center ${
          top ? '' : '-translate-y-1/2'
        }`}>
        {char}
      </span>
    </span>
  );
}

function FlapLine({ text, cycle }: { text: string; cycle: number }) {
  return (
    <span
      role="text"
      aria-label={text}
      className="inline-flex gap-[0.5px] text-[10px] leading-[20px] md:gap-[1.2px] md:text-[11px] text-[#fbf4ec]"
      style={{ fontFamily: 'var(--font-mr-label)' }}>
      {text
        .toUpperCase()
        .split('')
        .map((ch, i) => (
          <Flap key={i} target={ch} index={i} cycle={cycle} />
        ))}
    </span>
  );
}

export default function MemorollAnnouncementStrip() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const first = setTimeout(() => setCycle(1), 600);
    const loop = setInterval(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, []);

  return (
    <Link
      href="/wedding-invitation"
      className="group flex h-10 items-center justify-center gap-3 overflow-hidden bg-[#1b1b1b] px-4 transition-colors hover:bg-black">
      <span className="memoroll-live-dot size-[6px] shrink-0 rounded-[3px] bg-[#ff3e09]" />
      <span className="hidden md:inline-flex">
        <FlapLine text={LONG_TEXT} cycle={cycle} />
      </span>
      <span className="inline-flex md:hidden">
        <FlapLine text={SHORT_TEXT} cycle={cycle} />
      </span>
      <Image
        src="/memoroll-landing/banner-arrow.svg"
        alt=""
        width={14}
        height={14}
        unoptimized
        className="mr-strip-arrow shrink-0"
      />
    </Link>
  );
}
