'use client';

import { createContext, useContext, type ReactNode } from 'react';

import {
  LANDING_COPY,
  LANDING_VARIANTS,
  type LandingCopy,
  type LandingVariant,
} from './copy';
import type { LandingLanguage } from './language';

const LanguageContext = createContext<{
  language: LandingLanguage;
  variant?: LandingVariant;
} | null>(null);

/**
 * Holds the landing's language, which the page's address decided on the
 * server, for the client sections that look their words up.
 *
 * It draws the element the landing lives in, so the element's `lang` says
 * the language too and a screen reader reads Indonesian as Indonesian.
 */
export function LandingLanguageProvider({
  language,
  variant,
  className,
  children,
}: {
  language: LandingLanguage;
  /**
   * The landing written for one search (copy.tsx). Named, not passed as
   * words: the words hold functions and markup, which cannot cross from the
   * server to here.
   */
  variant?: LandingVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <LanguageContext.Provider value={{ language, variant }}>
      <div lang={language} className={className}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

/** Everything the landing says, already in the right language. */
export function useLandingCopy(): LandingCopy {
  const page = useContext(LanguageContext);
  if (!page) {
    throw new Error(
      'The MemoRoll landing’s language was asked for outside LandingLanguageProvider.'
    );
  }
  return page.variant
    ? LANDING_VARIANTS[page.variant]
    : LANDING_COPY[page.language];
}
