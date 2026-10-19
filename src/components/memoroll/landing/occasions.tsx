'use client';

import { useEffect, useRef, useState } from 'react';

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
const WINDOWS = [
  [0.05, 0.5],
  [0.5, 0.95],
];

/**
 * A card and its print rise from below the screen, tilted, and settle flat as
 * `--t{n}` (0 -> 1, set from the scroll position) reaches 1.
 */
const rise = (n: 1 | 2): React.CSSProperties => ({
  transform: `translateY(calc((1 - var(--t${n})) * 80vh)) rotate(calc((1 - var(--t${n})) * -8deg))`,
  opacity: `min(1, calc(var(--t${n}) * 4))`,
  willChange: 'transform, opacity',
});

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
        src="/memoroll-landing/why-paper.png"
        alt=""
        className={`absolute object-cover ${paperClassName}`}
      />
      <img
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
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const update = () => {
      const { top, height } = track.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -top / scrollable)) : 0;
      let shown = 0;
      WINDOWS.forEach(([from, to], i) => {
        const t = reduceMotion
          ? 1
          : Math.min(1, Math.max(0, (progress - from) / (to - from)));
        track.style.setProperty(`--t${i + 1}`, String(1 - (1 - t) ** 3));
        if (t > 0) shown = i + 1;
      });
      setActive(shown);
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
      aria-label="For any occasions"
      className="bg-white py-[120px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div
        ref={trackRef}
        className="relative [--t1:0] [--t2:0]"
        style={{ height: `${(1 + OCCASIONS.length * VH_PER_STEP) * 100}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-4 py-8 md:px-10">
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-8 lg:gap-12">
            <div className="flex flex-col items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-[#e6e6e6] px-3 py-1.5 text-[14px] font-medium capitalize tracking-[-0.28px] text-[#e34013]">
                For any Occasions
              </span>
              <h2 className="text-center text-[28px] font-semibold leading-[1.2] tracking-[-0.72px] text-[#1b1b1b] md:text-[36px] md:leading-[44px]">
                Made for moments worth remembering
              </h2>
            </div>

            <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-[99px]">
              <div className="flex w-full flex-col gap-5 lg:w-[580px] lg:shrink-0">
                {OCCASIONS.map((o, i) => (
                  <div
                    key={o.title}
                    aria-hidden={i > active}
                    style={i > 0 ? rise(i as 1 | 2) : undefined}
                    className={`rounded-[20px] bg-[#fff6f5] p-3 shadow-[0_0_0_1px_#f0f0f0,0_4px_8px_-5px_rgba(0,0,0,0.14)] md:p-5 ${
                      i > 0 && i > active ? 'pointer-events-none' : ''
                    }`}>
                    <div className="flex flex-col gap-2 rounded-[10px] bg-white p-5 font-medium lg:h-[156px]">
                      <p className="text-[24px] text-[#ff3e09]">{o.title}</p>
                      <p className="text-[16px] text-black/60">{o.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* The collage is drawn at its 601x684 design size and scaled to 0.92x
                (0.55x of that on narrow screens). */}
              <div className="relative h-[346px] w-[304px] shrink-0 sm:h-[629px] sm:w-[553px]">
                <div className="absolute left-0 top-0 h-[684px] w-[601px] origin-top-left scale-[0.506] sm:scale-[0.92]">
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
                        src="/memoroll-landing/occasions-cat.png"
                        alt=""
                        className="h-[139.3px] w-[122.4px] -rotate-[12.25deg] object-cover"
                      />
                    </div>
                  </div>

                  {/* Weddings */}
                  <div
                    style={rise(1)}
                    className="absolute left-0 top-[212.5px] h-[311.7px] w-[527px]">
                    <Print
                      photo="/memoroll-landing/occasions-wedding.jpg"
                      className="absolute left-[68.8px] top-0 h-[311.7px] w-[458.3px]"
                      paperClassName="inset-0 size-full"
                      photoClassName="left-[8.8px] top-[8.8px] h-[294px] w-[440.7px]"
                    />
                    <div className="absolute left-[416.4px] top-[-31.6px] flex h-[117px] w-[172.6px] items-center justify-center">
                      <img
                        src="/memoroll-landing/occasions-swans.png"
                        alt=""
                        className="h-[63.2px] w-[160.7px] -rotate-[21.37deg] object-cover"
                      />
                    </div>
                  </div>

                  {/* Friends & Gatherings */}
                  <div
                    style={rise(2)}
                    className="absolute left-[69.7px] top-[352px] flex h-[332px] w-[541.7px] items-center justify-center">
                    <div
                      className={`relative h-[324.9px] w-[537.5px] rotate-[0.75deg] ${PRINT_SHADOW}`}>
                      <img
                        src="/memoroll-landing/why-paper.png"
                        alt=""
                        className="absolute left-[74.7px] top-[6.2px] h-[311.7px] w-[458.3px] object-cover"
                      />
                      <img
                        src="/memoroll-landing/occasions-gathering.jpg"
                        alt=""
                        className="absolute left-[83.6px] top-[15.1px] h-[294px] w-[440.7px] object-cover"
                      />
                      <div className="absolute left-[3px] top-[176.7px] flex h-[134.7px] w-[154.4px] items-center justify-center">
                        <img
                          src="/memoroll-landing/occasions-disco.png"
                          alt=""
                          className="h-[132.7px] w-[152.7px] -rotate-[0.75deg] object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
