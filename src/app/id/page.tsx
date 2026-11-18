import HomePage from '@/components/home/home-page';
import { Metadata } from 'next';
import { HOME_LANGUAGES, pageMeta } from '@/lib/seo';

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
  title: 'Kado Digital & Website Ucapan Ulang Tahun | Memoify',
  description:
    'Bikin kado digital dari fotomu: website ucapan ulang tahun ala Netflix atau Spotify, scrapbook digital, atau kado anniversary buat pacar. Kirim lewat satu link.',
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
  languages: HOME_LANGUAGES,
});

export default function IndonesianHome({
  searchParams,
}: {
  searchParams?: { spotlight?: string };
}) {
  return <HomePage lang="id" spotlight={searchParams?.spotlight} />;
}
