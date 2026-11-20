import IntentLanding from '@/components/intent-landing/intent-landing';
import { BATAM_CAMERA } from '@/lib/intent-pages';
import { intentMetadata, intentStructuredData } from '@/lib/seo';

/**
 * "Kamera digital pernikahan di Batam": the page for that search
 * (lib/intent-pages.ts).
 * Indonesian only, so it has no language switch.
 */
export const metadata = intentMetadata(BATAM_CAMERA);

export default function BatamWeddingCameraPage() {
  return (
    <>
      {/* Read by search engines, drawn by nobody. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(intentStructuredData(BATAM_CAMERA)).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      <IntentLanding page={BATAM_CAMERA} />
    </>
  );
}
