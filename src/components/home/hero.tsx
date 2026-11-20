'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import type { NewTemplate } from '@/lib/new-template';
import { localHref } from '@/lib/page-language';
import { useCalmMotion } from '@/lib/use-calm-motion';

import { HOME_COPY, type HomeLanguage } from './copy';
import GiftDeck, { GIFTS, useGiftBeat } from './gift-deck';
import { ctaGhost, ctaPrimary } from './ui';

/**
 * The home page's first screen: what Memoify is, in one line that finishes
 * itself - "Turn your memories into a series / a playlist / a magazine..." -
 * over a deck of real gifts that flips in time with it.
 *
 * The opening is one wave (choreograph: lead first, shrinking gaps, 0.6s
 * entrances - a hero is seen once per visit and may take the room):
 *
 *   headline  lead        0ms  rise 18px
 *   body      support    90ms  rise 12px
 *   actions   support   160ms  rise 8px
 *   proof     decoration 210ms fade
 *   deck      lead of its own group: fans open from 120ms (gift-deck.tsx)
 *
 * The word that changes is an exit and an entrance in the same line box, so
 * they overlap (popLayout) and both use the strong ease-out.
 */

const at = (ms: number, rise: number): CSSProperties =>
  ({ '--at': `${ms}ms`, '--rise': `${rise}px` }) as CSSProperties;

export default function HomeHero({
  fresh,
  lang = 'en',
}: {
  fresh?: NewTemplate | null;
  lang?: HomeLanguage;
}) {
  const copy = HOME_COPY[lang];
  const t = copy.hero;
  const beat = useGiftBeat();
  const reduce = useCalmMotion();
  const gift = GIFTS[beat.active];
  const freshSays = lang === 'id' ? fresh?.indonesian.says : fresh?.says;

  return (
    <section
      className="relative overflow-hidden bg-[#fbf4ec] px-5 pb-16 pt-10 md:pb-24 md:pt-14"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto flex max-w-[1180px] flex-col items-center">
        {/* The line over the headline. With a template tagged `New` it is
            the news, and a way down to it; otherwise what Memoify is. The
            same pill either way, so the headline never moves. */}
        {fresh ? (
          <a
            href="#new"
            className="home-enter group inline-flex max-w-full items-center gap-2 rounded-full border border-[#e6e6e6] bg-white py-1 pl-1 pr-3 text-[14px] font-medium tracking-[-0.28px] text-[#1b1b1b] transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
            style={at(0, 0)}>
            <span className="rounded-full bg-[#ff3e09] px-2 py-[3px] text-[11px] font-bold uppercase tracking-[0.08em] text-white">
              {t.newTag}
            </span>
            <span className="truncate">
              <span className="font-semibold">{fresh.name}</span>
              <span className="hidden text-[#6b655f] sm:inline">
                {' · '}
                {freshSays}
              </span>
            </span>
            <ArrowRight
              aria-hidden
              className="size-3.5 shrink-0 text-[#e34013] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
            />
          </a>
        ) : (
          <span
            className="home-enter inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium tracking-[-0.28px] text-[#e34013]"
            style={at(0, 0)}>
            <span className="size-[6px] rounded-full bg-[#ff3e09]" />
            {t.pill}
          </span>
        )}

        <h1
          className="home-enter mt-5 text-center text-[40px] font-bold leading-[1.04] tracking-[-0.045em] text-[#1b1b1b] sm:text-[56px] md:text-[72px]"
          style={at(0, 18)}>
          <span className="sr-only">{t.headingSpoken}</span>
          <span aria-hidden className="block">
            {t.headingLead}
          </span>
          <span
            aria-hidden
            className="relative flex h-[1.16em] justify-center overflow-hidden text-[#ff3e09]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={gift.key}
                className="block whitespace-nowrap"
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, transform: 'translateY(90%)' }
                }
                animate={
                  reduce
                    ? { opacity: 1 }
                    : { opacity: 1, transform: 'translateY(0%)' }
                }
                exit={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, transform: 'translateY(-90%)' }
                }
                transition={{
                  duration: reduce ? 0.2 : 0.56,
                  ease: [0.23, 1, 0.32, 1],
                }}>
                {copy.deck.words[gift.key]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <p
          className="home-enter mt-4 max-w-[560px] text-center text-[16px] leading-[1.6] text-[#4a4642] md:text-[19px]"
          style={at(90, 12)}>
          {t.body}
        </p>

        <div
          className="home-enter mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          style={at(160, 8)}>
          <Link href="/create" prefetch className={`group ${ctaPrimary}`}>
            {t.create}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
            />
          </Link>
          {/* The second thing Memoify is known for, one tap from the top. */}
          <Link
            href={localHref('/memoroll', lang)}
            prefetch
            className={ctaGhost}>
            {t.browse}
          </Link>
        </div>

        <p
          className="home-enter mt-4 text-[13px] font-medium text-[#8a847d]"
          style={at(210, 0)}>
          {t.proof}
        </p>

        <div className="relative mt-9 w-full md:mt-10">
          {/* What floats beside the deck where there is room for it. */}
          <div
            aria-hidden
            className="home-enter pointer-events-none absolute -left-2 bottom-[18%] z-20 hidden size-[112px] -rotate-12 flex-col items-center justify-center rounded-full bg-[#ff3e09] text-white xl:flex"
            style={at(520, 0)}>
            <span
              className="text-[40px] leading-9"
              style={{ fontFamily: 'var(--font-mr-badge)' }}>
              15+
            </span>
            <span
              className="text-[11px] tracking-[1.2px]"
              style={{ fontFamily: 'var(--font-mr-label)' }}>
              {t.stylesBadge}
            </span>
          </div>
          <p
            aria-hidden
            className="home-enter pointer-events-none absolute -right-1 top-[16%] z-20 hidden w-[150px] rotate-6 text-[26px] leading-[1.05] text-[#1b1b1b] xl:block"
            style={{ ...at(600, 0), fontFamily: 'var(--font-mr-hand)' }}>
            {t.hint}
          </p>

          <GiftDeck
            active={beat.active}
            leaving={beat.leaving}
            onNext={beat.next}
            onJump={beat.jump}
            lang={lang}
          />
        </div>
      </div>
    </section>
  );
}
