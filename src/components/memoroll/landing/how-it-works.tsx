'use client';

import { useState } from 'react';

type Role = 'guest' | 'host';

const TABS: { role: Role; label: string }[] = [
  { role: 'guest', label: 'Guest' },
  { role: 'host', label: 'Host' },
];

const GUEST_STEPS = [
  {
    title: 'Scan',
    heading: 'Join the roll',
    body: 'Scan the event QR code to open your disposable camera. No app download needed',
  },
  {
    title: 'Shoot',
    heading: 'Make them count.',
    body: 'Every guest gets a limited roll. No previews, no retakes. Capture what catches your eye and let the moment happen.',
  },
  {
    title: 'Reveal',
    heading: 'Each perspective, one roll.',
    body: 'Once the event is over and the roll is ready, everyone’s photos come together in one shared collection.',
  },
  {
    title: 'Relive',
    heading: 'See what you missed',
    body: 'Discover the moments you didn’t see, the ones you almost forgot, and the event through everyone else’s eyes.',
  },
];

const HOST_STEPS = [
  {
    title: 'Activate',
    heading: 'Set the scene',
    body: 'Create a roll for your event, customize the experience, and choose when everyone gets to see the photos.',
  },
  {
    title: 'Invite',
    heading: 'Pass the roll around',
    body: 'Share your event QR code around the venue. Guests scan to join the roll and get their own disposable camera',
  },
  {
    title: 'Enjoy',
    heading: 'Be there for the moment',
    body: 'Your guests will capture the little moments happening all around you.',
  },
];

const STEPS: Record<Role, typeof GUEST_STEPS> = {
  guest: GUEST_STEPS,
  host: HOST_STEPS,
};

function StepArrow() {
  return (
    <div
      aria-hidden
      className="absolute left-1/2 top-1/2 z-10 hidden size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2eee8] lg:flex">
      <div className="flex size-[42px] items-center justify-center rounded-full bg-[#e34013]">
        <img src="/memoroll-landing/step-arrow.svg" alt="" width={10} height={16} />
      </div>
    </div>
  );
}

/** "How it works?" - a Guest / Host switch over four numbered-by-arrow step cards. */
export default function MemorollHowItWorks() {
  const [role, setRole] = useState<Role>('guest');
  const steps = STEPS[role];

  return (
    <section
      className="flex flex-col items-center gap-12 bg-white px-4 py-16 md:px-10 lg:py-24"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <span className="relative inline-flex items-center rounded-full border border-[#e6e6e6] px-3 py-1.5 text-[14px] font-medium capitalize tracking-[-0.28px] text-[#e34013]">
        How it works?
      </span>

      <div
        className="flex w-full max-w-[1280px] flex-col items-center gap-12 rounded-2xl bg-cover bg-center px-4 py-10 md:px-10 lg:py-14"
        style={{
          backgroundImage: 'url(/memoroll-landing/how-it-works-bg.png)',
        }}>
        <div
          role="tablist"
          aria-label="How it works for"
          className="relative grid w-full max-w-[596px] grid-cols-2 gap-[15px] rounded-2xl bg-white p-2">
          <span
            aria-hidden
            className={`absolute inset-y-2 left-2 w-[calc(50%-11.5px)] rounded-lg bg-[#ff3e09] transition-transform duration-200 ${
              role === 'host' ? 'translate-x-[calc(100%+15px)]' : ''
            }`}
          />
          {TABS.map((tab) => (
            <button
              key={tab.role}
              type="button"
              role="tab"
              aria-selected={role === tab.role}
              onClick={() => setRole(tab.role)}
              className={`relative rounded-lg px-[22px] py-3 text-[16px] font-semibold leading-6 transition-colors ${
                role === tab.role ? 'text-white' : 'text-[#7b7b7b]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <ol
          className={`grid w-full grid-cols-1 gap-[10px] md:grid-cols-2 ${
            role === 'host'
              ? 'lg:max-w-[898px] lg:grid-cols-3'
              : 'lg:grid-cols-4'
          }`}>
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative flex min-h-[316px] items-center justify-center rounded-[30px] bg-white p-10">
              <div className="flex w-full max-w-[212px] flex-col gap-7">
                <p className="text-[32px] font-bold text-[#e34013]">
                  {step.title}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-balance text-[22px] font-semibold text-[#1b1b1b]">
                    {step.heading}
                  </p>
                  <p className="text-balance text-[16px] font-normal text-[#393838]">
                    {step.body}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute -right-[5px] top-1/2 size-0">
                  <StepArrow />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
