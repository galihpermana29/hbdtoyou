import TemplateGuide from '@/components/template-guide/template-guide';
import { TEMPLATE_PAGES } from '@/lib/template-pages';
import { templateMetadata, templateStructuredData } from '@/lib/seo';

import Sample from './sample';

/**
 * The spotifyv1 sample, and below it the words that make it a page someone can
 * land on from a search (lib/template-pages.ts). The sample itself is
 * unchanged, in `sample.tsx`.
 */
const page = TEMPLATE_PAGES.spotifyv1;

export const metadata = templateMetadata(page);

export default function TemplateSamplePage() {
  return (
    <>
      {/* Read by search engines, drawn by nobody. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(templateStructuredData(page)).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      <Sample />
      <TemplateGuide page={page} />
    </>
  );
}
