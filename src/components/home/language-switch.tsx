import { HOME_COPY, HOME_PATH, type HomeLanguage } from './copy';
import { press } from './ui';

/**
 * The way between the English home page (`/`) and the Indonesian one
 * (`/id`), drawn like the FAQ's language switch.
 *
 * Plain links rather than a toggle: each language is its own address, so a
 * crawler following them finds both pages, and a visitor's choice can be
 * bookmarked and shared. Plain `<a>` rather than next/link too, so the
 * switch loads the page whole and the document's `lang` (set by the root
 * layout on the server) follows it.
 */
const LANGUAGES: Array<[HomeLanguage, string]> = [
  ['en', 'English'],
  ['id', 'Bahasa Indonesia'],
];

export default function LanguageSwitch({ lang }: { lang: HomeLanguage }) {
  const t = HOME_COPY[lang].language;
  return (
    <nav
      aria-label={t.label}
      className="mx-auto mt-8 flex max-w-[1180px] flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <span className="text-[14px] font-medium text-[#8a847d]">{t.label}</span>
      <span className="flex rounded-full bg-[#efeae9] p-1">
        {LANGUAGES.map(([code, label]) => {
          const here = code === lang;
          return (
            <a
              key={code}
              href={HOME_PATH[code]}
              hrefLang={code}
              lang={code}
              aria-current={here ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-200 ${press} ${
                here ? 'bg-[#1b1b1b] text-white' : 'text-[#4a4642]'
              }`}>
              {label}
            </a>
          );
        })}
      </span>
    </nav>
  );
}
