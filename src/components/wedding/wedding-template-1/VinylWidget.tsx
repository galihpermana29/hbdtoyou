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
 * Respects prefers-reduced-motion (no spin, the toggle still works).
 */

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';

const ASSET = '/templates/wedding-template-1';

/** One full turn of the record, in milliseconds. */
const TURN_MS = 10_000;

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
  // resume would snap the record back to its starting angle.
  const rotate = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (!playing || reduce) return;
    rotate.set((rotate.get() + (delta * 360) / TURN_MS) % 360);
  });

  return (
    <button
      type="button"
      onClick={onToggle}
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
    </button>
  );
}
