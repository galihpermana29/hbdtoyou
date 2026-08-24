/**
 * Step one: what kind of event this is (creator-02 in the capture, Figma node
 * 442:11307).
 *
 * Three answers, and only the first is a wedding. That is the whole evidence
 * for MemoRoll being its own product rather than a section of an invitation
 * (ADR 0007), so all three are asserted by their words.
 *
 * Chosen and unchosen are asserted as boxes as well as words, because the
 * design expresses the choice twice - a wash of the flame under a hairline of
 * it, against the warm grey of everything nobody picked - and a build that got
 * only the words right would read as no choice having been made.
 */

import { body, COLOUR } from './memoroll.mjs';
import { creatorStep, CREATOR_COLOUR } from './memoroll-creator.mjs';

/**
 * The design stretches its chosen-pill gradient nearly four times the pill's
 * width, so only its first quarter is ever drawn. This is that quarter, which
 * is what a browser is asked to draw and therefore what it reports.
 */
const CHOSEN_WASH =
  'linear-gradient(90deg, rgba(239, 234, 233, 0) 0%, rgba(243, 188, 173, 0.268) 100%)';

const vibeRow = (nth, chosen) => ({
  name: `vibe ${nth + 1}, ${chosen ? 'chosen' : 'not chosen'}`,
  select: 'button[aria-pressed]',
  nth,
  style: {
    backgroundColor: chosen ? 'transparent' : CREATOR_COLOUR.unchosen,
    backgroundImage: chosen ? CHOSEN_WASH : 'none',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: chosen ? COLOUR.flame : 'transparent',
    padding: '7px 16px',
  },
});

export const expectations = creatorStep(
  {
    step: 1,
    name: 'Choose your vibe',
    heading: 'This Memoroll is for?',
    blurb: 'Tell us the vibe of the moments you want to capture',
  },
  [
    {
      name: 'the question above the answers',
      withText: 'What’s the vibe?',
      style: body(14, 600, COLOUR.black),
    },
    vibeRow(0, true),
    {
      name: 'the wedding answer',
      withText: 'Romantic & timeless (Wedding)',
      style: body(12, 400, COLOUR.flame),
    },
    vibeRow(1, false),
    {
      name: 'the birthday answer',
      withText: 'Fun & spontaneous (Birthday)',
      style: body(12, 400, CREATOR_COLOUR.unchosenInk),
    },
    vibeRow(2, false),
    {
      name: 'the little moments answer',
      withText: 'For all the little moments (Trips, Parties, Gatherings)',
      style: body(12, 400, CREATOR_COLOUR.unchosenInk),
    },
  ]
);
