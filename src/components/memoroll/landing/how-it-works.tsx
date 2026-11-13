'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CalendarPlus,
  PartyPopper,
  QrCode,
  type LucideIcon,
} from 'lucide-react';

import Eyebrow from './eyebrow';
import { useLandingCopy } from './language-provider';
import { RevealHeading } from './reveal-words';

type Role = 'guest' | 'host';

/** The guest steps use the icons from the design; the host steps use lucide. */
type StepIconSource = string | LucideIcon;

const ROLES: Role[] = ['guest', 'host'];

/** Each step's icon, in the order the steps are told (`how` in `copy.tsx`). */
const ICONS: Record<Role, StepIconSource[]> = {
  guest: [
    '/memoroll-landing/step-icon-scan.svg',
    '/memoroll-landing/step-icon-shoot.svg',
    '/memoroll-landing/step-icon-reveal.svg',
    '/memoroll-landing/step-icon-relive.svg',
  ],
  host: [CalendarPlus, QrCode, PartyPopper],
};

/**
 * The section as a link (owner, 2026-11-13): somebody asking "how does it
 * work?" on social media can be sent straight here. `#how-it-works` opens on
 * the guest's story, `#how-it-works-host` on the host's.
 */
const SECTION_ID = 'how-it-works';
const hashFor = (role: Role) =>
  role === 'host' ? `${SECTION_ID}-host` : SECTION_ID;

/** Where each side of the demo starts. */
const DEMO_HREF: Record<Role, string> = {
  guest: '/memoroll/demo',
  host: '/memoroll/demo/create',
};

/** The third frame is the one the design lights up, on either tab. */
const LIT_FRAME = 2;

const HOLES = 34;

/** A strip of film sprocket holes; fewer are shown as the strip gets narrower. */
function Sprockets() {
  return (
    <div
      aria-hidden
      className="flex h-[39px] items-start justify-between overflow-hidden px-[6px] py-[14px]">
      {Array.from({ length: HOLES }, (_, i) => (
        <span
          key={i}
          className={`h-[11px] w-4 shrink-0 rounded-[3px] bg-[#fbf4ec] ${
            i >= 22 ? 'hidden lg:block' : i >= 12 ? 'hidden md:block' : ''
          }`}
        />
      ))}
    </div>
  );
}

function StepIcon({ icon, lit }: { icon: StepIconSource; lit: boolean }) {
  if (typeof icon === 'string') {
    return (
      <img
        loading="lazy"
        decoding="async"
        src={icon}
        alt=""
        width={22}
        height={22}
        className="size-[22px]"
      />
    );
  }
  const Icon = icon;
  return (
    <Icon
      aria-hidden
      size={22}
      strokeWidth={1.5}
      className={lit ? 'text-white' : 'text-[#1b1b1b]'}
    />
  );
}

/**
 * "How it works" - the four frames of a guest's night on a strip of film, with
 * a switch to read the same story as the host (three frames).
 */
