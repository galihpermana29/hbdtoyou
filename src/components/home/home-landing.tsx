import type { NewTemplate } from '@/lib/new-template';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';

import HomeClosing from './closing';
import HomeFaq from './faq';
import HomeHero from './hero';
import HomeHowItWorks from './how-it-works';
import HomeInspirationPreview from './inspiration-preview';
import HomeLiveDemo from './live-demo';
import HomeNewTemplate from './new-template';
import HomeOccasions from './occasions';
import HomePricing from './pricing';
import HomeProducts from './products';
import HomeStats from './stats';
import HomeTestimonials from './testimonials';

/**
 * memoify.live's home page, in the MemoRoll design system (owner,
 * 2026-11-17). MemoRoll's landing has the arc of prints; this page's own
 * signature is the gift deck in the hero (gift-deck.tsx).
 *
 * The page it replaces, NewLandingPage, is kept in the code and no longer
 * rendered. Two of its blocks are not carried over: the row of studio logos
 * (placeholder artwork, `fictional-*.png`) and the newsletter form, which
 * was never wired to anything.
 */
export default function HomeLanding({
  fresh,
}: {
  /** The template tagged `New`, if any: see lib/new-template.ts. */
  fresh?: NewTemplate | null;
}) {
  return (
    <div className={`${memorollFonts} ${landingFonts}`}>
      <div className="fixed left-0 top-0 z-[1000] w-full isolate">
        <NavigationBar />
      </div>
      <main className="mt-[81px] overflow-x-clip">
        <HomeHero fresh={fresh} />
        <HomeOccasions />
        {fresh ? <HomeNewTemplate fresh={fresh} /> : null}
        <HomeHowItWorks />
        <HomeProducts />
        <HomeLiveDemo />
        <HomeInspirationPreview />
        <HomeStats />
        <HomeTestimonials />
        <HomePricing />
        <HomeFaq />
        <HomeClosing />
      </main>
    </div>
  );
}
