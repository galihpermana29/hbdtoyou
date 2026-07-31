'use client';

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

/**
 * Renders a single line of text that is always horizontally centered and scaled
 * down (never up) to fit within `maxWidth`. Used for user-supplied content on
 * the fixed-size template cards (couple names, venue, etc.) so long values stay
 * centered and inside the card instead of overflowing.
 *
 * Re-measures after web fonts load, since the script/serif faces change width.
 */
export function FitText({
  children,
  maxWidth,
  className,
  style,
  origin = 'center',
}: {
  children: ReactNode;
  maxWidth: number;
  className?: string;
  style?: CSSProperties;
  /** Anchor the down-scaling: 'center' (default), 'left', or 'right'. */
  origin?: 'center' | 'left' | 'right';
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
    // Custom fonts reflow the text once loaded — re-measure then.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
  }, [children, maxWidth]);

  return (
    <span
      style={{
        display: 'inline-block',
        transform: `scale(${scale})`,
        transformOrigin:
          origin === 'left'
            ? 'left center'
            : origin === 'right'
              ? 'right center'
              : 'center',
        ...style,
      }}>
      <span
        ref={innerRef}
        className={className}
        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {children}
      </span>
    </span>
  );
}
