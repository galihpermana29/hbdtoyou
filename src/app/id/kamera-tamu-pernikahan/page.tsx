import MemorollLanding, {
  memorollVariantMetadata,
  memorollVariantStructuredData,
} from '@/components/memoroll/landing/memoroll-landing';

/**
 * "Kamera tamu pernikahan": the MemoRoll landing, worded for that search
 * (components/memoroll/landing/copy.tsx). The same sections, pictures and
 * motion as `/id/memoroll`; Indonesian only.
 */
export const metadata = memorollVariantMetadata('wedding');

export default function WeddingGuestCameraPage() {
  return (
    <>
      {/* Read by search engines, drawn by nobody. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            memorollVariantStructuredData('wedding')
          ).replace(/</g, '\\u003c'),
        }}
      />
      <MemorollLanding language="id" variant="wedding" />
    </>
  );
}
