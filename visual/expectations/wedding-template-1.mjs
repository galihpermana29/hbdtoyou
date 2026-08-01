/**
 * What the design says Wedding Template 1 is, as a guest reads it.
 *
 * Read from the ten frames Figma node 312-1631 stacks, in the Wedding
 * Invitations file, each one named beside the section it belongs to below.
 * Every value here was read from those frames through the plugin bridge. The
 * design is literal truth, including its copy errors: see
 * `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * Positions are counted by `declared-positions.mjs`, which the Create Flow's
 * manifest uses too.
 *
 * The same list is checked three times, once at each set of Example Content, so
 * that an answer no couple would call unusual cannot quietly move something.
 * That is only possible because nothing here claims a couple's own words. A
 * chapter, a venue, a verse and an account are theirs; what the design owns is
 * the type they are set in, the order they come in, and the words around them.
 * Those are what this file states.
 *
 * ## How an element is found
 *
 * The invitation is one composition per section, positioned rather than flowed,
 * and its markup is paragraphs inside sections. So there are three handles here
 * rather than the Create Flow's list of landmarks:
 *
 *   main > section     one per section, in the order a guest scrolls them
 *   main p             every line of words the invitation prints, in order
 *   main span          a line the template scales down to fit its box
 *
 * A position counted down the page is never written as a number below. Each
 * section declares the paragraphs it prints, in its own order, and every `nth`
 * is derived from those lists - so a line added to an early section is one line
 * in that section's list rather than a renumbering of every line under it. A
 * paragraph declared and never asked for throws, because it would silently
 * shift every position after it and report failures against the wrong elements.
 *
 * A box the design draws around words is found by the words instead, which is
 * the only handle the markup gives it: `{select: 'div', withText: ...}` resolves
 * to the innermost box saying exactly that, and the label inside it is claimed
 * separately as a paragraph. That is why the five bordered controls appear twice
 * each, once as a box and once as a label.
 *
 * ## What is deliberately not asserted
 *
 * The artwork. The envelope, the wax seal, the torn paper, the film strip, the
 * polaroids, the paper grounds and every photograph are images, and this harness
 * compares computed style. Whether an asset is the one the design draws is a
 * judgement and it stays a person's.
 *
 * The two partners' first names in the Introduction. They are the one thing the
 * invitation prints that nothing here can name: the behaviour that fits them to
 * their box draws them in a bare `div`, which is neither a paragraph nor copy
 * the design owns. Giving them a handle belongs with `hbd-a09.6`, the bead that
 * rewrites that section.
 *
 * The size of any line the template fits to its box. The design states 48px for
 * a partner's name and 26.092px for the couple on the Save the Date card, and
 * both are ceilings rather than sizes: a longer name is meant to step down. The
 * two on the card are scaled rather than resized, so their size is stated; the
 * Introduction's are resized, and asserting a size there would fail the fitting
 * behaviour the spec asks for.
 *
 * The countdown's digits, the reception's times, the wedding's date. All are
 * derived from the couple's answers, so only their type is the design's.
 *
 * The first wish's white border, and the paper card behind the MemoRoll control.
 * Both are boxes the design draws and neither says anything of its own, so
 * neither can be found. They are covered by review.
 *
 * Whether a line fits the box it is drawn in. No computed style says a
 * paragraph has overrun the frame around it, so what the three sets catch is an
 * answer that changes what is on the page, what it says, how it is set or where
 * it sits - not one that spills over an edge. That an answer still looks
 * considered at each of the three lengths is a person's judgement, and the
 * screenshots beside the report are what they judge it from.
 *
 * ## Two things the design states that the build does not
 *
 * Worth knowing before reading a run, because they are one decision each rather
 * than the dozens of failures they produce.
 *
 * The design sets every text layer's line height to AUTO, which is the leading
 * the typeface itself asks for, and is written below as `normal`. The build sets
 * 1.5 on all of them, so every block of words is half again as loose as the
 * design draws it.
 *
 * The Photo Sharing section is drawn only when a couple has turned MemoRoll on.
 * All three sets of Example Content have it on, which is what lets one list
 * cover them; a set that turned it off would be a different screen.
 */

import { declaredPositions } from './declared-positions.mjs';

/**
 * The leading the design asks for, on every line of the invitation.
 *
 * Figma states AUTO on every text layer in all ten frames, which means the
 * typeface's own leading and is `normal` in a browser. It is written once here
 * because it is one decision the design made once.
 */
