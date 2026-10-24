import Link from 'next/link';

import { RevealHeading } from '@/components/memoroll/landing/reveal-words';
import MemorollPreview from './memoroll-preview';
import Reveal from './reveal';
import SectionPill from './section-pill';

const STEPS = [
  {
    when: 'T–60 DAYS',
    title: 'Pick',
    subtitle: 'Choose your template',
    body: 'Browse designs made for modern celebrations and start from the one you love.',
  },
  {
    when: 'T–45 DAYS',
    title: 'Personalize',
    subtitle: 'Make it yours',
    body: 'Add your story, photos, schedule, maps and a song, then write a greeting for each guest.',
  },
  {
    when: 'T–30 DAYS',
    title: 'Share',
    subtitle: 'Send your invitations',
    body: 'Give each guest their personal link and watch RSVPs arrive in one dashboard.',
  },
];

const mono = { fontFamily: 'var(--font-mr-label)' };
const heavy = { fontFamily: 'var(--font-mr-badge)' };

export default function InvitationHowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="How it works"
      className="bg-[#1b1b1b] px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:py-[120px] xl:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-14 lg:gap-[88px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex max-w-[680px] flex-col items-start gap-6">
            <SectionPill>How it works</SectionPill>
            <RevealHeading className="text-[34px] font-semibold leading-[1.08] tracking-[-1.4px] text-[#fbf4ec] md:text-[56px] md:leading-[59px] md:tracking-[-2px]">
              Your invitation gets them there.{' '}
              <span className="text-[#ff3e09]">Memoroll</span> keeps what
              happens in-between
            </RevealHeading>
            <p className="max-w-[540px] text-[16px] leading-[26px] text-[#fbf4ec]/70 md:text-[17px]">
              The same link guests use to RSVP becomes their access to Memoroll
              disposable camera on the day. Memoroll is included free with every
              Wedding Plan.
            </p>
          </div>
          <div className="w-full px-3 pb-3 pt-6 sm:pt-8 lg:w-[420px] lg:shrink-0 lg:p-0">
            <div className="mx-auto w-full max-w-[420px] lg:mx-0">
              <MemorollPreview />
            </div>
          </div>
        </div>

        <ol className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 80}
              className="flex flex-col gap-7">
              <div className="flex items-center" aria-hidden="true">
                <span className="size-3.5 shrink-0 rounded-full bg-[#1b1b1b]" />
                <span
                  className="h-px flex-1 origin-left scale-x-0 bg-[#fbf4ec]/25 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[revealed=true]:scale-x-100 motion-reduce:scale-x-100 motion-reduce:transition-none"
                  style={{ transitionDelay: `${index * 80 + 150}ms` }}
                />
              </div>
              <div className="flex flex-col gap-3 pr-10">
                <p
                  className="text-[11px] tracking-[1.2px] text-[#fbf4ec]/50"
                  style={mono}>
                  {step.when}
                </p>
                <p
                  className="text-[48px] leading-[48px] text-[#fbf4ec]"
                  style={heavy}>
                  {step.title}
                </p>
                <p className="text-[18px] font-semibold text-[#fbf4ec]">
                  {step.subtitle}
                </p>
                <p className="max-w-[280px] text-[15px] leading-[23px] text-[#fbf4ec]/70">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal
            as="li"
            delay={STEPS.length * 80}
            className="flex flex-col gap-7">
            <div className="flex items-center" aria-hidden="true">
              <span className="size-3.5 shrink-0 rounded-full bg-[#ff3e09]" />
            </div>
            <div className="flex flex-col gap-3 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5">
                <p
                  className="text-[11px] tracking-[1.2px] text-[#ff3e09]"
                  style={mono}>
                  T-14 DAYS
                </p>
                <span
                  className="rounded-full bg-[#ff3e09] px-2 py-[3px] text-[10px] tracking-[1px] text-[#fffdfa]"
                  style={mono}>
                  FREE
                </span>
              </div>
              <p
                className="text-[40px] leading-[48px] text-[#ff3e09] sm:text-[48px] lg:whitespace-nowrap"
                style={heavy}>
                Activate Memoroll
              </p>
              <p className="text-[18px] font-semibold text-[#fbf4ec]">
                Enhance the Big Day
              </p>
              <p className="max-w-[280px] text-[15px] leading-[23px] text-[#fbf4ec]/70 lg:max-w-none">
                Through your dashboard you can activate Memoroll for free so on
                the day guests can access a digital disposable camera.{' '}
                <Link
                  href="/memoroll"
                  className="font-semibold text-[#ff3e09] underline">
                  Learn about Memoroll
                </Link>
              </p>
            </div>
          </Reveal>
        </ol>
      </div>
    </section>
  );
}
