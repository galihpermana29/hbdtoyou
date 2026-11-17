'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';

import { useBeat } from '@/components/home/beat';
import { useStart } from '@/components/home/blocks';
import { ctaGhost, ctaPrimary } from '@/components/home/ui';
import { useCalmMotion } from '@/lib/use-calm-motion';

import JournalPaper, { PAPERS } from './paper';

/**
 * The journal page's first screen: "Write a love letter / an apology / a
 * birthday wish like a research paper", beside a paper that typesets
 * itself on the same beat (paper.tsx).
 *
 * The opening is one wave, lead first, gaps shrinking:
 *
 *   headline  lead         0ms  rise 18px
 *   body      support     90ms  rise 12px
 *   actions   support    160ms  rise 8px
 *   proof     decoration 210ms  fade
 *   paper     its own group: the sheet rises once (120ms), its text waves
 */

const at = (ms: number, rise: number): CSSProperties =>
  ({ '--at': `${ms}ms`, '--rise': `${rise}px` }) as CSSProperties;

export default function JournalHero({ published }: { published: number }) {
  const beat = useBeat(PAPERS.length);
  const reduce = useCalmMotion();
  const start = useStart('/journal/create');
  const paper = PAPERS[beat.active];

  return (
    <section
      className="relative overflow-hidden bg-[#fbf4ec] px-5 pb-16 pt-10 md:pb-24 md:pt-16"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex w-full flex-col items-center text-center lg:w-[54%] lg:items-start lg:text-left">
          <span
            className="home-enter inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium tracking-[-0.28px] text-[#e34013]"
            style={at(0, 0)}>
            <span className="size-[6px] rounded-full bg-[#ff3e09]" />
            Journals
          </span>

          <h1
            className="home-enter mt-5 text-[40px] font-bold leading-[1.04] tracking-[-0.045em] text-[#1b1b1b] sm:text-[56px] lg:text-[64px]"
            style={at(0, 18)}>
            <span className="sr-only">
              Write a love letter, an apology or a birthday wish like a research
              paper
            </span>
            <span aria-hidden className="block">
              Write
            </span>
            <span
              aria-hidden
              className="relative flex h-[1.16em] justify-center overflow-hidden text-[#ff3e09] lg:justify-start">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={paper.key}
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
                  {paper.word}
                </motion.span>
              </AnimatePresence>
            </span>
            <span aria-hidden className="block">
              like a research paper.
            </span>
          </h1>

          <p
            className="home-enter mt-5 max-w-[520px] text-[16px] leading-[1.6] text-[#4a4642] md:text-[19px]"
            style={at(90, 12)}>
            Say the simple thing in the most serious format there is: a title,
            an abstract, a conclusion. Publish it, and send them the link.
          </p>

          <div
            className="home-enter mt-7 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
            style={at(160, 8)}>
            <button
              type="button"
              onClick={() => start()}
              className={`group ${ctaPrimary}`}>
              Publish a journal
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
              />
            </button>
            <a href="#published" className={ctaGhost}>
              Read published ones
            </a>
          </div>

          <p
            className="home-enter mt-4 text-[13px] font-medium text-[#8a847d]"
            style={at(210, 0)}>
            {published > 0
              ? `${published.toLocaleString('en-US')} journals published so far`
              : 'Published as a page you can share'}
          </p>
        </div>

        <div
          className="home-enter relative w-full lg:w-[46%]"
          style={at(120, 20)}>
          <p
            aria-hidden
            className="pointer-events-none absolute -right-2 -top-7 z-20 hidden w-[150px] rotate-6 text-right text-[24px] leading-[1.05] text-[#1b1b1b] xl:block"
            style={{ fontFamily: 'var(--font-mr-hand)' }}>
            tap the paper for the next one
          </p>
          <JournalPaper
            active={beat.active}
            onNext={beat.next}
            onJump={beat.jump}
          />
        </div>
      </div>
    </section>
  );
}
