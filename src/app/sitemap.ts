import type { MetadataRoute } from 'next';

/**
 * /sitemap.xml: the pages meant to be found. Product pages and the public
 * galleries; not gifts (they are for the person they were sent to) and not
 * the signed-in areas. A new public page is one more line here.
 */
const PAGES: Array<[path: string, priority: number]> = [
  ['/', 1],
  ['/templates', 0.9],
  ['/create', 0.8],
  ['/scrapbook', 0.8],
  ['/journal', 0.8],
  ['/memoroll', 0.8],
  ['/inspiration', 0.7],
  ['/photobox-newspaper', 0.6],
  ['/contact', 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, priority]) => ({
    url: `https://www.memoify.live${path}`,
    changeFrequency: 'weekly',
    priority,
  }));
}
