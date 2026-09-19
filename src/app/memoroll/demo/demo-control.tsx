'use client';

import DemoDock from './demo-dock';
import { SHOT_LIMIT } from './use-shots';

/**
 * Where the demo stands on the event's timeline. This is the local-state
 * stand-in for the real time gate and reveal clock, so every branch of the
 * designer's flowchart is walkable without waiting for a wedding.
 */
export type DemoPhase = 'before' | 'during' | 'developing' | 'revealed';

export const PHASE_LABELS: Record<DemoPhase, string> = {
  before: 'Before the event',
  during: 'During the event',
  developing: 'After · waiting for reveal',
  revealed: 'After · revealed',
};

/**
 * What the guest's own Roll holds. The two gates are independent - the Reveal
 * above never touches this one - so the dock carries them as two dials rather
 * than one. `live` is whatever was really shot on the demo camera; the rest
 * stand in the designed states without ten trips through the shutter.
 */
export type DemoRoll = 'live' | 'nine' | 'spent' | 'developed';

export const ROLL_LABELS: Record<DemoRoll, string> = {
  live: 'Your own shots',
  nine: 'One shot left',
  spent: 'All ten spent',
  developed: 'Developed',
};

/**
 * What lighting hardware the camera should believe in. Flash and Torch are
 * capability-detected and a laptop has neither, so the designed Flash button
 * would be unreachable on this demo without a stand-in - the same stand-in
 * the phase and roll dials already are for clocks and shutters. 'detected'
 * is the truth; the rest pretend, and pretending only ever adds a control.
 */
export type DemoLighting = 'detected' | 'flash' | 'torch' | 'both';

export const LIGHTING_LABELS: Record<DemoLighting, string> = {
  detected: 'Hardware: as detected',
  flash: 'Hardware: flash',
  torch: 'Hardware: torch',
  both: 'Hardware: flash + torch',
};

export const LIGHTING_SIMULATED: Record<
  DemoLighting,
  { flash: boolean; torch: boolean } | undefined
> = {
  detected: undefined,
  flash: { flash: true, torch: false },
  torch: { flash: false, torch: true },
  both: { flash: true, torch: true },
};

/**
 * The guest demo's affordance: the two dials of the two gates, the jumps that
 * put a screen straight on the glass, and the two reset actions, living in the
 * shared DemoDock shell.
 */
export default function DemoControl({
  phase,
  onPhaseChange,
  roll,
  onRollChange,
  lighting,
  onLightingChange,
  onOpenGallery,
  onPinDarkRoom,
  onReloadFilm,
  onRestart,
}: {
  phase: DemoPhase;
  onPhaseChange: (phase: DemoPhase) => void;
  roll: DemoRoll;
  onRollChange: (roll: DemoRoll) => void;
  lighting: DemoLighting;
  onLightingChange: (lighting: DemoLighting) => void;
  onOpenGallery: () => void;
  /** Hold the Dark Room mid-develop, so its chemistry can be looked at. */
  onPinDarkRoom: () => void;
  onReloadFilm: () => void;
  onRestart: () => void;
}) {
  const option = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-left text-[12px] transition-colors ${
      active
        ? 'bg-[#212121] text-white'
        : 'bg-[#f2efe9] text-[#212121] hover:bg-[#e8e4dc]'
    }`;

  return (
    <DemoDock chipLabel={`demo · ${PHASE_LABELS[phase].toLowerCase()}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#212121]/50">
        Demo · event phase
      </p>
      <div className="mt-2 flex flex-col gap-1">
        {(Object.keys(PHASE_LABELS) as DemoPhase[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onPhaseChange(key)}
            className={option(key === phase)}>
            {PHASE_LABELS[key]}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#212121]/50">
        Demo · your roll
      </p>
      <div className="mt-2 flex flex-col gap-1">
        {(Object.keys(ROLL_LABELS) as DemoRoll[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onRollChange(key)}
            className={option(key === roll)}>
            {ROLL_LABELS[key]}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#212121]/50">
        Demo · camera lighting
      </p>
      <div className="mt-2 flex flex-col gap-1">
        {(Object.keys(LIGHTING_LABELS) as DemoLighting[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onLightingChange(key)}
            className={option(key === lighting)}>
            {LIGHTING_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="mt-3 border-t border-[#212121]/10 pt-2">
        <button
          type="button"
          onClick={onOpenGallery}
          className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#212121] hover:bg-[#f2efe9]">
          Open the gallery
        </button>
        <button
          type="button"
          onClick={onPinDarkRoom}
          className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#212121] hover:bg-[#f2efe9]">
          Pin the Dark Room open
        </button>
        <button
          type="button"
          onClick={onReloadFilm}
          className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#ff3e09] hover:bg-[#fff1ed]">
          Reload film (clear your {SHOT_LIMIT} shots)
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#212121] hover:bg-[#f2efe9]">
          Restart walkthrough
        </button>
      </div>
    </DemoDock>
  );
}
