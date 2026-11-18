import MemorollLanding, {
  memorollMetadata,
} from '@/components/memoroll/landing/memoroll-landing';

/**
 * The MemoRoll landing in Indonesian. The document's `lang="id"`, the
 * Indonesian footer and the navbar's language all follow from the address
 * (lib/page-language.ts).
 */
export const metadata = memorollMetadata('id');

export default function IndonesianMemorollLandingPage() {
  return <MemorollLanding language="id" />;
}
