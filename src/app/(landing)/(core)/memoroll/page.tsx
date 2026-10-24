import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';

import { LANDING_COPY } from '@/components/memoroll/landing/copy';
import {
  LANGUAGE_COOKIE,
  resolveLandingLanguage,
} from '@/components/memoroll/landing/language';
import { LandingLanguageProvider } from '@/components/memoroll/landing/language-provider';
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

/** The language the visitor chose, or failing that the one their browser asks for. */
function requestLanguage() {
  return resolveLandingLanguage(
    cookies().get(LANGUAGE_COOKIE)?.value,
    headers().get('accept-language')
  );
}

export function generateMetadata(): Metadata {
  return {
    title: 'MemoRoll | Memoify',
    description: LANDING_COPY[requestLanguage()].metaDescription,
  };
}

/**
 * The MemoRoll landing. The guest viewer lives at `/memoroll/{code}` and the
 * demo at `/memoroll/demo`; this is the page that introduces the product.
 */
export default function MemorollLandingPage() {
  return (
    <LandingLanguageProvider
      initialLanguage={requestLanguage()}
      className={`${memorollFonts} ${landingFonts}`}>
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
    </LandingLanguageProvider>
  );
}
