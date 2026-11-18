'use client';

import { Input } from 'antd';
import { SearchIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useRef, useState } from 'react';

import { getAllJournalCards } from '@/action/journal-api';
import MemorollFormTheme from '@/components/forms/memoroll-form-theme';
import { SectionHead, press } from '@/components/home/ui';
import type { JournalCardData } from '@/lib/journal-card';
import type { PageLanguage } from '@/lib/page-language';

import { JOURNAL_COPY } from './copy';

const JournalCard = dynamic(
  () => import('@/app/(landing)/(core)/journal/view/JournalCard'),
  { ssr: false }
);

/** How many journal cards to mount at a time. */
const PER_PAGE = 24;

/**
 * The published journals, with the search the page always had (by the
 * person it is for, or its author).
 *
 * The page arrives with the first cards and the count. The rest of the
 * list is fetched once, the first time it is needed: when the visitor asks
 * for more or starts a search. Most visitors do neither, and no longer
 * download hundreds of journals to see twenty-four.
 *
 * The list does not animate in: there are hundreds of cards, so they mount
 * a page at a time and simply appear.
 */
export default function JournalPublished({
  first,
  total,
  lang = 'en',
}: {
  first: JournalCardData[];
  total: number;
  lang?: PageLanguage;
}) {
  const t = JOURNAL_COPY[lang].published;
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PER_PAGE);
  /** The whole list, once fetched. Until then only `first` is known. */
  const [all, setAll] = useState<JournalCardData[] | null>(null);
  const [failed, setFailed] = useState(false);
  const asked = useRef<Promise<void> | null>(null);

  /** Fetch the whole list, once; a failure can be tried again. */
  const loadAll = useCallback(() => {
    if (asked.current) return asked.current;
    setFailed(false);
    asked.current = getAllJournalCards()
      .then((cards) => {
        // An empty answer for a list known to have journals is a failure.
        if (cards.length === 0 && total > 0) throw new Error('empty');
        setAll(cards);
      })
      .catch(() => {
        asked.current = null;
        setFailed(true);
      });
    return asked.current;
  }, [total]);

  const wanted = query.trim().toLowerCase();
  const journals = all ?? first;
  const found = useMemo(() => {
    if (!wanted) return journals;
    return journals.filter((journal) => journal.names.includes(wanted));
  }, [journals, wanted]);

  // A search can only be answered from the whole list.
  const searching = wanted !== '' && all === null && !failed;
  const loadingMore = all === null && shown > first.length && !failed;
  const count = wanted || all ? found.length : total;
  const left = count - Math.min(shown, found.length);

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
            onFocus={() => void loadAll()}
            onChange={(event) => {
              void loadAll();
              setQuery(event.target.value);
              // A new search starts from the first page again.
              setShown(PER_PAGE);
            }}
            prefix={
              <SearchIcon aria-hidden className="size-4 text-[#8a847d]" />
            }
          />
        </div>

        {searching ? (
          <p
            role="status"
            className="mt-10 text-center text-[16px] text-[#4a4642]">
            {t.searching}
          </p>
        ) : found.length > 0 && !(failed && wanted) ? (
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {found.slice(0, shown).map((entry) => (
              <JournalCard key={entry.id} card={entry} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-[16px] text-[#4a4642]">
            {failed && wanted
              ? t.failed
              : wanted
                ? t.noMatch(query.trim())
                : t.empty}
          </p>
        )}

        {left > 0 && !searching ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => {
                void loadAll();
                setShown((now) => now + PER_PAGE);
              }}
              className={`inline-flex h-12 items-center justify-center rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] px-7 text-[16px] font-semibold text-[#1b1b1b] ${press}`}>
              {loadingMore ? t.loading : failed ? t.retry : t.more(left)}
            </button>
          </div>
        ) : null}
      </MemorollFormTheme>
    </section>
  );
}
