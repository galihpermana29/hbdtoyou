/**
 * The MemoRoll design's own values, named once so nineteen screens cannot drift
 * apart on them. Every number here was read out of the captured design; see
 * docs/design/memoroll/README.md, and `inspect.mjs --colors` for the census
 * these were chosen from.
 *
 * Not a theme and not a Tailwind extension: a plain record, because the screens
 * are ordinary components and the values belong beside them rather than in a
 * config file that the rest of the product also reads.
 */

export const colour = {
  /** The paper ground: landing, gallery, every creator step. */
  paper: '#f7f5f3',
  /** The camera's dark ground, and the ink everything else is written in. */
  ink: '#232323',
  inkSoft: '#212121',
  inkDeep: '#1b1b1b',
  /** The one accent. Shutter, back button, CTA, the wordmark's lozenge. */
  flame: '#ff3e09',
  /** Cream: whatever is selected, and text on the dark ground. */
  cream: '#e0dabf',
  /** The mauve of the shutter dock and the shots counter's outer pill. */
  mauve: '#ae9ea6',
  /**
   * The dark of a pill that is not chosen - the gallery tab and film pill a
   * guest is not on - and of the shots counter's inner card. A shade lighter
   * than the ink so the pill reads as an object on the page rather than a hole
   * in it.
   */
  pill: '#222222',
  /** The orange a Date Stamp is burned into a print's corner in. */
  stamp: '#f17e03',
  /** The Dark Room's red light, the developer bath every print soaks in. */
  redLight: '#c42a00',
  field: '#f7f6f6',
  hairline: '#dadada',
  muted: '#808080',
  /**
   * The unchosen half of a choice - a vibe nobody picked, a Cover Style nobody
   * picked - and the words written on it. The chosen half is the flame, so
   * these two only ever appear beside it.
   */
  unchosen: '#efeae9',
  unchosenInk: '#696969',
  /** The stepper's track, and the mark of a step nobody has reached. */
  track: '#e5e5e5',
  /**
   * The ground a Cover slot waits on until a photograph arrives, and the shade
   * the wordmark tiles across it in.
   *
   * These two are read off the exported frame rather than out of the capture,
   * because the design draws the waiting slot as a raster: it is an IMAGE fill
   * with no colours of its own for `inspect.mjs --colors` to find.
   */
  waiting: '#ffac96',
  waitingMark: '#fbd1c5',
} as const;

/**
 * Type, as the design sets it: almost everything is 150% line height and -1.1%
 * tracking, so the exceptions are what is worth naming.
 *
 * Tracking is expressed in em because the design expresses it in percent, and
 * percent of the font size is what em means.
 */
export const type = {
  /** Screen headings: "Made it to the function?", "Welcome to Memoroll!" */
  heading: 'text-[20px] font-bold leading-[150%] tracking-[-0.011em]',
  /** The countdown's heading, which is semibold where the others are bold. */
  headingSoft: 'text-[20px] font-semibold leading-[150%] tracking-[-0.011em]',
  /** Body copy under a heading. */
  body: 'text-[12px] font-medium leading-[150%] tracking-[-0.011em]',
  /** Field labels: "This you?" */
  label: 'text-[14px] font-semibold leading-[150%] tracking-[-0.011em]',
  /** Button copy, which is regular weight rather than the medium beside it. */
  button: 'text-[12px] font-normal leading-[150%] tracking-[-0.011em]',
  /** The unit under a flip counter: days, hours, Minutes, seconds. */
  unit: 'text-[12px] font-semibold leading-[150%]',
  /** The footer, and only the footer. */
  footer: 'text-[10px] font-normal leading-none',
  /**
   * The smallest thing the design sets: a stepper's number, the name of the
   * step under it, the note beneath a creator's field, the number on a Cover
   * slot still waiting for its photograph.
   */
  mark: 'text-[10px] font-medium leading-[150%] tracking-[-0.011em]',
  /**
   * The creator's welcome, and nothing else: 44px over the dark ground, and the
   * one place the design sets tracking at zero rather than -1.1%.
   *
   * Its leading is 53px rather than the 150% every other line is set at,
   * because the design draws this heading as five separate lines 20 apart
   * rather than as one paragraph. 33 of line and 20 of gap is 53, and that is
   * what a reader sees; 66 would be the same words a third further apart.
   */
  display: 'text-[44px] font-bold leading-[53px] tracking-[0px]',
  /**
   * The number of shots a guest gets, which is the whole of its screen.
   *
   * Its box is 48 tall in the design, under a 64px face, so the digits fill it
   * rather than floating in half a line of air. At 150% the caption twelve
   * pixels below it would sit thirty-six below instead.
   */
  tally: 'text-[64px] font-bold leading-[48px] tracking-[-0.011em]',
} as const;

/**
 * The pair of inner shadows every selection pill wears, chosen or not: the
 * gallery's tabs, the camera's film pills, the circular back button. One
 * string, because a pill whose shadows drifted from its neighbours' would
 * read as a different control.
 */
export const pillShadow =
  'inset 4px 4px 40.9px 12px rgba(0, 0, 0, 0.1), inset 0 -3.6px 5.2px 1px rgba(0, 0, 0, 0.17)';

/** Every screen in the design is a 375-wide phone. */
export const PHONE_WIDTH = 375;
