'use client';

import { ArrowRight, Play, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { NewTemplate } from '@/lib/new-template';

import { Rise, press } from './ui';

/**
 * "Just dropped": the template the owner tagged `New`, shown off under the
 * hero (owner, 2026-11-18). See lib/new-template.ts for which and why.
 *
 * A gift you operate cannot be sold with a picture, so a playable template
 * is the gift itself, in a phone, on the page: a still at first, and the
 * real sample page once the visitor asks for it. Asked for, not loaded with
 * the page, because it is a whole second page (and one that makes sound).
 * It runs in a frame of its own: a gift fills its screen and pins things to
 * it, and here its screen has to be the phone, not the home page.
 *
 * A template with no playable sample shows its catalogue art instead.
 *
 * Motion (emilkowalski/skills): the words arrive as one wave, lead first;
 * the phone rises once, a little later and a little further, being the
 * heavier thing. Nothing loops. Presses give.
 */

/** The gift is laid out for a phone this size, then scaled to the frame. */
const SCREEN = { width: 390, height: 780 };
const SCALE = 0.7;

function Phone({ fresh }: { fresh: NewTemplate }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative overflow-hidden rounded-[38px] border-[9px] border-[#3a3835] bg-[#0f0e0d] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
        style={{
          width: SCREEN.width * SCALE + 18,
          height: SCREEN.height * SCALE + 18,
        }}>
        {playing ? (
          <iframe
            src={fresh.sample}
            title={`${fresh.name}, a sample you can play`}
            width={SCREEN.width}
            height={SCREEN.height}
            className="origin-top-left border-0"
            style={{ transform: `scale(${SCALE})` }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Try ${fresh.name} here`}
            className="group relative block h-full w-full">
            {fresh.poster ? (
              <img
                src={fresh.poster}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            ) : null}
            <span className="absolute inset-0 bg-black/25" />
            <span
              className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#ff3e09] py-3 pl-4 pr-5 text-[15px] font-semibold text-white shadow-[0_12px_28px_-8px_rgba(255,62,9,0.9)] transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-active:scale-[0.96]`}>
              <Play aria-hidden size={16} fill="currentColor" />
              Try it here
            </span>
          </button>
        )}
      </div>
      {playing ? (
        <button
          type="button"
          onClick={() => setPlaying(false)}
          className={`inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 px-3.5 text-[13px] font-semibold text-[#f4efe6] ${press}`}>
          <X aria-hidden size={14} />
          Stop
        </button>
      ) : (
        <p className="h-9 text-[13px] leading-9 text-[#a39b91]">
          It plays right here, sound and all
        </p>
      )}
    </div>
  );
}

export default function HomeNewTemplate({ fresh }: { fresh: NewTemplate }) {
  return (
    <section
      id="new"
      aria-label={`New: ${fresh.name}`}
      className="scroll-mt-[97px] bg-[#fffdfa] px-5 pt-16 md:pt-[96px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-10 overflow-hidden rounded-[32px] bg-[#1b1b1b] px-6 py-12 md:px-12 lg:flex-row lg:justify-between lg:gap-12 lg:py-16">
        <div className="flex max-w-[520px] flex-col items-center text-center lg:items-start lg:text-left">
          <Rise>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ff3e09] px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white">
              Just dropped
            </span>
          </Rise>
          <Rise delay={70} distance={18}>
            <h2 className="mt-5 text-[40px] font-bold leading-[1.04] tracking-[-0.045em] text-[#fbf4ec] md:text-[56px]">
              {fresh.name}
            </h2>
          </Rise>
          <Rise delay={130} distance={12}>
            <p
              className="mt-2 text-[30px] leading-[1.1] text-[#ff8a5c] md:text-[34px]"
              style={{ fontFamily: 'var(--font-mr-hand)' }}>
              {fresh.says}
            </p>
            <p className="mt-4 text-[16px] leading-[1.65] text-[#cfc7bd] md:text-[18px]">
              {fresh.body}
            </p>
          </Rise>
          <Rise
            delay={180}
            distance={8}
            className="mt-7 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
            <Link
              href={`/create?template=${fresh.id}`}
              prefetch={false}
              className={`group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff3e09] px-7 text-[16px] font-semibold text-white shadow-[inset_2px_3px_3.2px_rgba(255,255,255,0.25)] md:h-14 md:text-[17px] ${press}`}>
              Make one
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href={fresh.sample}
              target="_blank"
              className={`inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-7 text-[16px] font-semibold text-[#fbf4ec] md:h-14 md:text-[17px] ${press}`}>
              Open the sample
            </Link>
          </Rise>
        </div>

        <Rise delay={160} distance={28} className="shrink-0">
          {fresh.playable ? (
            <Phone fresh={fresh} />
          ) : fresh.thumbnail ? (
            <img
              src={fresh.thumbnail}
              alt={`${fresh.name}, as it looks when opened`}
              loading="lazy"
              decoding="async"
              className="w-full max-w-[520px] rounded-[20px] border border-white/10"
            />
          ) : null}
        </Rise>
      </div>
    </section>
  );
}
