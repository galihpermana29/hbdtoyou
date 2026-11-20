'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { LANDING_COPY, type LandingCopy } from './copy';
import type { LandingLanguage } from './language';

const LanguageContext = createContext<LandingLanguage | null>(null);

/**
 * Holds the landing's language, which the page's address decided on the
 * server, for the client sections that look their words up.
 *
 * It draws the element the landing lives in, so the element's `lang` says
 * the language too and a screen reader reads Indonesian as Indonesian.
 */
export function LandingLanguageProvider({
  language,
  className,
  children,
}: {
  language: LandingLanguage;
  className?: string;
  children: ReactNode;
}) {
  return (
    <LanguageContext.Provider value={language}>
      <div lang={language} className={className}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

/** Everything the landing says, already in the right language. */
export function useLandingCopy(): LandingCopy {
  const language = useContext(LanguageContext);
  if (!language) {
    throw new Error(
      'The MemoRoll landing’s language was asked for outside LandingLanguageProvider.'
    );
  }
  return LANDING_COPY[language];
}

/** The language the landing is in, for what depends on it besides words. */
export function useLandingLanguage(): LandingLanguage {
  const language = useContext(LanguageContext);
  if (!language) {
    throw new Error(
      'useLandingLanguage must be used inside LandingLanguageProvider'
    );
  }
  return language;
}
