'use client';

import { useState } from 'react';

import { TESTIMONIALS, type Testimonial } from '@/lib/testimonials';

import { HOME_COPY, type HomeCopy, type HomeLanguage } from './copy';
import { Rise, SectionHead, press } from './ui';

/**
 * What people wrote in the feedback form, as notes pinned to the page
 * (owner, 2026-11-17). The words are theirs, unedited (lib/testimonials.ts).
 *
 * - A wide screen pins them in three columns of uneven height; the first
 *   nine show, and a button brings the rest.
 * - A phone gets one row to swipe through, snapping note to note, so
 *   eighteen notes are not eighteen screens of scrolling.
 *
 * Motion (emilkowalski/skills): the notes arrive as one wave per column,
 * lead first with shrinking gaps, once. They are read, so nothing loops and
 * nothing moves afterwards; a note tilts a little, and that is its pose,
 * not an animation. The notes the button brings fade in the same way.
 */

const FIRST = 9;

/** Three looks, dealt in turn, so the wall is not one card eighteen times. */
const LOOKS = [
  'bg-[#fbf4ec] border border-[#e8ded3] text-[#1b1b1b]',
  'bg-[#1b1b1b] text-[#fbf4ec]',
  'bg-[#fff0e9] border border-[#ffd9cb] text-[#1b1b1b]',
];
// Written whole: Tailwind only makes classes it can read in the source.
const TILTS = [
  'md:-rotate-[1.2deg]',
  'md:rotate-[0.8deg]',
  'md:-rotate-[0.5deg]',
  'md:rotate-[1.4deg]',
];

function Note({
  note,
  index,
  t,
}: {
  note: Testimonial;
  index: number;
  t: HomeCopy['testimonials'];
}) {
  const look = LOOKS[index % LOOKS.length];
  const dark = index % LOOKS.length === 1;
  // Short ones are said out loud: bigger, in the hand font.
  const short = note.words.length < 60;
  return (
    <figure
      className={`flex h-full flex-col justify-between gap-5 rounded-[20px] p-6 ${look} ${TILTS[index % TILTS.length]}`}>
      <blockquote
        className={
          short ? 'text-[26px] leading-[1.15]' : 'text-[16px] leading-[1.6]'
        }
        style={short ? { fontFamily: 'var(--font-mr-hand)' } : undefined}>
        “{note.words}”
      </blockquote>
      <figcaption
        className={`text-[11px] tracking-[1.2px] ${dark ? 'text-[#a39b91]' : 'text-[#8a847d]'}`}
        style={{ fontFamily: 'var(--font-mr-label)' }}>
        {t.source} · {t.month(note.when).toUpperCase()}
      </figcaption>
    </figure>
  );
}

export default function HomeTestimonials({
  lang = 'en',
}: {
  lang?: HomeLanguage;
}) {
  const t = HOME_COPY[lang].testimonials;
  const [all, setAll] = useState(false);
  const shown = all ? TESTIMONIALS : TESTIMONIALS.slice(0, FIRST);
  const columns: Array<Array<[Testimonial, number]>> = [[], [], []];
  shown.forEach((note, index) => columns[index % 3].push([note, index]));

  return (
    <section
      aria-label={t.label}
      className="bg-[#fffdfa] pb-16 md:pb-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="px-5">
        <SectionHead eyebrow={t.eyebrow} title={t.title} body={t.body} />
      </div>

      {/* Wide screens: three columns of pinned notes. */}
      <div className="mx-auto mt-14 hidden max-w-[1180px] gap-5 px-5 md:flex">
        {columns.map((column, at) => (
          <div key={at} className="flex flex-1 flex-col gap-5">
            {column.map(([note, index], row) => (
              <Rise
                key={note.words}
                // A wave across the first row; later rows follow closely.
                delay={
                  index < FIRST ? [0, 80, 130][at] + row * 60 : [0, 60, 100][at]
                }
                distance={[18, 14, 10][at]}>
                <Note note={note} index={index} t={t} />
              </Rise>
            ))}
          </div>
        ))}
      </div>
      {!all ? (
        <div className="mt-10 hidden justify-center md:flex">
          <button
            type="button"
            onClick={() => setAll(true)}
            className={`inline-flex h-12 items-center justify-center rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] px-7 text-[16px] font-semibold text-[#1b1b1b] ${press}`}>
            {t.more(TESTIMONIALS.length - FIRST)}
          </button>
        </div>
      ) : null}

      {/* Phones: one row, swiped, snapping note to note. */}
      <Rise className="mt-10 md:hidden">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TESTIMONIALS.map((note, index) => (
            <div key={note.words} className="w-[82%] shrink-0 snap-center">
              <Note note={note} index={index} t={t} />
            </div>
          ))}
        </div>
      </Rise>
    </section>
  );
}
