'use client';

import { useQuery } from '@tanstack/react-query';
import { useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { getInspirationPage } from '@/action/inspiration-api';
import type { InspirationItem } from '@/lib/inspiration';

import { Rise, SectionHead, press } from './ui';

/**
 * A look at the inspiration page from the home page (owner, 2026-11-17):
 * real gifts people chose to share, passing by in two rows, and a way to
 * the whole wall.
 *
 * - The gifts are asked for only when the section is nearly on screen, so
 *   the home page's first paint does not wait for them. The cards come from
 *   the inspiration page's own source (action/inspiration-api.ts), so a
 *   picture that has been deleted is already left out; one that still
 *   fails in the browser removes itself.
 * - Too few gifts to fill the rows, or no answer: the section is not drawn
 *   at all rather than drawn thin.
 * - Constant motion, so it is linear and `transform` only (the same
 *   `home-marquee` as the occasions line); the second row runs the other
 *   way. A real pointer over a row holds it still so a gift can be opened.
 *   Reduced motion: no drift, the rows scroll by hand instead.
 */

const ENOUGH = 8;
const FILLS_A_SCREEN = 14;

function Tile({ item, hidden }: { item: InspirationItem; hidden: boolean }) {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noreferrer"
      // The second copy of a row is there for the loop, not to be read.
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      aria-label={`A ${item.label} someone made. Opens in a new tab`}
      className={`group relative block aspect-[4/5] w-[168px] shrink-0 overflow-hidden rounded-[20px] bg-[#2a2a2a] md:w-[220px] ${press}`}>
      <img
        src={item.image}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setGone(true)}
        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
      />
      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#1b1b1b]">
        {item.label}
      </span>
    </a>
  );
}

function Row({
  items,
  seconds,
  reverse = false,
}: {
  items: InspirationItem[];
  seconds: number;
  reverse?: boolean;
}) {
  // One copy of the row has to be wider than any screen, or the loop would
  // show its own end: a short row is repeated until it is.
  const count = items.length;
  while (items.length < FILLS_A_SCREEN) items = [...items, ...items];
  return (
    <div className="overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className="flex w-max motion-reduce:!animate-none [@media(hover:hover)_and_(pointer:fine)]:hover:[animation-play-state:paused]"
        // Written out, not as the `animation` shorthand: the shorthand would
        // also set the play state here, and the hover pause could not win.
        style={{
          animationName: 'home-marquee',
          // So many seconds a tile: the pace stays the same however long the row.
          animationDuration: `${items.length * seconds}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: reverse ? 'reverse' : 'normal',
        }}>
        {[false, true].map((copy) => (
          <div
            key={String(copy)}
            className={`flex shrink-0 gap-4 pr-4 ${copy ? 'motion-reduce:hidden' : ''}`}>
            {items.map((item, index) => (
              <Tile
                key={`${item.id}-${index}`}
                item={item}
                // A gift repeated to fill the row is read once.
                hidden={copy || index >= count}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeInspirationPreview() {
  const section = useRef<HTMLDivElement>(null);
  const near = useInView(section, { once: true, margin: '700px 0px' });

  const { data, isFetched } = useQuery({
    queryKey: ['home-inspiration'],
    // Two pages, so a row is rarely long enough to show a gift twice.
    queryFn: async () => {
      const pages = await Promise.all([
        getInspirationPage({ page: 1 }),
        getInspirationPage({ page: 2 }),
      ]);
      const seen = new Set<string>();
      return pages
        .flatMap((page) => page.items)
        .filter((item) => !seen.has(item.id) && Boolean(seen.add(item.id)));
    },
    enabled: near,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const pictures = (data ?? []).filter((item) => item.image);
  // Asked and not enough came back: no section.
  if (isFetched && pictures.length < ENOUGH) return null;

  const half = Math.ceil(pictures.length / 2);
  const rows = [pictures.slice(0, half), pictures.slice(half)];

  return (
    <section
      ref={section}
      aria-label="Inspiration"
      className="overflow-hidden bg-[#1b1b1b] py-16 md:py-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="px-5">
        <SectionHead
          tone="paper"
          eyebrow="Inspiration"
          title="Made by people like you"
          body="Real gifts their makers chose to share. Open one and borrow the idea."
        />
      </div>

      <div className="mt-12 flex min-h-[452px] flex-col gap-4 md:mt-16 md:min-h-[566px]">
        {pictures.length >= ENOUGH ? (
          <>
            <Row items={rows[0]} seconds={8} />
            <Row items={rows[1]} seconds={9.5} reverse />
          </>
        ) : (
          // Holding the rows' place while the gifts are on their way.
          [0, 1].map((row) => (
            <div key={row} aria-hidden className="flex gap-4 overflow-hidden">
              {Array.from({ length: 9 }, (_, index) => (
                <span
                  key={index}
                  className="aspect-[4/5] w-[168px] shrink-0 animate-pulse rounded-[20px] bg-[#2a2a2a] motion-reduce:animate-none md:w-[220px]"
                />
              ))}
            </div>
          ))
        )}
      </div>

      <Rise className="mt-10 flex justify-center px-5 md:mt-14">
        <Link
          href="/inspiration"
          prefetch
          className={`group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff3e09] px-7 text-[16px] font-semibold text-white shadow-[inset_2px_3px_3.2px_rgba(255,255,255,0.25)] md:h-14 md:text-[17px] ${press}`}>
          See the whole wall
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
          />
        </Link>
      </Rise>
    </section>
  );
}
