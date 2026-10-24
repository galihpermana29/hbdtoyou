'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

/**
 * One print on the hero's arc: a white polaroid, 240 wide, with a 216x262
 * picture and a line of writing under it.
 *
 * It is either developed (the photograph, with what a guest wrote on it in
 * their own hand) or undeveloped (a dark brown plate, with the camera's own
 * frame count in mono type where the writing will go). A print half way
 * through is not a third kind: it is the developed one showing on one side of
 * the flame line and the undeveloped one on the other (see `hero-carousel.tsx`).
 *
 * The one thing both copies agree on is the writing under a print that is on
 * the line: a developing print says so, in the flame orange, whichever side of
 * the line you read it from. Left alone the two copies would each write their
 * own words either side of the line, half a label beside half a caption.
 */
export const PRINT_WIDTH = 240;
export const PRINT_HEIGHT = 328;

/** Under every print, the one shadow the design gives them. */
const SHADOW = '0 18px 40px rgba(90, 42, 18, 0.133)';

function useFade(developing: MotionValue<number>) {
  return useTransform(developing, (value) => 1 - value);
}

export type Photo = { src: string; caption: string };

export default function PhotoCard({
  photo,
  exposure,
  developing,
  undeveloped = false,
}: {
  photo: Photo;
  /** 0 to 1: how much this print is on the line, and so how much it says "developing…". */
  developing: MotionValue<number>;
  /** What the undeveloped print says about itself: "EXP 16/27". */
  exposure: string;
  undeveloped?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-start gap-[10px] bg-white px-3 pb-4 pt-3"
      style={{
        width: PRINT_WIDTH,
        height: PRINT_HEIGHT,
        // Only the developed copy casts the shadow: the undeveloped copy lies
        // exactly over it, and two shadows would darken the half of a print
        // that is still waiting.
        boxShadow: undeveloped ? undefined : SHADOW,
      }}>
      <div className="relative h-[262px] w-[216px] shrink-0 overflow-clip">
        {undeveloped ? (
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a231e] to-[#4a3e35]" />
        ) : (
          <img
            src={photo.src}
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
      </div>
      <div className="relative">
        <motion.p
          className={
            undeveloped
              ? 'whitespace-pre text-[11px] leading-[normal] tracking-[1.2px] text-[#a39a91]'
              : 'whitespace-pre text-[22px] font-normal leading-[normal] text-[#4a4642]'
          }
          style={{
            fontFamily: undeveloped
              ? 'var(--font-mr-label)'
              : 'var(--font-mr-hand)',
            opacity: useFade(developing),
          }}>
          {undeveloped ? exposure : photo.caption}
        </motion.p>
        <motion.p
          className="absolute left-0 top-0 whitespace-pre text-[11px] leading-[normal] tracking-[1.2px] text-[#ff3e09]"
          style={{
            fontFamily: 'var(--font-mr-label)',
            opacity: developing,
          }}>
          developing…
        </motion.p>
      </div>
    </div>
  );
}
