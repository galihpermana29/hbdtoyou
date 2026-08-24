import {
  Oooh_Baby,
  Passion_One,
  Plus_Jakarta_Sans,
  Sometype_Mono,
} from 'next/font/google';

/**
 * The four families the MemoRoll design is drawn in, each with exactly one job.
 *
 * They are loaded here rather than globally, and applied on the MemoRoll route's
 * own element, so nothing else in the product changes typeface.
 *
 * The wedding invitation deliberately keeps whatever family the application
 * already sets (ADR 0002), on the grounds that loading a second family for one
 * flow buys a difference nobody would notice. MemoRoll is the exception that
 * proves it: the wordmark and the script event name are not a detail of the
 * brand, they are the brand, and a guest would notice a substitute instantly.
 *
 * Homemade Apple and Poppins are gone. Homemade Apple survives in the captured
 * design only inside the off-canvas leftovers of the camera this work replaces
 * (see docs/design/memoroll/README.md), and rendering it would be rebuilding
 * the old design by accident.
 */

/** Everything structural: headings, body, labels, buttons, counters. */
export const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-mr-body',
});

/** The MEMO·R·LL wordmark, and nothing else. */
export const display = Passion_One({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  variable: '--font-mr-display',
});

/** The event's own name, in script, on every Cover. */
export const script = Oooh_Baby({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-mr-script',
});

/** "Created by Memoify.live" at 10px, and nothing else. */
export const mono = Sometype_Mono({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-mr-mono',
});

export const memorollFonts = `${body.variable} ${display.variable} ${script.variable} ${mono.variable}`;
