'use client';

import { type ReactNode } from 'react';

import { useFitFontSize } from './use-fit-font-size';

/**
 * Renders a block of lines that wrap at WORD boundaries only (never mid-word)
 * and steps ONE font size down until the whole block fits `maxHeight`. Nothing
 * is clipped and nothing is dropped: the block either fits or it has reached
 * `minFontSize`, and the size it stops at is the size every line inside it is
 * set in.
 *
 * The container must have a defined width (set one via `className`).
 *
 * This is `AutoFitText` for a column rather than a paragraph, and the reason
 * there are two is the word "one". `AutoFitText` fits each paragraph to its own
 * box, which is right when the paragraphs have their own boxes - a partner's
 * full name and their family do - and wrong when they share one. Two chapters
 * down one column share it two ways. A couple who wrote a long first chapter
 * and a short second one would have the first stepped down while the space
 * under the second went unused, and the two would then be set in different
 * sizes one above the other, in the same column, for no reason a reader could
 * see. Fitting the column instead spends its space where the words are, and
 * sets everything in it in one size.
 *
 * Only lines free to wrap take part in the width test, and they are found
 * rather than declared, so `children` has to say its lines as `p` - which the
 * invitation does anyway, because the check finds every line it prints as
 * `main p`. A paragraph the design keeps on one line is sized by its own words,
 * so its `scrollWidth` and `clientWidth` agree whatever it says; a paragraph
 * filling the column reports a word wider than the column as the difference
 * between the two. The test is the same on both and only ever fails on the
 * second. A heading too wide for its column is therefore not this component's
 * to catch, and the caller has to know that its own headings cannot be.
 *
 * Height is the block's `offsetHeight` rather than its `scrollHeight` or its
 * rect, and each of those two is wrong for its own reason. The template reveals
 * its sections by moving them, so a child part-way through a `fadeUp` sits 28px
 * below where it comes to rest, which a scrollable overflow region counts and a
 * border box does not; and a rect is in painted pixels, so a scaled ancestor
 * would silently change what fits. `offsetHeight` is the laid-out box, which is
 * the one the design draws.
 */
export function AutoFitBlock({
  children,
  maxFontSize,
  minFontSize,
  maxHeight,
  className,
}: {
  children: ReactNode;
  maxFontSize: number;
  minFontSize: number;
  maxHeight: number;
  className?: string;
}) {
  const { ref, fontSize } = useFitFontSize<HTMLDivElement>({
    maxFontSize,
    minFontSize,
    fits: (block) =>
      block.offsetHeight <= maxHeight + 0.5 &&
      Array.from(block.querySelectorAll('p')).every(
        (line) => line.scrollWidth <= line.clientWidth + 0.5
      ),
    refitOn: [children, maxHeight],
  });

  return (
    <div
      ref={ref}
      className={className}
      // normal word wrapping; keep-all prevents mid-word breaks in all cases
      style={{ fontSize: `${fontSize}px`, wordBreak: 'keep-all' }}>
      {children}
    </div>
  );
}
