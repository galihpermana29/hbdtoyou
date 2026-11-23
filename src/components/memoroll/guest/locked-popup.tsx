'use client';

import howDay from '@/assets/memoroll/how-day.png';
import howReveal from '@/assets/memoroll/how-reveal.png';
import { PopupCard } from './how-popup';

/**
 * What a guest gets for tapping a print that has not opened yet (owner,
 * 2026-11-23): the same card that told them the rules on the way in, now
 * saying which rule they just ran into and when it lifts. Before this a
 * veiled print was dead to the touch, and a guest could not tell a locked
 * shot from a broken one.
 *
 * Two reasons a print is shut, and the card says the one that is true:
 * the Reveal has not come, or it has and this guest has not developed yet.
 */

/** "Sun, 24 May" and "8:00 PM", in the guest's own clock: they are standing
 *  at the event, and their phone's time is the time on the wall. */
function when(at: Date) {
  return {
    day: at.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }),
    time: at.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
}

export default function LockedPopup({
  revealsAt,
  canDevelop,
  onDevelop,
  onDone,
}: {
  /** The Reveal, when the caller knows the moment. */
  revealsAt?: Date;
  /** The Reveal has come and the guest's own press is all that is missing. */
  canDevelop: boolean;
  onDevelop: () => void;
  onDone: () => void;
}) {
  if (canDevelop) {
    return (
      <PopupCard
        pinned
        title="It’s time. Develop first"
        rows={[
          {
            icon: howReveal.src,
            read: 'The reveal is here. Develop your Roll and every shot opens, yours and everyone else’s.',
            copy: (
              <>
                The reveal is here.{' '}
                <strong className="font-bold">Develop your Roll</strong> and
                every shot opens, yours and everyone else’s.
              </>
            ),
          },
        ]}
        action="Develop My Roll"
        onAction={onDevelop}
        onDismiss={onDone}
      />
    );
  }

  const at = revealsAt ? when(revealsAt) : null;
  return (
    <PopupCard
      pinned
      title="Not yet. No peeking"
      rows={[
        {
          icon: howReveal.src,
          read: 'Every shot stays in the dark until the reveal. Yours too.',
          copy: (
            <>
              Every shot stays in the dark until the reveal.{' '}
              <strong className="font-bold">Yours too.</strong>
            </>
          ),
        },
        {
          icon: howDay.src,
          read: at
            ? `It all opens on ${at.day} at ${at.time}. We’ll send you an email, come back then.`
            : 'It all opens when the countdown up top hits zero.',
          copy: at ? (
            <>
              It all opens on{' '}
              <strong className="font-bold">
                {at.day} at {at.time}
              </strong>
              . We’ll send you an email, come back then.
            </>
          ) : (
            <>It all opens when the countdown up top hits zero.</>
          ),
        },
      ]}
      action="Got it"
      onAction={onDone}
      onDismiss={onDone}
    />
  );
}
