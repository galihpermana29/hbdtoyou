/**
 * How the root layout learns which language a page is written in, for the
 * document's `<html lang>`.
 *
 * The layout is not told the path it is rendering, so the middleware, which
 * is, adds this header to requests for a page written in Indonesian (today
 * only `/id`, the home page in Indonesian). Every other page is English and
 * gets no header. The layout already reads the session cookie, so reading a
 * header as well does not change how any page is rendered.
 */
export const PAGE_LANGUAGE_HEADER = 'x-memoify-page-language';

/** Paths written in Indonesian, with or without the trailing slash. */
export function isIndonesianPath(pathname: string): boolean {
  return pathname === '/id' || pathname === '/id/';
}
