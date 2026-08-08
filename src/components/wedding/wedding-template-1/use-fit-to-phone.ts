'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * How wide the design draws the invitation: one phone, Figma node 312:1631.
 * Every section positions its pieces against this width in pixels, so it is
 * the width the whole composition is right at and the width it is scaled from.
 */
const PHONE_WIDTH = 375;

/**
 * Fit a composition drawn `PHONE_WIDTH` wide into whatever box holds it.
 *
 * The invitation is one 375px-wide composition, positioned rather than flowed,
 * so a box narrower than that - a 320px Android, the Create Flow's Site
 * Preview tray on the phone a couple is holding - used to slice the right
 * edge off instead: "You're Invited" read as "You're Invite". Scaling the
 * whole composition keeps every piece where the design put it, only smaller,
 * which is what a phone mockup is.
 *
 * `zoom` rather than `transform: scale`, because zoom takes part in layout:
 * the page is exactly as long as the scaled invitation, and nothing after it
 * is left floating over the gap a transform would leave. At the design's
 * width and above the zoom is 1 and no style is written at all, so the
 * visual check - driven at 1440 - asserts the unscaled design.
 *
 * The box watched is the element's parent, because the element's own width is
 * what the zoom changes. A browser without `zoom` (Firefox before 126) keeps
 * the old behaviour, clipped rather than scaled, and loses nothing it had.
 */
export function useFitToPhone<T extends HTMLElement>(): {
  frame: React.RefObject<T>;
  style: CSSProperties | undefined;
} {
  const frame = useRef<T>(null);
  const [zoom, setZoom] = useState(1);

  useLayoutEffect(() => {
    const box = frame.current?.parentElement;
    if (!box) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setZoom(width > 0 && width < PHONE_WIDTH ? width / PHONE_WIDTH : 1);
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return { frame, style: zoom < 1 ? { zoom } : undefined };
}
