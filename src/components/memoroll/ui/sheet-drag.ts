'use client';

import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import { useCallback, useRef } from 'react';

/**
 * Drag-to-dismiss for a bottom sheet, the way a native sheet answers a
 * finger (Emil Kowalski, gestures skill):
 *
 * - Track phase: the sheet IS the finger. Downward drags map 1:1 - no
 *   spring, no easing, no React state per move. Upward drags meet rubber
 *   (a tenth of the distance) rather than a wall.
 * - Release: dismiss on distance OR velocity - past 30% of the sheet's
 *   height, or a flick faster than 500px/s - so a quick flick is never
 *   ignored. Otherwise a fast spring snaps it home.
 * - The backdrop's dimness is derived from the same value, so the two can
 *   never drift apart mid-gesture.
 *
 * The sheet's own entrance and exit stay on its outer element; this drives
 * an inner one, so the two never fight over the same transform.
 */
export function useSheetDrag(onClose: () => void) {
  const reduce = useReducedMotion();
  const dragY = useMotionValue(0);
  const height = useRef(1);
  const backdropOpacity = useTransform(dragY, (y) =>
    Math.max(0, Math.min(1, 1 - y / Math.max(1, height.current)))
  );

  const onDragStart = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent) => {
      const sheet = (event.target as HTMLElement | null)?.closest?.(
        '[data-sheet]'
      );
      height.current = sheet?.getBoundingClientRect().height ?? 1;
    },
    []
  );

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const far = info.offset.y > height.current * 0.3;
      const flicked = info.velocity.y > 500;
      if (far || flicked) {
        onClose();
        return;
      }
      animate(dragY, 0, { type: 'spring', duration: 0.35, bounce: 0.15 });
    },
    [dragY, onClose]
  );

  return {
    backdropOpacity,
    dragProps: reduce
      ? {}
      : {
          drag: 'y' as const,
          dragConstraints: { top: 0 },
          dragElastic: { top: 0.1, bottom: 0 },
          dragMomentum: false,
          onDragStart,
          onDragEnd,
          style: { y: dragY, touchAction: 'pan-x' as const },
          'data-sheet': '',
        },
  };
}
