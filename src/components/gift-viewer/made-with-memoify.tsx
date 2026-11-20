'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { PageLanguage } from '@/lib/page-language';

/**
 * The one line a recipient sees about who made the page they were sent:
 * "Made with Memoify · Make yours", linking to where they can make one.
 *
 * Mounted once, by the session provider, under every recipient viewer
 * (`recipientViewerRoute` in lib/gift-routes.ts), and nowhere else: not on
 * the sample pages, not in the Create Flow, not on a wedding invitation.
 *
 * It sits in the page's flow below the gift rather than floating over it, so
 * it can never cover a gift's own controls (Unlock, Play, Next, the music
 * player, a full-screen book), whatever a template draws or wherever it draws
 * it. A dark translucent pill reads on a dark template and a light one alike.
 *
 * A template can pin its own controls to the bottom of the window: Spotify's
 * player bar, the round music button most templates float in the corner.
 * The line measures whatever is pinned across its own width and leaves that
 * much room beneath itself, so scrolled to the end it sits above them
 * instead of under them.
 *
 * Drawn only after the page has hydrated, and not at all on the maker's own
 * "your scrapbook is ready" view (`?isNew=true`), which is the creator's
 * screen rather than the recipient's. Reading the query that way rather than
 * through `useSearchParams` keeps every page under the root layout statically
 * renderable.
 */
const COPY: Record<PageLanguage, { made: string; make: string }> = {
  en: { made: 'Made with Memoify', make: 'Make yours' },
  id: { made: 'Dibuat dengan Memoify', make: 'Buat punyamu' },
};

/** Where a recipient of this template starts making their own. */
function startFor(route: string): string {
  if (/^scrapbook\d+$/.test(route)) return '/scrapbook';
  if (route === 'journal') return '/journal';
  if (route === 'photobox-newspaper') return '/photobox';
  return '/create';
}

export function makeYoursHref(route: string): string {
  const query = new URLSearchParams({
    utm_source: 'gift',
    utm_medium: 'viewer',
    utm_campaign: route,
  });
  return `${startFor(route)}?${query.toString()}`;
}

export default function MadeWithMemoify({
  route,
  lang,
}: {
  route: string;
  lang: PageLanguage;
}) {
  const [show, setShow] = useState(false);
  const [room, setRoom] = useState(0);
  const self = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setShow(query.get('isNew') !== 'true');
  }, [route]);

  useEffect(() => {
    if (!show) return;
    const measure = () => setRoom(bottomBarHeight(self.current));
    measure();
    // Players and bars often mount a moment after the page does.
    const later = window.setTimeout(measure, 1500);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(later);
      window.removeEventListener('resize', measure);
    };
  }, [show]);

  if (!show) return null;
  const t = COPY[lang] ?? COPY.en;

  return (
    <div
      ref={self}
      style={room ? { paddingBottom: room + 24 } : undefined}
      className="relative z-[1] flex justify-center px-4 py-6">
      <Link
        href={makeYoursHref(route)}
        data-made-with-memoify=""
        className="inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-[13px] leading-none text-white/90 no-underline shadow-sm ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-black/85 hover:text-white">
        <span>{t.made}</span>
        <span aria-hidden="true" className="text-white/50">
          ·
        </span>
        <span className="font-semibold text-white underline underline-offset-2">
          {t.make}
        </span>
      </Link>
    </div>
  );
}

/**
 * How much of the bottom of the window the page keeps for itself under this
 * line: the top of the highest fixed element that sits along the bottom edge
 * and across the line's own width (a player bar, or a floating play button
 * that would otherwise land on "Make yours"). Anything a third of the window
 * tall or more is a full-screen layer over the whole gift, and not counted.
 */
function bottomBarHeight(self: HTMLElement | null): number {
  const link = self?.querySelector('a');
  if (!self || !link) return 0;
  const own = link.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // The line's horizontal span with a little air either side.
  const left = Math.max(0, own.left - 12);
  const right = Math.min(vw, own.right + 12);
  let room = 0;
  for (const el of Array.from(
    document.body.querySelectorAll<HTMLElement>('*')
  )) {
    if (el === self || self.contains(el)) continue;
    if (getComputedStyle(el).position !== 'fixed') continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0 || r.height >= vh / 3) continue;
    if (r.bottom < vh - 120 || r.top >= vh) continue;
    if (r.right <= left || r.left >= right) continue;
    room = Math.max(room, Math.ceil(vh - r.top));
  }
  return room;
}
