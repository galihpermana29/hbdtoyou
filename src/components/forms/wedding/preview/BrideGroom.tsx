/**
 * Wedding Template 1 — Bride & Groom. Figma node 312:1650.
 * Fixed 375-wide mobile composition, 708px tall, built pixel-accurate to the design.
 * Alternating rows: Freya (name left / photo right), Elias (photo left / name right).
 * NOTE: the Figma component's portraits are authored at off-canvas offsets (each
 * pushed ~its own width past an edge) — those are animation START positions. For the
 * static layout they're placed at their visible resting state: bride flush-right,
 * groom flush-left. Exact resting offset pending a Figma screenshot re-check
 * (Figma API was rate-limited at build time). These offsets become the animate-to
 * targets in the animation phase (slide bride in from right, groom from left).
 * Animation: on scroll, the bride portrait slides in from off-canvas right
 * (x:230 -> 0, settling at its left-[157px] resting spot) and the groom from
 * off-canvas left (x:-230 -> 0, settling at left-[-3px]); names/parents fade up.
 * The left-[...] values are untouched — motion is a pure additive x-transform.
 */

'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { EASE, fadeUp } from '@/components/wedding/wedding-template-1/variants';
import { useWeddingTemplate1RecipientMode } from './preview-context';
import { useWeddingReveal } from './use-wedding-reveal';
import { AutoFitText } from './AutoFitText';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  joinParents,
  type WeddingTemplate1Content,
} from '../wedding-invitation-types';

const ASSET = '/templates/wedding-template-1';

export default function BrideGroom({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: {
  content?: WeddingTemplate1Content;
}) {
  const recipientMode = useWeddingTemplate1RecipientMode();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const scrolledIntoView = useInView(sectionRef, { once: true, amount: 0.2 });
  const seen = recipientMode ? scrolledIntoView : true;
  const fadeUpReveal = useWeddingReveal(fadeUp);

  // The portraits slide in from off-canvas. They can't use whileInView on
  // themselves: at their start offset they sit outside the section's
  // overflow-hidden box, so the IntersectionObserver never sees them enter.
  // Drive the slide from the section's own in-view state instead.
  const slideIn = (from: number) =>
    reduce
      ? {}
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
                src={`${ASSET}/bridegroom-513.png`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* "The Bride & Groom" heading */}
      <motion.div
        className="absolute left-[16px] top-[102px] flex w-[230px] flex-col items-start gap-[4px]"
        {...fadeUpReveal}>
        <p className="w-full text-left font-[family-name:var(--font-wt1-mono)] text-[20px] leading-normal text-white">
          The
        </p>
        <div className="w-full">
          <p className="pl-[12px] text-left font-[family-name:var(--font-wt1-script)] text-[48px] leading-normal text-[rgba(250,250,250,0.98)]">
            Bride &amp; Groom
          </p>
          <div className="mt-[-10px] h-[0.5px] w-[230px] bg-[#fafafa]" />
        </div>
      </motion.div>

      {/* Bride — Freya (name + parents) */}
      <motion.div
        className="absolute left-[28px] top-[263px] flex flex-col items-start gap-[16px]"
        {...fadeUpReveal}>
        <div className="flex flex-col items-start">
          <AutoFitText
            maxFontSize={48}
            minFontSize={20}
            maxHeight={56}
            className="w-[125px] pl-[10px] font-[family-name:var(--font-wt1-script)] leading-[1] text-[rgba(250,250,250,0.98)]">
            {content.brideName}
          </AutoFitText>
          <div className="mt-[-10px] h-[0.5px] w-[100px] bg-[#fafafa]" />
          <p className="mt-[6px] max-w-[140px] font-[family-name:var(--font-wt1-mono)] text-[10px] leading-normal text-white">
            {content.brideFullName}
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-[4px] text-left leading-normal text-white">
          <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[8px]">
            Daughter of
          </p>
          <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[10px] font-semibold">
            {joinParents(content.brideFatherName, content.brideMotherName)}
          </p>
        </div>
      </motion.div>

      {/* Bride portrait (resting flush-right; animates in from off-canvas right) */}
      <motion.div
        className="absolute left-[157px] top-[224px] h-[171.693px] w-[218.254px]"
        {...slideIn(230)}>
        <div className="absolute left-[17.46px] top-[16.73px] h-[141.138px] w-[169.511px]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute left-0 top-[-9%] h-[159.43%] w-full max-w-none"
              src={`${ASSET}/bridegroom-rect8.jpg`}
            />
          </div>
        </div>
        <div className="absolute left-[-2.3px] top-[-2.94px] flex h-[177.581px] w-[222.855px] items-center justify-center">
          <div className="flex-none rotate-[1.56deg]">
            <div className="relative h-[171.693px] w-[218.254px]">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  alt=""
                  className="absolute left-[-10.9%] top-[-11.27%] h-[155.74%] w-[122.52%] max-w-none"
                  src={`${ASSET}/bridegroom-523.png`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Groom portrait (resting flush-left; animates in from off-canvas left) */}
      <motion.div
        className="absolute left-[-3px] top-[461.4px] flex h-[176.896px] w-[222.321px] items-center justify-center"
        {...slideIn(-230)}>
        <div className="flex-none rotate-[-1.38deg]">
          <div className="relative h-[171.69px] w-[218.25px]">
            <div className="absolute left-[32.01px] top-[16.73px] h-[141.135px] w-[169.507px]">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  alt=""
                  className="absolute left-[-0.18%] top-[-0.07%] h-[159.43%] w-full max-w-none"
                  src={`${ASSET}/bridegroom-rect9.jpg`}
                />
              </div>
            </div>
            <div className="absolute left-0 top-0 flex h-[171.69px] w-[218.25px] items-center justify-center">
              <div className="flex-none rotate-180 -scale-y-100">
                <div className="relative h-[171.69px] w-[218.25px]">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <img
                      alt=""
                      className="absolute left-[-10.9%] top-[-11.27%] h-[155.74%] w-[122.52%] max-w-none"
                      src={`${ASSET}/bridegroom-523.png`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Groom — Elias (name + parents) */}
      <motion.div
        className="absolute left-[215.89px] top-[493.85px] flex flex-col items-start gap-[16px]"
        {...fadeUpReveal}>
        <div className="flex flex-col items-start">
          <AutoFitText
            maxFontSize={48}
            minFontSize={20}
            maxHeight={56}
            className="w-[150px] pl-[8px] font-[family-name:var(--font-wt1-script)] leading-[1] text-[rgba(250,250,250,0.98)]">
            {content.groomName}
          </AutoFitText>
          <div className="mt-[-10px] h-[0.5px] w-[100px] bg-[#fafafa]" />
          <p className="mt-[6px] max-w-[150px] font-[family-name:var(--font-wt1-mono)] text-[10px] leading-normal text-white">
            {content.groomFullName}
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-[4px] text-right leading-normal text-white">
          <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[8px]">
            Son of
          </p>
          <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[10px] font-semibold">
            {joinParents(content.groomFatherName, content.groomMotherName)}
          </p>
        </div>
      </motion.div>

      {/* decorative square emblem, top-center-right */}
      <div className="absolute left-[246px] top-[-7px] size-[172px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/bridegroom-533.png`}
        />
      </div>
    </section>
  );
}
