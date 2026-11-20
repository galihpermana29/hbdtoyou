import MemorollLanding, {
  memorollMetadata,
  memorollStructuredData,
} from '@/components/memoroll/landing/memoroll-landing';

/** The MemoRoll landing in English. Its Indonesian version is `/id/kamera-tamu-pernikahan`. */
export const metadata = memorollMetadata('en');

export default function MemorollLandingPage() {
  return (
    <>
      {/* Read by search engines, drawn by nobody. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(memorollStructuredData('en')).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      <MemorollLanding language="en" />
    </>
  );
}
