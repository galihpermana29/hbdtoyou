import type { Metadata } from 'next';
import MapsOfUs from '../maps-of-us';

export const metadata: Metadata = {
  title: 'Maps of Us — Memoify Preview',
  description: 'A map-shaped love story, told one memory at a time.',
};

export default function MapsOfUsPreviewPage() {
  return <MapsOfUs />;
}
