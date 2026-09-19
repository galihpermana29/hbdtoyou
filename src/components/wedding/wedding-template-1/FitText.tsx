'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Renders a single line of text that is always horizontally centered and scaled
 * down (never up) to fit within `maxWidth`. Used for user-supplied content on
 * the fixed-size template cards (couple names, venue, etc.) so long values stay
 * centered and inside the card instead of overflowing.
 *
 * Re-measures after web fonts load, since the script/serif faces change width.
 *
 * Typography belongs to the box a caller puts this in, not to this. Both spans
 * take their face and size from that box, so the line lands on the y the box
 * states rather than on a line box sized by some other font. This is why there
 * is no `className`: `globals.css` names a face on `*`, which reaches any
 * element no class of its own targets, so both spans have to say `inherit` in a
 * style attribute to get out of its way - and a style attribute would then beat
 * anything a caller passed as a class.
 */
export function FitText({
  children,
  maxWidth,
}: {
  children: ReactNode;
  maxWidth: number;
}) {
  const innerRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => {
      // scrollWidth reflects the natural (untransformed) line width.
      const natural = el.scrollWidth;
      setScale(natural > maxWidth && natural > 0 ? maxWidth / natural : 1);
    };
    measure();
    // Custom fonts reflow the text once loaded - re-measure then.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
  }, [children, maxWidth]);

  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'inherit',
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}>
      <span
        ref={innerRef}
        style={{
          display: 'inline-block',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}>
        {children}
      </span>
    </span>
  );
}
