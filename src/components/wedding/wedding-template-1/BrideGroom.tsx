/**
 * Wedding Template 1 - Bride & Groom. Figma node 312:1650.
 * Fixed 375-wide mobile composition, 708px tall, built pixel-accurate to the design.
 * Alternating rows: Freya (name left / photo right), Elias (photo left / name right).
 * NOTE: the Figma component's portraits are authored at off-canvas offsets (each
 * pushed ~its own width past an edge) - those are animation START positions. For the
 * static layout they're placed at their visible resting state: bride flush-right,
 * groom flush-left.
 *
 * The design gives no resting offset to read. Node 312:1650 parks the bride at
 * x 375.75 on a 375-wide section and the groom at x -225.66, both entirely past
 * an edge of a frame that clips its contents, so neither portrait is drawn in
 * the design at all. Those are where the slide starts, not where it ends, and
 * where it ends is ours to choose.
 *
 * The rule chosen: each portrait sits 10px clear of the names beside it. The
 * design pins both text frames - the bride's ends at x 147, the groom's begins
 * at x 215.89 - so the portraits are the only free variable. 10px was already
 * the bride's gap; the groom's was 0.64px, which read as the name touching the
 * polaroid. These offsets become the animate-to targets.
 * Animation: on scroll, the bride portrait slides in from off-canvas right
 * (x:230 -> 0, settling at its left-[157px] resting spot) and the groom from
 * off-canvas left (x:-230 -> 0, settling at left-[-12px]); names/parents fade up.
 * The left-[...] values are untouched - motion is a pure additive x-transform.
 */

'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { EASE, fadeUp } from './variants';
import { useSealed } from './sealed-context';
import { useWeddingReveal } from './use-wedding-reveal';
import { AutoFitText } from './AutoFitText';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  joinParents,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

const ASSET = '/templates/wedding-template-1';

/**
 * The height either of a partner's two written answers steps down towards.
 *
 * Three lines of the 10px the design sets them in, which at this leading is 45.
 * The design draws the full name on one line and the family on two, and neither
 * is capped, so what this really says is how much of the space around the
 * column a longer answer may take before it stops growing and starts stepping
 * down instead.
 *
 * Three, because of what is below each column. The bride's begins 198px above
 * the groom's portrait and the groom's 214px above the foot of the section, and
 * a column spends 100 of either on furniture the design fixes - the Nickname's
 * line box, the rule under it, the two gaps and the "Daughter of". So the two
 * answers have 98px between them in the tighter of the two columns, and three
 * lines each is 90.
 *
 * It is a target rather than a guarantee, and deliberately: `AutoFitText` stops
 * at its floor and lets the box grow rather than shrinking words past reading.
 * The hostile set's bride already spends that - her parents reach the 8px floor
 * at 48px tall - and the column still ends 7px clear of the groom's portrait,
 * on the slack the design left rather than on this number. Legibility wins over
 * the budget, because a family nobody can read is the failure this section
 * exists to avoid.
 *
 * Both this and the 72px line box below were figured at the 1.5 leading the
 * build used to set, which `hbd-a09.13` has since corrected to the typeface's
 * own. At the design's leading these hold more lines than they did, not fewer,
 * so nothing they bound has got tighter: the hostile set's families still fit
 * and the section still matches at all three sets of Example Content. They are
 * budgets rather than measurements, and re-figuring them would change nothing
 * anybody can see.
 */
const ANSWER_MAX_HEIGHT = 45;

/**
 * One partner's column: their Nickname over its rule, their full name, and
 * their parents under it.
 *
 * The two partners are the same column twice, differing only in where it sits
 * and which edge it reads from, so they are one component rather than two
 * copies - a family the invitation cannot hold is a fault in both or in
 * neither.
 *
 * `className` carries what the design places: the column's corner, its width,
 * and the edge its words align to. The width is the design's own (Figma node
 * 312:1650, `Frame 29` at 119 and `Frame 30` at 134), and it is the whole of
 * what keeps a real family on the invitation. Everything here is drawn inside
 * it: the design leaves 10px between the bride's column and her portrait and
 * 25px between the groom's and the edge of the page, and text that sized itself
 * to its own words instead would cross both.
 */
