import type { Metadata } from 'next';

import NavigationBar from '@/components/ui/navbar';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import { languageVersions } from '@/lib/page-language';
import { SITE_URL, languageAlternates, pageMeta } from '@/lib/seo';

import MemorollAnnouncementStrip from './announcement-strip';
import { LANDING_COPY, LANDING_VARIANTS, type LandingVariant } from './copy';
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

/**
 * Where the landing answers one search instead of introducing the product
 * (copy.tsx, `LANDING_VARIANTS`). Indonesian only, so no language switch.
 */
export const VARIANT_PAGES: Record<
  LandingVariant,
  { path: string; title: string; label: string; keywords: string[] }
> = {
  wedding: {
    path: '/id/kamera-tamu-pernikahan',
    title: 'Kamera Tamu Pernikahan: Disposable Camera Digital | MemoRoll',
    label: 'Kamera tamu pernikahan',
    keywords: [
      'kamera tamu pernikahan',
      'kamera pernikahan untuk tamu',
      'kamera digital pernikahan',
      'disposable camera pernikahan',
      'disposable camera wedding',
      'kamera sekali pakai pernikahan',
      'kamera analog pernikahan',
      'aplikasi foto tamu undangan',
      'foto tamu pernikahan scan QR',
      'QR foto pernikahan',
      'album foto tamu pernikahan',
      'foto candid pernikahan dari tamu',
      'alternatif photobooth pernikahan',
    ],
  },
};

export function memorollVariantMetadata(variant: LandingVariant): Metadata {
  const page = VARIANT_PAGES[variant];
  return pageMeta({
    path: page.path,
    locale: 'id',
    title: page.title,
    description: LANDING_VARIANTS[variant].metaDescription,
    keywords: { id: page.keywords },
  });
}

/** The variant's questions and its place in the site, for search engines. */
export function memorollVariantStructuredData(variant: LandingVariant) {
  const page = VARIANT_PAGES[variant];
  const copy = LANDING_VARIANTS[variant];
  const url = `${SITE_URL}${page.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: page.title,
        description: copy.metaDescription,
        inLanguage: 'id',
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'MemoRoll',
            item: `${SITE_URL}/id/memoroll`,
          },
          { '@type': 'ListItem', position: 2, name: page.label, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        inLanguage: 'id',
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
  variant,
}: {
  language: LandingLanguage;
  variant?: LandingVariant;
}) {
  return (
    <LandingLanguageProvider
      language={language}
      variant={variant}
      className={`${memorollFonts} ${landingFonts}`}>
      <div className="sticky top-0 z-[100] [--site-strip:40px]">
        <MemorollAnnouncementStrip />
        <NavigationBar
          lang={language}
          languageSwitch={variant ? undefined : VERSIONS}
        />
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
