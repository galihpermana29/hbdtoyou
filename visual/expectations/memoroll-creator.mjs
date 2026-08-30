/**
 * What every step of the MemoRoll creator flow shares, taken from the captured
 * design in `docs/design/memoroll/`.
 *
 * The design draws the same three bands on all eight: the stepper with the
 * step's own name under it, a heading with a line beneath, and a footer holding
 * Back and whatever moves the creator forward. Those are written once here, so
 * a screen's own file is only the question it asks.
 *
 * Nothing here asserts a width or a height (ADR 0002).
 */

import { body, COLOUR, cta } from './memoroll.mjs';

/** The creator's own colours, beside the ones every guest screen uses. */
export const CREATOR_COLOUR = {
  ...COLOUR,
  /** Whatever nobody chose, and the words on it. */
  unchosen: 'rgb(239, 234, 233)',
  unchosenInk: 'rgb(105, 105, 105)',
  /** The stepper's track, and the mark of a step nobody has reached. */
  track: 'rgb(229, 229, 229)',
  muted: 'rgb(128, 128, 128)',
};

/**
 * Where each mark sits among the stepper's own children.
 *
 * A mark says nothing but its number, and a number is the last thing on these
 * screens that can be found by its copy: "4" is also an upload slot, a Cover
 * slot waiting for a photograph, and half of the shots counter. So the marks
 * are asked for by position inside the stepper and their number is checked as a
 * claim, which is the difference between a copy failure that names two
 * spellings and a hunt for a missing element.
 *
 * The stepper is a row of five things at most: a mark, a bar, a mark, a bar, a
 * mark. The first step has no mark before it and the last has none after, and
 * each pads that side rather than closing up, so the position of the current
 * mark does not move about.
 */
const STEPPER_CHILD = '[role="group"] > span';

function markSeats(step, total) {
  if (step === 1) return { current: 1, after: 3 };
  if (step === total) return { before: 0, current: 2 };
  return { before: 0, current: 2, after: 4 };
}

const mark = (number, nth, lit) => ({
  name: `stepper mark ${number}, ${lit ? 'lit' : 'not yet'}`,
  select: STEPPER_CHILD,
  nth,
  text: String(number),
  style: {
    ...body(10, 500, lit ? COLOUR.white : CREATOR_COLOUR.muted),
    backgroundColor: lit ? COLOUR.flame : CREATOR_COLOUR.track,
    borderRadius: '9999px',
    padding: '4px',
  },
});

/**
 * The name of the step, under its marks.
 *
 * Asked for as the first thing on the page rendering those words, because one
 * step is called "Shots per guest" and so is the caption under its counter.
 */
export const stepName = (copy) => ({
  name: 'the step’s name',
  withText: copy,
  nth: 0,
  style: body(10, 500, COLOUR.black),
});

/** The question the step asks, and the line under it. */
export const stepHeading = (copy) => ({
  name: 'the heading',
  withText: copy,
  style: body(20, 700, COLOUR.ink),
});

export const stepBlurb = (copy) => ({
  name: 'the line under the heading',
  withText: copy,
  style: body(12, 500, COLOUR.ink),
});

/**
 * The Back button, which is the flame CTA drawn on the paper instead of filled
 * with it: same corner, same padding, same inner shadow, hairlined.
 */
export const outlineCta = (copy, name) => ({
  name: name ?? `${copy} button`,
  withText: copy,
  style: {
    ...body(12, 400, COLOUR.ink),
    backgroundColor: COLOUR.paper,
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(33, 33, 33, 0.2)',
    padding: '10px',
    boxShadow: 'rgba(255, 255, 255, 0.25) 2px 3px 3.2px inset',
  },
});

/** A field's label, and the note or hint the design writes around it. */
export const fieldLabel = (copy) => ({
  name: `the "${copy}" label`,
  withText: copy,
  style: body(14, 600, COLOUR.black),
});

/**
 * The smaller line under a field.
 *
 * It takes a position because the design writes the same note under both of the
 * venue step's fields, and two elements rendering one string is an ambiguous
 * claim rather than a satisfied one.
 */
export const fieldNote = (copy, name, nth = 0) => ({
  name,
  withText: copy,
  nth,
  style: body(10, 500, CREATOR_COLOUR.muted),
});

/**
 * The pill a creator types into, asked for as the box that directly holds an
 * input.
 *
 * There is nothing else to find it by: it has no copy of its own, and the label
 * beside it resolves to the input rather than to the box drawn around it. What
 * is typed into it is not asserted, and deliberately - a creator's answer is
 * their content, and the design owns the type it is set in and the words around
 * it rather than the words themselves.
 */
export const fieldPill = (nth, { shaded = false } = {}) => ({
  name: shaded ? `field ${nth + 1}, shaded` : `field ${nth + 1}`,
  select: 'div:has(> input)',
  nth,
  style: {
    backgroundColor: shaded ? CREATOR_COLOUR.unchosen : COLOUR.field,
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    padding: '8px 16px',
  },
});

/** What is typed in it, found by the label beside it. */
export const fieldValue = (label) => ({
  name: `the "${label}" answer`,
  control: label,
  style: body(12, 500, COLOUR.ink),
});

/**
 * A whole ordinary step: the stepper, the heading, whatever it asks, and the
 * footer, in the order the design stacks them.
 *
 * Seven of the eight are exactly this. "Ready to publish" is not, because its
 * footer is three buttons and then a fourth, so it writes its own.
 */
export function creatorStep(
  { step, total = 8, name, heading, blurb, primary = 'Continue', back },
  asks
) {
  const seats = markSeats(step, total);
  const hasBack = back ?? step > 1;

  return [
    ...(seats.before === undefined ? [] : [mark(step - 1, seats.before, true)]),
    mark(step, seats.current, true),
    ...(seats.after === undefined ? [] : [mark(step + 1, seats.after, false)]),
    stepName(name),
    stepHeading(heading),
    ...(blurb ? [stepBlurb(blurb)] : []),
    ...asks,
    ...(hasBack ? [outlineCta('Back')] : []),
    ...(primary ? [cta(primary)] : []),
  ];
}
