import HomePage from '@/components/home/home-page';
import { Metadata } from 'next';
import { languageAlternates, pageMeta } from '@/lib/seo';
import { BILINGUAL_PAGES } from '@/lib/page-language';

/** The home page in English. `/id` is the same page in Indonesian. */
export const metadata: Metadata = pageMeta({
  path: '/',
  // The brand as its owner states it (2026-11-20): the first digital gift
  // and the first digital disposable camera in Indonesia, since 2024, with
  // birthday gifts and the wedding-guest camera in front.
  title: "Memoify | Indonesia's First Digital Gifts & Disposable Camera",
  description:
    "Indonesia's first digital gifts and digital disposable camera, since 2024. Make a Netflix-style birthday gift, or give wedding guests a camera with MemoRoll.",
  keywords: {
    en: [
      'Netflix birthday template',
      'Spotify gift template',
      'gift for girlfriend',
      'gift for boyfriend',
      'long distance relationship gift',
    ],
    id: [
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
    alt: 'Memoify - digital gifts, scrapbooks and albums',
  },
  languages: languageAlternates(BILINGUAL_PAGES[0]),
});

export default function Home({
  searchParams,
}: {
  /** `?spotlight=<route>` shows that template as the new one, for a look
   *  at it here before it is tagged `New` for everybody. */
  searchParams?: { spotlight?: string };
}) {
  return <HomePage lang="en" spotlight={searchParams?.spotlight} />;
}
