'use client';

import Field from '../ui/field';
import { CalendarIcon, ClockIcon } from '../ui/icons';
import StepShell from './step-shell';

/**
 * Step seven: when the roll develops (creator-10).
 *
 * This is the Reveal, and it governs everyone else's Shots rather than a
 * guest's own: a guest whose shots are spent develops their own roll whenever
 * they like, and the collective gallery stays blurred for all of them until
 * this moment.
 *
 * Two things here are the design's and are not mistakes. The heading has no
 * question mark where every other question on the flow does, and the line under
 * it is the line from "Name your roll" left behind. Both ship as written
 * (ADR 0002).
 *
 * Its button is the one that says "Create Now" rather than Continue, because
 * this is the last thing asked before the roll exists.
 */
export default function RevealStep({
  revealOn,
  revealAt,
  onChange,
  onBack,
  onCreate,
}: {
  revealOn: string;
  revealAt: string;
  onChange: (patch: { revealOn?: string; revealAt?: string }) => void;
  onBack: () => void;
  onCreate: () => void;
}) {
  return (
    <StepShell
      step={7}
      heading="When should the roll develop"
      blurb="Give your Memoroll a name and customize what guests see when they join"
      onBack={onBack}
      primary={{ label: 'Create Now', onClick: onCreate }}>
      <div className="flex w-full flex-col gap-[20px]">
        <Field
          id="memoroll-reveal-on"
          label="Reveal on"
          kind="date"
          value={revealOn}
          onChange={(value) => onChange({ revealOn: value })}
          icon={<CalendarIcon className="h-[24px] w-[24px]" />}
        />
        <Field
          id="memoroll-reveal-at"
          label="At"
          kind="time"
          value={revealAt}
          onChange={(value) => onChange({ revealAt: value })}
          icon={<ClockIcon className="h-[24px] w-[24px]" />}
        />
      </div>
    </StepShell>
  );
}
