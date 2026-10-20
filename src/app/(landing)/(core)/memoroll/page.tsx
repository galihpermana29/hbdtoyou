import type { Metadata } from 'next';

import MemorollAnnouncementStrip from '@/components/memoroll/landing/announcement-strip';
import MemorollFaq from '@/components/memoroll/landing/faq';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import MemorollHero from '@/components/memoroll/landing/hero';
import MemorollHowItWorks from '@/components/memoroll/landing/how-it-works';
import MemorollIdea from '@/components/memoroll/landing/idea';
import MemorollOccasions from '@/components/memoroll/landing/occasions';
import MemorollPlanCallout from '@/components/memoroll/landing/plan-callout';
import MemorollTestimonials from '@/components/memoroll/landing/testimonials';
import MemorollWhy from '@/components/memoroll/landing/why';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';

export const metadata: Metadata = {
  title: 'MemoRoll | Memoify',
  description:
    'Give every guest a disposable camera and collect the moments you could not be there to see.',
};

/**
 * The MemoRoll landing. The guest viewer lives at `/memoroll/{code}` and the
 * demo at `/memoroll/demo`; this is the page that introduces the product.
 */
export default function MemorollLandingPage() {
  return (
    <div className={`${memorollFonts} ${landingFonts}`}>
      <div className="sticky top-0 z-[100] [--site-strip:40px]">
        <MemorollAnnouncementStrip />
        <NavigationBar />
      </div>
      <main className="overflow-x-clip">
        <MemorollHero />
        <MemorollIdea />
        <MemorollHowItWorks />
        <MemorollWhy />
        <MemorollOccasions />
        <MemorollTestimonials />
        <MemorollFaq />
        <MemorollPlanCallout />
      </main>
    </div>
  );
}
