import type { MetadataRoute } from 'next';

import { INTENT_PAGES } from '@/lib/intent-pages';
import { languageVersions } from '@/lib/page-language';
import { languageAlternates } from '@/lib/seo';

/**
 * /sitemap.xml: the pages meant to be found. Product pages and the public
 * galleries; not gifts (they are for the person they were sent to) and not
 * the signed-in areas. A new public page is one more line here.
 *
 * A page written in both languages (lib/page-language.ts) is listed at both
 * addresses, and each entry names the other, as the pages' own hreflang
 * links do.
 */
const PAGES: Array<[path: string, priority: number]> = [
  ['/', 1],
  ['/id', 1],
  ['/templates', 0.9],
  ['/create', 0.8],
  ['/scrapbook', 0.8],
  ['/id/scrapbook', 0.8],
  ['/journal', 0.8],
  ['/id/journal', 0.8],
  ['/memoroll', 0.8],
  ['/id/memoroll', 0.8],
  ['/inspiration', 0.7],
  ['/photobox-newspaper', 0.6],
  ['/contact', 0.3],
  // Pages written for one search each, Indonesian only.
  ...INTENT_PAGES.map((page): [string, number] => [`/id/${page.slug}`, 0.8]),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, priority]) => {
    const versions = languageVersions(path);
    return {
      url: `https://www.memoify.live${path}`,
      changeFrequency: 'weekly',
      priority,
      ...(versions
        ? { alternates: { languages: languageAlternates(versions) } }
        : {}),
    };
  });
}
