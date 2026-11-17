'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { useInView } from 'react-intersection-observer';
import Masonry from 'react-masonry-css';

import { getInspirationPage } from '@/action/inspiration-api';
import { ClosingPanel } from '@/components/home/blocks';
import { ctaGhost, ctaPrimary, press } from '@/components/home/ui';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';
import type {
  InspirationFilter,
  InspirationItem,
  InspirationPage as Page,
} from '@/lib/inspiration';

import InspirationCard from './card';
import InspirationWall from './wall';

/**
 * The inspiration page, in the MemoRoll design system (owner, 2026-11-17:
 * "all beauty, well animated and catchy", and no broken thumbnails).
 *
 * - The hero's signature is the wall of real gifts drifting by (wall.tsx).
 * - Below it, the gifts people chose to share, as a masonry wall that
 *   keeps loading as you reach its end, with one chip per kind of gift.
 *   There is no search box: the backend's `keyword` matches the template's
 *   name, never a gift's title, so the old box only did what a chip does.
 * - A picture that no longer exists is never drawn: the server leaves the
 *   card out (action/inspiration-api.ts) and a card whose picture still
 *   fails in the browser removes itself (card.tsx).
 *
 * Motion (emilkowalski/skills): the hero opens as one wave; cards fade and
 * rise once as they are first seen; the filter bar does not animate - it
 * is used many times a visit, and a chip answers on press.
 */

const COLUMNS = { default: 4, 1180: 3, 760: 2 };

const at = (ms: number, rise: number): CSSProperties =>
  ({ '--at': `${ms}ms`, '--rise': `${rise}px` }) as CSSProperties;

/** Tiles holding the wall's place while a page of it is on its way. */
function Waiting({ count }: { count: number }) {
  return (
    <Masonry
      breakpointCols={COLUMNS}
      className="insp-grid"
      columnClassName="insp-col">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[20px] bg-[#f1e8dd] motion-reduce:animate-none"
          style={{
            aspectRatio: ['4 / 5', '1 / 1', '3 / 4', '5 / 6'][index % 4],
          }}
        />
      ))}
    </Masonry>
  );
}

