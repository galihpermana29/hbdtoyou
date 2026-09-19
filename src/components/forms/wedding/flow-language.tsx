'use client';

/**
 * Which language the Create Flow is being read in, and how it is remembered.
 *
 * Indonesian by default, because that is who this product marries. English is a
 * choice rather than a starting point, which is the opposite of how the form was
 * built and the reason this exists.
 *
 * The choice is kept in the browser rather than on the invitation. It is a
 * preference about reading a form, not a fact about a wedding: two people
 * planning together might read it in different languages on different laptops
 * and neither of them is wrong, and the backend has nowhere to put it anyway.
 *
 * It is read after the first paint rather than during it. Reading storage while
 * rendering would have the server say Indonesian and the browser say English for
 * the same markup, which React reports as a hydration failure. The cost is that
 * somebody who chose English sees one frame of Indonesian; the alternative is a
 * console full of mismatches on every visit, for everybody.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { copyIn, type FlowCopyKey, type FlowLanguage } from './copy';

/** Where the choice is kept, and the only key this feature owns. */
const STORAGE_KEY = 'memoify-wedding-flow-language';

/** What a couple gets before they have chosen anything. */
const DEFAULT_LANGUAGE: FlowLanguage = 'id';

function isLanguage(value: unknown): value is FlowLanguage {
  return value === 'id' || value === 'en';
}

interface FlowLanguageValue {
  language: FlowLanguage;
  setLanguage: (language: FlowLanguage) => void;
}

const FlowLanguageContext = createContext<FlowLanguageValue | null>(null);

export function FlowLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<FlowLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLanguage(stored)) setLanguageState(stored);
    } catch {
      // A browser that refuses storage still gets a working form, in the
      // language everybody starts in. Remembering is the part that fails, and
      // it is not worth telling anybody about.
    }
  }, []);

  const value = useMemo<FlowLanguageValue>(
    () => ({
      language,
      setLanguage: (next) => {
        setLanguageState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // As above: the choice still applies to this visit.
        }
      },
    }),
    [language]
  );

  return (
    <FlowLanguageContext.Provider value={value}>
      {children}
    </FlowLanguageContext.Provider>
  );
}

function useFlowLanguageContext(): FlowLanguageValue {
  const context = useContext(FlowLanguageContext);
  if (!context) {
    throw new Error(
      'The Create Flow’s language was asked for outside FlowLanguageProvider.'
    );
  }
  return context;
}

/** The language being read, and the way to change it. */
export function useFlowLanguage(): FlowLanguageValue {
  return useFlowLanguageContext();
}

/**
 * Everything the flow says, already in the right language.
 *
 * Resolved once per language rather than per lookup, so a Section reads
 * `copy.brideNickname` and never has to know which language it is in.
 */
export function useFlowCopy(): Record<FlowCopyKey, string> {
  const { language } = useFlowLanguageContext();
  return useMemo(() => copyIn(language), [language]);
}
