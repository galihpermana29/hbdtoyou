'use client';

import { useEffect, type RefObject } from 'react';

/**
 * What an invitation is scrolling inside, and so what holding it still means.
 *
 * `'page'` is an invitation that has the window to itself, which is the one a
 * guest is sent: the page is what scrolls, so the page is what stops.
 *
 * A ref is an invitation drawn inside something that scrolls instead of the
 * page. Play Preview is that: it covers the window with a dialog of its own and
 * the dialog is the scroller, so locking the page there holds still a page
 * nobody was scrolling while the dialog runs on past the envelope.
 *
 * Nothing at all is the third answer, and it is the Create Flow's panels: an
 * invitation drawn as a picture beside a form holds nothing still, because the
 * couple did not ask for an envelope and would be stranded behind one.
 */
export type Scroller = 'page' | RefObject<HTMLElement>;

/**
 * Hold still whatever the invitation scrolls inside, for as long as it is
 * locked, and start it at the top.
 *
 * Where it was scrolled to is deliberately not restored when the lock lets go:
 * a guest who has just opened an envelope carries on from the envelope.
 */
export function useScrollLock(locked: boolean, target: Scroller | undefined) {
  useEffect(() => {
    if (!locked || !target) return;

    // The page's scroller is the document rather than `body`, so the two are
    // told apart: `body` is where the overflow goes, and the window is what
    // gets scrolled back to the top.
    //
    // A ref with nothing in it is nothing to lock. It cannot happen from where
    // this is called - a ref is filled in on commit, before any effect runs, so
    // an invitation handed the element it is drawn inside always finds it - but
    // an empty ref is worth reading as "not yet" rather than as a crash.
    const element = target === 'page' ? document.body : target.current;
    if (!element) return;

    const previous = element.style.overflow;
    element.style.overflow = 'hidden';
    if (target === 'page') {
      window.scrollTo(0, 0);
    } else {
      element.scrollTop = 0;
    }

    return () => {
      element.style.overflow = previous;
    };
  }, [locked, target]);
}
