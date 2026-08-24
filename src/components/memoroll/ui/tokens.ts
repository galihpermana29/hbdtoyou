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
  field: '#f7f6f6',
  hairline: '#dadada',
  muted: '#808080',
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
} as const;

/** Every screen in the design is a 375-wide phone. */
export const PHONE_WIDTH = 375;
