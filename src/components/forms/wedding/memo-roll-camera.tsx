'use client';

import { useId } from 'react';

/**
 * The camera the design prints behind the MemoRoll question.
 *
 * It is decoration rather than an illustration of anything, so it is drawn here
 * rather than loaded: one shape, one colour, and nothing to fetch or to keep in
 * step with the rest of the flow's imagery.
 *
 * Every coordinate is the design's, read off the exported frame at a 1440px
 * viewport: a 106 by 88 area with the body's top edge 16 down, the viewfinder
 * above it, the lens a little left of the middle, and the whole thing fading out
 * downwards so that it ends before the card does rather than being clipped by
 * it. The lens and the shutter arc are drawn in the card's own white rather than
 * cut out, because the fade would show through a hole and the design's does not.
 */
export default function MemoRollCamera() {
  // The gradient is referenced by id, and an id is unique to a document rather
  // than to a component, so it has to be this instance's.
  const fadeId = useId();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 106 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute bottom-[13px] right-[13px] h-[88px] w-[106px]">
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.2" stopColor="#FADAD1" />
          <stop offset="1" stopColor="#FADAD1" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g fill={`url(#${fadeId})`}>
        {/* The viewfinder, narrowing towards the top. */}
        <path d="M37 2a2 2 0 0 1 2-2h35a2 2 0 0 1 2 2l3 14H34Z" />
        <rect x="0" y="16" width="106" height="72" rx="10" />
      </g>

      <g stroke="#FFFFFF" fill="none" strokeLinecap="round">
        <circle cx="53" cy="53" r="18" strokeWidth="7" />
        <path d="M53 44a9 9 0 0 1 7 14" strokeWidth="5" />
      </g>
      <circle cx="18" cy="34" r="3" fill="#FFFFFF" />
    </svg>
  );
}
