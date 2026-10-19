'use client';

import { useState } from 'react';
import {
  CalendarPlus,
  PartyPopper,
  QrCode,
  type LucideIcon,
} from 'lucide-react';

import { RevealHeading } from './reveal-words';

type Role = 'guest' | 'host';

type Step = {
  title: string;
  heading: string;
  body: string;
  /** The guest steps use the icons from the design; the host steps use lucide. */
  icon: string | LucideIcon;
};

const TABS: { role: Role; label: string }[] = [
  { role: 'guest', label: "I'm a guest" },
  { role: 'host', label: "I'm hosting" },
];

const STEPS: Record<Role, Step[]> = {
  guest: [
    {
      title: 'Scan',
      heading: 'Join the roll',
      body: 'Scan the event QR code to open your disposable camera. No app download needed.',
      icon: '/memoroll-landing/step-icon-scan.svg',
    },
    {
      title: 'Shoot',
      heading: 'Make them count',
      body: 'Every guest gets a limited roll. No previews, no retakes. Capture what catches your eye.',
      icon: '/memoroll-landing/step-icon-shoot.svg',
    },
    {
      title: 'Reveal',
      heading: 'One roll, every angle',
      body: 'Once the event wraps and the roll develops, everyone’s photos land in one shared gallery.',
      icon: '/memoroll-landing/step-icon-reveal.svg',
    },
    {
      title: 'Relive',
      heading: 'See what you missed',
      body: 'Discover the moments you didn’t see and the night through everyone else’s eyes.',
      icon: '/memoroll-landing/step-icon-relive.svg',
    },
  ],
  host: [
    {
      title: 'Activate',
      heading: 'Set the scene',
      body: 'Create a roll for your event, customize the experience, and choose when everyone gets to see the photos.',
      icon: CalendarPlus,
    },
    {
      title: 'Invite',
      heading: 'Pass the roll around',
      body: 'Share your event QR code around the venue. Guests scan to join the roll and get their own disposable camera.',
      icon: QrCode,
    },
    {
      title: 'Enjoy',
      heading: 'Be there for the moment',
      body: 'Your guests will capture the little moments happening all around you.',
      icon: PartyPopper,
    },
  ],
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

function StepIcon({ icon, lit }: { icon: Step['icon']; lit: boolean }) {
  if (typeof icon === 'string') {
    return (
      <img src={icon} alt="" width={22} height={22} className="size-[22px]" />
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
  const steps = STEPS[role];

  return (
    <section
      id="how-it-works"
      className="bg-[#fbf4ec] px-4 py-16 md:px-10 lg:px-20 lg:py-[120px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 lg:gap-14">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[640px] flex-col items-start gap-5">
            <span className="inline-flex items-center rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium capitalize tracking-[-0.28px] text-[#e34013]">
              How it works
            </span>
            <RevealHeading className="text-[28px] font-semibold leading-[1.2] tracking-[-0.72px] text-[#1b1b1b] md:text-[36px] md:leading-[44px]">
              From first flash to final reveal, in four frames.
            </RevealHeading>
          </div>

          <div
            role="tablist"
            aria-label="How it works for"
            className="relative grid shrink-0 grid-cols-2 rounded-full bg-white p-[5px]">
            <span
              aria-hidden
              className={`absolute inset-y-[5px] left-[5px] w-[calc(50%-5px)] rounded-full bg-[#ff3e09] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                role === 'host' ? 'translate-x-full' : ''
              }`}
            />
            {TABS.map((tab) => (
              <button
                key={tab.role}
                type="button"
                role="tab"
                id={`how-tab-${tab.role}`}
                aria-selected={role === tab.role}
                aria-controls="how-frames"
                onClick={() => setRole(tab.role)}
                className={`relative whitespace-nowrap rounded-full px-7 py-3 text-[15px] font-semibold transition-colors duration-300 ${
                  role === tab.role ? 'text-white' : 'text-[#8a847d]'
                }`}>
                {tab.label}
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
                  key={step.title}
                  className={`memoroll-frame-in flex min-h-[283px] flex-col gap-5 rounded-lg px-[26px] pb-8 pt-7 ${
                    lit ? 'bg-[#ff3e09]' : 'bg-[#fffdfa]'
                  }`}
                  style={{ animationDelay: `${i * 70}ms` }}>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[14px] font-medium leading-[21px] tracking-[-0.28px] ${
                        lit ? 'text-[#ffe1d6]' : 'text-[#8a847d]'
                      }`}>
                      Step {i + 1}
                    </span>
                    <StepIcon icon={step.icon} lit={lit} />
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
      </div>
    </section>
  );
}
