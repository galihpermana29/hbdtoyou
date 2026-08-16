'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BodyText, ChoiceChips, FieldLabel } from '../../ui';
import { REDUCED_FADE, fadeUp, staggerContainer } from '../../variants';
import { StepProps } from '../config';

const SHOT_CHOICES = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
];

/**
 * Step 4 · the film. The designer's flowchart says ten shots; the POV
 * precedent makes it configurable. So the choice is offered, and the copy
 * defends the default instead of hiding it.
 */
export default function FilmStep({ config, patch }: StepProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
      className="flex flex-col gap-6">
      <motion.div variants={reduce ? undefined : fadeUp}>
        <BodyText className="!text-left text-[#212121]/75">
          Every guest gets one roll of film for the whole day. No retakes, no
          camera-roll uploads - when it&rsquo;s gone, it&rsquo;s gone. Which
          film a shot develops through is each guest&rsquo;s own pick at the
          shutter, Kodak Gold to black-and-white HP5.
        </BodyText>
      </motion.div>

      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="text-center">
        <span className="relative mx-auto block h-[96px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={config.shotsPerGuest}
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, y: -18, scale: 1.25 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              transition={
                reduce
                  ? REDUCED_FADE
                  : { type: 'spring', stiffness: 420, damping: 26 }
              }
              className="block text-[72px] leading-[96px] text-[#212121]"
              style={{ fontFamily: 'var(--font-mr-hand)' }}>
              {config.shotsPerGuest}
            </motion.span>
          </AnimatePresence>
        </span>
        <p
          className="text-[19px] text-[#212121]"
          style={{ fontFamily: 'var(--font-mr-hand)' }}>
          shots each
        </p>
      </motion.div>

      <motion.div variants={reduce ? undefined : fadeUp}>
        <FieldLabel>Shots per guest</FieldLabel>
        <div className="mt-2">
          <ChoiceChips
            options={SHOT_CHOICES}
            value={config.shotsPerGuest}
            onChange={(shotsPerGuest) => patch({ shotsPerGuest })}
          />
        </div>
        <p
          className="mt-3 text-[12px] leading-relaxed text-[#212121]/60"
          style={{ fontFamily: 'var(--font-mr-body)' }}>
          Ten is the magic number: enough to cover the night, few enough that
          every shot costs something. The scarcity is what makes them look.
        </p>
      </motion.div>
    </motion.div>
  );
}
