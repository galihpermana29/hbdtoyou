'use client';

import React, { useEffect, useRef, useState } from 'react';

/** Delay between one word starting to rise and the next, in ms. */
const WORD_STAGGER_MS = 45;

/**
 * Word-by-word text reveal: each word sits in its own clipped line box and
 * rises into place from below, one after another, whenever `show` turns on.
 * Hiding resets every word at once so the next reveal starts clean.
 *
 * The text is walked recursively so words inside an accent span keep their
 * colour. Plain spaces stay between the words so the line still wraps.
 */
export function RevealWords({
  children,
  show,
}: {
  children: React.ReactNode;
  show: boolean;
}) {
  let index = 0;

  const walk = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      return node.split(/(\s+)/).map((part, k) => {
        if (part === '') return null;
        if (/^\s+$/.test(part)) return part;
        const delay = index++ * WORD_STAGGER_MS;
        return (
          <span
            key={k}
            className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-top">
            <span
              className={`inline-block ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:transition-none ${
                show
                  ? 'translate-y-0 transition-transform duration-700'
                  : 'translate-y-[115%]'
              }`}
              style={{ transitionDelay: show ? `${delay}ms` : '0ms' }}>
              {part}
            </span>
          </span>
        );
      });
    }
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
      return React.cloneElement(
        node,
        undefined,
        React.Children.map(node.props.children, walk)
      );
    }
    return node;
  };

  return <>{React.Children.map(children, walk)}</>;
}

/**
 * A section headline that reveals word by word as it scrolls into view, and
 * resets when it leaves so it plays again on the way back.
 */
export function RevealHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { rootMargin: '0px 0px -15% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 ref={ref} className={className}>
      <RevealWords show={show}>{children}</RevealWords>
    </h2>
  );
}
