import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

import { localHref } from '@/lib/page-language';

import { HOME_COPY, type HomeLanguage } from './copy';
import { Rise, press } from './ui';

/**
 * MemoRoll, right under the hero.
 *
 * Memoify is known for two things: the birthday gift the hero is about, and
 * the camera for wedding guests (owner, 2026-11-20). The camera used to be
 * one card in "What you can make", four sections down; a couple planning a
 * wedding should not have to scroll past a birthday page to learn it exists.
 *
 * One dark card, so it reads as a second product and not as more of the
 * hero: what it is, three facts, one way in. The three prints are guest
 * photographs from the MemoRoll landing, fanned the way that page fans them.
 * Decoration stays out of the way of a phone: the prints sit under the text
 * there, smaller, and nothing overlaps the words.
 */

const PRINTS = [
  { src: '/memoroll-landing/arc-2.webp', tilt: '-rotate-[8deg]', lift: 'mt-6' },
  { src: '/memoroll-landing/arc-4.webp', tilt: 'rotate-[3deg]', lift: 'mt-0' },
  { src: '/memoroll-landing/arc-3.webp', tilt: 'rotate-[10deg]', lift: 'mt-8' },
];

export default function HomeCamera({ lang = 'en' }: { lang?: HomeLanguage }) {
  const t = HOME_COPY[lang].camera;
  return (
    <section
      aria-label="MemoRoll"
      className="bg-[#fbf4ec] px-5 pb-16 md:pb-24"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <Rise distance={18}>
        <div className="mx-auto flex max-w-[1180px] flex-col gap-10 overflow-hidden rounded-[28px] bg-[#1b1b1b] p-7 md:p-12 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex flex-1 flex-col items-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[13px] font-medium tracking-[-0.2px] text-[#ffd9cc]">
              <span className="size-[6px] rounded-full bg-[#ff3e09]" />
              {t.eyebrow}
            </span>
            <h2 className="mt-5 max-w-[520px] text-[30px] font-bold leading-[1.1] tracking-[-0.04em] text-white md:text-[44px]">
              {t.title}
            </h2>
            <p className="mt-4 max-w-[500px] text-[16px] leading-[1.6] text-[#d9d3cc] md:text-[18px]">
              {t.body}
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {t.points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-[15px] font-medium text-white md:text-[16px]">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#ff3e09]">
                    <Check aria-hidden className="size-3" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={localHref('/memoroll', lang)}
              className={`group mt-8 inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-6 text-[16px] font-semibold text-[#1b1b1b] md:h-14 md:px-7 md:text-[17px] ${press}`}>
              {t.cta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="flex flex-none items-start justify-center gap-3 lg:w-[460px] lg:gap-4">
            {PRINTS.map((print, index) => (
              <div
                key={print.src}
                className={`${print.tilt} ${print.lift} w-[30%] max-w-[150px] bg-white p-[6px] pb-6 shadow-[0_18px_30px_-14px_rgba(0,0,0,0.7)] md:p-2 md:pb-8`}>
                <img
                  src={print.src}
                  alt={t.alts[index]}
                  width={300}
                  height={375}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Rise>
    </section>
  );
}
