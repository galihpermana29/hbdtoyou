/**
 * Step three: the Cover a guest meets (creator-03 in the capture, Figma node
 * 442:11433).
 *
 * The preview inside the phone is the Cover component itself, shrunk, and most
 * of it is checked on its own screen rather than again here (ADR 0007). What
 * this file holds is the creator's half: the three Cover Styles, the row of
 * slots their photographs go into, and the one thing about the Cover that only
 * a creator ever sees - a slot still waiting for a photograph, numbered to say
 * which upload fills it. The guest's Cover screen cannot check that, because a
 * guest is never sent a Cover with holes in it.
 *
 * The Cover Styles are the same pill in the same two states as the vibe, which
 * is why the wash is written the same way in both files rather than shared: two
 * screens agreeing by accident is worth catching, and a value they both import
 * cannot catch it.
 *
 * The waiting upload slots are dashed where a filled one is solid. That is a
 * `dashPattern` in the capture and it is the whole difference between "press
 * this" and "this is already done", so it is asserted.
 */

import { body, COLOUR } from './memoroll.mjs';
import { creatorStep, CREATOR_COLOUR } from './memoroll-creator.mjs';

const CHOSEN_WASH =
  'linear-gradient(90deg, rgba(239, 234, 233, 0) 0%, rgba(243, 188, 173, 0.268) 100%)';

/**
 * One Cover Style, box and word together.
 *
 * The vibe's answers carry an emoji beside their words, so their pill and their
 * words are two elements there. A Cover Style is only its word, so it is one -
 * and asking twice about one element would be the design claiming a thing comes
 * after itself.
 */
const stylePill = (copy, chosen) => ({
  name: `the ${copy} style, ${chosen ? 'chosen' : 'not chosen'}`,
  withText: copy,
  style: {
    ...body(12, 400, chosen ? COLOUR.flame : CREATOR_COLOUR.unchosenInk),
    backgroundColor: chosen ? 'transparent' : CREATOR_COLOUR.unchosen,
    backgroundImage: chosen ? CHOSEN_WASH : 'none',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: chosen ? COLOUR.flame : 'transparent',
    padding: '7px 16px',
  },
});

/**
 * One upload slot, asked for by the words read out where it has none.
 *
 * A slot's only copy is its number, and a number on this screen is also a
 * stepper mark and a waiting Cover slot, so the accessible name is what
 * separates them - and it is the name a person using a screen reader gets, so
 * checking it is checking something that matters twice.
 */
const uploadSlot = (nth, { filled }) => ({
  name: `upload slot ${nth + 1}, ${filled ? 'filled' : 'waiting'}`,
  select: 'button[aria-label^="Add photo"], button[aria-label^="Change photo"]',
  nth,
  style: {
    borderRadius: '12px',
    borderWidth: '1px',
    borderStyle: filled ? 'solid' : 'dashed',
    borderColor: filled ? 'rgba(0, 0, 0, 0.2)' : 'rgba(33, 33, 33, 0.2)',
  },
});

/**
 * The numbers on the Cover slots still waiting for a photograph.
 *
 * They live inside the phone, which is `inert` because it is a picture of a
 * screen rather than a screen - and `inert` is the only thing in the markup
 * that says so, which makes it the way in. The spans inside it are the four
 * waiting numbers and then the Memoify line, in that order, so the first and
 * the last of the four pin both the count and the size.
 *
 * The size is why this is here at all. The design sets these at 9 inside a
 * preview 142 wide, which is 24 in the Cover's own space - a number a creator
 * can read across the room from the slot it belongs to, not a caption.
 */
const waitingNumber = (number, nth) => ({
  name: `waiting Cover slot ${number}`,
  select: 'div[inert] span',
  nth,
  text: String(number),
  style: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '36px',
    letterSpacing: '-0.264px',
    color: COLOUR.flame,
  },
});

export const expectations = creatorStep(
  {
    step: 3,
    name: 'Make it yours',
    heading: 'Put some photos on',
    blurb: 'Set the cover your guests will see when they scan your QR',
  },
  [
    // The phone stands above everything the creator presses, so its two claims
    // come first: the check compares where things sit as well as what they are.
    waitingNumber(3, 0),
    waitingNumber(6, 3),
    {
      name: 'the Cover Style label',
      withText: 'Cover style',
      style: body(14, 600, COLOUR.black),
    },
    stylePill('Collage', true),
    stylePill('Taped wall', false),
    stylePill('Simple', false),
    {
      name: 'the upload label',
      withText: 'Upload your photo(s)',
      style: body(12, 500, COLOUR.black),
    },
    // The slot the creator is on wears a 2px flame ring and a pencil where the
    // others carry their number, so it is the one filled slot checked as
    // filled-and-chosen rather than as filled.
    {
      name: 'upload slot 1, the one being edited',
      select: 'button[aria-label="Change photo 1"]',
      style: {
        borderRadius: '12px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: COLOUR.flame,
      },
    },
    uploadSlot(1, { filled: true }),
    uploadSlot(2, { filled: false }),
    uploadSlot(3, { filled: false }),
    uploadSlot(4, { filled: false }),
    uploadSlot(5, { filled: false }),
  ]
);
