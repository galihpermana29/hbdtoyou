'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

/**
 * Once-only scroll reveal: fades and lifts its children into place the first
 * time they scroll into view, then never replays. The wrapper is translated
 * while hidden, so children must not rely on the layout of that box (measure
 * nothing inside it before `data-revealed="true"`). Children can react to the
 * reveal with `group-data-[revealed=true]:...`.
 */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  as?: 'div' | 'li' | 'figure' | 'section';
  /** Delay in ms before the reveal starts once the element is in view. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setReduced(true);
      setShown(true);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const motionStyle: CSSProperties = reduced
    ? {
        opacity: shown ? 1 : 0,
        transform: 'none',
        transition: 'opacity 200ms ease-out',
      }
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(16px)',
        transition:
          'opacity 400ms ease-out, transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: shown ? `${delay}ms` : '0ms',
        willChange: shown ? undefined : 'opacity, transform',
      };

  return (
    <Tag
      ref={ref}
      className={`group ${className ?? ''}`}
      data-revealed={shown ? 'true' : 'false'}
      style={{ ...style, ...motionStyle }}>
      {children}
    </Tag>
  );
}
