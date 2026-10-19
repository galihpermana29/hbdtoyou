import { Caveat, DM_Mono, Passion_One } from 'next/font/google';

/**
 * The three faces the landing's hero prints and badges are written in, on top
 * of the MemoRoll set in `ui/fonts.ts`. Loaded here, and applied on the
 * landing page's own element, so the guest screens do not pay for them.
 */

/** What a guest wrote on a print: "first dance!!". */
export const hand = Caveat({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-mr-hand',
});

/** Everything the camera prints about itself: "EXP 16/27", "ROLL DEVELOPS IN". */
export const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mr-label',
});

/** The photo count badge. Regular weight, where the wordmark is Bold. */
export const badge = Passion_One({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-mr-badge',
});

export const landingFonts = `${hand.variable} ${mono.variable} ${badge.variable}`;