export default function InspirationPage({
  first,
  filters,
}: {
  /** The first page of everything, fetched with the page itself. */
  first: Page;
  filters: InspirationFilter[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<InspirationItem[]>(first.items);
  const [hasMore, setHasMore] = useState(first.hasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  // Only the latest question's answer is used; an older one arriving late
  // is dropped rather than drawn over the newer.
  const asked = useRef(0);
  const templateIds =
    filters.find((entry) => entry.key === filter)?.templateIds ?? [];
  const idsKey = templateIds.join(',');

  const load = useCallback(
    async (nextPage: number) => {
      const mine = ++asked.current;
      setLoading(true);
      let answer: Page = { items: [], hasMore: false };
      try {
        answer = await getInspirationPage({
          page: nextPage,
          templateIds: idsKey ? idsKey.split(',') : [],
        });
      } catch {
        // Nothing to add; the end-of-wall line below says so.
      }
      if (mine !== asked.current) return;
      setItems((old) => {
        if (nextPage === 1) return answer.items;
        const have = new Set(old.map((item) => item.id));
        return [...old, ...answer.items.filter((item) => !have.has(item.id))];
      });
      setHasMore(answer.hasMore);
      setPage(nextPage);
      setLoading(false);
    },
    [idsKey]
  );

  // A new filter starts the wall again. The first paint already
  // has the unfiltered first page, so that one is not asked for twice.
  const opened = useRef(false);
  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      return;
    }
    setItems([]);
    load(1);
  }, [load]);

  const { ref: end, inView: atEnd } = useInView({ rootMargin: '600px 0px' });
  useEffect(() => {
    if (atEnd && hasMore && !loading) load(page + 1);
  }, [atEnd, hasMore, loading, page, load]);

  const wall = first.items
    .map((item) => item.image)
    .filter((image): image is string => Boolean(image));
  const fresh = loading && items.length === 0;

  return (
    <div className={`${memorollFonts} ${landingFonts}`}>
      <div className="fixed left-0 top-0 z-[1000] w-full isolate">
        <NavigationBar />
      </div>
      <main
        className="mt-[81px] overflow-x-clip bg-[#fbf4ec]"
        style={{ fontFamily: 'var(--font-mr-body)' }}>
        <section className="px-5 pb-10 pt-10 md:pb-14 md:pt-14">
          <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-10 lg:flex-row lg:gap-12">
            <div className="flex w-full flex-col items-center text-center lg:w-[52%] lg:items-start lg:text-left">
              <span
                className="home-enter inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium tracking-[-0.28px] text-[#e34013]"
                style={at(0, 0)}>
                <span className="size-[6px] rounded-full bg-[#ff3e09]" />
                Inspiration
              </span>
              <h1
                className="home-enter mt-5 text-balance text-[40px] font-bold leading-[1.04] tracking-[-0.045em] text-[#1b1b1b] sm:text-[56px] lg:text-[64px]"
                style={at(0, 18)}>
                See what people made for{' '}
                <span className="text-[#ff3e09]">the ones they love.</span>
              </h1>
              <p
                className="home-enter mt-5 max-w-[500px] text-[16px] leading-[1.6] text-[#4a4642] md:text-[19px]"
                style={at(90, 12)}>
                Real gifts, scrapbooks and journals their makers chose to share.
                Open one, borrow the idea, make it yours.
              </p>
              <div
                className="home-enter mt-7 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
                style={at(160, 8)}>
                <Link href="/create" prefetch className={`group ${ctaPrimary}`}>
                  Create a gift
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
                  />
                </Link>
                <a href="#wall" className={ctaGhost}>
                  Browse the wall
                </a>
              </div>
            </div>
            <div className="home-enter w-full lg:w-[48%]" style={at(120, 0)}>
              <InspirationWall images={wall} />
            </div>
          </div>
        </section>

        <section id="wall" className="scroll-mt-[81px] px-5 pb-16 md:pb-24">
          <div className="mx-auto max-w-[1180px]">
            {/* The chips stay in reach while the wall scrolls. */}
            <div className="sticky top-[81px] z-30 -mx-5 border-b border-[#e8ded3] bg-[#fbf4ec]/95 px-5 py-3 backdrop-blur">
              <div
                role="group"
                aria-label="Kind of gift"
                className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                {[{ key: 'all', label: 'All' }, ...filters].map((entry) => {
                  const on = entry.key === filter;
                  return (
                    <button
                      key={entry.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFilter(entry.key)}
                      className={`h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold ${press} ${
                        on
                          ? 'bg-[#1b1b1b] text-[#fbf4ec]'
                          : 'border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] text-[#1b1b1b]'
                      }`}>
                      {entry.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 min-h-[50vh]">
              {fresh ? (
                <Waiting count={8} />
              ) : items.length > 0 ? (
                <Masonry
                  breakpointCols={COLUMNS}
                  className="insp-grid"
                  columnClassName="insp-col">
                  {items.map((item, index) => (
                    <InspirationCard key={item.id} item={item} order={index} />
                  ))}
                </Masonry>
              ) : !hasMore ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <p className="text-[20px] font-bold tracking-[-0.02em] text-[#1b1b1b]">
                    Nothing shared here yet
                  </p>
                  <p className="mt-2 max-w-[360px] text-[15px] leading-[1.6] text-[#4a4642]">
                    Nobody has shared one of these yet. Yours could be the
                    first.
                  </p>
                </div>
              ) : null}

              {hasMore ? (
                <div ref={end} className="pt-4">
                  {loading && items.length > 0 ? <Waiting count={4} /> : null}
                </div>
              ) : items.length > 0 ? (
                <p className="pt-10 text-center text-[14px] font-medium text-[#8a847d]">
                  That is the whole wall. The next one could be yours.
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <ClosingPanel
          ground="#fbf4ec"
          title="Now make one of your own."
          body="Pick the style that sounds like them. Your first gift is free."
          action="Create a gift"
          onAction={() => router.push('/create')}
          second={{ label: 'Browse templates', href: '/templates' }}
        />
      </main>
    </div>
  );
}
