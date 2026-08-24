'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import HeaderRule from '../ui/header-rule';
import MemoifyFooter from '../ui/memoify-footer';
import { colour } from '../ui/tokens';
import RollPrint from './print';
import type { GalleryPhoto } from './roll';

/**
 * The Dark Room (guest-17): the screen a Roll develops in, where the blur
 * lifts off the prints. A dark chamber, the camera's counter pill saying
 * "Developing...", and a window of red light - the developer bath - with the
 * guest's prints soaking in it.
 *
 * APPROXIMATION, PENDING HER REFERENCE. The designer attached a video to this
 * screen as a Gumlet link that cannot be read from here (design README,
 * deviation 4), so the develop is built from the animation guidance in this
 * setup instead: it reads as chemistry - each print sharpens through the
 * design's own stops, blur 10 to 6 to sharp, staggered print by print, on a
 * slow ease-out - and the red light breathes over them. Re-cut it against her
 * video when the reference is reachable.
 *
 * Under reduced motion nothing moves: the room holds the design's own still -
 * one print at blur 6, one at 10, one sharp - and completes with a plain
 * crossfade.
 *
 * `hold` keeps the chemistry mid-bath and never completes, so the demo can pin
 * this screen open to be looked at; the real ceremony always runs through.
 */

/** The design's develop stops, and how each print sits in the bath. */
const BATH = [
  { x: -6, rotate: -1, restingBlur: 6 },
  { x: 17, rotate: 1.5, restingBlur: 10 },
  { x: -6, rotate: -0.8, restingBlur: 0 },
];

/** Seconds until a print reaches each stop, staggered a print apart. */
const TO_SOFT = 0.9;
const TO_SHARP = 2.1;
const STAGGER = 1.1;

export default function DarkRoomScreen({
  photos,
  hold = false,
  onDeveloped,
}: {
  photos: GalleryPhoto[];
  /** Pin the chemistry mid-bath: the demo's way of keeping this screen still. */
  hold?: boolean;
  onDeveloped: () => void;
}) {
  const reduce = useReducedMotion();
  const inTheBath = photos.slice(0, 3);

  /**
   * The designed still doubles as the resting pose: held, or under reduced
   * motion, every print sits at its own stop. The live develop instead walks
   * each print from 10 to 6 to sharp, and the print's own filter transition
   * smooths the steps.
   */
  const still = hold || reduce;
  const [blurs, setBlurs] = useState<number[]>(() =>
    still ? BATH.map((spot) => spot.restingBlur) : [10, 10, 10]
  );

  useEffect(() => {
    if (still) {
      setBlurs(BATH.map((spot) => spot.restingBlur));
      if (hold) return undefined;
      // Reduced motion develops without ceremony: the still, then the roll.
      const done = window.setTimeout(onDeveloped, 2200);
      return () => window.clearTimeout(done);
    }

    const timers: number[] = [];
    const setBlur = (print: number, blur: number, atSeconds: number) => {
      timers.push(
        window.setTimeout(() => {
          setBlurs((current) =>
            current.map((value, index) => (index === print ? blur : value))
          );
        }, atSeconds * 1000)
      );
    };
    inTheBath.forEach((_, print) => {
      setBlur(print, 6, TO_SOFT + print * STAGGER);
      setBlur(print, 0, TO_SHARP + print * STAGGER);
    });
    timers.push(
      window.setTimeout(
        onDeveloped,
        (TO_SHARP + (inTheBath.length - 1) * STAGGER + 1.4) * 1000
      )
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
    // The ceremony runs once per entry; the photos do not change mid-bath.
  }, [still, hold]);

  return (
    <section
      aria-label="Dark Room"
      className="relative flex min-h-full flex-1 flex-col"
      style={{ background: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
      <div className="px-[16px] pb-[12px] pt-[60px]">
        {/* The camera's shots counter, saying what it is doing instead of what
            is left. The outer stroke is drawn as a gradient in the design; a
            half-white hairline stands in for it, read off the frame. */}
        <div
          className="rounded-[16px] p-[8px]"
          style={{
            background: colour.mauve,
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.25)',
          }}>
          <div
            className="flex items-center justify-center gap-[10px] rounded-[8px] px-[16px] py-[10px]"
            style={{
              background: colour.pill,
              boxShadow:
                'inset 4px 4px 40.9px 12px rgba(0, 0, 0, 0.1), inset 0 3.6px 5.2px 1px rgba(0, 0, 0, 0.45), inset 0 -3.6px 5.2px 1px rgba(0, 0, 0, 0.17)',
            }}>
            <span
              aria-hidden
              className="h-[10px] w-[10px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, #b6ffcb, #34d16b 60%, #17a04a)',
                boxShadow: '0 0 6px 2px rgba(80, 255, 140, 0.55)',
              }}
            />
            <span
              className="text-[18px] font-extrabold italic leading-[150%] tracking-[0.12em]"
              style={{ color: colour.cream }}>
              Developing...
            </span>
          </div>
        </div>
      </div>

      <HeaderRule tint="rgba(77, 77, 77, 0.7)" />

      {/* The tray's ground is the design's own grey (the punched window's
          fill): the red light multiplies over it, so the empty tray glows a
          deep red and a print's highlights burn towards it, the way the frame
          shows. */}
      <div
        className="relative mx-[24px] mb-[22px] mt-[30px] min-h-[400px] flex-1 overflow-hidden"
        style={{ background: '#d9d9d9' }}>
        <div className="absolute inset-0 flex flex-col items-center gap-[24px] pt-[20px]">
          {inTheBath.map((photo, print) => (
            <RollPrint
              key={photo.id}
              src={photo.src}
              size="bath"
              blur={blurs[print]}
              stamp={photo.stamp}
              shooter={photo.shooter}
              className="w-[254px] shrink-0"
              style={{
                transform: `translateX(${BATH[print].x}px) rotate(${BATH[print].rotate}deg)`,
              }}
            />
          ))}
        </div>

        {/* The red light lies over the whole bath. The design fills it with a
            caustic water texture that the capture cannot hand over, so the
            veins are gradients drifting slowly - part of the same approximated
            chemistry as the develop itself. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: colour.redLight,
            mixBlendMode: 'multiply',
            opacity: 0.95,
          }}>
          <motion.span
            className="absolute inset-[-20%] block"
            style={{
              mixBlendMode: 'screen',
              opacity: 0.5,
              backgroundImage:
                'radial-gradient(closest-side at 30% 30%, rgba(255, 190, 170, 0.5), transparent 65%), radial-gradient(closest-side at 70% 65%, rgba(255, 150, 120, 0.4), transparent 60%)',
            }}
            animate={reduce ? undefined : { x: [0, -26, 0], y: [0, 18, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        </div>
      </div>

      <MemoifyFooter onDark />
    </section>
  );
}
