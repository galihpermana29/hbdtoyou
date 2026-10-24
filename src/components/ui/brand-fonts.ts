import { DM_Mono, Passion_One } from 'next/font/google';

/**
 * The two faces the site footer shares with the MemoRoll landing. Each is
 * loaded once, here, so a page that shows both downloads each family once.
 */

/** Everything the camera prints about itself ("EXP 16/27"), and the footer's labels. */
export const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mr-label',
});

/** The footer wordmark and the landing's photo count badge, in Regular. */
export const badge = Passion_One({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-mr-badge',
});
