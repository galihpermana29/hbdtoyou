'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  COLLAGE_BACK,
  COLLAGE_MAIN,
  COLLAGE_STRIP,
  MOCK_WEDDING,
} from '../mock';
import {
  CoupleDoodle,
  CurlyArrow,
  HeartCluster,
  PillButton,
  ScribbleBurst,
} from '../ui';
import { fadeUp, staggerContainer } from '../variants';

/**
 * Landing (guest-01): the scattered polaroid collage, the handwritten
 * "Memoroll of Elias & Freya's wedding", and the orange way in.
 */
export default function LandingScreen({ onEnter }: { onEnter: () => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
      className="flex flex-1 flex-col px-6 pb-8 pt-6">
      <div className="relative">
        <CoupleDoodle className="h-[92px] w-[140px]" />
        <ScribbleBurst className="absolute right-0 top-2 h-[70px] w-[70px]" />
      </div>

      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="relative mt-2">
        <div className="absolute -left-2 -top-3 h-[190px] w-[62%] rotate-[-7deg] bg-white p-2 shadow-md">
          <img
            src={COLLAGE_BACK}
            alt=""
            className="h-full w-full object-cover grayscale"
          />
        </div>
        <div className="relative ml-4 mt-2 rotate-[2deg] bg-white p-2.5 shadow-lg">
          <img
            src={COLLAGE_MAIN}
            alt="The couple"
            className="h-[200px] w-full object-cover"
          />
        </div>
        <div className="relative -mt-6 ml-16 flex rotate-[-2deg] gap-1.5 bg-white p-2 shadow-md">
          {COLLAGE_STRIP.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-[74px] min-w-0 flex-1 object-cover"
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="relative mt-6 text-center">
        <CurlyArrow className="absolute -left-1 top-0 h-[110px] w-[80px]" />
        <p
          className="text-[18px] text-[#212121]"
          style={{ fontFamily: 'var(--font-mr-ui)' }}>
          Memoroll of
        </p>
        <p
          className="mt-1 px-8 text-[30px] leading-[1.5] text-[#212121]"
          style={{ fontFamily: 'var(--font-mr-hand)' }}>
          {MOCK_WEDDING.title}
        </p>
        <p
          className="mt-1 text-[14px] text-[#212121]"
          style={{ fontFamily: 'var(--font-mr-hand)' }}>
          {MOCK_WEDDING.dateLabel}
        </p>
      </motion.div>

      <div className="relative mt-auto pt-8">
        <HeartCluster className="absolute -left-4 bottom-0 h-[130px] w-[100px]" />
        <motion.div
          variants={reduce ? undefined : fadeUp}
          className="mx-auto w-[85%]">
          <div
            className="mx-auto -mb-3 w-fit rounded-[10px] bg-[#212121] px-4 pb-4 pt-2 text-[14px] text-white"
            style={{ fontFamily: 'var(--font-mr-body)' }}>
            join others capturing the moments
          </div>
          <div className="relative">
            <PillButton onClick={onEnter}>I’m in, let’s go!</PillButton>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