const LEADING = 'normal';

/** The near-white the design sets every script heading in. */
const HEADING_WHITE = 'rgba(250, 250, 250, 0.98)';

/** One line of type, which is all the design says about most of its words. */
const type = (fontSize, fontWeight, color) => ({
  fontSize,
  fontWeight,
  lineHeight: LEADING,
  color,
});

/** A section's name, in the script face, over its rule. */
const SECTION_HEADING = type('48px', 400, HEADING_WHITE);

/** The small word above a section's name: "The", "Our". */
const SECTION_LEAD = type('20px', 400, '#ffffff');

/**
 * A control, which the design draws the same way everywhere: a hairline box
 * around one line of words, padded 10px, with 10px between anything inside it.
 */
const CONTROL_BOX = {
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: '#fafafa',
  padding: '10px',
  gap: '10px',
};

/** The same box where the design fills it black rather than leaving it clear. */
const FILLED_CONTROL_BOX = { ...CONTROL_BOX, backgroundColor: '#000000' };

/** The words inside any of those boxes. */
const CONTROL_LABEL = type('12px', 400, '#fafafa');

/** One chapter of the Love Story, printed on the paper ground. */
const CHAPTER_YEAR = type('12px', 600, '#090909');
const CHAPTER_DASH = type('14px', 600, '#090909');
const CHAPTER_TITLE = type('12px', 600, '#090909');
const CHAPTER_STORY = type('10px', 400, '#090909');

/** One guest's wish, printed on a paper card. */
const WISH_NAME = type('16px', 600, '#000000');
const WISH_DATE = type('10px', 400, '#000000');
const WISH_MESSAGE = type('12px', 400, '#000000');

/** The three chapters, in the order the invitation prints them. */
const CHAPTER_TITLES = {
  proposal: 'On his one knee!',
  meeting: 'The meeting',
  closer: 'Getting serious',
};

/** What every guest's wish says, which is the design's own example wedding. */
const WISHES = [
  {
    who: 'Anin',
    said: 'So happy to celebrate your big day! Wishing you both a lifetime of love and laughter.',
  },
  {
    who: 'John',
    said: 'Cheers to the new Mr. and Mrs.! May your journey together be full of joy.',
  },
  {
    who: 'Jane',
    said: 'Cheers to the new Mr. and Mrs.! May your journey together be full of joy.',
  },
  {
    who: 'Ari',
    said: 'Happy wedding day! Can’t wait to see what the future holds for you both.',
  },
  {
    who: 'Zidane',
    said: 'Cheers to the new Mr. and Mrs.! May your journey together be full of joy.',
  },
];

/** When the design says every one of them was left, which is the same minute. */
const EVERY_WISH_DATED = '05-04-2026 00:21';

/** The four things the invitation counts down, as the design names them. */
const COUNTDOWN = ['days', 'hours', 'minutes', 'seconds'];

/**
 * The ten sections, in the order a guest scrolls them.
 *
 * Each declares the Figma frame it was read from, the ground the design paints
 * behind it, the paragraphs it prints in its own order, and any line the
 * template fits to a box. `paragraphs` and `fitted` are what every position is
 * derived from.
 */
