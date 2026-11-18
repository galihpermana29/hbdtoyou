import type { Metadata } from 'next';

import NavigationBar from '@/components/ui/navbar';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import { languageVersions } from '@/lib/page-language';
import { languageAlternates, pageMeta } from '@/lib/seo';

import MemorollAnnouncementStrip from './announcement-strip';
import { LANDING_COPY } from './copy';
import MemorollFaq from './faq';
import { landingFonts } from './fonts';
import MemorollHero from './hero';
import MemorollHowItWorks from './how-it-works';
import MemorollIdea from './idea';
import type { LandingLanguage } from './language';
import { LandingLanguageProvider } from './language-provider';
import MemorollOccasions from './occasions';
import MemorollPlanCallout from './plan-callout';
import MemorollTestimonials from './testimonials';
import MemorollWhy from './why';

/**
 * The MemoRoll landing, in either language: `/memoroll` renders it in
 * English and `/id/memoroll` in Indonesian (lib/page-language.ts). The
 * guest viewer lives at `/memoroll/{code}` and the demo at `/memoroll/demo`;
 * this is the page that introduces the product.
 */

const VERSIONS = languageVersions('/memoroll')!;

const TITLE: Record<LandingLanguage, string> = {
  en: 'MemoRoll: A Shared Camera for Your Event (Kamera Tamu) | Memoify',
  // What people type: a camera for wedding guests. The product's name comes
  // second, because nobody searches for a name they have not heard yet.
  id: 'Kamera Tamu Pernikahan Digital, Cukup Scan QR | MemoRoll',
};

export function memorollMetadata(language: LandingLanguage): Metadata {
  return pageMeta({
    path: VERSIONS[language],
    locale: language,
    title: TITLE[language],
    description: LANDING_COPY[language].metaDescription,
    keywords: {
      en: [
        'disposable camera app',
        'wedding guest photo app',
        'event photo sharing',
        'QR code photo album',
      ],
      id: [
        'kamera tamu pernikahan',
        'kamera pernikahan untuk tamu',
        'kamera digital pernikahan',
        'disposable camera pernikahan',
        'disposable camera wedding',
        'kamera sekali pakai pernikahan',
        'kamera disposable digital',
        'aplikasi foto tamu undangan',
        'foto tamu pernikahan scan QR',
        'QR foto pernikahan',
        'album foto tamu pernikahan',
        'foto candid pernikahan dari tamu',
        'kamera untuk acara',
        'alternatif photobooth pernikahan',
      ],
    },
    languages: languageAlternates(VERSIONS),
  });
}

export default function MemorollLanding({
  language,
}: {
  language: LandingLanguage;
}) {
  return (
    <LandingLanguageProvider
      language={language}
      className={`${memorollFonts} ${landingFonts}`}>
      <div className="sticky top-0 z-[100] [--site-strip:40px]">
        <MemorollAnnouncementStrip />
        <NavigationBar lang={language} languageSwitch={VERSIONS} />
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
