'use client';

import Field from '../ui/field';
import StepShell from './step-shell';

/**
 * Step two: what the event is called (creator-06).
 *
 * This answer travels further than any other. It is set in script on the Cover,
 * it is what a guest reads the moment they scan the QR, and it is printed under
 * the QR itself - which is what the hint under the field is telling the creator,
 * in the design's own words.
 *
 * Nothing here bounds its length. A name long enough to run off a phone is the
 * Cover's problem, and the Cover already steps its script down a size rather
 * than truncating somebody's wedding.
 */
export default function NameStep({
  eventName,
  onChange,
  onBack,
  onContinue,
}: {
  eventName: string;
  onChange: (name: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <StepShell
      step={2}
      heading="What’s the event called?"
      blurb="A memorable occasion must have a name"
      onBack={onBack}
      primary={{ label: 'Continue', onClick: onContinue }}>
      <Field
        id="memoroll-event-name"
        label="Event name"
        hint="This will be the first thing guests will see when they scan your QR"
        value={eventName}
        onChange={onChange}
      />
    </StepShell>
  );
}
