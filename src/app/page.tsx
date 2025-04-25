import NewLandingPage from '@/components/newlanding/NewLandingPage';
import Script from 'next/script';

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
