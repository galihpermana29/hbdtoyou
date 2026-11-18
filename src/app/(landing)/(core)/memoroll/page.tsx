import MemorollLanding, {
  memorollMetadata,
} from '@/components/memoroll/landing/memoroll-landing';

/** The MemoRoll landing in English. `/id/memoroll` is the same in Indonesian. */
export const metadata = memorollMetadata('en');

export default function MemorollLandingPage() {
  return <MemorollLanding language="en" />;
}
