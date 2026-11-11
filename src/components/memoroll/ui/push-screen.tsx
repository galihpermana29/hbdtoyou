'use client';

import { motion, useIsPresent, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, useCallback, useEffect, useRef } from 'react';

/**
 * One screen of a MemoRoll flow inside a push transition (ui/motion.ts).
 *
 * While a push or pop runs, the screen that is leaving is still on the page
 * for the length of the slide. A native stack makes it untouchable at once,
 * and so does this: the moment it starts leaving it is `inert` - no taps, no
 * focus - and hidden from assistive tech, so a fast double-tap on Continue
 * lands on the screen arriving, never on the one going.
 *
 * `forwardRef` because AnimatePresence's popLayout mode measures the leaving
 * screen through its ref.
 */
const PushScreen = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  function PushScreen(props, forwarded) {
    const present = useIsPresent();
    const own = useRef<HTMLDivElement | null>(null);

    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        own.current = node;
        if (typeof forwarded === 'function') forwarded(node);
        else if (forwarded) forwarded.current = node;
      },
      [forwarded]
    );

    // React 18 has no `inert` prop, so the attribute is set on the node.
    useEffect(() => {
      const node = own.current;
      if (!node) return;
      if (present) node.removeAttribute('inert');
      else node.setAttribute('inert', '');
    }, [present]);

    return (
      <motion.div
        ref={ref}
        {...props}
        aria-hidden={present ? undefined : true}
      />
    );
  }
);

export default PushScreen;
