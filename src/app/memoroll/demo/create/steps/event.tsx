'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BodyText, FieldLabel, TextInput } from '../../ui';
import { fadeUp, staggerContainer } from '../../variants';
import { StepProps } from '../config';

/**
 * Step 1 · the event window, which is the flowchart's "event time?" gate:
 * outside these hours the door stays shut and the camera does not exist.
 */
export default function EventStep({ config, patch }: StepProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
      className="flex flex-col gap-6">
      <motion.div variants={reduce ? undefined : fadeUp}>
        <BodyText className="!text-left text-[#212121]/75">
          Cameras only work between these hours. Early birds wait at the door,
          and when the night ends, the film is done.
        </BodyText>
      </motion.div>

      <motion.div variants={reduce ? undefined : fadeUp}>
        <FieldLabel htmlFor="mr-event-name">Event name</FieldLabel>
        <TextInput
          id="mr-event-name"
          value={config.eventName}
          onChange={(e) => patch({ eventName: e.target.value })}
          className="mt-1.5"
        />
      </motion.div>

      <motion.div variants={reduce ? undefined : fadeUp}>
        <FieldLabel htmlFor="mr-event-date">Event date</FieldLabel>
        <TextInput
          id="mr-event-date"
          type="date"
          value={config.eventDate}
          onChange={(e) => patch({ eventDate: e.target.value })}
          className="mt-1.5"
        />
      </motion.div>

      <motion.div variants={reduce ? undefined : fadeUp} className="flex gap-3">
        <div className="flex-1">
          <FieldLabel htmlFor="mr-start-time">Doors open</FieldLabel>
          <TextInput
            id="mr-start-time"
            type="time"
            value={config.startTime}
            onChange={(e) => patch({ startTime: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="flex-1">
          <FieldLabel htmlFor="mr-end-time">Last shot at</FieldLabel>
          <TextInput
            id="mr-end-time"
            type="time"
            value={config.endTime}
            onChange={(e) => patch({ endTime: e.target.value })}
            className="mt-1.5"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
