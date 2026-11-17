'use client';

import { useEffect, useState } from 'react';

/**
 * Whether the visitor asked for reduced motion - known only after mount.
 *
 * framer-motion's `useReducedMotion` answers on the very first client
 * render, which the server could not know. Where the answer feeds a
 * `style`, the hydrated markup then differs from the server's, and React
 * keeps the server's attributes without patching them: the element stays in
 * its pre-animation pose for good (found 2026-11-17: the home deck was
 * invisible, and rolling numbers stuck at zero, for exactly the people who
 * asked for less motion). Starting from `false` and correcting in an effect
 * keeps the first render identical on both sides.
 */
export function useCalmMotion() {
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setCalm(query.matches);
    read();
    query.addEventListener('change', read);
    return () => query.removeEventListener('change', read);
  }, []);
  return calm;
}
