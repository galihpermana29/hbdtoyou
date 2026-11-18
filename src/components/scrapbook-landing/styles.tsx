'use client';

import { ArrowRight } from 'lucide-react';

import { useStart } from '@/components/home/blocks';
import { Rise, SectionHead, press } from '@/components/home/ui';

import { STYLES, page } from './book';
import { SCRAPBOOK_COPY } from './copy';
import type { PageLanguage } from '@/lib/page-language';

/**
 * Every style as the spread it makes; a card opens the creator on that
 * style.
 *
 * The cards enter as one wave per row (lead first, shrinking gaps). Under a
 * real pointer a card lifts and its arrow nudges; a finger gets the press
 * only - hover that sticks after a tap is worse than none.
 */
export default function ScrapbookStyles({
  lang = 'en',
}: {
  lang?: PageLanguage;
}) {
  const t = SCRAPBOOK_COPY[lang].styles;
  const alts = SCRAPBOOK_COPY[lang].book.alts;
  const start = useStart('/scrapbook/create');
  return (
    <section
      id="styles"
      className="scroll-mt-[81px] bg-[#fffdfa] px-5 py-16 md:py-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto max-w-[1180px]">
        <SectionHead eyebrow={t.eyebrow} title={t.title} body={t.body} />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {STYLES.map((style, index) => (
            <Rise
              key={style.key}
              delay={[0, 90, 150][index % 3]}
              distance={[20, 14, 10][index % 3]}>
              <button
                type="button"
                onClick={() => start(`/scrapbook/create?route=${style.route}`)}
                aria-label={t.make(style.name)}
                className={`group block w-full rounded-[28px] border border-[#e8ded3] bg-[#fbf4ec] p-4 text-left ${press} [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1`}>
                <span className="flex overflow-hidden rounded-[14px] border border-black/10">
                  <img
                    src={page(style, 'l')}
                    alt=""
                    width={450}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="block w-1/2"
                  />
                  <img
                    src={page(style, 'r')}
                    alt={alts[style.key]}
                    width={450}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="block w-1/2"
                  />
                </span>
                <span className="mt-4 flex items-center justify-between px-1 pb-1">
                  <span className="text-[18px] font-bold tracking-[-0.02em] text-[#1b1b1b]">
                    {style.name}
                  </span>
                  <span className="flex items-center gap-1 text-[14px] font-semibold text-[#e34013]">
                    {t.use}
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
              </button>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
