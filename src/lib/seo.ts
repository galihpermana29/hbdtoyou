import type { Metadata } from 'next';

import type { IntentPage } from '@/lib/intent-pages';

import type { LanguageVersions } from './page-language';

/**
 * What a search engine is told about a public page, in one place.
 *
 * The site answers on both `memoify.live` and `www.memoify.live`. Without a
 * canonical link a crawler sees two copies of every page and picks one
 * itself. `www` is the address Google already holds and the one the sitemap
 * lists, so every page names it as the original.
 *
 * Visitors search in English and in Indonesian, and the pages are written
 * in English. So the description of each page carries one Indonesian
 * sentence (a description is what a result shows under the title), and the
 * keywords are kept in both languages.
 */
export const SITE_URL = 'https://www.memoify.live';
export const SITE_NAME = 'Memoify';

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763138771/brave_screenshot_memoify.live_lvsx21.png';

/** Said of every page: what Memoify is, in the words people type. */
const SHARED_KEYWORDS = {
  en: [
    'digital gift',
    'online gift',
    'personalized gift website',
    'birthday gift website',
    'anniversary gift online',
    'digital scrapbook',
    'digital album',
    'Memoify',
  ],
  id: [
    'kado digital',
    'hadiah digital',
    'kado ulang tahun digital',
    'kado online',
    'website ucapan ulang tahun',
    'kado anniversary digital',
    'kado untuk pacar',
    'scrapbook digital',
    'album foto digital',
  ],
};

type PageSeo = {
  /** Path on the site, starting with a slash. */
  path: string;
  title: string;
  description: string;
  /** Words for this page only; the shared ones are added after them. */
  keywords?: { en?: string[]; id?: string[] };
  /** Picture shown when the link is shared. */
  image?: { url: string; alt: string };
  /** The language the page is written in. English unless it says. */
  locale?: 'en' | 'id';
  /**
   * The same page in each language, by language code, for a page that has
   * one per language (hreflang). A search engine then shows each person the
   * one in their language instead of treating them as two copies.
   */
  languages?: Record<string, string>;
};

/**
 * hreflang for a page that is written in both languages
 * (lib/page-language.ts): each version, and English as the default.
 */
export function languageAlternates(versions: LanguageVersions) {
  const at = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;
  return {
    en: at(versions.en),
    id: at(versions.id),
    'x-default': at(versions.en),
  };
}

export function pageMeta({
  path,
  title,
  description,
  keywords,
  image,
  locale = 'en',
  languages,
}: PageSeo): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const picture = image ?? { url: DEFAULT_IMAGE, alt: title };
  return {
    title,
    description,
    keywords: Array.from(
      new Set([
        ...(keywords?.en ?? []),
        ...(keywords?.id ?? []),
        ...SHARED_KEYWORDS.en,
        ...SHARED_KEYWORDS.id,
      ])
    ),
    alternates: languages ? { canonical: url, languages } : { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        { url: picture.url, width: 1200, height: 630, alt: picture.alt },
      ],
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: [locale === 'id' ? 'en_US' : 'id_ID'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [picture.url],
    },
  };
}

/** A page that is not for search results: somebody's gift, a signed-in page. */
export const NOT_FOR_SEARCH: Metadata['robots'] = {
  index: false,
  follow: false,
};

type Question = { label: string; children: string };

/**
 * Structured data for the home page: who Memoify is, that the site is one
 * site, what the product is, and the questions the page answers.
 *
 * The Indonesian home page (`/id`) says the same about Memoify, with its
 * own address, the product described in Indonesian, and its questions in
 * Indonesian, each marked as such.
 */
export function homeStructuredData(
  questions: Question[],
  language: 'en' | 'id' = 'en'
) {
  const indonesian = language === 'id';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
        email: 'memoify@memoify.live',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: ['Memoify Live', 'memoify.live'],
        url: SITE_URL,
        inLanguage: ['en', 'id'],
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: indonesian ? `${SITE_URL}/id` : SITE_URL,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Any',
        description: indonesian
          ? 'Kado digital dan disposable camera digital pertama di Indonesia, sejak 2024. Bikin kado ulang tahun ala Netflix, atau kasih tamu pernikahan kamera sekali pakai.'
          : "Indonesia's first digital gifts and digital disposable camera, since 2024. Make a Netflix-style birthday gift, or give wedding guests a camera with MemoRoll.",
        ...(indonesian ? { inLanguage: 'id' } : {}),
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IDR',
          description: indonesian ? 'Paket gratis' : 'Free plan',
        },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'FAQPage',
        ...(indonesian ? { inLanguage: 'id', url: `${SITE_URL}/id` } : {}),
        mainEntity: questions.map((question) => ({
          '@type': 'Question',
          name: question.label,
          acceptedAnswer: { '@type': 'Answer', text: question.children },
        })),
      },
    ],
  };
}

/** Metadata of a page written for one search (lib/intent-pages.ts). */
export function intentMetadata(page: IntentPage): Metadata {
  return pageMeta({
    path: `/id/${page.slug}`,
    title: page.meta.title,
    description: page.meta.description,
    keywords: { id: page.meta.keywords },
    locale: 'id',
  });
}

/**
 * Structured data of such a page: where it sits in the site, and its
 * questions with their answers, which are also on the page as text.
 */
export function intentStructuredData(page: IntentPage) {
  const url = `${SITE_URL}/id/${page.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: page.meta.title,
        description: page.meta.description,
        inLanguage: 'id',
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: SITE_NAME,
            item: `${SITE_URL}/id`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.hero.pill,
            item: url,
          },
        ],
      },
      // A page about a city says so: the service and where it is offered.
      ...(page.area
        ? [
            {
              '@type': 'Service',
              name: page.meta.title,
              description: page.meta.description,
              serviceType: 'Wedding guest camera',
              areaServed: { '@type': 'City', name: page.area },
              provider: { '@id': `${SITE_URL}/#organization` },
              url,
            },
          ]
        : []),
      {
        '@type': 'FAQPage',
        inLanguage: 'id',
        mainEntity: page.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };
}