export default function MemorollHowItWorks() {
  const [role, setRole] = useState<Role>('guest');
  const copy = useLandingCopy().how;
  const steps = copy[role];

  // Arriving on either link opens that side's story and lands on it. The
  // browser's own jump to #how-it-works happens before the hero's images
  // settle and can end short, and there is no element called
  // how-it-works-host to jump to at all, so the section is scrolled to here.
  useEffect(() => {
    const open = () => {
      const hash = window.location.hash.slice(1);
      if (hash !== SECTION_ID && hash !== hashFor('host')) return;
      setRole(hash === SECTION_ID ? 'guest' : 'host');
      requestAnimationFrame(() =>
        document.getElementById(SECTION_ID)?.scrollIntoView({ block: 'start' })
      );
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);

  return (
    <section
      id={SECTION_ID}
      // Clear of the sticky announcement strip and navigation bar.
      className="scroll-mt-[112px] bg-[#fbf4ec] px-4 py-16 md:px-10 lg:px-20 lg:py-[120px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 lg:gap-14">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[640px] flex-col items-start gap-5">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <RevealHeading className="text-[28px] font-semibold leading-[1.2] tracking-[-0.72px] text-[#1b1b1b] md:text-[36px] md:leading-[44px]">
              {copy.heading(steps.length)}
            </RevealHeading>
          </div>

          <div
            role="tablist"
            aria-label={copy.tabsLabel}
            className="relative grid shrink-0 grid-cols-2 rounded-full bg-white p-[5px]">
            <span
              aria-hidden
              className={`absolute inset-y-[5px] left-[5px] w-[calc(50%-5px)] rounded-full bg-[#ff3e09] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                role === 'host' ? 'translate-x-full' : ''
              }`}
            />
            {ROLES.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`how-tab-${tab}`}
                aria-selected={role === tab}
                aria-controls="how-frames"
                onClick={() => setRole(tab)}
                className={`relative whitespace-nowrap rounded-full px-7 py-3 text-[15px] font-semibold transition-colors duration-300 ${
                  role === tab ? 'text-white' : 'text-[#8a847d]'
                }`}>
                {tab === 'guest' ? copy.guestTab : copy.hostTab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-[22px] bg-[#1b1b1b] px-[18px]">
          <Sprockets />
          <ol
            id="how-frames"
            role="tabpanel"
            aria-labelledby={`how-tab-${role}`}
            key={role}
            className={`grid grid-cols-1 gap-[14px] md:grid-cols-2 ${
              role === 'host' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
            }`}>
            {steps.map((step, i) => {
              const lit = i === LIT_FRAME;
              return (
                <li
                  key={i}
                  className={`memoroll-frame-in flex min-h-[283px] flex-col gap-5 rounded-lg px-[26px] pb-8 pt-7 ${
                    lit ? 'bg-[#ff3e09]' : 'bg-[#fffdfa]'
                  }`}
                  style={{ animationDelay: `${i * 70}ms` }}>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[14px] font-medium leading-[21px] tracking-[-0.28px] ${
                        lit ? 'text-[#ffe1d6]' : 'text-[#8a847d]'
                      }`}>
                      {copy.step(i + 1)}
                    </span>
                    <StepIcon icon={ICONS[role][i]} lit={lit} />
                  </div>
                  <p
                    className={`text-[32px] font-bold leading-[48px] ${
                      lit ? 'text-white' : 'text-[#e34013]'
                    }`}>
                    {step.title}
                  </p>
                  <div className="flex flex-col gap-2">
                    <p
                      className={`text-[22px] font-semibold leading-[33px] ${
                        lit ? 'text-white' : 'text-[#1b1b1b]'
                      }`}>
                      {step.heading}
                    </p>
                    <p
                      className={`text-[16px] font-normal leading-6 ${
                        lit ? 'text-[#ffede6]' : 'text-[#4a4642]'
                      }`}>
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          <Sprockets />
        </div>

        {/* Try it (owner, 2026-11-13): the demo of the side being read comes
            first, the other side right beside it. The section is shared by
            its link, #how-it-works or #how-it-works-host. */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {(role === 'host'
            ? (['host', 'guest'] as Role[])
            : (['guest', 'host'] as Role[])
          ).map((side, i) => (
            <Link
              key={side}
              href={DEMO_HREF[side]}
              className={`inline-flex items-center justify-center rounded-full px-7 py-4 text-[16px] font-semibold transition-[transform,background-color] duration-150 active:scale-[0.97] ${
                i === 0
                  ? 'bg-[#ff3e09] text-white hover:bg-[#e63600]'
                  : 'border border-[#1b1b1b]/15 bg-white text-[#1b1b1b] hover:bg-[#fffdfa]'
              }`}>
              {side === 'host' ? copy.demoAsCreator : copy.demoAsGuest}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
