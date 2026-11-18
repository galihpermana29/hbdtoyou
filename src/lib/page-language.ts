/**
 * Which language a page is in, and where its other language lives.
 *
 * One rule for the whole site: the address says the language. `/x` is
 * English and `/id/x` is the same page in Indonesian. There is no cookie and
 * no switch on the page itself: the navbar's EN / ID pill and a line in the
 * footer link the two addresses, so each is its own page to a search engine
 * and a visitor's choice can be bookmarked and shared.
 *
 * Only the pages below have both. Every other page is English, and shows no
 * switch.
 */

export type PageLanguage = 'en' | 'id';

/** The two addresses of one page. */
export type LanguageVersions = Record<PageLanguage, string>;

export const BILINGUAL_PAGES: LanguageVersions[] = [
  { en: '/', id: '/id' },
  { en: '/memoroll', id: '/id/memoroll' },
  { en: '/scrapbook', id: '/id/scrapbook' },
  { en: '/journal', id: '/id/journal' },
];

/**
 * How the root layout learns the page's language, for `<html lang>`. The
 * layout is not told the path it renders, so the middleware, which is, adds
 * this header to requests for an Indonesian page and takes it off the rest.
 */
export const PAGE_LANGUAGE_HEADER = 'x-memoify-page-language';

/** `/id` and everything under `/id/`, with or without the trailing slash. */
export function isIndonesianPath(pathname: string): boolean {
  return pathname === '/id' || pathname.startsWith('/id/');
}

export function pageLanguage(pathname: string): PageLanguage {
  return isIndonesianPath(pathname) ? 'id' : 'en';
}

const bare = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

/** The page's two addresses, if it has both; otherwise null. */
export function languageVersions(pathname: string): LanguageVersions | null {
  const path = bare(pathname);
  return (
    BILINGUAL_PAGES.find((page) => page.en === path || page.id === path) ?? null
  );
}

/**
 * Where a link to an English page should go from a page in `language`: to
 * its Indonesian version when there is one, else where it already went.
 */
export function localHref(href: string, language: PageLanguage): string {
  if (language === 'en') return href;
  return BILINGUAL_PAGES.find((page) => page.en === href)?.id ?? href;
}
