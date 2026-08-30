'use client';

import Field from '../ui/field';
import { CalendarIcon, ClockIcon } from '../ui/icons';
import StepShell from './step-shell';

/**
 * Step four: when the roll opens (creator-07).
 *
 * This is the door the countdown counts to. A guest who follows the link before
 * it is asked to come back when the function begins; after it, they are asked
 * who they are and then handed a camera.
 *
 * The design draws a date and an hour as two ordinary fields with an icon in
 * each, and the first build shipped them as free text. The owner called that
 * confusing (2026-08-30), so the same two fields now open the platform's own
 * pickers - the pill, the label and the icon unchanged, the answers arriving
 * as `YYYY-MM-DD` and `HH:mm`.
 */
export default function TimeStep({
  opensOn,
  opensAt,
  onChange,
  onBack,
  onContinue,
}: {
  opensOn: string;
  opensAt: string;
  onChange: (patch: { opensOn?: string; opensAt?: string }) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <StepShell
      step={4}
      heading="When does the roll open?"
      blurb="Set the time the guest can join in"
      onBack={onBack}
      primary={{ label: 'Continue', onClick: onContinue }}>
      <div className="flex w-full flex-col gap-[20px]">
        <Field
          id="memoroll-opens-on"
          label="Open on"
          kind="date"
          value={opensOn}
          onChange={(value) => onChange({ opensOn: value })}
          icon={<CalendarIcon className="h-[24px] w-[24px]" />}
        />
        <Field
          id="memoroll-opens-at"
          label="At"
          kind="time"
          value={opensAt}
          onChange={(value) => onChange({ opensAt: value })}
          icon={<ClockIcon className="h-[24px] w-[24px]" />}
        />
      </div>
    </StepShell>
  );
}
