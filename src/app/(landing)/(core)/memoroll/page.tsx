import MemorollLanding, {
  memorollMetadata,
} from '@/components/memoroll/landing/memoroll-landing';

/** The MemoRoll landing in English. Its Indonesian version is `/id/kamera-tamu-pernikahan`. */
export const metadata = memorollMetadata('en');

export default function MemorollLandingPage() {
  return <MemorollLanding language="en" />;
}
