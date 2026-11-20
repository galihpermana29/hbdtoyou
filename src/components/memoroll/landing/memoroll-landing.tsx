import type { Metadata } from 'next';

import NavigationBar from '@/components/ui/navbar';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import { languageVersions } from '@/lib/page-language';
import { SITE_URL, languageAlternates, pageMeta } from '@/lib/seo';

import MemorollAnnouncementStrip from './announcement-strip';
import { LANDING_COPY } from './copy';
import { FREE_UNTIL } from './free-slot';
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
 * English and `/id/kamera-tamu-pernikahan` in Indonesian
 * (lib/page-language.ts; `/id/memoroll` redirects there). The
 * guest viewer lives at `/memoroll/{code}` and the demo at `/memoroll/demo`;
 * this is the page that introduces the product.
 */

const VERSIONS = languageVersions('/memoroll')!;

const TITLE: Record<LandingLanguage, string> = {
  en: 'MemoRoll: Digital Disposable Camera for Wedding Guests | Memoify',
  // What people type: a camera for wedding guests. The product's name comes
  // second, because nobody searches for a name they have not heard yet.
  id: 'Kamera Tamu Pernikahan & Kamera Sekali Pakai Digital | MemoRoll',
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
        'kamera sekali pakai digital',
        'kamera tamu pernikahan gratis',
        'kamera analog pernikahan',
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

/**
 * What the page tells search engines beside its words: that MemoRoll is an
 * app with a price (free, until `FREE_UNTIL`), how it is used (the host's
 * three steps, as on the page), where the page sits in the site, and its
 * questions, which are on the page as text too (faq.tsx).
 */
export function memorollStructuredData(language: LandingLanguage) {
  const copy = LANDING_COPY[language];
  const url = `${SITE_URL}${VERSIONS[language]}`;
  const home = language === 'id' ? `${SITE_URL}/id` : SITE_URL;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: TITLE[language],
        description: copy.metaDescription,
        inLanguage: language,
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'MemoRoll',
        url,
        applicationCategory: 'PhotographyApplication',
        operatingSystem: 'Any (runs in the phone browser)',
        description: copy.metaDescription,
        inLanguage: language,
        publisher: { '@id': `${SITE_URL}/#organization` },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IDR',
          priceValidUntil: FREE_UNTIL,
          availability: 'https://schema.org/LimitedAvailability',
          url,
        },
      },
      {
        '@type': 'HowTo',
        name:
          language === 'id'
            ? 'Cara pakai MemoRoll di acaramu'
            : 'How to run MemoRoll at your event',
        inLanguage: language,
        step: copy.how.host.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.heading,
          text: step.body,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Memoify', item: home },
          {
            '@type': 'ListItem',
            position: 2,
            name: language === 'id' ? 'Kamera tamu pernikahan' : 'MemoRoll',
            item: url,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        inLanguage: language,
        mainEntity: copy.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };
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
