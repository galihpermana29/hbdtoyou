'use client';

import { useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, type ReactNode } from 'react';

import { useMemoifySession } from '@/app/session-provider';
import { RevealHeading } from '@/components/memoroll/landing/reveal-words';

import { EASE_IN_OUT, Rise, SectionHead, press } from './ui';

/**
 * Blocks the product landings (journal, scrapbook) share with each other.
 * Same system and the same motion rules as the home page (see ui.tsx).
 */

/**
 * Where a "make one" button goes: the creator when signed in, Google
 * sign-in when not - what both pages' buttons already did. The returned
 * function takes another path for a button that opens the creator somewhere
 * specific (a scrapbook style).
 */
export function useStart(path: string) {
  const router = useRouter();
  const session = useMemoifySession();
  return (other?: string) => {
    if (session?.accessToken) router.push(other ?? path);
    else signIn('google');
  };
}

export interface StepItem {
  title: string;
  body: string;
  art: ReactNode;
}

/**
 * Steps in a row. The cards enter as one wave (lead first, shrinking gaps);
 * the flame line behind the numbers draws across as they arrive - movement
 * on screen, so the strong ease-in-out.
 */
export function Steps({
  eyebrow,
  title,
  body,
  steps,
  ground = '#fffdfa',
}: {
  eyebrow: string;
  title: string;
  body?: string;
  steps: StepItem[];
  ground?: string;
}) {
  const row = useRef<HTMLDivElement>(null);
  const seen = useInView(row, { once: true, margin: '0px 0px -20% 0px' });
  return (
    <section
      className="px-5 py-16 md:py-[112px]"
      style={{ background: ground, fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto max-w-[1180px]">
        <SectionHead eyebrow={eyebrow} title={title} body={body} />
        <div ref={row} className="relative mt-12 md:mt-16">
          <span
            aria-hidden
            className="absolute left-[46px] right-[46px] top-[46px] hidden h-[2px] origin-left bg-[#ff3e09] motion-reduce:!scale-x-100 lg:block"
            style={{
              transform: seen ? 'scaleX(1)' : 'scaleX(0)',
              transition: `transform 1100ms ${EASE_IN_OUT} 200ms`,
            }}
          />
          <div className="flex flex-col gap-5 lg:flex-row">
            {steps.map((step, index) => (
              <Rise
                key={step.title}
                delay={[0, 90, 150][index] ?? 150}
                distance={[20, 14, 10][index] ?? 10}
                className="relative flex-1">
                <div className="flex h-full flex-col rounded-[28px] border border-[#e8ded3] bg-[#fffdfa] p-6 md:p-7">
                  <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-[#1b1b1b] text-[14px] font-semibold text-[#fbf4ec]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 text-[22px] font-bold leading-[1.2] tracking-[-0.03em] text-[#1b1b1b]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-[#4a4642]">
                    {step.body}
                  </p>
                  <div className="mt-6 flex h-[176px] items-center justify-center overflow-hidden rounded-[20px] bg-[#fbf4ec]">
                    {step.art}
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The last word of a page: one flame panel, one line, one action. The
 * pictures tucked behind it are decoration: they fade in and do not move.
 */
export function ClosingPanel({
  title,
  body,
  action,
  onAction,
  second,
  tucked = [],
  ground = '#fffdfa',
}: {
  title: string;
  body: string;
  action: string;
  onAction: () => void;
  second?: { label: string; href: string };
  /** [src, where it sits] - the pose goes on the outer box, not on Rise. */
  tucked?: [string, string][];
  ground?: string;
}) {
  return (
    <section
      className="px-5 pb-16 md:pb-[112px]"
      style={{ background: ground, fontFamily: 'var(--font-mr-body)' }}>
      <div className="relative mx-auto flex max-w-[1180px] flex-col items-center overflow-hidden rounded-[32px] bg-[#ff3e09] px-6 py-16 text-center md:py-[104px]">
        {tucked.map(([src, pose], index) => (
          <div
            key={src}
            aria-hidden
            className={`pointer-events-none absolute hidden lg:block ${pose}`}>
            <Rise delay={index * 60} distance={0}>
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full rounded-[10px] border border-white/30 opacity-90 shadow-[0_16px_32px_rgba(90,20,0,0.3)]"
              />
            </Rise>
          </div>
        ))}
        <RevealHeading className="relative max-w-[680px] text-[36px] font-bold leading-[1.05] tracking-[-0.045em] text-white md:text-[64px]">
          {title}
        </RevealHeading>
        <p className="relative mt-5 max-w-[460px] text-[16px] leading-[1.6] text-white/90 md:text-[18px]">
          {body}
        </p>
        <div className="relative mt-8 flex flex-col items-stretch gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onAction()}
            className={`group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1b1b1b] px-7 text-[16px] font-semibold text-white md:h-14 md:text-[17px] ${press}`}>
            {action}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
            />
          </button>
          {second ? (
            <Link
              href={second.href}
              prefetch
              className={`inline-flex h-12 items-center justify-center rounded-full border border-white/50 px-7 text-[16px] font-semibold text-white md:h-14 md:text-[17px] ${press}`}>
              {second.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
