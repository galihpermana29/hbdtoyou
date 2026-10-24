'use client';

import { useLandingCopy, useLandingLanguage } from './language-provider';
import type { LandingLanguage } from './language';

/**
 * The hero's EN / ID switch. It wears the How it works tab switch's
 * treatment, smaller: a white pill with the flame orange thumb sliding under
 * the language being read.
 *
 * Each option is labelled in its own language, so a visitor who cannot read
 * the page yet can still find theirs.
 *
 * Where it sits is the caller's to say, `className` included: the thumb is
 * placed against it, so the caller's position must be `relative` or `absolute`.
 */
export default function LanguageToggle({ className }: { className: string }) {
  const { language, setLanguage } = useLandingLanguage();
  const copy = useLandingCopy().language;

  const options: { value: LandingLanguage; short: string; name: string }[] = [
    { value: 'en', short: 'EN', name: copy.english },
    { value: 'id', short: 'ID', name: copy.indonesian },
  ];

  return (
    <div
      role="group"
      aria-label={copy.group}
      className={`grid grid-cols-2 rounded-full bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.06)] ${className}`}
      style={{ fontFamily: 'var(--font-mr-label)' }}>
      <span
        aria-hidden
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#ff3e09] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          language === 'id' ? 'translate-x-full' : ''
        }`}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          aria-label={option.name}
          aria-pressed={language === option.value}
          onClick={() => setLanguage(option.value)}
          className={`relative rounded-full px-3 py-1.5 text-[12px] font-medium tracking-[1.2px] transition-colors duration-300 ${
            language === option.value
              ? 'text-white'
              : 'text-[#8a847d] hover:text-[#1b1b1b]'
          }`}>
          {option.short}
        </button>
      ))}
    </div>
  );
}
