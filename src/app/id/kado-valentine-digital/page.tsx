import IntentLanding from '@/components/intent-landing/intent-landing';
import { VALENTINE } from '@/lib/intent-pages';
import { intentMetadata, intentStructuredData } from '@/lib/seo';

/**
 * "Kado valentine digital": the page for that search (lib/intent-pages.ts).
 * Indonesian only, so it has no language switch.
 */
export const metadata = intentMetadata(VALENTINE);

export default function ValentineGiftPage() {
  return (
    <>
      {/* Read by search engines, drawn by nobody. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(intentStructuredData(VALENTINE)).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      <IntentLanding page={VALENTINE} />
    </>
  );
}