const SECTIONS = [
  {
    name: 'Hero',
    figmaNodeId: '312-1632',
    background: '#090909',
    paragraphs: [
      'Save the Date date',
      'Save the Date S',
      'Save the Date AVE',
      'Save the Date THE DATE',
      'Open Invitation label',
      'Invitation heading',
      'Invitation welcome',
    ],
    fitted: ['Save the Date couple', 'Save the Date venue'],
    // The design's frame draws the control to open the invitation and the cards
    // already out of the envelope at once, which no single state can be. These
    // three screens have opened it, so the control has faded out where a guest
    // is concerned - it is still drawn, and the check compares no opacity. That
    // it is the only thing on a sealed invitation is `hbd-a09.7`'s to assert.
    parts: (invitation) => [
      invitation.paragraph(
        'Save the Date date',
        type('16.699px', 400, '#000000')
      ),
      invitation.paragraph(
        'Save the Date S',
        type('62.62px', 400, '#000000'),
        'S'
      ),
      invitation.paragraph(
        'Save the Date AVE',
        type('46.965px', 400, '#000000'),
        'AVE'
      ),
      invitation.paragraph(
        'Save the Date THE DATE',
        type('46.965px', 400, '#000000'),
        'THE DATE'
      ),
      invitation.fittedLine(
        'Save the Date couple',
        type('26.092px', 400, '#000000')
      ),
      invitation.fittedLine('Save the Date venue', {
        ...type('6.262px', 400, '#000000'),
        // The one line in the invitation the design tracks out: 2% of its size.
        letterSpacing: '0.1252px',
      }),
      {
        name: 'Open Invitation control',
        select: 'button',
        withText: 'Open Invitation',
        style: CONTROL_BOX,
      },
      invitation.paragraph(
        'Open Invitation label',
        CONTROL_LABEL,
        'Open Invitation'
      ),
      invitation.paragraph(
        'Invitation heading',
        type('64px', 400, HEADING_WHITE),
        'You’re Invited'
      ),
      invitation.paragraph(
        'Invitation welcome',
        type('12px', 400, '#ffffff'),
        'As we begin our journey together, we’d love for you to join us in ' +
          'celebrating our big day.'
      ),
    ],
  },
  {
    name: 'Holy Verse',
    figmaNodeId: '312-1645',
    // The one section whose ground is a photograph of paper rather than a
    // colour, so there is nothing here a computed style could be held against.
    background: null,
    paragraphs: ['Holy Verse scripture', 'Holy Verse citation'],
    parts: (invitation) => [
      invitation.paragraph(
        'Holy Verse scripture',
        type('12px', 400, '#090909')
      ),
      invitation.paragraph('Holy Verse citation', type('14px', 600, '#090909')),
    ],
  },
  {
    name: 'Bride & Groom',
    figmaNodeId: '312-1650',
    background: '#090909',
    paragraphs: [
      'Bride & Groom lead',
      'Bride & Groom heading',
      'Bride full name',
      'Bride parents lead',
      'Bride parents',
      'Groom full name',
      'Groom parents lead',
      'Groom parents',
    ],
    // The bride first and the groom second, each their name over their parents.
    // Both partners' first names are drawn between the two, and are the one
    // thing here nothing can name: see the note at the top of this file.
    parts: (invitation) => [
      invitation.paragraph('Bride & Groom lead', SECTION_LEAD, 'The'),
      invitation.paragraph(
        'Bride & Groom heading',
        SECTION_HEADING,
        'Bride & Groom'
      ),
      invitation.paragraph('Bride full name', type('10px', 400, '#ffffff')),
      invitation.paragraph(
        'Bride parents lead',
        type('8px', 400, '#ffffff'),
        'Daughter of'
      ),
      invitation.paragraph('Bride parents', type('10px', 600, '#ffffff')),
      invitation.paragraph('Groom full name', type('10px', 400, '#ffffff')),
      invitation.paragraph(
        'Groom parents lead',
        type('8px', 400, '#ffffff'),
        'Son of'
      ),
      invitation.paragraph('Groom parents', type('10px', 600, '#ffffff')),
    ],
  },
  {
    name: 'Love Story',
    figmaNodeId: '312-1687',
    background: '#090909',
    // The design prints the proposal in the middle of the page and the other
    // two down the side, and the middle one is drawn first. So the order the
    // three chapters are read in is not the order they happened in, which is
    // the design's arrangement rather than a mistake in this list.
    paragraphs: [
      'Love Story lead',
      'Love Story heading',
      'Polaroid prompt',
      ...chapterParagraphs('proposal'),
      ...chapterParagraphs('meeting'),
      ...chapterParagraphs('closer'),
    ],
    parts: (invitation) => [
      invitation.paragraph('Love Story lead', SECTION_LEAD, 'Our'),
      invitation.paragraph('Love Story heading', SECTION_HEADING, 'Love Story'),
      invitation.paragraph(
        'Polaroid prompt',
        type('10px', 600, '#ffffff'),
        'tap to reveal'
      ),
      ...chapter(invitation, 'proposal'),
      ...chapter(invitation, 'meeting'),
      ...chapter(invitation, 'closer'),
    ],
  },
  {
    name: 'Venue & Details',
    figmaNodeId: '312-1651',
    background: '#292929',
    paragraphs: [
      'Venue & Details heading',
      'Venue name',
      'Venue address',
      'View Location label',
      ...COUNTDOWN.flatMap((unit) => [
        `Countdown ${unit}`,
        `Countdown ${unit} unit`,
      ]),
      'Wedding date',
      'Reception lead',
      'Reception time',
      'RSVP label',
    ],
    // View Location is a box rather than a link here, and deliberately: the
    // section draws a link only when the couple has given a maps address, and
    // no set of Example Content gives one, so all three render the same shape.
    parts: (invitation) => [
      invitation.paragraph(
        'Venue & Details heading',
        SECTION_HEADING,
        'Venue & Details'
      ),
      invitation.paragraph('Venue name', type('12px', 600, '#ffffff')),
      invitation.paragraph('Venue address', type('10px', 400, '#ffffff')),
      {
        name: 'View Location control',
        select: 'div',
        withText: 'View Location',
        style: CONTROL_BOX,
      },
      invitation.paragraph(
        'View Location label',
        CONTROL_LABEL,
        'View Location'
      ),
      ...COUNTDOWN.flatMap((unit) => [
        invitation.paragraph(`Countdown ${unit}`, type('24px', 600, '#ffffff')),
        invitation.paragraph(
          `Countdown ${unit} unit`,
          type('16px', 600, '#ffffff'),
          unit
        ),
      ]),
      invitation.paragraph('Wedding date', type('14px', 400, '#ffffff')),
      invitation.paragraph(
        'Reception lead',
        type('12px', 600, '#ffffff'),
        'Reception Starts'
      ),
      invitation.paragraph('Reception time', type('12px', 400, '#ffffff')),
      {
        name: 'RSVP control',
        select: 'div',
        withText: 'RSVP Now',
        style: CONTROL_BOX,
      },
      invitation.paragraph('RSVP label', CONTROL_LABEL, 'RSVP Now'),
    ],
  },
  {
    name: 'Messages',
    figmaNodeId: '312-1742',
    background: '#090909',
    // Five wishes, and every word of them is the design's own example: nobody
    // has left one yet, because there is nothing to leave one with. The RSVP
    // that replaces them is `hbd-a09.9`, and this list changes when it lands.
    paragraphs: [
      'Messages heading',
      ...WISHES.flatMap((wish) => [
        `${wish.who}'s name`,
        `${wish.who}'s date`,
        `${wish.who}'s wish`,
      ]),
    ],
    parts: (invitation) => [
      invitation.paragraph('Messages heading', SECTION_HEADING, 'Messages'),
      ...WISHES.flatMap((wish) => [
        invitation.paragraph(`${wish.who}'s name`, WISH_NAME, wish.who),
        invitation.paragraph(`${wish.who}'s date`, WISH_DATE, EVERY_WISH_DATED),
        invitation.paragraph(`${wish.who}'s wish`, WISH_MESSAGE, wish.said),
      ]),
    ],
  },
  {
    name: 'Send a Token of Love',
    figmaNodeId: '312-1786',
    background: '#292929',
    paragraphs: [
      'Token of Love heading',
      'Token of Love message',
      'Thank You',
      'Account holder',
      'Account number',
      'Copy label',
    ],
    parts: (invitation) => [
      invitation.paragraph(
        'Token of Love heading',
        SECTION_HEADING,
        'Send a Token of Love'
      ),
      invitation.paragraph(
        'Token of Love message',
        type('12px', 400, '#ffffff')
      ),
      invitation.paragraph(
        'Thank You',
        type('32px', 400, '#000000'),
        'Thank You'
      ),
      invitation.paragraph('Account holder', type('12px', 500, '#000000')),
      invitation.paragraph('Account number', type('16px', 600, '#000000')),
      {
        // The one control that does something on this screen, and the only one
        // the build makes a button. At rest it says "copy"; for two seconds
        // after it has worked it says "copied", which the design never draws.
        name: 'Copy control',
        select: 'button',
        withText: 'copy',
        style: FILLED_CONTROL_BOX,
      },
      invitation.paragraph('Copy label', CONTROL_LABEL, 'copy'),
    ],
  },
  {
    name: 'Photo Sharing',
    figmaNodeId: '312-1734',
    background: '#292929',
    paragraphs: [
      'Photo Sharing invitation',
      'Photo Sharing reassurance',
      'Disposable Camera label',
    ],
    parts: (invitation) => [
      invitation.paragraph(
        'Photo Sharing invitation',
        type('12px', 400, '#ffffff'),
        'We want your perspective from our wedding! Join through the link ' +
          'below to submit all the moments once the wedding concludes'
      ),
      invitation.paragraph(
        'Photo Sharing reassurance',
        type('12px', 500, '#ffffff'),
        'No app download required'
      ),
      {
        name: 'Disposable Camera control',
        select: 'div',
        withText: 'Get My Disposable Camera',
        style: FILLED_CONTROL_BOX,
      },
      invitation.paragraph(
        'Disposable Camera label',
        CONTROL_LABEL,
        'Get My Disposable Camera'
      ),
    ],
  },
  {
    // The one section with no words at all: five photographs, cropped by the
    // frame around them. Its ground is the only thing here the design states.
    name: 'Gallery',
    figmaNodeId: '312-1807',
    background: '#fafafa',
    paragraphs: [],
    parts: () => [],
  },
  {
    name: 'Footer',
    figmaNodeId: '312-1813',
    background: '#e23f12',
    paragraphs: ['Memoify credit'],
    parts: (invitation) => [
      {
        // The credit and the mark beside it, 12px apart.
        name: 'Memoify credit row',
        select: 'div',
        withText: 'Created by Memoify.live',
        style: { gap: '12px' },
      },
      invitation.paragraph(
        'Memoify credit',
        type('10px', 400, '#fafafa'),
        'Created by Memoify.live'
      ),
    ],
  },
];

