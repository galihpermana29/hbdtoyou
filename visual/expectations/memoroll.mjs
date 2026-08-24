/**
 * What every MemoRoll guest screen shares, taken from the captured design in
 * `docs/design/memoroll/`.
 *
 * The design sets almost all of its type at 150% line height and -1.1% letter
 * spacing, so those are computed here from the size rather than written out
 * screen by screen, where a typo would read as a design decision.
 *
 * Nothing here asserts a width or a height (ADR 0002).
 */

/** 150% of the size, which is what the design sets nearly everywhere. */
const leading = (size) => `${size * 1.5}px`;

/** -1.1% of the size, the design's own tracking, in the pixels a browser reports. */
const tracking = (size) => `${Math.round(size * -0.011 * 1000) / 1000}px`;

/** Plus Jakarta Sans at one size and weight, with the design's metrics. */
export function body(size, weight, color) {
  return {
    fontSize: `${size}px`,
    fontWeight: weight,
    lineHeight: leading(size),
    letterSpacing: tracking(size),
    color,
  };
}

export const COLOUR = {
  paper: 'rgb(247, 245, 243)',
  ink: 'rgb(35, 35, 35)',
  inkSoft: 'rgb(33, 33, 33)',
  black: 'rgb(0, 0, 0)',
  white: 'rgb(255, 255, 255)',
  flame: 'rgb(255, 62, 9)',
  field: 'rgb(247, 246, 246)',
};

/**
 * The one button the design moves a guest forward with. Its width changes from
 * screen to screen and is therefore not asserted; everything else about it is
 * fixed, including the inner shadow that makes it read as pressed out of the
 * paper rather than laid on it.
 */
export const cta = (copy) => ({
  name: `${copy} button`,
  withText: copy,
  style: {
    ...body(12, 400, COLOUR.white),
    backgroundColor: COLOUR.flame,
    borderRadius: '9999px',
    padding: '10px',
    boxShadow: 'rgba(0, 0, 0, 0.25) 2px 3px 3.2px inset',
  },
});

/**
 * "Created by Memoify.live", the one place Sometype Mono appears, at the foot
 * of every guest screen. The mark beside it is an image and carries no copy, so
 * the line is what the check can hold.
 */
export const memoifyFooter = {
  name: 'Memoify footer',
  withText: 'Created by Memoify.live',
  style: {
    fontSize: '10px',
    fontWeight: 400,
    color: COLOUR.ink,
  },
};
