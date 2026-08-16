'use client';

import dayjs from 'dayjs';
import { motion, useReducedMotion } from 'framer-motion';
import { COLLAGE_STRIP } from '../../mock';
import { BodyText, ChoiceChips, FieldLabel, TextInput } from '../../ui';
import { EASE, REDUCED_FADE, fadeUp, staggerContainer } from '../../variants';
import { MemorollConfig, StepProps, effectiveReveal } from '../config';

const PRESETS: {
  value: MemorollConfig['revealPreset'];
  label: string;
}[] = [
  { value: 'at-end', label: 'When the party ends' },
  { value: 'next-morning', label: 'Next morning, 9am' },
  { value: 'custom', label: 'Pick my own' },
];

/**
 * Step 2 · the reveal, which is the flowchart's "reveal time?" gate and the
 * soul of the product: every shot develops in the dark until this moment,
 * then the whole roll drops at once, for everyone.
 */
export default function RevealStep({ config, patch }: StepProps) {
  const reduce = useReducedMotion();

  // Presets derive from the event at read time (effectiveReveal), so choosing
  // one stores nothing it could later contradict. Switching to custom seeds
  // the inputs from whatever the reveal currently works out to.
  const choosePreset = (preset: MemorollConfig['revealPreset']) => {
    if (preset === 'custom') {
      const current = effectiveReveal(config);
      patch({
        revealPreset: preset,
        revealDate: current.date,
        revealTime: current.time,
      });
    } else {
      patch({ revealPreset: preset });
    }
  };

  const reveal = effectiveReveal(config);
  const revealDay = dayjs(reveal.date);
  const revealLabel = revealDay.isValid()
    ? `${revealDay.format('D MMMM')}, ${reveal.time}`
    : `${reveal.date}, ${reveal.time}`;

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
      className="flex flex-col gap-6">
      <motion.div variants={reduce ? undefined : fadeUp}>
        <BodyText className="!text-left text-[#212121]/75">
          Every shot lands blurred - even yours. At the moment you pick here,
          the whole roll develops at once, for everyone. The wait is the point.
        </BodyText>
      </motion.div>

      {/* The mechanic, shown instead of explained: the middle frame develops. */}
      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="mx-auto flex rotate-[-2deg] gap-1.5 bg-white p-2 shadow-md">
        {COLLAGE_STRIP.map((src, i) => (
          <span
            key={src}
            className="relative block h-[86px] w-[86px] overflow-hidden">
            <img
              src={src}
              alt=""
              className={`h-full w-full object-cover ${
                i === 1
                  ? ''
                  : 'scale-110 blur-[7px] brightness-[0.38] saturate-[0.8]'
              }`}
            />
            {i === 1 && (
              <span
                className="absolute bottom-0.5 right-1 text-[10px] text-white drop-shadow"
                style={{ fontFamily: 'var(--font-mr-hand)' }}>
                revealed
              </span>
            )}
          </span>
        ))}
      </motion.div>

      <motion.div variants={reduce ? undefined : fadeUp}>
        <FieldLabel>The roll drops</FieldLabel>
        <div className="mt-2">
          <ChoiceChips
            options={PRESETS}
            value={config.revealPreset}
            onChange={choosePreset}
          />
        </div>
      </motion.div>

      {config.revealPreset === 'custom' && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? REDUCED_FADE : { duration: 0.25, ease: EASE }}
          className="flex gap-3">
          <div className="flex-1">
            <FieldLabel htmlFor="mr-reveal-date">Reveal date</FieldLabel>
            <TextInput
              id="mr-reveal-date"
              type="date"
              value={config.revealDate}
              onChange={(e) => patch({ revealDate: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div className="flex-1">
            <FieldLabel htmlFor="mr-reveal-time">Reveal time</FieldLabel>
            <TextInput
              id="mr-reveal-time"
              type="time"
              value={config.revealTime}
              onChange={(e) => patch({ revealTime: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </motion.div>
      )}

      <motion.p
        variants={reduce ? undefined : fadeUp}
        className="text-center text-[19px] text-[#212121]"
        style={{ fontFamily: 'var(--font-mr-hand)' }}>
        drops {revealLabel} - until then, nobody peeks
      </motion.p>
    </motion.div>
  );
}
