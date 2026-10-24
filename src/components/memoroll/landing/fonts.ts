import { Caveat } from 'next/font/google';

import { badge, mono } from '@/components/ui/brand-fonts';

/**
 * The three faces the landing's hero prints and badges are written in, on top
 * of the MemoRoll set in `ui/fonts.ts`. Applied on the landing page's own
 * element, so the guest screens do not pay for them. The mono and the badge
 * face are the footer's own (`ui/brand-fonts.ts`), so the page loads them once.
 */

/** What a guest wrote on a print: "first dance!!". */
export const hand = Caveat({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-mr-hand',
});

export const landingFonts = `${hand.variable} ${mono.variable} ${badge.variable}`;
