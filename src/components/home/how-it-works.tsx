'use client';

import { useInView } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useRef, type ReactNode } from 'react';

import { EASE_IN_OUT, Rise, SectionHead } from './ui';

/**
 * Three steps, each with a small picture of the real thing it describes.
 *
 * The cards enter as one wave (0 / 90 / 150ms, the first travelling
 * furthest). The flame line behind the numbers draws left to right as the
 * row arrives - movement on screen, so the strong ease-in-out - and is only
 * drawn where the steps sit in a row.
 */

function Step({
  number,
  title,
  body,
  children,
  delay,
  distance,
}: {
  number: string;
  title: string;
  body: string;
  children: ReactNode;
  delay: number;
  distance: number;
}) {
  return (
    <Rise delay={delay} distance={distance} className="relative flex-1">
      <div className="flex h-full flex-col rounded-[28px] border border-[#e8ded3] bg-[#fffdfa] p-6 md:p-7">
        <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-[#1b1b1b] text-[14px] font-semibold text-[#fbf4ec]">
          {number}
        </span>
        <h3 className="mt-5 text-[22px] font-bold leading-[1.2] tracking-[-0.03em] text-[#1b1b1b]">
          {title}
        </h3>
        <p className="mt-2 text-[15px] leading-[1.6] text-[#4a4642]">{body}</p>
        <div className="mt-6 flex h-[176px] items-center justify-center overflow-hidden rounded-[20px] bg-[#fbf4ec]">
          {children}
        </div>
      </div>
    </Rise>
  );
}

export default function HomeHowItWorks() {
  const row = useRef<HTMLDivElement>(null);
  const seen = useInView(row, { once: true, margin: '0px 0px -20% 0px' });

  return (
    <section
      id="how-it-works"
      className="scroll-mt-[81px] bg-[#fffdfa] px-5 py-16 md:py-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto max-w-[1180px]">
        <SectionHead
          eyebrow="How it works"
          title="Three steps. No design skills."
          body="You bring the photos and the inside jokes. The template does the rest."
        />

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
            <Step
              number="01"
              title="Pick a style"
              body="A series page, a playlist, a magazine, a scrapbook, a game. Start from the one that sounds like them."
              delay={0}
              distance={20}>
              <div className="relative h-[120px] w-[190px]">
                {[
                  [
                    '/home/gift-magazine.webp',
                    '-rotate-[8deg] -translate-x-9 translate-y-2',
                  ],
                  [
                    '/home/gift-playlist.webp',
                    'rotate-[7deg] translate-x-9 translate-y-1',
                  ],
                  ['/home/gift-series.webp', ''],
                ].map(([src, pose]) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full rounded-[10px] border border-black/10 object-cover object-top shadow-[0_10px_20px_-10px_rgba(90,42,18,0.4)] ${pose}`}
                  />
                ))}
              </div>
            </Step>

            <Step
              number="02"
              title="Add your photos and words"
              body="Upload pictures, write the captions, drop in a song. A form, not a design tool."
              delay={90}
              distance={14}>
              <div className="flex w-full max-w-[250px] flex-col gap-2 px-4">
                <div className="rounded-[12px] border border-black/15 bg-white px-3 py-2 text-[12px] text-[#1b1b1b]">
                  Happy birthday, Sarah
                </div>
                <div className="rounded-[12px] border border-black/15 bg-white px-3 py-2 text-[12px] text-[#8a847d]">
                  Remember that night in Bandung…
                </div>
                <div className="flex gap-2">
                  {['series', 'scrapbook', 'magazine'].map((name) => (
                    <img
                      key={name}
                      src={`/home/gift-${name}.webp`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-[42px] min-w-0 flex-1 rounded-[10px] border border-black/10 object-cover"
                    />
                  ))}
                  <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] border border-dashed border-black/25 text-[18px] text-[#8a847d]">
                    +
                  </span>
                </div>
              </div>
            </Step>

            <Step
              number="03"
              title="Send one link"
              body="Copy the link, share it, or print the QR code on a card. It opens on any phone, no app."
              delay={150}
              distance={10}>
              <div className="flex items-center gap-4">
                <div className="rounded-[12px] bg-white p-[6px]">
                  <QRCodeSVG
                    value="https://memoify.live"
                    size={92}
                    fgColor="#1b1b1b"
                    aria-label="A QR code that opens memoify.live"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="rounded-full border border-black/15 bg-white px-3 py-[6px] text-[11px] text-[#1b1b1b]">
                    memoify.live/for-sarah
                  </span>
                  <span className="w-fit rounded-full bg-[#ff3e09] px-3 py-[6px] text-[11px] font-semibold text-white">
                    Share gift
                  </span>
                </div>
              </div>
            </Step>
          </div>
        </div>
      </div>
    </section>
  );
}
