import NewLandingPage from '@/components/newlanding/NewLandingPage';
import Script from 'next/script';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memoify | Create Custom Websites Inspired by Popular Platforms',
  description:
    'With Memoify create custom websites inspired by your favorite platforms like Netflix, Spotify, or YouTube. Add personal touches and let your memories shine!',
  keywords:
    'custom websites, Netflix templates, Spotify templates, YouTube templates, personalized websites, digital memories, Memoify',
  openGraph: {
    title: 'Memoify | Create Custom Websites Inspired by Popular Platforms',
    description:
      'With Memoify create custom websites inspired by your favorite platforms like Netflix, Spotify, or YouTube. Add personal touches and let your memories shine!',
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
    title: 'Memoify | Create Custom Websites Inspired by Popular Platforms',
    description:
      'With Memoify create custom websites inspired by your favorite platforms like Netflix, Spotify, or YouTube. Add personal touches and let your memories shine!',
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
      <NewLandingPage />
    </div>
  );
}
