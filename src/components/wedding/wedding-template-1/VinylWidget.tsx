'use client';

/**
 * Wedding Template 1 - Vinyl Widget. Figma node 312:1817.
 * A 67x67 spinning-record music toggle: the vinyl record masked into a ring
 * with the cover-art label at its centre, and the guest's one control over the
 * Background Track.
 * The record spins while the track actually plays and rests where it stopped
 * while the track is paused - it is a report of the audio, not an ornament, so
 * whoever draws it tells it what the audio is doing rather than the other way
 * round. Spin is linear at ~10s/turn; the centre cover-art label stays fixed.
 * A record has mass, so it winds up to speed and coasts back down rather than
 * starting and stopping dead - the angle it rests at is still exactly where
 * the coast ended, so a resumed track picks the groove back up.
 * Respects prefers-reduced-motion (no spin, the toggle still works).
 */

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { useRef } from 'react';

import { pressTap } from './variants';

const ASSET = '/templates/wedding-template-1';

/** One full turn of the record, in milliseconds. */
const TURN_MS = 10_000;

/**
 * How quickly the record chases its target speed, as the time constants of an
 * exponential approach in milliseconds: up to speed in about a second when the
 * track starts, and a slightly longer coast down when it pauses, because motors
 * drive and friction only drags. Interruptible by nature - a track toggled
 * mid-coast retargets from whatever speed the record still has.
 */
const SPIN_UP_TAU = 300;
const SPIN_DOWN_TAU = 450;

/** Slower than this is stopped: under 1% of full speed, parked at 0. */
const RESTING_SPEED = 360 / TURN_MS / 100;

export default function VinylWidget({
  playing,
  onToggle,
}: {
  /** Whether the track is audibly playing right now. */
  playing: boolean;
  /** Pause a playing track, or start a resting one. */
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();

  // Driven frame by frame rather than by an infinite animation, because a
  // paused record has to rest exactly where it was: an animation restarted on
  // resume would snap the record back to its starting angle. The speed eases
  // toward its target each frame, which is the inertia.
  const rotate = useMotionValue(0);
  const speed = useRef(0);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const target = playing ? 360 / TURN_MS : 0;
    speed.current +=
      (target - speed.current) *
      (1 - Math.exp(-delta / (playing ? SPIN_UP_TAU : SPIN_DOWN_TAU)));
    if (!playing && speed.current < RESTING_SPEED) speed.current = 0;
    if (speed.current === 0) return;
    rotate.set((rotate.get() + delta * speed.current) % 360);
  });

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={reduce ? undefined : pressTap}
      aria-label={
        playing ? 'Pause the background track' : 'Play the background track'
      }
      className="relative block h-[67px] w-[67px]">
      {/* vinyl record, masked into a donut ring so the centre reads through */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotate,
          WebkitMaskImage: `url(${ASSET}/vinyl-mask.svg)`,
          maskImage: `url(${ASSET}/vinyl-mask.svg)`,
          WebkitMaskSize: '67px 67px',
          maskSize: '67px 67px',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}>
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/vinyl-record.png`}
        />
      </motion.div>

      {/* cover-art label seated in the centre hole */}
      <div className="absolute left-[18.7px] top-[18.7px] h-[29.595px] w-[29.596px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/vinyl-exclude.png`}
        />
      </div>
    </motion.button>
  );
}
