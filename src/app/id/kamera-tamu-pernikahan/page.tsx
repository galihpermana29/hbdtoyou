import MemorollLanding, {
  memorollMetadata,
  memorollStructuredData,
} from '@/components/memoroll/landing/memoroll-landing';

/**
 * The MemoRoll landing in Indonesian. Its address is what people search
 * for, a camera for wedding guests, rather than `/id/memoroll` (which
 * redirects here, next.config.mjs). The document's `lang="id"`, the
 * Indonesian footer and the navbar's language follow from the address
 * (lib/page-language.ts).
 */
export const metadata = memorollMetadata('id');

export default function IndonesianMemorollLandingPage() {
  return (
    <>
      {/* Read by search engines, drawn by nobody. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(memorollStructuredData('id')).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      <MemorollLanding language="id" />
    </>
  );
}
