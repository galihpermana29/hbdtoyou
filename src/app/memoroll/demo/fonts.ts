import { Homemade_Apple, Plus_Jakarta_Sans, Poppins } from 'next/font/google';

/**
 * Shared font instances for the MemoRoll guest demo.
 * Matches the designer's Figma file "Randos" (.scratch/randos/DESIGN.md):
 *  - Homemade Apple    -> the handwritten film-camera voice (headings, counters)
 *  - Plus Jakarta Sans -> body copy
 *  - Poppins           -> UI labels, buttons, tabs
 */
export const homemadeApple = Homemade_Apple({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-mr-hand',
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mr-body',
});

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-mr-ui',
});

export const memorollFonts = `${homemadeApple.variable} ${plusJakartaSans.variable} ${poppins.variable}`;
