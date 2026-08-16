'use client';

import { MOCK_WEDDING } from '../mock';
import { BodyText, CalendarDoodle, HandHeading, PillButton } from '../ui';

/**
 * The "event hasn't started" page (guest-03): where the flowchart's time
 * gate sends an early guest. In the demo the clock is the phase control.
 */
export default function TimeGateScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-14">
      <HandHeading>Excited much?</HandHeading>
      <BodyText className="mt-3">
        The event hasn’t started yet my friend
      </BodyText>

      <div className="flex flex-1 items-center justify-center py-6">
        <CalendarDoodle
          calendar={MOCK_WEDDING.calendar}
          className="h-[230px] w-[250px]"
        />
      </div>

      <div className="mx-auto w-[85%]">
        <PillButton onClick={onBack}>Remind me</PillButton>
        <p
          className="mt-3 text-center text-[12px] text-[#212121]/60"
          style={{ fontFamily: 'var(--font-mr-ui)' }}>
          demo: flip the event phase to walk in
        </p>
      </div>
    </div>
  );
}
