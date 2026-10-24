'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { LANDING_COPY, type LandingCopy } from './copy';
import {
  LANGUAGE_COOKIE,
  LANGUAGE_COOKIE_MAX_AGE,
  type LandingLanguage,
} from './language';

interface LanguageValue {
  language: LandingLanguage;
  setLanguage: (language: LandingLanguage) => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

/**
 * Holds the landing's language. It starts in the one the server rendered, so
 * the first paint and the hydrated page agree, and a switch is applied here at
 * once rather than by asking the server for the page again.
 *
 * It draws the element the landing lives in, so the element's `lang` follows
 * the switch and a screen reader reads Indonesian as Indonesian.
 */
export function LandingLanguageProvider({
  initialLanguage,
  className,
  children,
}: {
  initialLanguage: LandingLanguage;
  className?: string;
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState(initialLanguage);

  const value = useMemo<LanguageValue>(
    () => ({
      language,
      setLanguage: (next) => {
        setLanguageState(next);
        document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; samesite=lax`;
      },
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      <div lang={language} className={className}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

function useLanguageContext(): LanguageValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      'The MemoRoll landing’s language was asked for outside LandingLanguageProvider.'
    );
  }
  return context;
}

/** The language being read, and the way to change it. */
export function useLandingLanguage(): LanguageValue {
  return useLanguageContext();
}

/** Everything the landing says, already in the right language. */
export function useLandingCopy(): LandingCopy {
  return LANDING_COPY[useLanguageContext().language];
}
