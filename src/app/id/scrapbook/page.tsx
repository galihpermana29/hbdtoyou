import ScrapbookLanding from '@/components/scrapbook-landing/scrapbook-landing';
import { scrapbookMetadata } from '@/components/scrapbook-landing/meta';

/** The scrapbook landing in Indonesian (lib/page-language.ts). */
export const metadata = scrapbookMetadata('id');

export default function IndonesianScrapbookPage() {
  return <ScrapbookLanding lang="id" />;
}
