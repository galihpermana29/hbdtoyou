'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { BeatPills } from '@/components/home/beat';
import { useCalmMotion } from '@/lib/use-calm-motion';

/**
 * The journal landing's signature: a plain feeling becomes a paper.
 *
 * A note says what you meant ("i love you, that's it"); the sheet under it
 * typesets the same thing as a research paper - title, author, abstract,
 * keywords - a highlighter runs across the line that matters, and a stamp
 * lands: ACCEPTED. Then the next feeling. The headline's changing words
 * follow the same beat (hero.tsx), so headline and paper are one gesture.
 *
 * Motion (emilkowalski/skills: animate + choreograph):
 * - the old paper's text leaves fast (a 140ms fade); the new one arrives as
 *   one wave - title first, then author, abstract, keywords, with shrinking
 *   gaps - on the strong ease-out. Only the text moves; the sheet is still;
 * - the highlighter is movement on screen: scaleX on the ease-in-out;
 * - the stamp is the punchline, so it comes last and short (320ms), from
 *   1.35 down to 1 - never from nothing;
 * - transform and opacity only; reduced motion keeps the fades, drops the
 *   travel, the highlighter draw and the autoplay.
 *
 * The papers are examples written for this page, not anyone's journal.
 */

export interface Paper {
  key: string;
  /** The headline's version: "a love letter". */
  word: string;
  /** What you would have texted. */
  meant: string;
  title: string;
  author: string;
  /** The abstract in three parts; the middle one is highlighted. */
  abstract: [string, string, string];
  keywords: string;
}

export const PAPERS: Paper[] = [
  {
    key: 'love',
    word: 'a love letter',
    meant: 'i love you, that’s it',
    title: 'On Loving You: A Five-Year Longitudinal Study',
    author: 'Raka A. · Department of Us',
    abstract: [
      'This paper examines why ordinary days improve when you are in them. ',
      'The effect is significant, consistent,',
      ' and shows no sign of wearing off.',
    ],
    keywords: 'love, home, you',
  },
  {
    key: 'apology',
    word: 'an apology',
    meant: 'sorry i forgot our anniversary',
    title: 'A Formal Review of My Mistake on the 14th',
    author: 'Dimas P. · Faculty of Knowing Better',
    abstract: [
      'The author forgot an important date. This study reviews what went wrong, ',
      'accepts full responsibility,',
      ' and proposes dinner as a first correction.',
    ],
    keywords: 'sorry, dinner, never again',
  },
  {
    key: 'birthday',
    word: 'a birthday wish',
    meant: 'happy birthday bestie!!',
    title: 'Twenty-Five Years of Dinda: A Review of the Evidence',
    author: 'Sasa K. · Institute of Best Friends',
    abstract: [
      'Across 25 years of data, the subject remains ',
      'the funniest person in every room.',
      ' This paper recommends cake, and many more years.',
    ],
    keywords: 'birthday, cake, bestie',
  },
];

const BEAT_MS = 5200;

const at = (ms: number, rise: number): CSSProperties =>
  ({ '--at': `${ms}ms`, '--rise': `${rise}px` }) as CSSProperties;

