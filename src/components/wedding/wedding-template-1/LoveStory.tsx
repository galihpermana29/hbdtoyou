'use client';

/**
 * Wedding Template 1 — Love Story. Figma node 312:1687.
 * A timeline of the couple's story: torn-paper framed film strip, a
 * "tap to reveal" polaroid, dated milestones and a map keepsake.
 * Fixed 1081px-tall mobile composition, built pixel-accurate to the design.
 * Animation: heading, film strip, milestones and map fade up on scroll; the
 * polaroid cover is tap-to-reveal (fades/scales out to show the photo beneath).
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { EASE, fadeUp, fadeUpCenter, inView, staggerContainer } from './variants';

const ASSET = '/templates/wedding-template-1';

const MILESTONE_2020 = {
  year: '2020',
  title: 'The meeting',
  body: 'Elias and Freya met during a summer volunteering program at a local wildlife sanctuary. Elias, always quiet and meticulous, found himself fascinated by Freya\u2019s contagious energy and deep empathy for every animal in her care. A shared task repairing an aviary roof led to hours of conversation that flowed with surprising ease.',
};

const MILESTONE_2022 = {
  year: '2022',
  title: 'Getting serious',
  body: 'They discovered a mutual love for hiking, old maps, and the kind of late-night calls that make time stand still. Over the years, they\u2019ve built a relationship grounded in shared values, unwavering respect, and a genuine delight in each other\u2019s success.',
};

const MILESTONE_2023 = {
  year: '2023',
  title: 'On his one knee!',
  body: 'Five years later, they are each other\u2019s anchor and wildest adventure. Freya still makes Elias laugh until his sides ache, and Elias\u2019s calm presence remains her haven. Now, they are excited to begin their next chapter together, celebrating not just their love, but the unique path they\u2019ve carved side by side\u2014surrounded by the family and friends who mean the most.',
};

/** Torn-paper crop used along the long (147px) edges. */
function TornEdgeLong() {
  return (
    <div className="relative h-[375px] w-[147px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute left-[-81.51%] top-[-13.38%] h-[134.36%] w-[192.99%] max-w-none"
          src={`${ASSET}/lovestory-torn-paper.png`}
        />
      </div>
    </div>
  );
}

/** Torn-paper crop used along the short (52px) edges. */
function TornEdgeShort() {
  return (
    <div className="relative h-[290px] w-[52px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute left-[-413.1%] top-[-6.61%] h-[173.74%] w-[545.57%] max-w-none"
          src={`${ASSET}/lovestory-torn-paper.png`}
        />
      </div>
    </div>
  );
}

