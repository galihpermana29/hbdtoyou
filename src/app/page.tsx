import { getNewTemplate } from '@/action/new-template-api';
import HomeLanding from '@/components/home/home-landing';
import Script from 'next/script';
import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import 'react-photo-view/dist/react-photo-view.css';
import MaintenancePage from './maintenance/page';
import { faqDataEnglish } from '@/lib/faqData';
import { homeStructuredData } from '@/lib/seo';
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
});

const GA_MEASUREMENT_ID = 'G-X4G9RCBNQH'; // Your Google Analytics ID

export default async function Home({
  searchParams,
}: {
  /** `?spotlight=<route>` shows that template as the new one, for a look
   *  at it here before it is tagged `New` for everybody. */
  searchParams?: { spotlight?: string };
}) {
  const maintenance = process.env.IS_MAINTENANCE === 'true';
  const fresh = maintenance
    ? null
    : await getNewTemplate(searchParams?.spotlight);
  return (
    <div>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        strategy="afterInteractive"
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
      {/* Read by search engines, drawn by nobody. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData(faqDataEnglish)).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      {maintenance ? <MaintenancePage /> : <HomeLanding fresh={fresh} />}
    </div>
  );
}
