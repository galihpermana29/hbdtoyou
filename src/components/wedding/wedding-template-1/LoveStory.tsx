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
import { motion, useReducedMotion, type MotionProps } from 'framer-motion';

import { AutoFitBlock } from './AutoFitBlock';
import { EASE, fadeUp, fadeUpCenter, staggerContainer } from './variants';
import { useSealed } from './sealed-context';
import { useWeddingReveal } from './use-wedding-reveal';
import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  pickPhoto,
  type WeddingMilestone,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

const ASSET = '/templates/wedding-template-1';

/**
 * The largest and the smallest a chapter's story may be printed at.
 *
 * The ceiling is the 10px the design sets one in, and it is a ceiling rather
 * than a size because a chapter is the couple's own words: a wedding with more
 * to say is set a little smaller rather than printed over the artwork. The
 * floor is the 8px the design sets the smallest words on the invitation in, and
 * it is the same floor the Bride & Groom's Introduction stops at - below it a
 * chapter stops being readable, and a story nobody can read is the failure this
 * fitting exists to avoid.
 */
const CHAPTER_CEILING = 10;
const CHAPTER_FLOOR = 8;

/**
 * How much of the page the two chapters down the right-hand side may fill.
 *
 * They start 187px into the section and the polaroid's Frame begins at 540, so
 * the column the design gives them is 353px tall. That is the whole of it: the
 * design leaves them no margin at the bottom, because at its own leading its
 * own two chapters end 6px above the polaroid. A chapter that ran past 540
 * would be printed across the photograph, which is what the build did at all
 * three sets of Example Content.
 *
 * The number covers both chapters, their two headings and the gaps between,
 * because all of that is what shares the column. `AutoFitBlock` says why it is
 * one number rather than half of it each.
 */
const SIDE_CHAPTERS_MAX_HEIGHT = 353;

/**
 * How much of the page the chapter in the middle of the paper may fill.
 *
 * It starts 548px into the section, and what would swallow it is the map
 * keepsake below. That keepsake's box begins at 738.86, but its top 55px are
 * the transparent margin of the photograph rather than the photograph: the
 * camera itself begins at 794, and the design's own chapter runs to 771, well
 * past the box and well short of the camera. So the bound is the camera, at
 * 794 - 548 = 246, and not the box, which the design itself crosses.
 *
 * Both this and the 353 above are figured at the 1.5 leading the build sets
 * today, which is `hbd-a09.13`. Neither number changes when that lands - they
 * are distances on the page rather than counts of lines - but what fits inside
 * them does: at the design's own leading, the design's own three chapters fit
 * both boxes at the full 10px and nothing steps down at all.
 */