/** Grey bars standing in for the body of the paper. */
function Column({ widths }: { widths: number[] }) {
  return (
    <div className="flex flex-1 flex-col gap-[7px]">
      {widths.map((width, index) => (
        <span
          key={index}
          className="h-[5px] rounded-full bg-[#ece6dd]"
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );
}

export default function JournalPaper({
  active,
  onNext,
  onJump,
}: {
  active: number;
  onNext: () => void;
  onJump: (index: number) => void;
}) {
  const reduce = useCalmMotion();
  const frame = useRef<HTMLDivElement>(null);
  const onScreen = useInView(frame, { amount: 0.35 });
  const [hovered, setHovered] = useState(false);
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const paper = PAPERS[active];
  const running = !reduce && onScreen && !hovered;

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div
        ref={frame}
        role="group"
        aria-label="An example of a letter written as a research paper"
        onPointerEnter={() => fine && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className="relative px-3 pt-[64px] md:px-6">
        {/* The pile under the sheet: decoration, and still. */}
        <span
          aria-hidden
          className="absolute inset-x-6 bottom-0 top-[76px] rotate-[3.5deg] rounded-[6px] border border-[#e8ded3] bg-[#fffdfa] md:inset-x-9"
        />
        <span
          aria-hidden
          className="absolute inset-x-6 bottom-0 top-[76px] -rotate-[2.5deg] rounded-[6px] border border-[#e8ded3] bg-[#fffdfa] md:inset-x-9"
        />

        <button
          type="button"
          onClick={onNext}
          aria-label={`${paper.title}. Show the next example`}
          className="relative block w-full rounded-[6px] border border-[#e0d6ca] bg-white px-5 pb-7 pt-5 text-left shadow-[0_28px_56px_-28px_rgba(90,42,18,0.4)] md:px-9 md:pb-9 md:pt-7">
          <span className="paper-serif flex items-center justify-between border-b border-[#1b1b1b] pb-2 text-[9px] uppercase tracking-[0.14em] text-[#1b1b1b] md:text-[10px]">
            <span>Journal of Heartfelt Communication</span>
            <span className="hidden sm:inline">Vol. 1 · No. 1</span>
          </span>

          {/* One block per paper: it leaves as one, and arrives as a wave. */}
          <span className="block min-h-[318px] md:min-h-[338px]">
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={paper.key}
                className="paper-serif block"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}>
                <span
                  className="home-enter mt-6 block text-balance text-center text-[21px] font-bold leading-[1.2] text-[#1b1b1b] md:text-[26px]"
                  style={at(0, 14)}>
                  {paper.title}
                </span>
                <span
                  className="home-enter mt-2 block text-center text-[12px] italic text-[#6b655f] md:text-[13px]"
                  style={at(80, 10)}>
                  {paper.author}
                </span>
                <span className="home-enter mt-5 block" style={at(140, 8)}>
                  <span className="block text-center text-[12px] font-bold text-[#1b1b1b] md:text-[13px]">
                    Abstract
                  </span>
                  <span className="mt-2 block text-[13px] leading-[1.7] text-[#35302b] md:text-[14px]">
                    {paper.abstract[0]}
                    {/* Kept on one line: the highlighter is one box drawn across it. */}
                    <span className="relative inline-block whitespace-nowrap">
                      <span
                        aria-hidden
                        className="home-mark absolute inset-x-[-2px] bottom-[1px] top-[2px] rounded-[2px] bg-[#ffd9cb]"
                        style={at(620, 0)}
                      />
                      <span className="relative">{paper.abstract[1]}</span>
                    </span>
                    {paper.abstract[2]}
                  </span>
                </span>
                <span
                  className="home-enter mt-3 block text-[12px] text-[#6b655f] md:text-[13px]"
                  style={at(180, 0)}>
                  <span className="font-bold italic text-[#1b1b1b]">
                    Keywords:
                  </span>{' '}
                  {paper.keywords}
                </span>
              </motion.span>
            </AnimatePresence>
          </span>

          <span aria-hidden className="mt-1 flex gap-5">
            <Column widths={[100, 94, 98, 88, 96, 60]} />
            <Column widths={[96, 100, 90, 97, 72]} />
          </span>

          {/* The stamp lands last, once per paper. */}
          <span
            key={`stamp-${paper.key}`}
            aria-hidden
            className="home-stamp absolute bottom-5 right-4 flex -rotate-[9deg] flex-col items-center rounded-[8px] border-[2.5px] border-[#ff3e09] px-3 py-1.5 text-[#ff3e09] md:bottom-8 md:right-7"
            style={at(1150, 0)}>
            <span
              className="text-[20px] leading-none tracking-[1.5px] md:text-[24px]"
              style={{ fontFamily: 'var(--font-mr-badge)' }}>
              ACCEPTED
            </span>
            <span
              className="mt-0.5 text-[8px] tracking-[1.4px] md:text-[9px]"
              style={{ fontFamily: 'var(--font-mr-label)' }}>
              REVIEWED WITH LOVE
            </span>
          </span>
        </button>

        {/* What you would have said, pinned to the corner. */}
        <span
          key={`note-${paper.key}`}
          aria-hidden
          className="home-enter pointer-events-none absolute left-0 top-0 z-10 w-[168px] -rotate-[5deg] rounded-[4px] bg-[#ffe9df] px-3 pb-3 pt-2 shadow-[0_10px_20px_-10px_rgba(90,42,18,0.45)] md:-left-4 md:w-[190px]"
          style={at(0, 0)}>
          <span
            className="block text-[9px] tracking-[1.4px] text-[#e34013]"
            style={{ fontFamily: 'var(--font-mr-label)' }}>
            WHAT YOU MEANT
          </span>
          <span
            className="mt-0.5 block text-[22px] leading-[1.05] text-[#1b1b1b] md:text-[24px]"
            style={{ fontFamily: 'var(--font-mr-hand)' }}>
            {paper.meant}
          </span>
        </span>
      </div>

      <div className="mt-6">
        <BeatPills
          labels={PAPERS.map((entry) => `Show ${entry.word} as a paper`)}
          active={active}
          running={running}
          still={reduce}
          ms={BEAT_MS}
          onNext={onNext}
          onJump={onJump}
        />
      </div>
    </div>
  );
}
