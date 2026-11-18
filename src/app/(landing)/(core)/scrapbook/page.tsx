import ScrapbookLanding from '@/components/scrapbook-landing/scrapbook-landing';
import { scrapbookMetadata } from '@/components/scrapbook-landing/meta';

/** English. `/id/scrapbook` is the same landing in Indonesian. */
export const metadata = scrapbookMetadata('en');

/**
 * The scrapbook product's landing. The page it replaces is kept beside this
 * file (old-page-client.tsx) and no longer rendered.
 */
export default function ScrapbookPage() {
  return <ScrapbookLanding />;
}
