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

/**
 * Phones: the collage has its own proportions on a 361 x 422 canvas rather than
 * being the desktop one shrunk, and sits between the headline and the copy.
 */
const mq = (px: number) => `${((px / 361) * 100).toFixed(3)}cqw`;

const MOBILE_PHONES = [
  { src: 'linen', x: 29.71, y: 131.3, w: 107.28, h: 212.43 },
  { src: 'noir', x: 119.83, y: 56.2, w: 134.11, h: 265.53 },
  { src: 'olive', x: 231.41, y: 158.12, w: 105.14, h: 208.13 },
];

const mobileNote = {
  fontFamily: 'var(--font-mr-hand)',
  fontSize: mq(12.874),
  lineHeight: mq(12.874),
};

function MobileCollage() {
  return (
    <div
      className="relative mx-auto aspect-[361/422] w-full max-w-[520px] [container-type:inline-size] max-md:order-2 md:hidden"
      aria-hidden="true">
      <div
        className="absolute bg-[#fffdfa]"
        style={{
          left: mq(16.83),
          top: mq(48.69),
          width: mq(321.85),
          height: mq(343.31),
          borderRadius: `${mq(160.93)} ${mq(160.93)} 0 0`,
        }}
      />
      {MOBILE_PHONES.map((phone) => (
        <div
          key={phone.src}
          className="absolute bg-[#1b1b1b]"
          style={{
            left: mq(phone.x),
            top: mq(phone.y),
            width: mq(phone.w),
            height: mq(phone.h),
            padding: mq(4.292),
            borderRadius: mq(15.018),
            boxShadow: `0 ${mq(22)} ${mq(11)} rgba(27,27,27,0.15)`,
          }}>
          <img
            src={`/digital-invitation/template-${phone.src}.jpg`}
            alt=""
            className="size-full object-cover"
            style={{ borderRadius: mq(11.8) }}
          />
        </div>
      ))}

      <div
        className="absolute flex flex-col bg-[#fffdfa]"
        style={{
          left: mq(6.11),
          top: mq(329.78),
          width: mq(90.55),
          height: mq(50.96),
          gap: mq(5.363),
          padding: `${mq(8.582)} ${mq(10.729)}`,
          borderRadius: mq(8.582),
          boxShadow: `0 ${mq(11)} ${mq(7.3)} rgba(27,27,27,0.08)`,
        }}>
        <p
          className="whitespace-nowrap text-[#8a847d]"
          style={{
            fontFamily: 'var(--font-mr-label)',
            fontSize: mq(5.363),
            lineHeight: mq(8.045),
            letterSpacing: mq(0.644),
          }}>
          RSVP · LIVE
        </p>
        <div className="flex items-end" style={{ gap: mq(5.363) }}>
          <span
            className="text-[#ff3e09]"
            style={{
              fontFamily: 'var(--font-mr-badge)',
              fontSize: mq(23.603),
              lineHeight: mq(21.459),
            }}>
            128
          </span>
          <span
            className="font-semibold text-[#1b1b1b]"
            style={{ fontSize: mq(7.511), lineHeight: mq(10.729) }}>
            attending
          </span>
        </div>
      </div>

      <p
        className="absolute rotate-[4deg] whitespace-nowrap text-[#4a4642]"
        style={{ left: mq(264.3), top: mq(97), ...mobileNote }}>
        greets every guest
        <br />
        <span style={{ marginLeft: mq(12.84), ...mobileNote }}>by name</span>
      </p>
      <p
        className="absolute -rotate-[4deg] whitespace-nowrap text-center text-[#4a4642]"
        style={{ left: mq(19.2), top: mq(72), ...mobileNote }}>
        Flexible customizable
        <br />
        template
      </p>
    </div>
  );
}

