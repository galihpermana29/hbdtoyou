'use client';

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

/**
 * Renders text that wraps at WORD boundaries only (never mid-word) and steps its
 * font size down just enough to fit its box — both width (so no single word
 * overflows) and an optional maxHeight (so it doesn't grow past the available
 * vertical space). Short values stay at maxFontSize; longer ones wrap by word
 * and/or shrink a little. Re-fits after web fonts load.
 *
 * The container must have a defined width (set one via `className`, e.g. w-[228px]).
 *
 * It draws a paragraph, because what it holds is a line of words the invitation
 * prints and the check finds every one of those as `main p`. A bare `div` left
 * the two partners' Nicknames the one thing on the invitation nothing could
 * name. So `children` has to be words rather than blocks.
 */
export function AutoFitText({
  children,
  maxFontSize,
  minFontSize = 11,
  maxHeight,
  step = 0.5,
  className,
  style,
}: {
  children: ReactNode;
  maxFontSize: number;
  minFontSize?: number;
  maxHeight?: number;
  step?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let size = maxFontSize;
      el.style.fontSize = `${size}px`;
      const fits = () =>
        el.scrollWidth <= el.clientWidth + 0.5 &&
        (maxHeight == null || el.scrollHeight <= maxHeight + 0.5);
      while (size > minFontSize && !fits()) {
        size = Math.max(minFontSize, size - step);
        el.style.fontSize = `${size}px`;
      }
      setFontSize(size);
    };
    fit();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(fit).catch(() => {});
    }
  }, [children, maxFontSize, minFontSize, maxHeight, step]);

  return (
    <p
      ref={ref}
      className={className}
      // normal word wrapping; keep-all prevents mid-word breaks in all cases
      style={{ fontSize: `${fontSize}px`, wordBreak: 'keep-all', ...style }}>
      {children}
    </p>
  );
}
