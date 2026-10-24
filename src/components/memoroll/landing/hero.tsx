'use client';

import Image from 'next/image';
import Link from 'next/link';

import HeroCarousel from './hero-carousel';
import { useLandingCopy } from './language-provider';
import LanguageToggle from './language-toggle';
import RollTimer from './roll-timer';
import StackedWordmark from './stacked-wordmark';

/**
 * The MemoRoll landing's first screen, as the redesign draws it: an arc of
 * polaroids, developing as they cross the flame line, with the logo, heading
 * and actions in the hollow of the arc, and two badges floating on it.
 *
 * Down to 1024px the arc is only the backdrop and the words lie over its
 * hollow, as in the design. Below that the arc is too small to hold them, so
 * it takes a band of its own at the top and the words follow it.
 *
 * The language switch governs the whole page rather than any one part of it,
 * so it stands apart from the words. Down to 1024px it sits in the corner
 * above the arc, where the design leaves sky. Below that the arc fills its
 * band edge to edge, so the switch heads the words instead of covering a print.
 */

const AVATARS = [1, 2, 3, 4];

/** What floats on the arc, placed on the design's 1440px frame. */
function Floaters() {
  const copy = useLandingCopy().hero;
  return (
    <>
      <RollTimer />

      <div className="absolute left-[137.1px] top-[620.4px] flex size-[112px] rotate-12 flex-col items-center justify-center rounded-full bg-[#ff3e09]">
        <p
          className="text-[40px] leading-9 text-white"
          style={{ fontFamily: 'var(--font-mr-badge)' }}>
          615
        </p>
        <p
          className="text-[11px] tracking-[1.2px] text-white"
          style={{ fontFamily: 'var(--font-mr-label)' }}>
          {copy.photosBadge}
        </p>
      </div>
    </>
  );
}

export default function MemorollHero() {
  const copy = useLandingCopy().hero;
  return (
    <section
      className="relative overflow-hidden bg-[#FBF4EC]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="relative h-[330px] overflow-hidden sm:h-[430px] lg:absolute lg:inset-x-0 lg:top-0 lg:h-[970px]">
        <HeroCarousel>
          <Floaters />
        </HeroCarousel>
      </div>

      <div className="relative flex flex-col items-center gap-7 px-6 pb-16 pt-6 lg:h-[970px] lg:pb-0 lg:pt-[437px]">
        <LanguageToggle className="relative z-10 lg:absolute lg:right-8 lg:top-6" />

        <StackedWordmark scale={0.6335} />

        <h1 className="w-[732px] max-w-full text-center text-[36px] font-bold leading-[40px] tracking-[-1.8px] text-[#1b1b1b] md:text-[56px] md:leading-[56px] md:tracking-[-3px]">
          {copy.heading}
        </h1>

        <p className="w-[560px] max-w-full text-center text-[16px] font-normal leading-[normal] text-[#4a4642]">
          {copy.body}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-[14px]">
          <Link
            href="/memoroll/create"
            className="flex h-12 items-center justify-center whitespace-nowrap rounded-lg bg-[#e34013] px-5 text-[16px] md:h-[60px] md:px-6 md:py-4 md:text-[18px] font-semibold leading-7 text-white shadow-[0_1px_1px_rgba(16,24,40,0.05)] transition-colors hover:bg-[#C9340E]">
            {copy.create}
          </Link>
          <Link
            href="#how-it-works"
            className="flex h-12 items-center justify-center gap-[10px] whitespace-nowrap rounded-lg border border-[#d0d5dd] px-5 text-[16px] md:h-[62px] md:px-6 md:py-4 md:text-[18px] font-semibold leading-7 text-[#344054] transition-colors hover:bg-white/60">
            <Image
              src="/memoroll-landing/play.svg"
              alt=""
              width={16}
              height={16}
              unoptimized
            />
            {copy.howItWorks}
          </Link>
        </div>

        <div className="flex items-center gap-[14px] pt-2">
          <div className="flex h-9 items-start">
            {AVATARS.map((n) => (
              <img
                key={n}
                src={`/memoroll-landing/avatar-${n}.webp`}
                alt=""
                className="-mr-3 size-9 shrink-0 rounded-full object-cover last:mr-0"
              />
            ))}
          </div>
          <div className="flex flex-col gap-[2px] leading-[normal]">
            <p className="text-[14px] font-bold text-[#1b1b1b]">{copy.proof}</p>
            <p className="text-[13px] font-normal text-[#8a847d]">
              {copy.proofWhere}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
