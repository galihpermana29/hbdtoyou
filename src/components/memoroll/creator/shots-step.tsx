'use client';

import { MinusIcon, PlusIcon } from '../ui/icons';
import { colour, type } from '../ui/tokens';
import StepShell from './step-shell';
import { FEWEST_SHOTS, MOST_SHOTS } from './draft';

/**
 * Step six: how many shots each guest gets (creator-09).
 *
 * The number is the whole screen, which is the design saying that this is the
 * decision that shapes the day. A guest cannot buy more and cannot retake, so
 * ten is ten - the line under the heading says as much, and it is why the
 * design pushes 165 of empty paper between the two.
 *
 * The design draws ten with the minus already grey, so ten is the floor. The
 * ceiling is the product's (see MOST_SHOTS) and it arrives the same way: the
 * plus greys at fifteen exactly as the minus does at ten.
 */
export default function ShotsStep({
  shotsPerGuest,
  onChange,
  onBack,
  onContinue,
}: {
  shotsPerGuest: number;
  onChange: (shots: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const atFloor = shotsPerGuest <= FEWEST_SHOTS;
  const atCeiling = shotsPerGuest >= MOST_SHOTS;

  return (
    <StepShell
      step={6}
      heading="How many shots does everyone get?"
      blurb="Every photo counts. Guests can't preview their shots until the roll develops."
      gap={165}
      onBack={onBack}
      primary={{ label: 'Continue', onClick: onContinue }}>
      <div className="flex w-full flex-col items-center gap-[12px]">
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            aria-label="One fewer shot each"
            disabled={atFloor}
            onClick={() => onChange(shotsPerGuest - 1)}
            className="h-[44px] w-[44px] shrink-0 rounded-full"
            style={{
              background: atFloor ? '#d9d9d9' : colour.flame,
              color: colour.paper,
            }}>
            <MinusIcon className="h-full w-full" />
          </button>

          <span
            className={type.tally}
            style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
            {shotsPerGuest}
          </span>

          <button
            type="button"
            aria-label="One more shot each"
            disabled={atCeiling}
            onClick={() => onChange(shotsPerGuest + 1)}
            className="h-[44px] w-[44px] shrink-0 rounded-full"
            style={{
              background: atCeiling ? '#d9d9d9' : colour.flame,
              color: colour.paper,
            }}>
            <PlusIcon className="h-full w-full" />
          </button>
        </div>

        <p
          className="text-[12px] font-semibold leading-[150%] tracking-[-0.011em]"
          style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
          Shots per guest
        </p>
      </div>
    </StepShell>
  );
}
