'use client';

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useRef, useState } from 'react';

import Eyebrow from './eyebrow';
import { PINNED_OFFSET, PINNED_STAGE } from './pinned';
import { RevealHeading } from './reveal-words';

const OCCASIONS = [
  {
    title: 'Birthdays',
    body: 'Your day, through everyone else’s eyes. Catch the candles, the chaos, and the little moments you were too busy celebrating to see.',
  },
  {
    title: 'Weddings',
    body: 'A day, a hundred perspectives. From the first look to the dance floor, relive the moments that made your day yours.',
  },
  {
    title: 'Friends & Gatherings',
    body: 'The nights you wish could last longer. Let everyone capture their own little piece of the chaos, the laughter, and the memories you’ll talk about for years.',
  },
];

/** Scroll distance, in viewport heights, that each occasion is held for. */
const VH_PER_STEP = 0.7;

const PRINT_SHADOW =
  'shadow-[0_0.5px_0.5px_rgba(255,255,255,0.22),0_2px_2px_rgba(255,255,255,0.19),0_8.8px_8.8px_rgba(255,255,255,0.08)]';

/**
 * The scroll window, as a fraction of the pinned scroll, in which each later
 * occasion rises into place. The first is there from the start.
 */
const WINDOWS: [number, number][] = [
  [0.05, 0.5],
  [0.5, 0.95],
];

/**
 * A card and its print rise from below the screen, tilted, and settle flat as
 * the scroll crosses the occasion's window.
 *
 * The transform is written straight onto each moving element. Written as a
 * CSS variable on the section instead, every scroll frame would restyle the
 * whole collage beneath it, which is what made this section drop frames.
 */
function useRise(
  progress: MotionValue<number>,
  [from, to]: [number, number],
  reduceMotion: boolean
) {
  // How far through its window the occasion is, eased out: 0 -> 1.
  const t = useTransform(progress, (p) => {
    if (reduceMotion) return 1;
    const linear = Math.min(1, Math.max(0, (p - from) / (to - from)));
    return 1 - (1 - linear) ** 3;
  });
  const transform = useTransform(
    t,
    (v) => `translateY(${(1 - v) * 80}vh) rotate(${(1 - v) * -8}deg)`
  );
  const opacity = useTransform(t, (v) => Math.min(1, v * 4));
  return { transform, opacity, willChange: 'transform, opacity' };
}

function Print({
  photo,
  className,
  paperClassName,
  photoClassName,
}: {
  photo: string;
  className?: string;
  paperClassName: string;
  photoClassName: string;
}) {
  return (
    <div className={`relative ${PRINT_SHADOW} ${className ?? ''}`}>
      <img
        loading="lazy"
        decoding="async"
        src="/memoroll-landing/why-paper.webp"
        alt=""
        className={`absolute object-cover ${paperClassName}`}
      />
      <img
        loading="lazy"
        decoding="async"
        src={photo}
        alt=""
        className={`absolute object-cover ${photoClassName}`}
      />
    </div>
  );
}

/**
 * "For any occasions" - the section is pinned while the page scrolls through
 * it. Scrolling down, the next occasion's card and its print rise in from
 * below, tilted, and settle onto the ones already there; scrolling back up
 * sends them back down. The motion follows the scroll position directly.
 */
