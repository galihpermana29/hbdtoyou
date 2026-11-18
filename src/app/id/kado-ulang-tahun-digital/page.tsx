import IntentLanding from '@/components/intent-landing/intent-landing';
import { BIRTHDAY } from '@/lib/intent-pages';
import { intentMetadata, intentStructuredData } from '@/lib/seo';

/**
 * "Kado ulang tahun digital": the page for that search (lib/intent-pages.ts).
 * Indonesian only, so it has no language switch.
 */
export const metadata = intentMetadata(BIRTHDAY);

export default function BirthdayGiftPage() {
  return (
    <>
      {/* Read by search engines, drawn by nobody. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(intentStructuredData(BIRTHDAY)).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      <IntentLanding page={BIRTHDAY} />
    </>
  );
}
