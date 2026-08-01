/**
 * What the design says the RSVP a guest replies with is.
 *
 * Read from Figma node 312-3846, "RSVP Form", in the Wedding Invitations file,
 * through the plugin bridge. The design is literal truth, including its copy
 * errors: see `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * ## How an element is found
 *
 * The card is a form rather than a composition, so it is found by the parts a
 * form has rather than by the invitation's paragraphs:
 *
 *   body                     the page, which the card holds still while it is
 *                            open, the same way a sealed invitation does
 *   [role=dialog] p          every line of words that names nothing: the card's
 *                            own title, the Optional beside a question, the
 *                            line saying a reply is not saved, and the words
 *                            inside the two controls at the foot of it
 *   [role=dialog] legend     a question with more than one answer under it
 *   [role=dialog] label      a field's name, and each answer, since an answer's
 *                            box is what a guest presses and is therefore the
 *                            label of the radio inside it
 *   [role=dialog] input      the Name a guest types
 *   [role=dialog] textarea   the Guest Message they may leave
 *   [role=dialog] button     Submit and Close
 *
 * The invitation behind the card is not claimed again here. Three screens
 * already assert it, at three sets of Example Content, and a fourth copy of
 * that list would say nothing this screen exists to say.
 *
 * ## What is deliberately not asserted
 *
 * The artwork: the torn paper the card is drawn on and the paperclip holding
 * it are images, and this harness compares computed style. Whether an asset is
 * the one the design draws is a judgement and it stays a person's.
 *
 * What a chosen answer looks like. The design draws each answer once, resting,
 * so it says nothing about a chosen one; the build fills it the way the design
 * fills the one field it drew answered, and that is a reading rather than a
 * claim the design makes.
 *
 * Anything a reply does. That a Guest Message joins the invitation's own, that
 * closing the card changes nothing, and that nothing reaches a network are
 * behaviours, and the only behaviour this harness can hold is `overflow`.
 */

import { declaredPositions } from './declared-positions.mjs';

/** The leading the design asks for, on every line of the card. */
const LEADING = 'normal';

/** Everything the design says about a line of words apart from its size. */
const setting = (fontWeight, color) => ({
  fontWeight,
  lineHeight: LEADING,
  color,
});

/** One line of type, which is all the design says about most of its words. */
const type = (fontSize, fontWeight, color) => ({
  fontSize,
  ...setting(fontWeight, color),
});

/** The name of a field, and the question above a pair of answers. */
const QUESTION = type('12px', 400, '#000000');

/** The small grey aside beside a question, and the note above Submit. */
const ASIDE = type('10px', 600, '#898989');

/**
 * The box the design draws every answer and every field in: a hairline square
 * with 2px of radius, padded 8 and 12. Figma `Frame 37` 312:3863 and `Option`
 * 312:3868, which agree on all of it.
 *
 * The 10 the design also puts between anything inside such a box is claimed on
 * the answers alone, below. A field a guest types into has nothing inside it to
 * space, and a gap asserted where there is nothing to gap would be a number
 * kept true rather than a thing the design says.
 */
const FIELD_BOX = {
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: '#000000',
  borderRadius: '2px',
  padding: '8px 12px',
};

/** The words inside one of those boxes. */
const FIELD_TEXT = type('10px', 400, '#000000');

/**
 * The two controls at the foot of the card, which the design draws square and
 * unrounded rather than as the fields above them. Figma `Frame 19` 312:3881
 * and `Frame 21` 312:3883: one filled black under a near-white hairline, one
 * clear under a black one.
 */
const FOOT_CONTROL = {
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: '0px',
  padding: '10px',
  gap: '10px',
};
const SUBMIT_CONTROL = {
  ...FOOT_CONTROL,
  borderColor: '#fafafa',
  backgroundColor: '#000000',
};
const CLOSE_CONTROL = { ...FOOT_CONTROL, borderColor: '#000000' };

/** Every line of words on the card that names nothing, in the order it draws them. */
const PARAGRAPHS = [
  'Card title',
  'Optional aside',
  'Unsaved note',
  'Submit label',
  'Close label',
];

/** Every question with a pair of answers under it, in order. */
const LEGENDS = ['Attendance question', 'Plus one question'];

