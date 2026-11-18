'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import Eyebrow from '@/components/memoroll/landing/eyebrow';
import { RevealHeading } from '@/components/memoroll/landing/reveal-words';
import { faqDataEnglish, faqDataIndonesian } from '@/lib/faqData';

import { HOME_COPY, type HomeLanguage } from './copy';
import { press } from './ui';

/**
 * Questions, in MemoRoll's own FAQ layout, with the home page's answers and
 * its English / Indonesia switch. The answers open in the page's own
 * language: Indonesian on `/id`.
 *
 * An answer opens by growing its row (grid rows - height is the documented
 * exception, there is no transform that pushes the rows below) and closes
 * the same way; it is a CSS transition, so opening another mid-way simply
 * retargets. Nothing staggers: a list opened many times appears at once.
 */

const EMAIL = 'memoify@memoify.live';

export default function HomeFaq({ lang = 'en' }: { lang?: HomeLanguage }) {
  const t = HOME_COPY[lang].faq;
  const [language, setLanguage] = useState<HomeLanguage>(lang);
  const [open, setOpen] = useState<string | null>('1');
  const items = language === 'en' ? faqDataEnglish : faqDataIndonesian;

  return (
    <section
      id="faq-section"
      aria-label="FAQ"
      className="scroll-mt-[81px] bg-[#fffdfa] px-5 py-16 md:px-10 md:py-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10 lg:flex-row lg:gap-24">
        <div className="flex w-full shrink-0 flex-col items-start gap-6 lg:w-[400px]">
          <Eyebrow>FAQ</Eyebrow>
          <RevealHeading className="text-[32px] font-bold leading-[1.1] tracking-[-0.04em] text-[#1b1b1b] md:text-[44px]">
            {t.title}
          </RevealHeading>
          <div
            role="radiogroup"
            aria-label={t.languageGroup}
            className="flex rounded-full bg-[#efeae9] p-1">
            {(
              [
                ['en', 'English'],
                ['id', 'Indonesia'],
              ] as const
            ).map(([code, label]) => (
              <button
                key={code}
                type="button"
                role="radio"
                aria-checked={language === code}
                onClick={() => setLanguage(code)}
                className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-200 ${press} ${
                  language === code
                    ? 'bg-[#1b1b1b] text-white'
                    : 'text-[#4a4642]'
                }`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded-[20px] bg-[#fbf4ec] p-7">
            <p className="text-[18px] font-bold text-[#1b1b1b]">{t.curious}</p>
            <p className="text-[15px] leading-[1.55] text-[#4a4642]">
              {t.write}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className={`inline-flex max-w-full items-center break-all rounded-full bg-[#1b1b1b] px-[18px] py-3 text-[14px] font-semibold text-white ${press}`}>
              {EMAIL}
            </a>
          </div>
        </div>

        <div className="min-w-0 flex-1 border-t-[1.5px] border-[#1b1b1b]">
          {items.map((item, index) => {
            const isOpen = open === item.key;
            return (
              <div key={item.key} className="border-b border-[#e8ded3]">
                <h3>
                  <button
                    type="button"
                    id={`home-faq-q-${item.key}`}
                    aria-expanded={isOpen}
                    aria-controls={`home-faq-a-${item.key}`}
                    onClick={() => setOpen(isOpen ? null : item.key)}
                    className="flex w-full items-center gap-5 px-1 py-6 text-left">
                    <span
                      className={`text-[14px] font-medium tabular-nums ${
                        isOpen ? 'text-[#ff3e09]' : 'text-[#8a847d]'
                      }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 text-[17px] leading-[1.5] text-[#1b1b1b] ${
                        isOpen ? 'font-semibold' : 'font-medium'
                      }`}>
                      {item.label}
                    </span>
                    <span
                      aria-hidden
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                        isOpen ? 'bg-[#ff3e09] text-white' : 'text-[#1b1b1b]'
                      }`}>
                      {isOpen ? (
                        <Minus className="size-[18px]" />
                      ) : (
                        <Plus className="size-[18px]" />
                      )}
                    </span>
                  </button>
                </h3>
                <div
                  id={`home-faq-a-${item.key}`}
                  role="region"
                  aria-labelledby={`home-faq-q-${item.key}`}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                    isOpen
                      ? 'visible grid-rows-[1fr] opacity-100'
                      : 'invisible grid-rows-[0fr] opacity-0'
                  }`}>
                  <div className="overflow-hidden">
                    <p className="pb-6 pl-[44px] pr-4 text-[16px] leading-[1.6] text-[#4a4642] md:pr-[60px]">
                      {item.children}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
