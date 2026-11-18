'use client';

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { BeatPills } from '@/components/home/beat';
import { useCalmMotion } from '@/lib/use-calm-motion';

import type { PageLanguage } from '@/lib/page-language';

import { SCRAPBOOK_COPY } from './copy';

/**
 * The scrapbook landing's signature: an open scrapbook that turns its own
 * pages, each spread a different style.
 *
 * A page really turns: the right-hand page lifts over the spine and lands
 * as the next spread's left-hand page, with the next right-hand page
 * already lying underneath.
 *
 * Motion (emilkowalski/skills: animate + choreograph):
 * - one thing moves, the turning page, and it is movement on screen, so the
 *   strong ease-in-out; `rotateY` only, with a shade that is opacity only;
 * - the turn is a keyframe that plays to the end: a tap mid-turn does not
 *   restart it, the book goes on to the latest spread asked for as soon as
 *   the page lands;
 * - the beat is the progress pill's own CSS animation (see home/beat.tsx),
 *   paused under a real pointer and off screen;
 * - reduced motion: no turning and no autoplay; the spread is replaced.
 *
 * The pages are the product's own scrapbook previews, cropped.
 */

export interface Style {
  key: string;
  name: string;
  /**
   * The `route` the creator opens this design with. Not always the design's
   * own number: the creator shows design 3 for `scrapbook1`, design 1 for
   * `scrapbook2` and design 2 for `scrapbook3` (`scrapbookPreview` in
   * scrapbook/create/page.tsx, and the note in lib/template-thumbnail.ts).
   */
  route: string;
}

export const STYLES: Style[] = [
  {
    key: 'garden',
    name: 'Garden',
    route: 'scrapbook1',
  },
  {
    key: 'sweet',
    name: 'Sweetheart',
    route: 'scrapbook2',
  },
  {
    key: 'folder',
    name: 'Case file',
    route: 'scrapbook7',
  },
  {
    key: 'rose',
    name: 'Rosé',
    route: 'scrapbook8',
  },
  {
    key: 'retro',
    name: 'Mixtape',
    route: 'scrapbook6',
  },
  {
    key: 'vintage',
    name: 'Vintage',
    route: 'scrapbook3',
  },
];

export const page = (style: Style, side: 'l' | 'r') =>
  `/landing/page-${style.key}-${side}.webp`;

const BEAT_MS = 4200;
const TURN_MS = 950;
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';

function Page({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      width={450}
      height={600}
      decoding="async"
      draggable={false}
      className="block h-full w-full object-cover"
    />
  );
}

export default function ScrapbookBook({
  active,
  onNext,
  onJump,
  lang = 'en',
}: {
  active: number;
  onNext: () => void;
  onJump: (index: number) => void;
  lang?: PageLanguage;
}) {
  const t = SCRAPBOOK_COPY[lang].book;
  const reduce = useCalmMotion();
  const frame = useRef<HTMLDivElement>(null);
  const onScreen = useInView(frame, { amount: 0.35 });
  const [hovered, setHovered] = useState(false);
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  // The spread lying open, and the one a page is turning toward.
  const [open, setOpen] = useState(active);
  const [toward, setToward] = useState<number | null>(null);

  useEffect(() => {
    if (toward !== null || active === open) return;
    if (reduce) setOpen(active);
    else setToward(active);
  }, [active, open, toward, reduce]);

  const land = () => {
    if (toward === null) return;
    setOpen(toward);
    setToward(null);
  };

  const from = STYLES[open];
  const to = toward === null ? null : STYLES[toward];
  // Fetched ahead, so the page that turns is never blank.
  const ahead = STYLES[(open + 1) % STYLES.length];
  const running = !reduce && onScreen && !hovered;

  return (
    <div className="mx-auto w-full max-w-[780px]">
      <div
        ref={frame}
        onPointerEnter={() => fine && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        // The cover the pages lie on.
        className="rounded-[14px] bg-[#1b1b1b] p-[6px] shadow-[0_36px_64px_-28px_rgba(90,42,18,0.5)] md:rounded-[18px] md:p-[10px]">
        <button
          type="button"
          onClick={onNext}
          aria-label={`${t.alts[STYLES[active].key]}. ${t.turn}`}
          className="relative block aspect-[900/600] w-full overflow-hidden rounded-[8px] bg-[#fffdfa] md:rounded-[10px]"
          style={{ perspective: 1800 }}>
          <span className="absolute inset-y-0 left-0 w-1/2">
            <Page key={from.key} src={page(from, 'l')} />
          </span>
          <span className="absolute inset-y-0 right-0 w-1/2">
            <Page key={(to ?? from).key} src={page(to ?? from, 'r')} />
          </span>

          {to ? (
            <span
              key={`${from.key}-${to.key}`}
              onAnimationEnd={(event) => {
                // The shade inside ends too; only the page's own turn lands.
                if (event.target === event.currentTarget) land();
              }}
              className="absolute inset-y-0 left-1/2 w-1/2 origin-left will-change-transform"
              style={{
                transformStyle: 'preserve-3d',
                animation: `book-turn ${TURN_MS}ms ${EASE_IN_OUT} both`,
              }}>
              <span
                className="absolute inset-0"
                style={{ backfaceVisibility: 'hidden' }}>
                <Page src={page(from, 'r')} />
                <span
                  className="absolute inset-0 bg-black opacity-0"
                  style={{
                    animation: `book-shade ${TURN_MS}ms linear both`,
                  }}
                />
              </span>
              <span
                className="absolute inset-0"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}>
                <Page src={page(to, 'l')} />
              </span>
            </span>
          ) : null}

          {/* The gutter: where the two pages meet. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 w-[9%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(27,27,27,0.16)_48%,rgba(27,27,27,0.22)_50%,rgba(27,27,27,0.16)_52%,transparent)]"
          />

          <span aria-hidden className="hidden">
            <img src={page(ahead, 'l')} alt="" />
            <img src={page(ahead, 'r')} alt="" />
          </span>
        </button>
      </div>

      <div className="mt-5 flex flex-col items-center gap-2">
        <p
          key={STYLES[active].key}
          className="home-enter text-[13px] font-semibold text-[#4a4642]"
          style={{ ['--rise' as string]: '0px' }}>
          {t.style}:{' '}
          <span className="text-[#e34013]">{STYLES[active].name}</span>
        </p>
        <BeatPills
          labels={STYLES.map((style) => t.show(style.name))}
          active={active}
          running={running && toward === null}
          still={reduce}
          ms={BEAT_MS}
          onNext={onNext}
          onJump={onJump}
        />
      </div>
    </div>
  );
}
