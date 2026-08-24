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
 * each, not as a picker, so that is what they are. Nothing here parses what is
 * typed: a demo that never saves has nothing to parse it for, and the product
 * will read it where it reads everything else.
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
          value={opensOn}
          onChange={(value) => onChange({ opensOn: value })}
          icon={<CalendarIcon className="h-[24px] w-[24px]" />}
        />
        <Field
          id="memoroll-opens-at"
          label="At"
          value={opensAt}
          onChange={(value) => onChange({ opensAt: value })}
          icon={<ClockIcon className="h-[24px] w-[24px]" />}
        />
      </div>
    </StepShell>
  );
}