/** What one chapter of the Love Story prints, in order. */
function chapterParagraphs(chapter) {
  return [
    `${chapter} year`,
    `${chapter} dash`,
    `${chapter} title`,
    `${chapter} story`,
  ];
}

/**
 * One chapter: the year, the dash between, the design's own title, the story.
 *
 * The title is the design's rather than the couple's. The form asks three
 * questions with three sets of words of its own and offers no way to add a
 * fourth, so what a chapter is called is not something anybody types.
 */
function chapter(invitation, name) {
  return [
    invitation.paragraph(`${name} year`, CHAPTER_YEAR),
    invitation.paragraph(`${name} dash`, CHAPTER_DASH, '-'),
    invitation.paragraph(`${name} title`, CHAPTER_TITLE, CHAPTER_TITLES[name]),
    invitation.paragraph(`${name} story`, CHAPTER_STORY),
  ];
}

/**
 * Which span of a fitted line holds its words, counted among all of them.
 *
 * Such a line is drawn as two spans, one inside the other: the outer carries
 * the scale, the inner the words. So the words of the first fitted line on the
 * page are the second span, of the next the fourth, and so on.
 */
const wordsOfFittedLine = (line) => line * 2 + 1;

/**
 * Where everything the invitation prints is counted from.
 *
 * Every `nth` below is an index into one of two lists gathered from the
 * sections, in the order the sections declare them. The counting itself, and
 * both of the mistakes it guards against, are `declared-positions.mjs`.
 */
