'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * The "REVEAL IN" card floating on the hero's arc. It counts down from
 * the design's 02 : 14 : 08 to zero a second at a time, and then starts again,
 * so there is always a roll that is about to develop.
 *
 * It draws the design's own value until the browser has taken over, so the
 * page the server sends and the first page the browser builds are the same.
 * Under reduced motion it holds that value, and off screen it waits.
 */
const START_SECONDS = 2 * 3600 + 14 * 60 + 8;

const pad = (value: number) => String(value).padStart(2, '0');

function format(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
}

export default function RollTimer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();
  const [remaining, setRemaining] = useState(START_SECONDS);

  useEffect(() => {
    if (reduceMotion || !inView) return;

    const tick = setInterval(() => {
      setRemaining((seconds) => (seconds > 0 ? seconds - 1 : START_SECONDS));
    }, 1000);
    return () => clearInterval(tick);
  }, [reduceMotion, inView]);

  return (
    <div
      ref={ref}
      className="absolute left-[1170.5px] top-[632.6px] -rotate-[4deg] rounded-[14px] bg-[#1b1b1b] px-[18px] py-[14px]"
      style={{ width: 209, height: 80, fontFamily: 'var(--font-mr-label)' }}>
      <p className="text-[11px] tracking-[1.2px] text-[#b9b2aa]">REVEAL IN</p>
      <p className="mt-[6px] whitespace-pre text-[24px] font-medium text-white">
        {format(remaining)}
      </p>
    </div>
  );
}
