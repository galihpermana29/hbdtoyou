import HomePage from '@/components/home/home-page';
import { Metadata } from 'next';
import { HOME_LANGUAGES, pageMeta } from '@/lib/seo';

/** The home page in English. `/id` is the same page in Indonesian. */
export const metadata: Metadata = pageMeta({
  path: '/',
  title: 'Memoify | Digital Gifts, Scrapbooks & Albums (Kado Digital)',
  description:
    'Turn photos into a digital gift, scrapbook or album styled like Netflix or Spotify, shared with one link. Bikin kado digital dan ucapan ulang tahun online.',
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
  languages: HOME_LANGUAGES,
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
