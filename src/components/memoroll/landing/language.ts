/**
 * Which language the MemoRoll landing is read in, worked out the same way on
 * the server and in the browser.
 *
 * The choice is kept in a cookie rather than in local storage, so the server
 * can render the page in it. Read from storage after the first paint, a
 * visitor who chose Indonesian would see the whole hero in English for a frame
 * before it switched, which on a page whose first screen is one big heading is
 * the most visible thing on it.
 *
 * Before anybody has chosen, the browser's own languages decide: a browser
 * that asks for Indonesian gets it, and everybody else gets English, the
 * language the page was designed in.
 */

export type LandingLanguage = 'en' | 'id';

/** Where the choice is kept, and the only cookie this feature owns. */
export const LANGUAGE_COOKIE = 'memoify-memoroll-language';

/** A year: the choice is a preference, not something that should lapse. */
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLandingLanguage(value: unknown): value is LandingLanguage {
  return value === 'en' || value === 'id';
}

/**
 * The language to render: the visitor's own choice if they made one, else the
 * first of their browser's languages that the page speaks.
 */
export function resolveLandingLanguage(
  cookie: string | undefined,
  acceptLanguage: string | null
): LandingLanguage {
  if (isLandingLanguage(cookie)) return cookie;

  const preferred = (acceptLanguage ?? '')
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase().split('-')[0])
    .find((code) => code === 'en' || code === 'id');
  return preferred === 'id' ? 'id' : 'en';
}