/** The film-strip of three photos, tilted -4.83deg. */
function FilmStrip({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      className="absolute left-[25px] top-[30px] flex h-[343.24px] w-[157.601px] items-center justify-center"
      {...inView(reduce, fadeUp)}>
      <div className="flex-none rotate-[-4.83deg]">
        <div
          className="relative h-[333.484px] w-[130.002px]"
          style={{
            filter:
              'drop-shadow(0px 0px 1.85px rgba(0,0,0,0.25)) drop-shadow(0px 2px 5.15px rgba(0,0,0,0.17))',
          }}>
          <div className="absolute left-[9.69px] top-[10.5px] h-[99.318px] w-[108.201px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={`${ASSET}/lovestory-photo-1.png`}
            />
          </div>
          <div className="absolute left-[9.69px] top-[117.08px] h-[99.318px] w-[108.201px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={`${ASSET}/lovestory-photo-2.png`}
            />
          </div>
          <div className="absolute left-[9.69px] top-[223.67px] h-[99.318px] w-[108.201px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={`${ASSET}/lovestory-photo-3.png`}
            />
          </div>
          <div className="absolute left-0 top-0 h-[333.888px] w-[129.845px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-[-40.7%] top-[-2.62%] h-[104.82%] w-[179.78%] max-w-none"
                src={`${ASSET}/lovestory-film-frame.png`}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** The hidden-photo polaroid with a "tap to reveal" cover, tilted slightly. */
function Polaroid({ reduce }: { reduce: boolean | null }) {
  const [revealed, setRevealed] = useState(false);

  const coverAnim = {
    animate: { opacity: revealed ? 0 : 1, scale: revealed ? 1.05 : 1 },
    transition: { duration: reduce ? 0 : 0.4, ease: EASE },
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Reveal photo"
      onClick={() => setRevealed(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setRevealed(true);
      }}
      className="absolute left-[191px] top-[389px] flex h-[219.836px] w-[178.439px] cursor-pointer items-center justify-center"
      {...inView(reduce, fadeUp)}>
      <div className="absolute left-[9.02px] top-[9.9px] h-[156.339px] w-[139.745px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none"
          src={`${ASSET}/lovestory-polaroid-photo.png`}
        />
      </div>
      <div className="absolute left-[0.01px] top-0 h-[205.649px] w-[159.458px] shadow-[0px_1.914px_2.967px_0px_rgba(0,0,0,0.17)]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/lovestory-polaroid-frame.png`}
        />
      </div>
      <motion.div
        className="absolute left-[9.03px] top-[9.9px] h-[156.339px] w-[139.745px]"
        style={{ pointerEvents: revealed ? 'none' : undefined }}
        {...coverAnim}>
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none"
          src={`${ASSET}/lovestory-polaroid-cover.svg`}
        />
      </motion.div>
      <motion.div
        className="absolute left-[40.15px] top-[72.27px] flex h-[19.202px] w-[76.799px] items-center justify-center"
        {...coverAnim}>
        <div className="flex-none rotate-[-5.48deg]">
          <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[10px] font-semibold leading-normal text-white">
            tap to reveal
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LoveStory() {
  const reduce = useReducedMotion();

  return (
    <section className="relative h-[1081px] w-full overflow-hidden bg-[#090909]">
      {/* Section heading */}
      <motion.div
        className="absolute left-[calc(50%+0.5px)] top-[34px] flex w-[176px] flex-col items-center gap-[4px]"
        {...inView(reduce, fadeUpCenter)}>
        <p className="w-full text-center font-[family-name:var(--font-wt1-mono)] text-[20px] leading-normal text-white">
          Our
        </p>
        <div className="flex flex-col items-center">
          <p className="whitespace-nowrap font-[family-name:var(--font-wt1-script)] text-[48px] leading-normal text-[rgba(250,250,250,0.98)]">
            Love Story
          </p>
          <div className="mt-[-10px] h-[0.5px] w-[180px] bg-[#fafafa]" />
        </div>
      </motion.div>

      {/* Main story block: torn-paper frame, paper card, film strip, polaroid, milestone */}
      <div className="absolute left-[15px] top-[151px] h-[696px] w-[360px]">
        {/* Torn-paper border pieces (behind the paper card) */}
        <div className="absolute left-[calc(50%+34.5px)] top-[8px] flex h-[147px] w-[375px] -translate-x-1/2 items-center justify-center">
          <div className="flex-none -rotate-90 -scale-y-100">
            <TornEdgeLong />
          </div>
        </div>
        <div className="absolute left-[calc(50%+34.5px)] top-[549px] flex h-[147px] w-[375px] -translate-x-1/2 items-center justify-center">
          <div className="flex-none rotate-90">
            <TornEdgeLong />
          </div>
        </div>
        <div className="absolute left-[calc(50%-35px)] top-[8px] flex h-[52px] w-[290px] -translate-x-1/2 items-center justify-center">
          <div className="flex-none -rotate-90">
            <TornEdgeShort />
          </div>
        </div>
        <div className="absolute left-[calc(50%-35px)] top-[644px] flex h-[52px] w-[290px] -translate-x-1/2 items-center justify-center">
          <div className="flex-none rotate-90 -scale-y-100">
            <TornEdgeShort />
          </div>
        </div>
        <div className="absolute left-[calc(50%-98.5px)] top-[55px] flex h-[375px] w-[147px] -translate-x-1/2 items-center justify-center">
          <div className="flex-none rotate-180 -scale-y-100">
            <TornEdgeLong />
          </div>
        </div>
        <div className="absolute left-[calc(50%-94.5px)] top-[229px] flex h-[375px] w-[147px] -translate-x-1/2 items-center justify-center">
          <div className="flex-none rotate-180 -scale-y-100">
            <TornEdgeLong />
          </div>
        </div>
        <div className="absolute left-[calc(50%-94.5px)] top-[286px] flex h-[375px] w-[147px] -translate-x-1/2 items-center justify-center">
          <div className="flex-none rotate-180">
            <TornEdgeLong />
          </div>
        </div>

        {/* Paper card background + cream tint overlay */}
        <div className="absolute left-[50px] top-[55px] h-[606px] w-[329px]">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-0 top-[-67.47%] h-[247.47%] w-[307.6%] max-w-none"
                src={`${ASSET}/lovestory-paper-bg.jpg`}
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.04) 100%), linear-gradient(90deg, rgba(239,233,226,0.3) 0%, rgba(239,233,226,0.3) 100%)',
              }}
            />
          </div>
        </div>

        <FilmStrip reduce={reduce} />

        {/* Small torn strip accent */}
        <div className="absolute left-[56px] top-0 h-[74px] w-[34px]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute left-[-145.77%] top-[-32.79%] h-[169.98%] w-[366.17%] max-w-none"
              src={`${ASSET}/lovestory-image-520.png`}
            />
          </div>
        </div>

        <Polaroid reduce={reduce} />

        {/* 2023 milestone copy */}
        <motion.div
          className="absolute left-[53px] top-[397px] flex w-[145px] flex-col items-start gap-[4px] leading-normal text-[#090909]"
          {...inView(reduce, fadeUp)}>
          <div className="flex w-full items-center gap-[4px] whitespace-nowrap font-[family-name:var(--font-wt1-mono)] font-semibold">
            <p className="shrink-0 text-[12px]">{MILESTONE_2023.year}</p>
            <p className="shrink-0 text-[14px]">-</p>
            <p className="shrink-0 text-[12px]">{MILESTONE_2023.title}</p>
          </div>
          <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[10px]">
            {MILESTONE_2023.body}
          </p>
        </motion.div>
      </div>

      {/* Map keepsake at the bottom */}
      <motion.div
        className="absolute left-[27px] top-[738.86px] h-[336.142px] w-[354px]"
        {...inView(reduce, fadeUp)}>
        <div className="absolute left-0 top-0 h-[336.022px] w-[354.127px]">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
            src={`${ASSET}/lovestory-map-bg.png`}
          />
        </div>
        <div className="absolute left-[21.01px] top-[81.93px] h-[127.104px] w-[207.988px] rounded-[4.202px]">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[4.202px] object-cover"
            src={`${ASSET}/lovestory-map-photo.png`}
          />
        </div>
        <div className="absolute left-[111.35px] top-[127.1px] size-[27.307px]">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 block size-full max-w-none"
            src={`${ASSET}/lovestory-pin.svg`}
          />
        </div>
      </motion.div>

      {/* Right-side timeline: 2020 & 2022 milestones */}
      <motion.div
        className="absolute left-[197px] top-[187px] flex w-[159px] flex-col items-start gap-[12px] leading-normal text-[#090909]"
        {...inView(reduce, staggerContainer)}>
        {[MILESTONE_2020, MILESTONE_2022].map((milestone) => (
          <motion.div
            key={milestone.year}
            variants={fadeUp}
            className="flex w-full flex-col items-start gap-[4px]">
            <div className="flex items-center gap-[4px] whitespace-nowrap font-[family-name:var(--font-wt1-mono)] font-semibold">
              <p className="shrink-0 text-[12px]">{milestone.year}</p>
              <p className="shrink-0 text-[14px]">-</p>
              <p className="shrink-0 text-[12px]">{milestone.title}</p>
            </div>
            <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[10px]">
              {milestone.body}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
