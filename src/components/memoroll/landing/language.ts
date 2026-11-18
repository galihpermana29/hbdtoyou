/**
 * The language the MemoRoll landing is read in. The address decides it, as
 * on every page written in both languages (lib/page-language.ts):
 * `/memoroll` is English and `/id/memoroll` Indonesian, and the navbar's
 * EN / ID switch goes between them.
 */
export type LandingLanguage = 'en' | 'id';
