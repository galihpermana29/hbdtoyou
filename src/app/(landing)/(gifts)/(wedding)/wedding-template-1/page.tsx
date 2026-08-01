import { DEFAULT_WEDDING_TEMPLATE_1_CONTENT } from '@/components/forms/wedding/wedding-invitation-types';
import WeddingTemplate1 from '@/components/wedding/wedding-template-1/WeddingTemplate1';
import {
  instrumentSerif,
  luxuriousScript,
  publicSans,
  sometypeMono,
} from '@/components/wedding/wedding-template-1/fonts';

export const metadata = {
  title: 'Wedding Invitation',
};

/**
 * The Showcase for Wedding Template 1 ("BNW"). Figma node 312:1631.
 *
 * It renders the same template a guest opens, with Example Content passed in
 * rather than written into the sections. Nobody's invitation.
 *
 * The words are handed over here; the photographs are not yet. The designer's
 * example photographs are still the fallback inside each section, so they reach
 * a couple's own invitation too, when the Showcase is the one place they
 * belong. Sorting a Frame from a photograph is `hbd-a09.10`, and putting the
 * photographs into Example Content is `hbd-a09.2`.
 *
 * Sealed, and it locks the page while it is: this route is the invitation, so
 * nothing below the envelope should be reachable before somebody opens it.
 */
export default function WeddingTemplate1ShowcasePage() {
  const fontVars = `${luxuriousScript.variable} ${sometypeMono.variable} ${instrumentSerif.variable} ${publicSans.variable}`;

  return (
    <div className={`${fontVars} bg-black`}>
      <WeddingTemplate1
        content={DEFAULT_WEDDING_TEMPLATE_1_CONTENT}
        sealed
        locksPage
        showVinylWidget
      />
    </div>
  );
}
