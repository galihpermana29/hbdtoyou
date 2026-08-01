'use client';

import { type CSSProperties, type ReactNode } from 'react';

import { useFitFontSize } from './use-fit-font-size';

/**
 * Renders text that wraps at WORD boundaries only (never mid-word) and steps its
 * font size down just enough to fit its box - both width (so no single word
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
 *
 * Use `AutoFitBlock` where the words are blocks, and where several of them
 * share one box rather than each having their own.
 */
export function AutoFitText({
  children,
  maxFontSize,
  minFontSize = 11,
  maxHeight,
  className,
  style,
}: {
  children: ReactNode;
  maxFontSize: number;
  minFontSize?: number;
  maxHeight?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, fontSize } = useFitFontSize<HTMLParagraphElement>({
    maxFontSize,
    minFontSize,
    fits: (line) =>
      line.scrollWidth <= line.clientWidth + 0.5 &&
      (maxHeight == null || line.scrollHeight <= maxHeight + 0.5),
    refitOn: [children, maxHeight],
  });

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
