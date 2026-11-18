'use client';

import { ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';

import { useBeat } from '@/components/home/beat';
import { useStart } from '@/components/home/blocks';
import { ctaGhost, ctaPrimary } from '@/components/home/ui';

import type { PageLanguage } from '@/lib/page-language';

import ScrapbookBook, { STYLES } from './book';
import { SCRAPBOOK_COPY } from './copy';

/**
 * The scrapbook page's first screen: what it is, over an open scrapbook
 * that turns its own pages (book.tsx).
 *
 * The opening is one wave, lead first, gaps shrinking:
 *
 *   headline  lead         0ms  rise 18px
 *   body      support     90ms  rise 12px
 *   actions   support    160ms  rise 8px
 *   proof     decoration 210ms  fade
 *   book      its own group: rises once, 120ms, then turns on its beat
 */

const at = (ms: number, rise: number): CSSProperties =>
  ({ '--at': `${ms}ms`, '--rise': `${rise}px` }) as CSSProperties;

export default function ScrapbookHero({
  lang = 'en',
}: {
  lang?: PageLanguage;
}) {
  const t = SCRAPBOOK_COPY[lang].hero;
  const beat = useBeat(STYLES.length);
  const start = useStart('/scrapbook/create');

  return (
    <section
      className="relative overflow-hidden bg-[#fbf4ec] px-5 pb-16 pt-10 md:pb-24 md:pt-14"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto flex max-w-[1180px] flex-col items-center">
        <span
          className="home-enter inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium tracking-[-0.28px] text-[#e34013]"
          style={at(0, 0)}>
          <span className="size-[6px] rounded-full bg-[#ff3e09]" />
          {t.pill}
        </span>

        <h1
          className="home-enter mt-5 max-w-[860px] text-balance text-center text-[40px] font-bold leading-[1.04] tracking-[-0.045em] text-[#1b1b1b] sm:text-[56px] md:text-[72px]"
          style={at(0, 18)}>
          {t.headingLead}{' '}
          <span className="text-[#ff3e09]">{t.headingAccent}</span>
        </h1>

        <p
          className="home-enter mt-4 max-w-[560px] text-center text-[16px] leading-[1.6] text-[#4a4642] md:text-[19px]"
          style={at(90, 12)}>
          {t.body}
        </p>

        <div
          className="home-enter mt-7 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          style={at(160, 8)}>
          <button
            type="button"
            onClick={() => start()}
            className={`group ${ctaPrimary}`}>
            {t.make}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
            />
          </button>
          <a href="#styles" className={ctaGhost}>
            {t.styles}
          </a>
        </div>

        <p
          className="home-enter mt-4 text-[13px] font-medium text-[#8a847d]"
          style={at(210, 0)}>
          {t.proof}
        </p>

        <div
          className="home-enter relative mt-9 w-full md:mt-12"
          style={at(120, 22)}>
          <div
            aria-hidden
            className="pointer-events-none absolute -left-2 bottom-[22%] z-20 hidden size-[112px] -rotate-12 flex-col items-center justify-center rounded-full bg-[#ff3e09] text-white xl:flex">
            <span
              className="text-[34px] leading-8"
              style={{ fontFamily: 'var(--font-mr-badge)' }}>
              MEMO
            </span>
            <span
              className="text-[11px] tracking-[1.2px]"
              style={{ fontFamily: 'var(--font-mr-label)' }}>
              {t.badge}
            </span>
          </div>
          <p
            aria-hidden
            className="pointer-events-none absolute -right-1 top-[14%] z-20 hidden w-[150px] rotate-6 text-[26px] leading-[1.05] text-[#1b1b1b] xl:block"
            style={{ fontFamily: 'var(--font-mr-hand)' }}>
            {t.hint}
          </p>
          <ScrapbookBook
            active={beat.active}
            onNext={beat.next}
            onJump={beat.jump}
            lang={lang}
          />
        </div>
      </div>
    </section>
  );
}
