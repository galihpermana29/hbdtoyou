'use client';

import { useEffect, type RefObject } from 'react';

/**
 * What an invitation is scrolling inside.
 *
 * `'page'` is an invitation that has the window to itself, which is the one a
 * guest is sent: the page is what scrolls.
 *
 * A ref is an invitation drawn inside something that scrolls instead of the
 * page. Play Preview is that: it covers the window with a dialog of its own and
 * the dialog is the scroller, so the page behind it is not what a couple is
 * moving while the dialog runs.
 *
 * Nothing at all is the third answer, and it is the Create Flow's panels: an
 * invitation drawn as a picture beside a form is never scrolled through,
 * because the couple is reading a preview rather than opening an envelope.
 */
export type Scroller = 'page' | RefObject<HTMLElement>;

/**
 * Begin a sealed invitation at the top of its envelope.
 *
 * A sealed invitation is only its envelope: everything below is contained out
 * of the page until it opens, so the whole of what there is to scroll is the
 * 812px the envelope is drawn in. That is short enough for a browser's own
 * scroll restoration to drop somebody halfway down it on a reload, and an
 * envelope met from the middle is not the one the design draws - so the top is
 * asked for rather than assumed.
 *
 * Nothing is asked for once it opens. A guest who has just broken the seal
 * carries on from where the envelope left them, which is the point they were
 * looking at when they pressed.
 */
export function useBeginAtTheTop(
  sealed: boolean,
  scroller: Scroller | undefined
) {
  useEffect(() => {
    if (!sealed || !scroller) return;

    if (scroller === 'page') {
      window.scrollTo(0, 0);
      return;
    }

    // A ref with nothing in it is nothing to scroll. It cannot happen from
    // where this is called - a ref is filled in on commit, before any effect
    // runs, so an invitation handed the element it is drawn inside always finds
    // it - but an empty ref is worth reading as "not yet" rather than as a
    // crash.
    if (scroller.current) {
      scroller.current.scrollTop = 0;
    }
  }, [sealed, scroller]);
}