function Partner({
  className,
  nickname,
  fullName,
  lead,
  parents,
}: {
  className: string;
  nickname: string;
  fullName: string;
  lead: string;
  parents: string;
}) {
  const fadeUpReveal = useWeddingReveal(fadeUp);

  return (
    <motion.div
      className={`absolute flex flex-col items-start gap-[16px] leading-[normal] text-white ${className}`}
      {...fadeUpReveal}>
      <div className="flex w-full flex-col items-start">
        {/*
          The design's line box for a Nickname, kept whatever the Nickname is.
          48px at this leading is 72px tall, the rule sits 10px up from the
          bottom of it, and the full name and the family are placed against
          that. So the Nickname is fitted inside those 72px and sits on the
          bottom of them: one that has stepped down draws smaller on the same
          rule rather than dragging the rule and their whole family up the page.

          It is fitted to the rule's own 100px rather than to the column, so a
          long Nickname is never wider than the line drawn under it, and centred
          on it. Centred because the design centres both of its own: in Figma
          node 312:1650 "Freya" is 80 wide at x 10 of that 100, and "Elias" is
          68 wide and carries a horizontal CENTER constraint. The build had each
          of those two offsets written out as a left pad instead, which drew the
          design's own two names and nothing else.
        */}
        <div className="flex h-[72px] w-[100px] items-end">
          <AutoFitText
            maxFontSize={48}
            minFontSize={20}
            maxHeight={72}
            className="w-full text-center font-[family-name:var(--font-wt1-script)] leading-[normal] text-[rgba(250,250,250,0.98)]">
            {nickname}
          </AutoFitText>
        </div>
        <div className="mt-[-10px] h-[0.5px] w-[100px] bg-[#fafafa]" />
        <AutoFitText
          maxFontSize={10}
          minFontSize={8}
          maxHeight={ANSWER_MAX_HEIGHT}
          className="mt-[6px] w-full font-[family-name:var(--font-wt1-mono)]">
          {fullName}
        </AutoFitText>
      </div>
      {/* The lead goes with the names it introduces. Parents are optional, and
          "The daughter of" standing over an empty line is worse than saying
          nothing: it announces a family and then fails to name them. */}
      {parents ? (
        <div className="flex w-full flex-col items-start gap-[4px]">
          <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[8px]">
            {lead}
          </p>
          <AutoFitText
            maxFontSize={10}
            minFontSize={8}
            maxHeight={ANSWER_MAX_HEIGHT}
            className="w-full font-[family-name:var(--font-wt1-mono)] font-semibold">
            {parents}
          </AutoFitText>
        </div>
      ) : null}
    </motion.div>
  );
}

