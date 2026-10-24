'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';

/**
 * The footer wordmark, set letter by letter. While the pointer is over it the
 * letters nearest the pointer stretch upward, and each one runs on its own
 * spring, so they overshoot and wobble back when the pointer moves on or
 * leaves. Under `prefers-reduced-motion` the word simply stays still.
 */

const STRETCH = 0.3; // how much taller the letter under the pointer gets
const REACH = 1.3; // falloff, in letter widths
const STIFFNESS = 0.16;
const DAMPING = 0.78;

export default function ElasticWordmark({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const letters = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const n = text.length;
    const value = new Array(n).fill(1);
    const velocity = new Array(n).fill(0);
    const target = new Array(n).fill(1);
    let frame = 0;

    const tick = () => {
      let moving = false;
      for (let i = 0; i < n; i++) {
        velocity[i] =
          (velocity[i] + (target[i] - value[i]) * STIFFNESS) * DAMPING;
        value[i] += velocity[i];
        if (
          Math.abs(velocity[i]) > 0.0005 ||
          Math.abs(target[i] - value[i]) > 0.0005
        ) {
          moving = true;
        }
        const el = letters.current[i];
        if (el) {
          const grow = value[i] - 1;
          el.style.transform = `scale(${1 - grow * 0.3}, ${value[i]})`;
        }
      }
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const x = e.clientX - root.getBoundingClientRect().left;
      for (let i = 0; i < n; i++) {
        const el = letters.current[i];
        if (!el) continue;
        const center = el.offsetLeft + el.offsetWidth / 2;
        const d = (x - center) / (el.offsetWidth * REACH);
        target[i] = 1 + STRETCH * Math.exp(-d * d);
      }
      run();
    };
    const onLeave = () => {
      target.fill(1);
      run();
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [text]);

  return (
    <div
      ref={rootRef}
      aria-label={text}
      role="img"
      className={`relative ${className ?? ''}`}
      style={{
        ...style,
        // Only the foot is cropped; the stretch is free to rise above the box.
        clipPath: 'inset(-2em -1em 0 -1em)',
      }}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            fontFamily: style?.fontFamily,
            fontWeight: style?.fontWeight,
            // The foot of the box is the crop line (0.605em of a 0.9em line),
            // so the letters grow up from there and nothing moves at the bottom.
            transformOrigin: '50% 67.2%',
          }}
          ref={(el) => {
            if (el) letters.current[i] = el;
          }}
          className="inline-block will-change-transform">
          {ch}
        </span>
      ))}
    </div>
  );
}
