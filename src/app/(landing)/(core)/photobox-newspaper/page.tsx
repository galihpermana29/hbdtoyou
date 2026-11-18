import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PhotoboxNewspaperPage from './photobox-newspaper-clientside';

export const metadata: Metadata = pageMeta({
  path: '/photobox-newspaper',
  title: 'Newspaper Photobooth Online (Photobox Koran) | Memoify',
  description:
    'Snap a live photo straight into a vintage newspaper frame, photobooth style, and download your own front page. Foto langsung jadi halaman depan koran, gratis.',
  keywords: {
    en: ['online photobooth', 'newspaper photo frame', 'photobox'],
    id: ['photobox online', 'photobooth koran', 'bingkai foto koran'],
  },
});

export default function Page() {
  return <PhotoboxNewspaperPage />;
}
