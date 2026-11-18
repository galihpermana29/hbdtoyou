'use client';

import { Input } from 'antd';
import { SearchIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

import type { IContent } from '@/action/interfaces';
import MemorollFormTheme from '@/components/forms/memoroll-form-theme';
import { SectionHead, press } from '@/components/home/ui';
import type { PageLanguage } from '@/lib/page-language';

import { JOURNAL_COPY } from './copy';

const JournalCard = dynamic(
  () => import('@/app/(landing)/(core)/journal/view/JournalCard'),
  { ssr: false }
);

/** How many journal cards to mount at a time. */
const PER_PAGE = 24;

/** A journal's addressee and author, for the search. Unreadable: no match. */
function names(journal: IContent): string {
  try {
    const data = JSON.parse(journal.detail_content_json_text);
    return `${data.destinationName ?? ''} ${data.author ?? ''}`.toLowerCase();
  } catch {
    return '';
  }
}

/**
 * The published journals, with the search the page always had (by the
 * person it is for, or its author).
 *
 * The list does not animate in: there are hundreds of cards, each parsing a
 * whole journal, so they mount a page at a time and simply appear.
 */
export default function JournalPublished({
  journals,
  lang = 'en',
}: {
  journals: IContent[];
  lang?: PageLanguage;
}) {
  const t = JOURNAL_COPY[lang].published;
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PER_PAGE);

  const found = useMemo(() => {
    const wanted = query.trim().toLowerCase();
    if (!wanted) return journals;
    return journals.filter((journal) => names(journal).includes(wanted));
  }, [journals, query]);

  const left = found.length - shown;

  return (
    <section
      id="published"
      className="scroll-mt-[81px] bg-[#fbf4ec] px-5 py-16 md:py-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <MemorollFormTheme className="mx-auto max-w-[1180px]">
        <SectionHead eyebrow={t.eyebrow} title={t.title} body={t.body} />
        <div className="mx-auto mt-8 max-w-[420px]">
          <Input
            aria-label={t.search}
            placeholder={t.placeholder}
            size="large"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              // A new search starts from the first page again.
              setShown(PER_PAGE);
            }}
            prefix={
              <SearchIcon aria-hidden className="size-4 text-[#8a847d]" />
            }
          />
        </div>

        {found.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {found.slice(0, shown).map((entry) => (
              <JournalCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-[16px] text-[#4a4642]">
            {query.trim() ? t.noMatch(query.trim()) : t.empty}
          </p>
        )}

        {left > 0 ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShown((count) => count + PER_PAGE)}
              className={`inline-flex h-12 items-center justify-center rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] px-7 text-[16px] font-semibold text-[#1b1b1b] ${press}`}>
              {t.more(left)}
            </button>
          </div>
        ) : null}
      </MemorollFormTheme>
    </section>
  );
}
