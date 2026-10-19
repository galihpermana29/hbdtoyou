'use client';

import { useEffect, useRef, useState } from 'react';

import { RevealHeading } from './reveal-words';

/** Delay between one asset popping up and the next, in ms. */
const POP_STAGGER_MS = 220;

/**
 * Springy pop: the asset starts small and low, then overshoots and settles.
 * The overshoot comes from the curve's y1 > 1. Hiding resets it instantly so
 * the pop plays again the next time the cluster scrolls into view.
 */
const pop = (show: boolean, order: number): React.CSSProperties => ({
  opacity: show ? 1 : 0,
  transform: show ? 'none' : 'translateY(40px) scale(0.5)',
  transition: show
    ? `transform 700ms cubic-bezier(0.34, 1.7, 0.5, 1) ${order * POP_STAGGER_MS}ms, opacity 200ms ease-out ${order * POP_STAGGER_MS}ms`
    : 'none',
});

/** "Included in the Wedding Plan" - the closing call-out above the footer. */
export default function MemorollPlanCallout() {
  const clusterRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = clusterRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label="Included in the Wedding Plan"
      className="bg-[#fbf4ec] px-4 pb-16 pt-12 md:px-10 md:pb-[120px] md:pt-24"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-10 overflow-hidden rounded-2xl p-6 md:p-10 lg:block lg:h-[460px] lg:p-0">
        <img
          src="/memoroll-landing/callout-bg.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />

        <div className="relative flex max-w-[600px] flex-col items-start gap-6 lg:absolute lg:left-16 lg:top-[63px]">
          <span className="inline-flex items-center rounded-full border border-white/35 bg-white/15 px-3 py-1.5 text-[14px] font-medium tracking-[-0.28px] text-white">
            Included in the Wedding Plan
          </span>
          <RevealHeading className="text-[28px] font-semibold leading-[1.2] tracking-[-0.72px] text-white md:text-[36px] md:leading-[44px]">
            Memoroll is on the house with your Wedding Plan.
          </RevealHeading>
          <p className="max-w-[520px] text-[18px] leading-[30px] text-[#ffe9e0]">
            No add-on, no extra checkout. Every guest gets a camera and the
            whole roll develops the morning after - all included when you book
            the Wedding Plan.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="/create/wedding-invitation"
              className="flex h-12 items-center justify-center rounded-lg bg-white px-5 text-[16px] md:h-[60px] md:px-6 md:text-[18px] font-semibold text-[#e34013] shadow-[0_1px_1px_rgba(16,24,40,0.05)]">
              Get the Wedding Plan
            </a>
            <a
              href="#plan-details"
              className="text-[16px] font-semibold text-white">
              See what&apos;s in the plan
            </a>
          </div>
        </div>

        {/* The plan card and the print behind it, drawn at their 553x418 design
            size and scaled down on narrow screens. */}
        <div
          ref={clusterRef}
          className="relative mx-auto h-[251px] w-[332px] sm:h-[418px] sm:w-[553px] lg:absolute lg:left-[718px] lg:top-9 lg:mx-0">
          <div className="absolute left-0 top-0 h-[418px] w-[553px] origin-top-left scale-[0.6] sm:scale-100">
            <div
              style={pop(show, 0)}
              className="absolute left-[275.09px] top-0 flex h-[339.7px] w-[278.3px] items-center justify-center">
              <div className="rotate-[11.18deg] bg-white px-3 pb-10 pt-3 drop-shadow-[0_16px_16px_rgba(122,31,0,0.25)]">
                <img
                  src="/memoroll-landing/testimonial-elias.jpg"
                  alt=""
                  className="h-[250px] w-[200px] object-cover"
                />
              </div>
            </div>
            <div
              style={pop(show, 1)}
              className="absolute left-0 top-[18.19px] flex h-[398.6px] w-[405.1px] items-center justify-center">
              <div
                id="plan-details"
                className="flex h-[373px] w-[380px] -rotate-4 flex-col gap-[18px] rounded-2xl bg-[#fffdfa] p-7 drop-shadow-[0_20px_20px_rgba(122,31,0,0.28)]">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium tracking-[-0.28px] text-[#8a847d]">
                    Memoify · Wedding Plan
                  </p>
                  <img
                    src="/memoroll-landing/callout-heart.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                </div>
                <p className="text-[22px] font-semibold leading-[33px] text-[#1b1b1b]">
                  What&apos;s in your plan
                </p>
                <div className="h-px bg-[#e8ded3]" />
                <div className="flex h-[43px] items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1b1b1b]">
                    <img
                      src="/memoroll-landing/callout-check.svg"
                      alt=""
                      width={13}
                      height={13}
                    />
                  </span>
                  <div className="flex flex-col gap-0.5 text-[14px]">
                    <p className="font-semibold leading-[21px] text-[#1b1b1b]">
                      Wedding Plan
                    </p>
                    <p className="leading-5 text-[#4a4642]">
                      Everything for your big day
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#ffede5] p-[14px]">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ff3e09]">
                    <img
                      src="/memoroll-landing/callout-camera.svg"
                      alt=""
                      width={13}
                      height={13}
                    />
                  </span>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <p className="text-[16px] font-semibold leading-6 text-[#1b1b1b]">
                      Memoroll
                    </p>
                    <p className="text-[14px] leading-5 text-[#4a4642]">
                      A camera for every guest
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 text-[14px] font-medium leading-[21px] tracking-[-0.28px]">
                    <p className="text-[#8a847d]">Add-on</p>
                    <p className="text-[#ff3e09]">Free</p>
                  </div>
                </div>
                <div className="border-t border-[#e8ded3]" />
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium leading-[21px] text-[#4a4642]">
                    Extra cost for Memoroll
                  </p>
                  <p className="text-[24px] font-semibold leading-9 text-[#ff3e09]">
                    Rp0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
