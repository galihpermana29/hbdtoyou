import Link from 'next/link';

import { RevealHeading } from '@/components/memoroll/landing/reveal-words';
import Reveal from './reveal';
import SectionPill from './section-pill';
import StartInvitationLink from './start-invitation-link';

const INCLUDED = [
  'Invitation website',
  'Guest name greetings',
  'RSVP dashboard',
  'Schedule & maps',
  'Background music',
  'Custom link',
];

const mono = { fontFamily: 'var(--font-mr-label)' };
const badge = { fontFamily: 'var(--font-mr-badge)' };

export default function InvitationPlan() {
  return (
    <section
      id="plan"
      aria-label="The wedding plan"
      className="bg-[#ff3e09] px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:py-[120px] xl:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-14 lg:flex-row lg:items-center lg:justify-between lg:gap-24">
        <div className="flex max-w-[705px] flex-col items-start gap-7">
          <SectionPill>The Wedding Plan</SectionPill>
          <RevealHeading className="text-[38px] font-bold leading-[1.02] tracking-[-1.4px] text-[#fffdfa] sm:text-[48px] md:text-[64px] md:leading-[64px] md:tracking-[-2.6px]">
            One plan. The invitation, the RSVPs, and every guest&apos;s camera.
          </RevealHeading>
          <p className="max-w-[480px] text-[16px] leading-[26px] text-[#fffdfa]/90 md:text-[18px] md:leading-7">
            Memoroll is included free with the Wedding Plan. No add-ons, no
            extra checkout.
          </p>
          <div className="flex w-full flex-col items-stretch gap-4 pt-2 sm:w-auto sm:flex-row sm:items-center">
            <StartInvitationLink className="inline-flex h-[60px] items-center justify-center rounded-lg bg-[#1b1b1b] px-6 text-[18px] font-semibold leading-7 text-white shadow-[0_1px_1px_rgba(16,24,40,0.05)] transition-[transform,background-color] duration-150 ease-out hover:bg-black active:scale-[0.97]">
              Start your invitation
            </StartInvitationLink>
            <Link
              href="/payment?type=premium"
              className="flex min-h-[44px] items-center justify-center px-2 text-center text-[16px] font-semibold leading-6 text-white underline-offset-4 hover:underline">
              See what&apos;s in the plan
            </Link>
          </div>
        </div>

        <Reveal
          className="mx-auto w-full max-w-[460px] shrink-0 lg:mx-0 lg:w-[460px]"
          delay={100}>
          <div className="-rotate-2 rounded bg-[#fffdfa] px-6 py-8 shadow-[0_30px_30px_rgba(27,27,27,0.2)] sm:px-8 sm:py-9">
            <div className="flex justify-end">
              <span
                className="rounded-full bg-[#ff3e09] px-2 py-[3px] text-[10px] tracking-[1px] text-[#fffdfa]"
                style={mono}>
                SPECIAL LAUNCHING OFFER
              </span>
            </div>
            <div className="mt-5 flex flex-col items-center gap-1.5">
              <img
                src="/digital-invitation/logo.png"
                alt="Memoify"
                width={32}
                height={32}
                className="rotate-2"
              />
              <p
                className="text-center text-[10px] tracking-[1.2px] text-[#8a847d]"
                style={mono}>
                WEDDING PLAN · ORDER #0421
              </p>
            </div>
            <div className="my-5 h-px bg-[#e8ded3]" />
            <ul
              className="flex flex-col gap-5 text-[13px] text-[#1b1b1b]"
              style={mono}>
              {INCLUDED.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center justify-between gap-4"
                  style={mono}>
                  {item}
                  <span
                    aria-label="included"
                    className="inline-block scale-[0.6] text-[#ff3e09] opacity-0 transition-[transform,opacity] duration-200 ease-out group-data-[revealed=true]:scale-100 group-data-[revealed=true]:opacity-100 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none"
                    style={{ ...mono, transitionDelay: `${500 + i * 70}ms` }}>
                    ✓
                  </span>
                </li>
              ))}
            </ul>
            <div className="my-5 h-px bg-[#e8ded3]" />
            <p
              className="flex items-center justify-between text-[13px] text-[#1b1b1b]"
              style={mono}>
              MemoRoll camera
              <span className="text-[#ff3e09]" style={mono}>
                INCLUDED
              </span>
            </p>
            <div className="my-5 h-px bg-[#1b1b1b]" />
            <div className="flex items-center justify-between gap-4">
              <p
                className="text-[12px] tracking-[0.2px] text-[#1b1b1b]"
                style={mono}>
                TOTAL WEDDING PLAN COST
              </p>
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[20px] text-[#1b1b1b] line-through"
                  style={badge}>
                  Rp149.000
                </span>
                <span
                  className="text-[48px] leading-[48px] text-[#ff3e09]"
                  style={badge}>
                  Rp0
                </span>
              </div>
            </div>
            <p
              className="mt-5 text-[22px] text-[#4a4642] md:text-[24px]"
              style={{ fontFamily: 'var(--font-mr-hand)' }}>
              see you on the altar of love♡
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
