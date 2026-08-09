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
 * The guest demo's affordance: the phase switcher plus the two reset actions,
 * living in the shared DemoDock shell.
 */
export default function DemoControl({
  phase,
  onPhaseChange,
  onReloadFilm,
  onRestart,
}: {
  phase: DemoPhase;
  onPhaseChange: (phase: DemoPhase) => void;
  onReloadFilm: () => void;
  onRestart: () => void;
}) {
  return (
    <DemoDock chipLabel={`demo · ${PHASE_LABELS[phase].toLowerCase()}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#212121]/50">
        Demo · event phase
      </p>
      <div className="mt-2 flex flex-col gap-1">
        {(Object.keys(PHASE_LABELS) as DemoPhase[]).map((key) => {
          const active = key === phase;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onPhaseChange(key)}
              className={`rounded-full px-3 py-1.5 text-left text-[12px] transition-colors ${
                active
                  ? 'bg-[#212121] text-white'
                  : 'bg-[#f2efe9] text-[#212121] hover:bg-[#e8e4dc]'
              }`}>
              {PHASE_LABELS[key]}
            </button>
          );
        })}
      </div>
      <div className="mt-3 border-t border-[#212121]/10 pt-2">
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
