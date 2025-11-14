import NewLandingPage from '@/components/newlanding/NewLandingPage';
import Script from 'next/script';
import { Metadata } from 'next';
import 'react-photo-view/dist/react-photo-view.css';
import MaintenancePage from './maintenance/page';
export const metadata: Metadata = {
  title:
    'Memoify | Create Digital Gifts, Scrapbooks & Albums Inspired by Popular Platforms',
  description:
    'With Memoify create digital gifts, digital scrapbooks, and digital albums inspired by your favorite platforms like Netflix, Spotify, or YouTube. Add personal touches and let your memories shine!',
  keywords:
    'digital gift, digital scrapbook, digital album, virtual present, online gift, electronic memory book, digital photo collection, memory collection, virtual album, online scrapbook, e-gift, hadiah ulang tahun digital, kado digital, scrapbook digital, album foto digital, kenangan digital, kado online, custom websites, Netflix templates, Spotify templates, YouTube templates, personalized websites, digital memories, Memoify',
  openGraph: {
    title:
      'Memoify | Create Digital Gifts, Scrapbooks & Albums Inspired by Popular Platforms',
    description:
      'With Memoify create digital gifts, digital scrapbooks, and digital albums inspired by your favorite platforms like Netflix, Spotify, or YouTube. Add personal touches and let your memories shine!',
    url: 'https://memoify.live',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751298448/brave_screenshot_memoify.live_mhwzfs.png',
        width: 1200,
        height: 630,
        alt: 'Memoify - Create Custom Websites Inspired by Popular Platforms',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Memoify | Create Digital Gifts, Scrapbooks & Albums Inspired by Popular Platforms',
    description:
      'With Memoify create digital gifts, digital scrapbooks, and digital albums inspired by your favorite platforms like Netflix, Spotify, or YouTube. Add personal touches and let your memories shine!',
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751298448/brave_screenshot_memoify.live_mhwzfs.png',
    ],
  },
};

const GA_MEASUREMENT_ID = 'G-X4G9RCBNQH'; // Your Google Analytics ID

export default function Home() {
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
      {process.env.IS_MAINTENANCE ? <MaintenancePage /> : <NewLandingPage />}
    </div>
  );
}
