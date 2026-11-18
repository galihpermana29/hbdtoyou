import type { Metadata } from 'next';

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
};

export function pageMeta({
  path,
  title,
  description,
  keywords,
  image,
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
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        { url: picture.url, width: 1200, height: 630, alt: picture.alt },
      ],
      locale: 'en_US',
      alternateLocale: ['id_ID'],
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
 */
export function homeStructuredData(questions: Question[]) {
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
        url: SITE_URL,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Any',
        description:
          'Make a digital gift, scrapbook or album from your photos and share it with one link.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IDR',
          description: 'Free plan',
        },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: questions.map((question) => ({
          '@type': 'Question',
          name: question.label,
          acceptedAnswer: { '@type': 'Answer', text: question.children },
        })),
      },
    ],
  };
}
