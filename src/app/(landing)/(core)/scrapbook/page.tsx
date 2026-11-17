import type { Metadata } from 'next';

import ScrapbookLanding from '@/components/scrapbook-landing/scrapbook-landing';

export const metadata: Metadata = {
  title: 'Digital Scrapbook Maker | Memoify',
  description:
    'Add your photos, pick a style, and Memo-AI lays out a digital scrapbook you can share with one link.',
  openGraph: {
    title: 'Digital Scrapbook Maker | Memoify',
    description:
      'Add your photos, pick a style, and Memo-AI lays out a digital scrapbook you can share with one link.',
    url: 'https://memoify.live/scrapbook',
    siteName: 'Memoify',
    type: 'website',
  },
};

/**
 * The scrapbook product's landing. The page it replaces is kept beside this
 * file (old-page-client.tsx) and no longer rendered.
 */
export default function ScrapbookPage() {
  return <ScrapbookLanding />;
}
