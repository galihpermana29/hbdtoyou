import Link from 'next/link';

import { RevealHeading } from '@/components/memoroll/landing/reveal-words';
import StartInvitationLink from './start-invitation-link';

const STATS = [
  { value: '100+', label: 'COUPLES ON MEMOIFY' },
  { value: 'FREE', label: 'MEMOROLL CAMERA' },
];

/**
 * The phones collage is drawn on the design's 616 x 720 canvas. Every
 * measurement on it is converted to `cqw` against that width, so the whole
 * composition scales down together instead of being redrawn for mobile.
 */
const cq = (px: number) => `${((px / 616) * 100).toFixed(3)}cqw`;

const PHONES = [
  {
    src: '/digital-invitation/template-linen.jpg',
    x: 28,
    y: 210,
    w: 200,
    h: 396,
  },
  {
    src: '/digital-invitation/template-noir.jpg',
    x: 196,
    y: 70,
    w: 250,
    h: 495,
  },
  {
    src: '/digital-invitation/template-olive.jpg',
    x: 404,
    y: 260,
    w: 196,
    h: 388,
  },
];

export default function InvitationHero() {
  return (
    <section
      aria-label="Digital invitation"
      className="px-4 pb-12 pt-10 sm:px-6 md:px-10 lg:py-[72px] xl:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex w-full flex-col items-start gap-7 lg:w-[600px] lg:shrink-0 lg:gap-8 lg:pt-10">
          <RevealHeading
            as="h1"
            className="text-[44px] font-bold leading-[1] tracking-[-1.8px] text-[#1b1b1b] sm:text-[60px] sm:tracking-[-2.4px] xl:text-[76px] xl:tracking-[-3.2px]">
            An invitation as unforgettable as your “I do.”
          </RevealHeading>
          <p className="max-w-[520px] text-[17px] leading-[27px] text-[#4a4642] md:text-[19px] md:leading-[29px]">
            Build a wedding invitation website with your story, RSVPs and
            schedule in minutes. Then let guests capture the night with
            MemoRoll, free with the Wedding Plan.
          </p>
          <div className="flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:items-center">
            <StartInvitationLink className="inline-flex h-[60px] items-center justify-center gap-2.5 rounded-lg bg-[#e34013] px-6 text-[18px] font-semibold leading-7 text-white shadow-[0_1px_1px_rgba(16,24,40,0.05)] transition-colors hover:bg-[#c9340e]">
              Start your invitation
              <img
                src="/digital-invitation/arrow-right.svg"
                alt=""
                width={18}
                height={18}
              />
            </StartInvitationLink>
            <Link
              href="/templates"
              className="inline-flex h-[62px] items-center justify-center rounded-lg border border-[#d0d5dd] px-6 text-[18px] font-semibold leading-7 text-[#344054] transition-colors hover:bg-white">
              Browse templates
            </Link>
          </div>

          <div className="mt-1 flex w-full flex-wrap items-center gap-x-9 gap-y-6 border-t border-[#e8ded3] pt-7 lg:mt-0">
            <div className="flex items-center gap-4">
              <p
                className="text-[56px] leading-[58px] text-[#1b1b1b] md:text-[64px]"
                style={{ fontFamily: 'var(--font-mr-badge)' }}>
                4.9
              </p>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-[3px]" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <img
                      key={i}
                      src="/digital-invitation/star.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  ))}
                </div>
                <p className="text-[14px] text-[#4a4642]">
                  from 1,200+ couples
                </p>
              </div>
            </div>
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <p
                  className="text-[40px] leading-[40px] text-[#1b1b1b]"
                  style={{ fontFamily: 'var(--font-mr-badge)' }}>
                  {stat.value}
                </p>
                <p
                  className="text-[11px] tracking-[1.2px] text-[#8a847d]"
                  style={{ fontFamily: 'var(--font-mr-label)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:min-w-px lg:flex-1">
          <div
            className="relative mx-auto aspect-[616/720] w-full max-w-[616px] [container-type:inline-size]"
            aria-hidden="true">
            <div
              className="absolute bg-[#fffdfa]"
              style={{
                left: cq(4),
                top: cq(56),
                width: cq(600),
                height: cq(640),
                borderRadius: `${cq(300)} ${cq(300)} 0 0`,
              }}
            />
            {PHONES.map((phone) => (
              <div
                key={phone.src}
                className="absolute bg-[#1b1b1b] shadow-[0_24px_24px_rgba(27,27,27,0.15)]"
                style={{
                  left: cq(phone.x),
                  top: cq(phone.y),
                  width: cq(phone.w),
                  height: cq(phone.h),
                  padding: cq(8),
                  borderRadius: cq(28),
                }}>
                <img
                  src={phone.src}
                  alt=""
                  className="size-full object-cover"
                  style={{ borderRadius: cq(22) }}
                />
              </div>
            ))}

            <div
              className="absolute flex flex-col bg-[#fffdfa] shadow-[0_12px_16px_rgba(27,27,27,0.08)]"
              style={{
                left: cq(-16),
                top: cq(580),
                width: cq(168.8),
                height: cq(95),
                gap: cq(10),
                padding: `${cq(16)} ${cq(20)}`,
                borderRadius: cq(16),
              }}>
              <p
                className="whitespace-nowrap tracking-[1.2px] text-[#8a847d]"
                style={{
                  fontFamily: 'var(--font-mr-label)',
                  fontSize: cq(10),
                  letterSpacing: cq(1.2),
                }}>
                RSVP · LIVE
              </p>
              <div className="flex items-end" style={{ gap: cq(10) }}>
                <span
                  className="text-[#ff3e09]"
                  style={{
                    fontFamily: 'var(--font-mr-badge)',
                    fontSize: cq(44),
                    lineHeight: cq(40),
                  }}>
                  128
                </span>
                <span
                  className="font-semibold text-[#1b1b1b]"
                  style={{ fontSize: cq(14), lineHeight: cq(20) }}>
                  attending
                </span>
              </div>
            </div>

            <p
              className="absolute rotate-[4deg] whitespace-nowrap text-[#4a4642]"
              style={{
                left: cq(465),
                top: cq(146),
                fontFamily: 'var(--font-mr-hand)',
                fontSize: cq(24),
                lineHeight: cq(24),
              }}>
              greets every guest
              <br />
              <span
                style={{
                  marginLeft: cq(24),
                  fontFamily: 'var(--font-mr-hand)',
                }}>
                by name
              </span>
            </p>
            <p
              className="absolute -rotate-[4deg] whitespace-nowrap text-center text-[#4a4642]"
              style={{
                left: cq(8),
                top: cq(101),
                fontFamily: 'var(--font-mr-hand)',
                fontSize: cq(24),
                lineHeight: cq(24),
              }}>
              Flexible customizable
              <br />
              template
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