export default function BrideGroom({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: {
  content?: WeddingTemplate1Content;
}) {
  const sealed = useSealed();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const scrolledIntoView = useInView(sectionRef, { once: true, amount: 0.2 });
  const seen = sealed ? scrolledIntoView : true;
  const fadeUpReveal = useWeddingReveal(fadeUp);

  // Two faces, so two photographs the couple owns. The frame around each is the
  // template's and is drawn on every invitation; who is inside it is not, and a
  // couple who has not given theirs is shown the sample's rather than a picture
  // baked into this section.
  // Theirs or nothing. These fell back to the sample until now, which put the
  // designer's two models inside the frames of every couple who had not chosen
  // portraits yet - the exact thing hbd-9h3.1 set out to end, surviving because
  // it guarded where the photograph is drawn and not where it is chosen.
  const bridePhoto = content.bridePhoto;
  const groomPhoto = content.groomPhoto;

  // The portraits slide in from off-canvas. They can't use whileInView on
  // themselves: at their start offset they sit outside the section's
  // overflow-hidden box, so the IntersectionObserver never sees them enter.
  // Drive the slide from the section's own in-view state instead.
  // Reduced motion still has to say where the portrait rests, rather than
  // saying nothing. `useReducedMotion()` is false on the first render, so the
  // start offset is applied before it flips true; a motion component handed no
  // animate prop keeps the transform it already has rather than returning to
  // its CSS position, and the portrait stays frozen off-canvas. A guest who
  // asks for less motion would read this section with no photographs in it.
  const slideIn = (from: number) =>
    reduce
      ? { initial: { x: 0 }, animate: { x: 0 } }
      : {
          initial: { x: from },
          animate: seen ? { x: 0 } : { x: from },
          transition: { duration: 0.85, ease: EASE },
        };

  return (
    <section
      ref={sectionRef}
      className="relative h-[708px] w-full overflow-hidden bg-[#090909]">
      {/* torn paper edge along the top (rotated -90deg) */}
      <div className="absolute left-1/2 top-[-7px] flex h-[95px] w-[375px] -translate-x-1/2 items-center justify-center">
        <div className="flex-none -rotate-90">
          <div className="relative h-[375px] w-[95px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-[-27.17%] top-[-13.38%] h-[134.36%] w-[298.63%] max-w-none"
                src={`${ASSET}/torn-paper.png`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* "The Bride & Groom" heading */}
      <motion.div
        className="absolute left-[16px] top-[102px] flex w-[230px] flex-col items-start gap-[4px]"
        {...fadeUpReveal}>
        <p className="w-full text-left font-[family-name:var(--font-wt1-mono)] text-[20px] leading-[normal] text-white">
          The
        </p>
        <div className="w-full">
          <p className="pl-[12px] text-left font-[family-name:var(--font-wt1-script)] text-[48px] leading-[normal] text-[rgba(250,250,250,0.98)]">
            Bride &amp; Groom
          </p>
          <div className="mt-[-10px] h-[0.5px] w-[230px] bg-[#fafafa]" />
        </div>
      </motion.div>

      {/* Bride - her name, her full name, her parents */}
      <Partner
        className="left-[28px] top-[263px] w-[119px] text-left"
        nickname={content.brideName}
        fullName={content.brideFullName}
        lead="Daughter of"
        parents={joinParents(content.brideFatherName, content.brideMotherName)}
      />

      {/* Bride portrait (resting flush-right; animates in from off-canvas right) */}
      <motion.div
        className="absolute left-[157px] top-[224px] h-[171.693px] w-[218.254px]"
        {...slideIn(230)}>
        <div className="absolute left-[17.46px] top-[16.73px] h-[141.138px] w-[169.511px]">
          {bridePhoto ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-0 top-[-9%] h-[159.43%] w-full max-w-none object-cover"
                src={bridePhoto}
              />
            </div>
          ) : null}
        </div>
        <div className="absolute left-[-2.3px] top-[-2.94px] flex h-[177.581px] w-[222.855px] items-center justify-center">
          <div className="flex-none rotate-[1.56deg]">
            <div className="relative h-[171.693px] w-[218.254px]">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  alt=""
                  className="absolute left-[-10.9%] top-[-11.27%] h-[155.74%] w-[122.52%] max-w-none"
                  src={`${ASSET}/portrait-frame.png`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Groom portrait (resting flush-left; animates in from off-canvas left) */}
      <motion.div
        className="absolute left-[-12px] top-[461.4px] flex h-[176.896px] w-[222.321px] items-center justify-center"
        {...slideIn(-230)}>
        <div className="flex-none rotate-[-1.38deg]">
          <div className="relative h-[171.69px] w-[218.25px]">
            <div className="absolute left-[32.01px] top-[16.73px] h-[141.135px] w-[169.507px]">
              {groomPhoto ? (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <img
                    alt=""
                    className="absolute left-[-0.18%] top-[-0.07%] h-[159.43%] w-full max-w-none object-cover"
                    src={groomPhoto}
                  />
                </div>
              ) : null}
            </div>
            <div className="absolute left-0 top-0 flex h-[171.69px] w-[218.25px] items-center justify-center">
              <div className="flex-none rotate-180 -scale-y-100">
                <div className="relative h-[171.69px] w-[218.25px]">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <img
                      alt=""
                      className="absolute left-[-10.9%] top-[-11.27%] h-[155.74%] w-[122.52%] max-w-none"
                      src={`${ASSET}/portrait-frame.png`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Groom - his name, his full name, his parents */}
      <Partner
        className="left-[215.89px] top-[493.85px] w-[134px] text-right"
        nickname={content.groomName}
        fullName={content.groomFullName}
        lead="Son of"
        parents={joinParents(content.groomFatherName, content.groomMotherName)}
      />

      {/* decorative square emblem, top-center-right */}
      <div className="absolute left-[246px] top-[-7px] size-[172px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/bridegroom-emblem.png`}
        />
      </div>
    </section>
  );
}
