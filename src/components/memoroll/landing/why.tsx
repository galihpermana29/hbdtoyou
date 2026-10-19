'use client';

import React, { useEffect, useRef, useState } from 'react';

import { RevealWords } from './reveal-words';

type Slide = {
  text: React.ReactNode;
  /** The first slide is set larger than the rest. */
  lead?: boolean;
  photo?: { src: string; side: 'left' | 'right' };
};

/** The accent the design sets the key phrase of a statement in. */
function Hi({ children }: { children: React.ReactNode }) {
  return <span className="text-[#ff3e09]">{children}</span>;
}

const SLIDES: Slide[] = [
  {
    lead: true,
    text: (
      <>
        Why would I want this <Hi>Memoroll</Hi>?
      </>
    ),
  },
  {
    lead: true,
    text: (
      <>
        You <Hi>can&apos;t be everywhere</Hi> at once...
      </>
    ),
  },
  {
    text: (
      <>
        The <Hi>unscripted joy</Hi> happening around the room
      </>
    ),
    photo: { src: '/memoroll-landing/why-photo-1.jpg', side: 'right' },
  },
  {
    text: (
      <>
        <Hi>Your friends</Hi> are taking over the dance floor.
      </>
    ),
    photo: { src: '/memoroll-landing/why-photo-2.jpg', side: 'left' },
  },
  {
    text: (
      <>
        Your <Hi>parents are having a moment</Hi> in the corner.
      </>
    ),
    photo: { src: '/memoroll-landing/why-photo-3.jpg', side: 'right' },
  },
  {
    text: (
      <>
        You won&apos;t see all of it while it&apos;s happening.{' '}
        <Hi>But someone will.</Hi>
      </>
    ),
  },
  {
    text: (
      <>
        <Hi>Memoroll brings those moments back</Hi> to you, captured by the
        people who were actually there.
      </>
    ),
  },
];

/** Scroll distance, in viewport heights, that each slide is held for. */
const VH_PER_SLIDE = 0.7;

/**
 * The print slides in from the side it sits on (and back out again when the
 * slide goes), easing to a stop; the text reveals alongside it.
 */
function PolaroidPhoto({
  src,
  side,
  show,
}: {
  src: string;
  side: 'left' | 'right';
  show: boolean;
}) {
  const offset = side === 'left' ? '-14vw' : '14vw';
  return (
    <div
      style={{
        transform: show ? 'none' : `translateX(${offset})`,
        transition: show
          ? 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1) 100ms'
          : 'transform 500ms ease-in',
      }}
      className="flex w-full max-w-[531px] shrink-0 items-center justify-center motion-reduce:!transform-none motion-reduce:!transition-none lg:w-[531px]">
      <div className="relative aspect-[519/353] w-[97.7%] rotate-[2.09deg] shadow-[0_0.6px_0.6px_rgba(255,255,255,0.22),0_2.3px_2.3px_rgba(255,255,255,0.19),0_10px_10px_rgba(255,255,255,0.08)]">
        <img
          src="/memoroll-landing/why-paper.png"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <img
          src={src}
          alt=""
          className="absolute left-[1.93%] top-[2.83%] h-[94.3%] w-[96.14%] object-cover"
        />
        <img
          src="/memoroll-landing/why-clip.png"
          alt=""
          width={76}
          height={87}
          className="absolute left-[42.4%] top-[-13.7%] w-[14.6%] -rotate-[2.09deg]"
        />
      </div>
    </div>
  );
}

/**
 * "Why would I want this?" - six statements that take the section's one slot in
 * turn. The section is pinned while the page scrolls through it: scrolling down
 * moves to the next statement, scrolling up moves back to the previous one.
 */
export default function MemorollWhy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const { top, height } = track.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -top / scrollable)) : 0;
      setActive(
        Math.min(SLIDES.length - 1, Math.floor(progress * SLIDES.length))
      );
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section
      ref={trackRef}
      aria-label="Why would I want this?"
      className="relative overflow-x-clip bg-white"
      style={{
        fontFamily: 'var(--font-mr-body)',
        height: `${(1 + SLIDES.length * VH_PER_SLIDE) * 100}vh`,
      }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-4 py-12 md:px-10">
        <div className="flex w-full max-w-[1280px] flex-col items-center">
          <div className="flex min-h-[420px] w-full items-center gap-6 lg:min-h-[498px] lg:gap-12">
            <div className="relative flex-1 self-stretch">
              {SLIDES.map((slide, i) => (
                <div
                  key={i}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-8 transition-opacity duration-500 ease-out motion-reduce:transition-none lg:gap-12 ${
                    slide.photo?.side === 'left'
                      ? 'lg:flex-row'
                      : 'lg:flex-row-reverse'
                  } ${i === active ? 'opacity-100' : 'opacity-0'}`}>
                  {slide.photo && (
                    <PolaroidPhoto
                      src={slide.photo.src}
                      side={slide.photo.side}
                      show={i === active}
                    />
                  )}
                  <p
                    className={`text-center text-[#1b1b1b] lg:flex-1 ${
                      slide.lead
                        ? 'w-full text-[36px] font-medium md:text-[56px]'
                        : slide.photo
                          ? 'text-[28px] font-medium md:text-[48px]'
                          : 'w-full text-[28px] font-medium md:text-[48px]'
                    }`}>
                    <RevealWords show={i === active}>{slide.text}</RevealWords>
                  </p>
                </div>
              ))}
            </div>

            <div aria-hidden className="flex flex-col gap-2">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`w-[7px] rounded-[4px] transition-[height,background-color] duration-300 ${
                    i === active ? 'h-6 bg-[#e34013]' : 'h-[7px] bg-[#d6dae1]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
