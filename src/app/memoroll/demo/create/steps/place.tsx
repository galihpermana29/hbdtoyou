'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BodyText,
  ChoiceChips,
  FieldLabel,
  TextInput,
  ToggleSwitch,
} from '../../ui';
import { EASE, REDUCED_FADE, fadeUp, staggerContainer } from '../../variants';
import { StepProps } from '../config';

const RADII = [
  { value: 100, label: '100 m' },
  { value: 250, label: '250 m' },
  { value: 500, label: '500 m' },
];

/** How wide the dashed fence draws on the mock map, per chosen radius. */
const FENCE_RADIUS_PX: Record<number, number> = { 100: 34, 250: 54, 500: 78 };

/**
 * Step 3 · the place, which is the flowchart's "in area?" gate. The map is a
 * doodle in the phone-map illustration's palette and the radius is three
 * chips: the demo geocodes nothing.
 */
export default function PlaceStep({ config, patch }: StepProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
      className="flex flex-col gap-6">
      <motion.div variants={reduce ? undefined : fadeUp}>
        <BodyText className="!text-left text-[#212121]/75">
          Being there is the ticket. Guests have to stand where the party is -
          nobody shoots the roll from their sofa.
        </BodyText>
      </motion.div>

      <motion.div variants={reduce ? undefined : fadeUp}>
        <FieldLabel htmlFor="mr-venue">Venue</FieldLabel>
        <TextInput
          id="mr-venue"
          value={config.venueName}
          onChange={(e) => patch({ venueName: e.target.value })}
          className="mt-1.5"
        />
      </motion.div>

      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="overflow-hidden rounded-[10px] border border-[#212121]/10 shadow-sm">
        <MapDoodle
          fenceOn={config.geofenceOn}
          fenceR={FENCE_RADIUS_PX[config.radiusM] ?? 54}
        />
        <div className="flex items-center justify-between gap-3 bg-white px-4 py-3">
          <div>
            <p
              className="text-[14px] text-[#212121]"
              style={{ fontFamily: 'var(--font-mr-ui)' }}>
              Only at the venue
            </p>
            <p
              className="text-[12px] text-[#212121]/60"
              style={{ fontFamily: 'var(--font-mr-body)' }}>
              Phones outside the fence stay filmless.
            </p>
          </div>
          <ToggleSwitch
            on={config.geofenceOn}
            onChange={(on) => patch({ geofenceOn: on })}
            label="Only allow shooting at the venue"
          />
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {config.geofenceOn && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduce ? REDUCED_FADE : { duration: 0.25, ease: EASE }}>
            <FieldLabel>How far the party reaches</FieldLabel>
            <div className="mt-2">
              <ChoiceChips
                options={RADII}
                value={config.radiusM}
                onChange={(radiusM) => patch({ radiusM })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * The venue on a hand-drawn map, in the location gate illustration's palette,
 * with the geofence as a dashed circle around the pin.
 */
function MapDoodle({ fenceOn, fenceR }: { fenceOn: boolean; fenceR: number }) {
  return (
    <svg viewBox="0 0 340 190" className="block w-full" aria-hidden>
      <rect width="340" height="190" fill="#eadfce" />
      <rect x="18" y="16" width="86" height="64" rx="8" fill="#8bc34a" />
      <rect x="238" y="24" width="84" height="58" rx="8" fill="#8fbede" />
      <rect x="30" y="118" width="70" height="52" rx="8" fill="#25314b" />
      <rect x="248" y="120" width="72" height="50" rx="8" fill="#8bc34a" />
      <path
        d="M0 100 C70 92 120 108 170 96 C220 84 280 98 340 90"
        stroke="#f3efe7"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M128 0 C136 60 120 130 136 190"
        stroke="#f3efe7"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {fenceOn && (
        <circle
          cx="170"
          cy="95"
          r={fenceR}
          fill="#ff3e09"
          fillOpacity="0.08"
          stroke="#ff3e09"
          strokeWidth="2.5"
          strokeDasharray="7 7"
        />
      )}
      <path
        d="M170 60 C158 60 148 70 148 82 C148 98 170 118 170 118 C170 118 192 98 192 82 C192 70 182 60 170 60 Z"
        fill="#e14e2a"
      />
      <circle cx="170" cy="81" r="8" fill="#f3efe7" />
    </svg>
  );
}
