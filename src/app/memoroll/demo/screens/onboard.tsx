'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { HandHeading, PillButton } from '../ui';
import { fadeUp, staggerContainer } from '../variants';

const STEPS = [
  {
    icon: '💒',
    copy: 'Memoroll starts on the day of the event',
  },
  {
    icon: '🎞️',
    copy: 'Each person gets 10 shots. That’s it. No retakes, no camera roll uploads.',
  },
  {
    icon: '⏳',
    copy: 'Nobody sees anything until the big reveal. Suspense is the point.',
  },
];

/**
 * Brief Memoroll (guest-04): how to play, and the ten-shot rule the whole
 * product hangs on.
 */
export default function OnboardScreen({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-14">
      <HandHeading>
        Here’s how Memoroll
        <br />
        works
      </HandHeading>

      <motion.ul
        variants={reduce ? undefined : staggerContainer}
        initial={reduce ? undefined : 'hidden'}
        animate={reduce ? undefined : 'show'}
        className="mt-10 flex flex-col gap-9">
        {STEPS.map((step) => (
          <motion.li
            key={step.copy}
            variants={reduce ? undefined : fadeUp}
            className="flex items-start gap-5">
            <span className="text-[40px] leading-none" aria-hidden>
              {step.icon}
            </span>
            <p
              className="pt-1 text-[16px] leading-relaxed text-[#212121]"
              style={{ fontFamily: 'var(--font-mr-body)' }}>
              {step.copy}
            </p>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mx-auto mt-auto w-[85%] pt-10">
        <PillButton onClick={onDone}>Got it, let’s shoot</PillButton>
      </div>
    </div>
  );
}
