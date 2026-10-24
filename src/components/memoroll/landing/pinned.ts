/**
 * How tall the landing's sticky header is: the 40px announcement strip over
 * the 80px navigation bar. A pinned section sticks below it, not under it, so
 * it fills what is left of the screen.
 */
export const HEADER_HEIGHT = 120;

/** Where a pinned section's sticky stage sits and how tall it is. */
export const PINNED_STAGE: React.CSSProperties = {
  top: HEADER_HEIGHT,
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
};

/**
 * The stretch of scroll a pinned section's progress runs over: from its track
 * reaching the foot of the header to its end reaching the foot of the screen.
 */
export const PINNED_OFFSET: [`start ${number}px`, 'end end'] = [
  `start ${HEADER_HEIGHT}px`,
  'end end',
];