function positions() {
  const paragraphs = SECTIONS.flatMap((section) => section.paragraphs);
  const fitted = SECTIONS.flatMap((section) => section.fitted ?? []);
  const { at, everythingWasAskedFor } = declaredPositions({
    paragraphs,
    'fitted lines': fitted,
  });

  return {
    everythingWasAskedFor,

    /**
     * One line of words the invitation prints.
     *
     * `copy` is given only where the words are the design's. A couple's own
     * answer is claimed for its type and its place and for nothing else, which
     * is what lets one list be checked at three sets of Example Content.
     */
    paragraph: (name, style, copy) => ({
      name,
      select: 'main p',
      nth: at('paragraphs', name),
      ...(copy === undefined ? {} : { text: copy }),
      style,
    }),

    /**
     * A line the template scales down until it fits its box.
     *
     * Drawn as one span inside another: the outer one carries the scale, the
     * inner one the words, and both take their size from the box around them -
     * so the size stated for such a line is the size it is set in rather than
     * the size it ends up drawn at. The inner one is claimed here, because it
     * is the one holding the words.
     */
    fittedLine: (name, style) => ({
      name,
      select: 'main span',
      nth: wordsOfFittedLine(at('fitted lines', name)),
      style,
    }),
  };
}

function invitationExpectations() {
  const invitation = positions();

  const expectations = SECTIONS.flatMap((section, index) => [
    {
      name: `${section.name} section`,
      select: 'main > section',
      nth: index,
      style:
        section.background === null
          ? {}
          : { backgroundColor: section.background },
    },
    ...section.parts(invitation),
  ]);

  invitation.everythingWasAskedFor();
  return expectations;
}

export const expectations = invitationExpectations();