export default function InvitationHero() {
  return (
    <section
      aria-label="Digital invitation"
      className="px-4 pb-12 pt-10 sm:px-6 md:px-10 lg:py-[72px] xl:px-20">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-7 md:grid-cols-[600fr_616fr] md:items-start md:gap-6 lg:gap-12 xl:gap-16">
        <div className="flex w-full min-w-0 flex-col items-start gap-7 max-md:contents md:pt-6 lg:gap-8 lg:pt-10">
          <RevealHeading
            as="h1"
            className="text-[44px] font-bold leading-[1] max-md:order-1 tracking-[-1.8px] text-[#1b1b1b] sm:text-[60px] sm:tracking-[-2.4px] md:text-[38px] md:tracking-[-1.5px] lg:text-[52px] lg:tracking-[-2px] xl:text-[64px] xl:tracking-[-2.6px] min-[1400px]:text-[76px] min-[1400px]:tracking-[-3.2px]">
            An invitation as unforgettable as your “I do.”
          </RevealHeading>
          <p className="max-w-[520px] text-[17px] max-md:order-3 leading-[27px] text-[#4a4642] md:text-[19px] md:leading-[29px]">
            Build a wedding invitation website with your story, RSVPs and
            schedule in minutes. Then let guests capture the night with
            MemoRoll, free with the Wedding Plan.
          </p>
          <div className="flex w-full flex-col gap-3.5 max-md:order-4 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center md:w-full md:flex-col md:items-stretch lg:w-auto lg:flex-row lg:flex-wrap lg:items-center">
            <StartInvitationLink className="inline-flex h-[60px] items-center justify-center gap-2.5 rounded-lg bg-[#e34013] whitespace-nowrap px-6 text-[18px] font-semibold leading-7 lg:px-5 lg:text-[16px] xl:px-6 xl:text-[18px] text-white shadow-[0_1px_1px_rgba(16,24,40,0.05)] transition-[transform,background-color] duration-150 ease-out hover:bg-[#c9340e] active:scale-[0.97]">
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
              className="inline-flex h-[62px] items-center justify-center rounded-lg border border-[#d0d5dd] whitespace-nowrap px-6 text-[18px] font-semibold leading-7 lg:px-5 lg:text-[16px] xl:px-6 xl:text-[18px] text-[#344054] transition-[transform,background-color] duration-150 ease-out hover:bg-white active:scale-[0.97]">
              Browse templates
            </Link>
          </div>

          <div className="mt-1 grid w-full grid-cols-2 gap-x-6 gap-y-6 border-t border-[#e8ded3] max-md:order-5 max-md:px-6 max-md:py-8 md:pt-7 md:flex md:flex-wrap md:items-center md:gap-x-9 lg:mt-0">
            <div className="col-span-2 flex items-center gap-4 md:col-auto">
              <p
                className="text-[40px] leading-[58px] text-[#1b1b1b] md:text-[64px]"
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
                <p className="text-[12px] leading-[21px] text-[#4a4642] md:text-[14px]">
                  from 1,200+ couples
                </p>
              </div>
            </div>
            {STATS.map((stat) => (
              <div key={stat.label} className="flex min-w-0 flex-col gap-1">
                <p
                  className="text-[32px] leading-[40px] text-[#1b1b1b] md:text-[40px]"
                  style={{ fontFamily: 'var(--font-mr-badge)' }}>
                  {stat.value}
                </p>
                <p
                  className="text-[12px] leading-[16.5px] tracking-[1.2px] text-[#8a847d] max-[400px]:text-[11px] max-[400px]:tracking-[1px] md:text-[11px] md:leading-normal md:tracking-[1.2px]"
                  style={{ fontFamily: 'var(--font-mr-label)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <MobileCollage />

        <div className="hidden w-full min-w-0 md:block">
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
              className="absolute left-0 flex h-[84px] w-[150px] flex-col gap-2 rounded-2xl bg-[#fffdfa] px-4 py-3.5 shadow-[0_12px_16px_rgba(27,27,27,0.08)] sm:max-md:-left-4 sm:max-md:h-[95px] sm:max-md:w-[169px] sm:max-md:gap-2.5 sm:max-md:px-5 sm:max-md:py-4 lg:-left-4 lg:h-[95px] lg:w-[169px] lg:gap-2.5 lg:px-5 lg:py-4"
              style={{ top: cq(580) }}>
              <p
                className="whitespace-nowrap text-[10px] tracking-[1.2px] text-[#8a847d]"
                style={{ fontFamily: 'var(--font-mr-label)' }}>
                RSVP · LIVE
              </p>
              <div className="flex items-end gap-2.5">
                <span
                  className="text-[36px] leading-[34px] text-[#ff3e09] sm:max-md:text-[44px] sm:max-md:leading-[40px] lg:text-[44px] lg:leading-[40px]"
                  style={{ fontFamily: 'var(--font-mr-badge)' }}>
                  128
                </span>
                <span className="text-[13px] font-semibold leading-5 text-[#1b1b1b] sm:max-md:text-[14px] lg:text-[14px]">
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
                fontSize: `clamp(13px, ${cq(24)}, 24px)`,
                lineHeight: 1,
              }}>
              greets every guest
              <br />
              <span
                style={{
                  marginLeft: '3.7em',
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
                fontSize: `clamp(13px, ${cq(24)}, 24px)`,
                lineHeight: 1,
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
