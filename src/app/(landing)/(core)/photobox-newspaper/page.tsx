import { Metadata } from 'next';
import PhotoboxNewspaperPage from './photobox-newspaper-clientside';

export const metadata: Metadata = {
  title: 'Photobox Newspaper | Memoify',
  description:
    'Snap a live photo straight into a vintage newspaper frame — photobooth style. Capture, retake, and download your own "Bestie of The Week" front page.',
  alternates: {
    canonical: 'https://memoify.live/photobox-newspaper',
  },
};

export default function Page() {
  return <PhotoboxNewspaperPage />;
}