export default function MemorollOccasions() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: PINNED_OFFSET,
  });
  const rises = [
    useRise(scrollYProgress, WINDOWS[0], reduceMotion),
    useRise(scrollYProgress, WINDOWS[1], reduceMotion),
  ];

  // The occasions that have started to rise, for the cards' pointer events and
  // what a screen reader is told. It only changes as a window is crossed, so
  // scrolling within one renders nothing.
  const [risen, setRisen] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) =>
    setRisen(WINDOWS.filter(([from]) => p > from).length)
  );
  const active = reduceMotion ? WINDOWS.length : risen;

  return (
    <section
      aria-label="For any occasions"
      className="bg-white py-16 md:py-[120px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${(1 + OCCASIONS.length * VH_PER_STEP) * 100}vh` }}>
        <div
          className="sticky flex flex-col items-center justify-center px-4 py-4 md:px-10 md:py-8"
          style={PINNED_STAGE}>
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-5 sm:gap-8 lg:gap-12">
            <div className="flex flex-col items-center gap-3">
              <Eyebrow>For any Occasions</Eyebrow>
              <RevealHeading className="text-center text-[28px] font-semibold leading-[1.2] tracking-[-0.72px] text-[#1b1b1b] md:text-[36px] md:leading-[44px]">
                Made for moments worth remembering
              </RevealHeading>
            </div>

            <div className="flex w-full flex-col items-center gap-3 sm:gap-6 lg:flex-row lg:items-start lg:gap-[99px]">
              {/* Below lg the cards share one grid cell, so the pinned view holds a
                  single card at a time and fits a phone screen. */}
              <div className="grid w-full gap-5 lg:flex lg:w-[580px] lg:shrink-0 lg:flex-col">
                {OCCASIONS.map((o, i) => (
                  <motion.div
                    key={o.title}
                    aria-hidden={i > active}
                    style={i > 0 ? rises[i - 1] : undefined}
                    className={`col-start-1 row-start-1 rounded-[20px] bg-[#fff6f5] p-3 shadow-[0_0_0_1px_#f0f0f0,0_4px_8px_-5px_rgba(0,0,0,0.14)] md:p-5 ${
                      i > 0 && i > active ? 'pointer-events-none' : ''
                    }`}>
                    <div className="flex flex-col gap-2 rounded-[10px] bg-white p-5 font-medium lg:h-[156px]">
                      <p className="text-[24px] text-[#ff3e09]">{o.title}</p>
                      <p className="text-[16px] text-black/60">{o.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* The collage is drawn at its 601x684 design size and scaled to 0.92x
                (0.48x of that on narrow screens). */}
              <div className="relative order-first h-[300px] w-[264px] shrink-0 sm:h-[629px] sm:w-[553px] lg:order-none">
                <div className="absolute left-0 top-0 h-[684px] w-[601px] origin-top-left scale-[0.44] sm:scale-[0.92]">
                  {/* Birthdays */}
                  <div className="absolute left-[34.9px] top-0 h-[368px] w-[558px]">
                    <div className="absolute left-[88.7px] top-[40.2px] flex h-[328px] w-[469px] items-center justify-center">
                      <Print
                        photo="/memoroll-landing/occasions-birthday.jpg"
                        className="h-[311.7px] w-[458.3px] rotate-[2.09deg]"
                        paperClassName="inset-0 size-full"
                        photoClassName="left-[8.8px] top-[8.8px] h-[294px] w-[440.7px]"
                      />
                    </div>
                    <div className="absolute left-0 top-0 flex h-[162px] w-[149px] items-center justify-center">
                      <img
                        loading="lazy"
                        decoding="async"
                        src="/memoroll-landing/occasions-cat.webp"
                        alt=""
                        className="h-[139.3px] w-[122.4px] -rotate-[12.25deg] object-cover"
                      />
                    </div>
                  </div>

                  {/* Weddings */}
                  <motion.div
                    style={rises[0]}
                    className="absolute left-0 top-[212.5px] h-[311.7px] w-[527px]">
                    <Print
                      photo="/memoroll-landing/occasions-wedding.jpg"
                      className="absolute left-[68.8px] top-0 h-[311.7px] w-[458.3px]"
                      paperClassName="inset-0 size-full"
                      photoClassName="left-[8.8px] top-[8.8px] h-[294px] w-[440.7px]"
                    />
                    <div className="absolute left-[416.4px] top-[-31.6px] flex h-[117px] w-[172.6px] items-center justify-center">
                      <img
                        loading="lazy"
                        decoding="async"
                        src="/memoroll-landing/occasions-swans.webp"
                        alt=""
                        className="h-[63.2px] w-[160.7px] -rotate-[21.37deg] object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Friends & Gatherings */}
                  <motion.div
                    style={rises[1]}
                    className="absolute left-[69.7px] top-[352px] flex h-[332px] w-[541.7px] items-center justify-center">
                    <div
                      className={`relative h-[324.9px] w-[537.5px] rotate-[0.75deg] ${PRINT_SHADOW}`}>
                      <img
                        loading="lazy"
                        decoding="async"
                        src="/memoroll-landing/why-paper.webp"
                        alt=""
                        className="absolute left-[74.7px] top-[6.2px] h-[311.7px] w-[458.3px] object-cover"
                      />
                      <img
                        loading="lazy"
                        decoding="async"
                        src="/memoroll-landing/occasions-gathering.jpg"
                        alt=""
                        className="absolute left-[83.6px] top-[15.1px] h-[294px] w-[440.7px] object-cover"
                      />
                      <div className="absolute left-[3px] top-[176.7px] flex h-[134.7px] w-[154.4px] items-center justify-center">
                        <img
                          loading="lazy"
                          decoding="async"
                          src="/memoroll-landing/occasions-disco.webp"
                          alt=""
                          className="h-[132.7px] w-[152.7px] -rotate-[0.75deg] object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
