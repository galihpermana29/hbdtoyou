'use client';

import {
  useLayoutEffect,
  useRef,
  useState,
  type DependencyList,
  type RefObject,
} from 'react';

/** How much smaller each step down is. Half a pixel is below noticing. */
const STEP = 0.5;

/**
 * Steps one font size down from `maxFontSize` until `fits` is satisfied, and
 * hands back the element to measure and the size it settled on.
 *
 * What "fits" means is deliberately not decided here. That is the whole of the
 * difference between fitting one paragraph to its own box and fitting a column
 * of them to theirs, and it belongs to the caller. Everything else is the same
 * either way and is here: starting from the ceiling rather than from the last
 * answer, so a size that once stepped down can step back up when the words get
 * shorter; stopping at the floor rather than shrinking words past reading;
 * measuring in a layout effect, so a guest never sees the overflowing size; and
 * measuring again once the web fonts arrive, since the script and mono faces
 * change width when they do.
 *
 * `refitOn` is what the caller says has changed: the words, and the box they
 * are being fitted to. A fit is a pure function of those and of the page's own
 * layout, so re-running one when nothing has changed costs a reflow and
 * settles on the same size.
 */
export function useFitFontSize<E extends HTMLElement>({
  maxFontSize,
  minFontSize,
  fits,
  refitOn,
}: {
  maxFontSize: number;
  minFontSize: number;
  fits: (element: E) => boolean;
  refitOn: DependencyList;
}): { ref: RefObject<E>; fontSize: number } {
  const ref = useRef<E>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const fit = () => {
      let size = maxFontSize;
      element.style.fontSize = `${size}px`;
      while (size > minFontSize && !fits(element)) {
        size = Math.max(minFontSize, size - STEP);
        element.style.fontSize = `${size}px`;
      }
      setFontSize(size);
    };
    fit();
    // Custom fonts reflow the text once loaded - re-fit then.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(fit).catch(() => {});
    }
    // `fits` is deliberately not a dependency: it is re-made on every render
    // and would defeat `refitOn`, which is the caller's own statement of when a
    // fit can have changed.
  }, [maxFontSize, minFontSize, ...refitOn]);

  return { ref, fontSize };
}
