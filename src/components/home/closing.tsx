import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { RevealHeading } from '@/components/memoroll/landing/reveal-words';

import { Rise, press } from './ui';

/**
 * The last word: one flame panel, one line, one action. The line arrives
 * word by word (the page's headings all do); the gifts tucked behind it are
 * decoration, so they fade in and do not move.
 */
const TUCKED: [string, string][] = [
  ['/home/gift-magazine.webp', 'left-[-6%] top-[14%] -rotate-[10deg]'],
  ['/home/gift-scrapbook.webp', 'right-[-5%] top-[8%] rotate-[9deg]'],
  ['/home/gift-game.webp', 'left-[4%] bottom-[-16%] rotate-[6deg]'],
  ['/home/gift-playlist.webp', 'right-[3%] bottom-[-18%] -rotate-[7deg]'],
];

export default function HomeClosing() {
  return (
    <section
      className="bg-[#fffdfa] px-5 pb-16 md:pb-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="relative mx-auto flex max-w-[1180px] flex-col items-center overflow-hidden rounded-[32px] bg-[#ff3e09] px-6 py-16 text-center md:py-[104px]">
        {TUCKED.map(([src, pose], index) => (
          // The pose sits on the outer box: Rise sets its own transform.
          <div
            key={src}
            aria-hidden
            className={`pointer-events-none absolute hidden w-[240px] lg:block ${pose}`}>
            <Rise delay={index * 60} distance={0}>
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full rounded-[12px] border border-white/30 opacity-90 shadow-[0_16px_32px_rgba(90,20,0,0.3)]"
              />
            </Rise>
          </div>
        ))}

        <RevealHeading className="relative max-w-[680px] text-[36px] font-bold leading-[1.05] tracking-[-0.045em] text-white md:text-[64px]">
          Make something they will keep.
        </RevealHeading>
        <p className="relative mt-5 max-w-[460px] text-[16px] leading-[1.6] text-white/90 md:text-[18px]">
          Your first gift is free, and takes less time than choosing a card.
        </p>
        <div className="relative mt-8 flex flex-col items-stretch gap-3 sm:flex-row">
          <Link
            href="/create"
            prefetch
            className={`group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1b1b1b] px-7 text-[16px] font-semibold text-white md:h-14 md:text-[17px] ${press}`}>
            Create a gift
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/templates"
            prefetch
            className={`inline-flex h-12 items-center justify-center rounded-full border border-white/50 px-7 text-[16px] font-semibold text-white md:h-14 md:text-[17px] ${press}`}>
            Browse templates
          </Link>
        </div>
      </div>
    </section>
  );
}
