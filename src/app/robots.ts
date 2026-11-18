import type { MetadataRoute } from 'next';

/**
 * /robots.txt. There was none (it answered 404), which crawlers read as
 * "everything is allowed" - true, but it also left them without the sitemap.
 *
 * Kept out: the signed-in areas, which only show a sign-in prompt to a
 * crawler. `/api` is deliberately NOT disallowed: pages ask `/api/session`
 * while rendering, and a crawler forbidden to fetch it renders them wrong.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/payment'] },
    sitemap: 'https://www.memoify.live/sitemap.xml',
  };
}
