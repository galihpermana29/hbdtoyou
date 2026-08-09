'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { COLLAGE_MAIN, MOCK_WEDDING } from '../../mock';
import { BodyText, ToggleSwitch } from '../../ui';
import { fadeUp, staggerContainer } from '../../variants';
import { StepProps } from '../config';

/**
 * Step 5 · the look: the film filter every shot develops through (the POV
 * precedent, on by default). The polaroid answers the toggle live, so the
 * choice is seen rather than described.
 */
export default function LookStep({ config, patch }: StepProps) {
  const reduce = useReducedMotion();
  const on = config.filmFilterOn;

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
      className="flex flex-col gap-6">
      <motion.div variants={reduce ? undefined : fadeUp}>
        <BodyText className="!text-left text-[#212121]/75">
          Develop every shot like it came off a drugstore roll: warm, a little
          faded, date stamp burned in. Or keep it plain digital.
        </BodyText>
      </motion.div>

      <motion.figure
        variants={reduce ? undefined : fadeUp}
        className="mx-auto w-[78%] rotate-[-2deg] bg-white p-2.5 pb-4 shadow-lg">
        <span className="relative block">
          <img
            src={COLLAGE_MAIN}
            alt="A sample shot from the roll"
            className={`h-[240px] w-full object-cover transition-[filter] duration-500 ${
              on
                ? '[filter:sepia(0.28)_contrast(1.08)_saturate(0.85)_brightness(1.02)]'
                : ''
            }`}
          />
          {on && (
            <>
              <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_46px_rgba(33,33,33,0.5)]" />
              <span
                className="absolute bottom-2 right-3 text-[15px] text-[#ffb44a] drop-shadow"
                style={{ fontFamily: 'var(--font-mr-hand)' }}>
                {MOCK_WEDDING.calendar.day}/05/{MOCK_WEDDING.calendar.year}
              </span>
            </>
          )}
        </span>
        <figcaption
          className="mt-2 text-center text-[15px] text-[#212121]"
          style={{ fontFamily: 'var(--font-mr-hand)' }}>
          {on ? 'shot on memoroll film' : 'no filter, as shot'}
        </figcaption>
      </motion.figure>

      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="flex items-center justify-between gap-3 rounded-[10px] border border-[#212121]/10 bg-white px-4 py-3 shadow-sm">
        <div>
          <p
            className="text-[14px] text-[#212121]"
            style={{ fontFamily: 'var(--font-mr-ui)' }}>
            Film filter
          </p>
          <p
            className="text-[12px] text-[#212121]/60"
            style={{ fontFamily: 'var(--font-mr-body)' }}>
            One look for the whole roll, everyone&rsquo;s shots alike.
          </p>
        </div>
        <ToggleSwitch
          on={on}
          onChange={(next) => patch({ filmFilterOn: next })}
          label="Develop every shot through the film filter"
        />
      </motion.div>
    </motion.div>
  );
}
