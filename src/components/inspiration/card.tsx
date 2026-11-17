'use client';

import { useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef, useState } from 'react';

import { EASE_OUT } from '@/components/home/ui';
import type { InspirationItem } from '@/lib/inspiration';

/**
 * One gift on the inspiration wall.
 *
 * A picture card is drawn in three states:
 * - waiting: a quiet paper tile holds its place, so nothing below jumps
 *   when the picture arrives;
 * - arrived: the card fades and rises in, once, the first time it is both
 *   loaded and on screen (strong ease-out; a wall seen once per visit);
 * - gone: the picture failed in the browser after all (the server already
 *   left out the ones it knew were deleted) and the card removes itself.
 *   There is never a broken image and never a placeholder standing in.
 *
 * Under a real pointer the picture eases closer and the title comes up; a
 * finger has no hover, so there the title is simply always shown.
 */

// The pointer gate is written out in each class: Tailwind only generates
// classes it can read whole in the source.

/**
 * A title nobody wrote: the creator's default, or just the kind of gift
 * again. The card says the kind already, so it shows no title instead.
 */
function titleOf(item: InspirationItem): string {
  const title = item.title.trim();
  const filler = ['scrapbook ai', 'a title', item.label.toLowerCase()];
  return filler.includes(title.toLowerCase()) ? '' : title;
}

/** A card's proportions: what the template's lead picture usually is. */
function ratioOf(item: InspirationItem): string {
  if (/^scrapbook\d+$/.test(item.route)) return '3 / 4';
  if (item.route === 'photobox-newspaper') return '3 / 4';
  if (['netflixv1', 'disneyplusv1'].includes(item.route)) return '4 / 5';
  // The rest vary a little, the same way every visit.
  let sum = 0;
  for (const char of item.id) sum += char.charCodeAt(0);
  return ['1 / 1', '4 / 5', '5 / 6'][sum % 3];
}

function Label({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#1b1b1b] shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
      {children}
    </span>
  );
}

/** Fades and rises once, when `ready` and first seen. */
function useArrival(ready: boolean, order: number) {
  const ref = useRef<HTMLAnchorElement>(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -6% 0px' });
  const here = ready && seen;
  // Cards in one row arrive as a short wave, not all at once.
  const delay = [0, 60, 100, 130][order % 4];
  return {
    ref,
    style: {
      opacity: here ? 1 : 0,
      transform: here ? 'translateY(0)' : 'translateY(14px)',
      transition: `opacity 520ms ${EASE_OUT} ${delay}ms, transform 520ms ${EASE_OUT} ${delay}ms`,
    },
  };
}

function PictureCard({
  item,
  order,
}: {
  item: InspirationItem;
  order: number;
}) {
  const [state, setState] = useState<'waiting' | 'arrived' | 'gone'>('waiting');
  const arrival = useArrival(state === 'arrived', order);
  const title = titleOf(item);
  if (state === 'gone') return null;

  return (
    <div
      className="relative overflow-hidden rounded-[20px] bg-[#f1e8dd]"
      style={{ aspectRatio: ratioOf(item) }}>
      <a
        ref={arrival.ref}
        href={item.link}
        target="_blank"
        rel="noreferrer"
        aria-label={`${title || 'Untitled'}, a ${item.label}. Opens in a new tab`}
        className="group absolute inset-0 block overflow-hidden rounded-[20px] transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] motion-reduce:!translate-y-0"
        style={arrival.style}>
        <img
          src={item.image}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          // A cached picture can be complete before React listens.
          ref={(node) => {
            if (node?.complete && node.naturalWidth > 0) setState('arrived');
          }}
          onLoad={() => setState('arrived')}
          onError={() => setState('gone')}
          className={`h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]`}
        />
        <span className="absolute left-3 top-3">
          <Label>{item.label}</Label>
        </span>
        <span
          className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-3.5 pt-12 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 group-focus-visible:!opacity-100`}>
          <span className="line-clamp-2 text-[14px] font-semibold leading-[1.3] text-white">
            {title}
          </span>
          <ArrowUpRight
            aria-hidden
            className="mb-0.5 size-4 shrink-0 text-white"
          />
        </span>
      </a>
    </div>
  );
}

function JournalCard({
  item,
  order,
}: {
  item: InspirationItem;
  order: number;
}) {
  const arrival = useArrival(true, order);
  const journal = item.journal;
  return (
    <a
      ref={arrival.ref}
      href={item.link}
      target="_blank"
      rel="noreferrer"
      aria-label={`${item.title}, a ${item.label}. Opens in a new tab`}
      className={`group block rounded-[20px] border border-[#e0d6ca] bg-white p-5 transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] motion-reduce:!translate-y-0`}
      style={arrival.style}>
      <span className="flex items-center justify-between gap-2">
        <Label>{item.label}</Label>
        <span className="paper-serif truncate text-[11px] uppercase tracking-[0.12em] text-[#8a847d]">
          {journal?.volume}
        </span>
      </span>
      <span className="paper-serif mt-4 block">
        <span className="line-clamp-3 block text-[18px] font-bold leading-[1.25] text-[#1b1b1b]">
          {item.title}
        </span>
        {journal?.author ? (
          <span className="mt-1.5 block truncate text-[12px] italic text-[#6b655f]">
            {journal.author}
          </span>
        ) : null}
        {journal?.abstract ? (
          <span className="mt-3 line-clamp-4 block text-[13px] leading-[1.65] text-[#35302b]">
            {journal.abstract}
          </span>
        ) : null}
      </span>
      <span className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-[#e34013]">
        Read it
        <ArrowUpRight
          aria-hidden
          className={`size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5`}
        />
      </span>
    </a>
  );
}

export default function InspirationCard({
  item,
  order,
}: {
  item: InspirationItem;
  order: number;
}) {
  return item.journal ? (
    <JournalCard item={item} order={order} />
  ) : (
    <PictureCard item={item} order={order} />
  );
}
