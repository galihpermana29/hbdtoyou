import HomePage from '@/components/home/home-page';
import { Metadata } from 'next';
import { languageAlternates, pageMeta } from '@/lib/seo';
import { BILINGUAL_PAGES } from '@/lib/page-language';

/**
 * The home page in Indonesian, at its own address so that search engines
 * index it as Indonesian and show it to people searching in Indonesian
 * ("kado digital", "website ucapan ulang tahun"). Same sections and design
 * as `/`; the words come from components/home/copy.ts.
 *
 * The document's `lang="id"` is set by the root layout, from the header the
 * middleware adds to requests for this path.
 */
export const metadata: Metadata = pageMeta({
  path: '/id',
  locale: 'id',
  title: 'Memoify | Kado Digital & Kamera Tamu Pertama di Indonesia',
  description:
    'Kado digital dan disposable camera digital pertama di Indonesia, sejak 2024. Bikin kado ulang tahun ala Netflix, atau kasih tamu pernikahan kamera sekali pakai.',
  keywords: {
    id: [
      'kado digital',
      'kado ulang tahun digital',
      'website ucapan ulang tahun',
      'scrapbook digital',
      'kado anniversary',
      'kado untuk pacar',
      'hadiah ulang tahun digital',
      'kado ulang tahun online',
      'template Netflix ulang tahun',
      'kado LDR',
      'hadiah wisuda digital',
      'kenangan digital',
    ],
  },
  image: {
    url: 'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763138771/brave_screenshot_memoify.live_lvsx21.png',
    alt: 'Memoify - kado digital, scrapbook, dan album foto',
  },
  languages: languageAlternates(BILINGUAL_PAGES[0]),
});

export default function IndonesianHome({
  searchParams,
}: {
  searchParams?: { spotlight?: string };
}) {
  return <HomePage lang="id" spotlight={searchParams?.spotlight} />;
}
