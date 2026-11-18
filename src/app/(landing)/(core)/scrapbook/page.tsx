import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

import ScrapbookLanding from '@/components/scrapbook-landing/scrapbook-landing';

export const metadata: Metadata = pageMeta({
  path: '/scrapbook',
  title: 'Digital Scrapbook Maker (Scrapbook Digital) | Memoify',
  description:
    'Add your photos, pick a style, and Memo-AI lays out a digital scrapbook you can share with one link. Bikin scrapbook digital otomatis dari foto kalian.',
  keywords: {
    en: ['digital scrapbook maker', 'online scrapbook', 'AI scrapbook'],
    id: [
      'scrapbook digital',
      'buat scrapbook online',
      'scrapbook untuk pacar',
      'album kenangan digital',
    ],
  },
});

/**
 * The scrapbook product's landing. The page it replaces is kept beside this
 * file (old-page-client.tsx) and no longer rendered.
 */
export default function ScrapbookPage() {
  return <ScrapbookLanding />;
}