const CENTRE_CHAPTER_MAX_HEIGHT = 246;

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
function FilmStrip({ content }: { content: WeddingTemplate1Content }) {
  const reveal = useWeddingReveal(fadeUp);
  const photos = [0, 1, 2].map((i) =>
    pickPhoto(
      content.loveStoryPhotos,
      i,
      `${ASSET}/lovestory-photo-${i + 1}.png`
    )
  );

  return (
    <motion.div
      className="absolute left-[25px] top-[30px] flex h-[343.24px] w-[157.601px] items-center justify-center"
      {...reveal}>
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
              src={photos[0]}
            />
          </div>
          <div className="absolute left-[9.69px] top-[117.08px] h-[99.318px] w-[108.201px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={photos[1]}
            />
          </div>
          <div className="absolute left-[9.69px] top-[223.67px] h-[99.318px] w-[108.201px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={photos[2]}
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
function Polaroid({ content }: { content: WeddingTemplate1Content }) {
  const reduce = useReducedMotion();
  const sealed = useSealed();
  const reveal = useWeddingReveal(fadeUp);
  const [revealed, setRevealed] = useState(false);
  const isRevealed = !sealed || revealed;
  const polaroidPhoto =
    content.polaroidPhoto || `${ASSET}/lovestory-polaroid-photo.png`;

  const coverAnim = {
    animate: { opacity: isRevealed ? 0 : 1, scale: isRevealed ? 1.05 : 1 },
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
      {...reveal}>
      <div className="absolute left-[9.02px] top-[9.9px] h-[156.339px] w-[139.745px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none"
          src={polaroidPhoto}
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
        style={{ pointerEvents: isRevealed ? 'none' : undefined }}
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

/**
 * One chapter: the year it happened, what the invitation calls it, and the
 * couple's account of it.
 *
 * The design prints one chapter in the middle of the paper and two down the
 * right-hand side, and the three are the same three lines, so they are one
 * component rather than two copies of it. `reveal` is how the column it is in
 * brings it onto the page: alone in the middle, or one after the other down the
 * side.
 *
 * The story states no size, so it takes the one its column has settled on. The
 * heading states the design's own two, because it is not fitted and it cannot
 * grow: the form takes a year as at most four digits and the three titles are
 * the design's own words, so the widest heading the invitation can print is the
 * one it is drawn with - 141px against the 145 the middle column has, and 135
 * against the side column's 159. Nothing measures that, here or in the check,
 * because there is nothing a couple could type to change it.
 */
function Chapter({
  milestone,
  reveal,
}: {
  milestone?: WeddingMilestone;
  reveal: MotionProps;
}) {
  return (
    <motion.div
      className="flex w-full flex-col items-start gap-[4px]"
      {...reveal}>
      <div className="flex w-full items-center gap-[4px] whitespace-nowrap font-[family-name:var(--font-wt1-mono)] font-semibold">
        <p className="shrink-0 text-[12px]">{milestone?.year}</p>
        <p className="shrink-0 text-[14px]">-</p>
        <p className="shrink-0 text-[12px]">{milestone?.title}</p>
      </div>
      <p className="w-full font-[family-name:var(--font-wt1-mono)]">
        {milestone?.body}
      </p>
    </motion.div>
  );
}

export default function LoveStory({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: {
  content?: WeddingTemplate1Content;
}) {
  const fadeUpCenterReveal = useWeddingReveal(fadeUpCenter);
  const fadeUpReveal = useWeddingReveal(fadeUp);
  const staggerReveal = useWeddingReveal(staggerContainer);
  const centerMilestone = content.milestones[2] ?? content.milestones[0];
  const rightMilestones = content.milestones.slice(0, 2);
  const mapPhoto = content.mapPhoto || `${ASSET}/lovestory-map-photo.png`;

  return (
    <section className="relative h-[1081px] w-full overflow-hidden bg-[#090909]">
      {/* Section heading */}
      <motion.div
        className="absolute left-[calc(50%+0.5px)] top-[34px] flex w-[176px] flex-col items-center gap-[4px]"
        {...fadeUpCenterReveal}>
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

        <FilmStrip content={content} />

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

        <Polaroid content={content} />

        {/* The chapter printed in the middle of the paper */}
        <AutoFitBlock
          className="absolute left-[53px] top-[397px] w-[145px] leading-normal text-[#090909]"
          maxFontSize={CHAPTER_CEILING}
          minFontSize={CHAPTER_FLOOR}
          maxHeight={CENTRE_CHAPTER_MAX_HEIGHT}>
          <Chapter milestone={centerMilestone} reveal={fadeUpReveal} />
        </AutoFitBlock>
      </div>

      {/* Map keepsake at the bottom */}
      <motion.div
        className="absolute left-[27px] top-[738.86px] h-[336.142px] w-[354px]"
        {...fadeUpReveal}>
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
            src={mapPhoto}
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

      {/* The two chapters printed down the right-hand side */}
      <AutoFitBlock
        className="absolute left-[197px] top-[187px] w-[159px] leading-normal text-[#090909]"
        maxFontSize={CHAPTER_CEILING}
        minFontSize={CHAPTER_FLOOR}
        maxHeight={SIDE_CHAPTERS_MAX_HEIGHT}>
        <motion.div
          className="flex flex-col items-start gap-[12px]"
          {...staggerReveal}>
          {rightMilestones.map((milestone, index) => (
            <Chapter
              key={`${milestone.year}-${index}`}
              milestone={milestone}
              reveal={{ variants: fadeUp }}
            />
          ))}
        </motion.div>
      </AutoFitBlock>
    </section>
  );
}
