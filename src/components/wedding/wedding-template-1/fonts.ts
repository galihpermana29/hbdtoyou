import {
  Instrument_Serif,
  Luxurious_Script,
  Public_Sans,
  Sometype_Mono,
} from 'next/font/google';

/**
 * Shared font instances for the Wedding Template 1 ("BNW") gift template.
 * Matches the Figma design (node 312:1631):
 *  - Luxurious Script  -> script section headers ("You're Invited", "Venue & Details", ...)
 *  - Instrument Serif  -> "SAVE THE DATE" display lettering on the card
 *  - Public Sans       -> small uppercase labels ("MANDARIN HOTEL, JAKARTA")
 *  - Sometype Mono     -> body copy, labels, countdown digits
 */
export const luxuriousScript = Luxurious_Script({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-wt1-script',
});

export const sometypeMono = Sometype_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-wt1-mono',
});

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-wt1-serif',
});

export const publicSans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-wt1-sans',
});