/**
 * Every label on the card, in order: a field's name where the design writes one
 * above the box, and the box itself where the design writes the answer inside
 * it.
 */
const LABELS = [
  'Name label',
  'Attending answer',
  'Not attending answer',
  'Plus one yes',
  'Plus one no',
  'Guest Message label',
];

/**
 * The line the card prints that the design does not draw.
 *
 * A reply is held in the page and lost on reload, and the card says so above
 * the control that takes it rather than letting a guest find out afterwards.
 * The deviation is agreed and recorded in
 * `docs/adr/0002-figma-is-literal-truth.md`; the words are claimed here so
 * that they cannot quietly become something vaguer.
 */
const UNSAVED_NOTE =
  'Nothing is saved yet. Your reply stays on this page and goes when you ' +
  'reload it.';

function rsvpExpectations() {
  const { at, everythingWasAskedFor } = declaredPositions({
    paragraphs: PARAGRAPHS,
    legends: LEGENDS,
    labels: LABELS,
  });

  const paragraph = (name, style, copy) => ({
    name,
    select: '[role="dialog"] p',
    nth: at('paragraphs', name),
    text: copy,
    style,
  });

  const legend = (name, copy) => ({
    name,
    select: '[role="dialog"] legend',
    nth: at('legends', name),
    text: copy,
    style: QUESTION,
  });

  const label = (name, style, copy) => ({
    name,
    select: '[role="dialog"] label',
    nth: at('labels', name),
    text: copy,
    style,
  });

  /** An answer's box, which is both what a guest presses and what it says. */
  const answer = (name, copy) =>
    label(name, { ...FIELD_BOX, ...FIELD_TEXT, gap: '10px' }, copy);

  const expectations = [
    {
      // The one thing about this card that is a behaviour rather than an
      // appearance, and the only part of it a computed style can hold: the
      // invitation behind it does not scroll while a guest is replying.
      //
      // This one is the build's decision rather than the design's. The design
      // draws a card and says nothing about the page under it, so usability
      // governs, and what usability says is what every modal says. It is
      // claimed here for the same reason the note above Submit is: a decision
      // taken deliberately should not be able to change by accident.
      //
      // Written first because `body` is the earliest element in the document,
      // and anywhere else the order check would read it as one that had moved.
      name: 'The page, while the RSVP is open',
      select: 'body',
      style: { overflow: 'hidden' },
    },
    paragraph('Card title', type('48px', 400, '#090909'), 'Kindly Reply'),

    label('Name label', QUESTION, 'Name'),
    {
      // The design fills this one box and leaves every other clear, which is
      // what makes the fill its word for a field holding an answer.
      name: 'Name field',
      select: '[role="dialog"] input[type="text"]',
      style: { ...FIELD_BOX, ...FIELD_TEXT, backgroundColor: '#d9d8d6' },
    },

    legend('Attendance question', 'Will you be attending?'),
    answer('Attending answer', 'I wouldn’t miss it for anything!'),
    answer('Not attending answer', 'Sadly can’t make it :('),

    legend('Plus one question', 'Will you be bringing a plus one?'),
    answer('Plus one yes', 'YES'),
    answer('Plus one no', 'NO'),

    label('Guest Message label', QUESTION, 'Message to the happy couple?'),
    paragraph('Optional aside', ASIDE, 'Optional'),
    {
      name: 'Guest Message field',
      select: '[role="dialog"] textarea',
      style: { ...FIELD_BOX, ...FIELD_TEXT },
    },

    paragraph('Unsaved note', ASIDE, UNSAVED_NOTE),
    {
      name: 'Submit control',
      select: '[role="dialog"] button',
      withText: 'Submit',
      style: SUBMIT_CONTROL,
    },
    paragraph('Submit label', type('12px', 400, '#fafafa'), 'Submit'),
    {
      name: 'Close control',
      select: '[role="dialog"] button',
      withText: 'Close',
      style: CLOSE_CONTROL,
    },
    paragraph('Close label', type('12px', 400, '#000000'), 'Close'),
  ];

  everythingWasAskedFor();
  return expectations;
}

export const expectations = rsvpExpectations();
