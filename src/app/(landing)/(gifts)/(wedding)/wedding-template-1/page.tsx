import {
  EXAMPLE_CONTENT_PARAM,
  addresseeFrom,
  ADDRESSEE_PARAM,
  exampleContent,
} from '@/components/wedding/wedding-template-1/example-content';
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
 * Which set of Example Content it renders is asked for by a query parameter,
 * and a visitor who asks for nothing gets the flattering set, so the Showcase
 * is unchanged for them. The other two exist so that the template can be seen
 * against content it was not designed for: today by a person typing the
 * parameter, and by the check once it renders all three, which is `hbd-a09.3`.
 * The parameter goes when this route fetches a real invitation instead.
 *
 * Reading a query parameter is what makes this route render per request rather
 * than once at build time. That is the price of the parameter and it leaves
 * with it.
 *
 * The words are handed over here; the photographs are not yet. The designer's
 * example photographs are still the fallback inside each section, so they reach
 * a couple's own invitation too, when the Showcase is the one place they
 * belong. Sorting a Frame from a photograph, and moving the photographs into
 * Example Content behind it, is `hbd-a09.10`.
 *
 * Sealed, and the page is what it scrolls: this route is the invitation and has
 * the window to itself, so nothing below the envelope is part of the page
 * before somebody opens it.
 */
export default function WeddingTemplate1ShowcasePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const fontVars = `${luxuriousScript.variable} ${sometypeMono.variable} ${instrumentSerif.variable} ${publicSans.variable}`;

  return (
    <div className={`${fontVars} bg-black`}>
      <WeddingTemplate1
        content={exampleContent(searchParams[EXAMPLE_CONTENT_PARAM])}
        addressee={addresseeFrom(searchParams[ADDRESSEE_PARAM])}
        sealed
        scrollsInside="page"
        showVinylWidget
      />
    </div>
  );
}
