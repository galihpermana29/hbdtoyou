import Script from 'next/script';

import { getNewTemplate } from '@/action/new-template-api';
import MaintenancePage from '@/app/maintenance/page';
import { faqDataEnglish, faqDataIndonesian } from '@/lib/faqData';
import { homeStructuredData } from '@/lib/seo';
import 'react-photo-view/dist/react-photo-view.css';

import type { HomeLanguage } from './copy';
import HomeLanding from './home-landing';

const GA_MEASUREMENT_ID = 'G-X4G9RCBNQH'; // Your Google Analytics ID

/**
 * The home page, whichever language it is read in: `/` renders it in
 * English and `/id` in Indonesian, and each says its own metadata. The two
 * share everything else - analytics, the structured data, the maintenance
 * switch - so that one cannot drift from the other.
 */
export default async function HomePage({
  lang,
  spotlight,
}: {
  lang: HomeLanguage;
  /** `?spotlight=<route>` shows that template as the new one, for a look
   *  at it here before it is tagged `New` for everybody. */
  spotlight?: string;
}) {
  const maintenance = process.env.IS_MAINTENANCE === 'true';
  const fresh = maintenance ? null : await getNewTemplate(spotlight);
  const questions = lang === 'id' ? faqDataIndonesian : faqDataEnglish;
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
          __html: JSON.stringify(homeStructuredData(questions, lang)).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      {maintenance ? (
        <MaintenancePage />
      ) : (
        <HomeLanding fresh={fresh} lang={lang} />
      )}
    </div>
  );
}
