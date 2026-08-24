'use client';

import allowArt from '@/assets/memoroll/location-allow.png';
import blockedPath from '@/assets/memoroll/location-blocked.svg';
import blockedPin from '@/assets/memoroll/location-blocked-pin.svg';
import Cta from '../ui/cta';
import MemoifyFooter from '../ui/memoify-footer';
import { colour, type } from '../ui/tokens';

/**
 * The location gate, in the design's two states (guest-07, guest-08).
 *
 * Being there is the ticket: the creator sets a venue and a 500m radius, and a
 * phone outside it cannot shoot. The two states are one screen because they
 * differ only in their words, their artwork and what the button does - and
 * because a guest walking towards the venue moves between them, which is easier
 * to believe when it is a prop rather than a route.
 *
 * The artwork is exported from the design rather than redrawn. `blocked` is a
 * cobblestone path receding towards a pin dropped far away, which is the whole
 * message of the screen and not something to approximate with a border.
 */

export type LocationState = 'asking' | 'blocked';

const COPY = {
  asking: {
    heading: 'Made it to the function?',
    body: 'We’ll use your location to check that you’re at the event, so you can capture and share moments with everyone.',
    cta: 'Allow My Location',
  },
  blocked: {
    heading: 'Looks like you’re a little too far',
    body: 'Head over and you’ll be able to join in and share your moments with everyone.',
    cta: 'Check Again',
  },
} as const;

export default function LocationScreen({
  state,
  onAct,
  busy = false,
}: {
  state: LocationState;
  /** Ask for permission, or check the distance again. */
  onAct: () => void;
  busy?: boolean;
}) {
  const copy = COPY[state];

  return (
    <div
      className="relative flex min-h-full flex-1 flex-col overflow-hidden"
      style={{ background: colour.paper }}>
      <div className="relative z-10 flex flex-col items-center gap-[8px] px-[16px] pt-[28px] text-center">
        <h1
          className={type.heading}
          style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
          {copy.heading}
        </h1>
        <p
          className={type.body}
          style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
          {copy.body}
        </p>
      </div>

      {/* The artwork runs off the bottom and both sides rather than sitting in
          a box: the map is the ground the screen stands on, and the button and
          the footer float on top of it. Anchored to the bottom so a taller
          phone shows more of it instead of shrinking it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none">
        <img
          src={state === 'asking' ? allowArt.src : blockedPath.src}
          alt=""
          className="w-full"
        />
      </div>
      {state === 'blocked' && (
        // The pin is its own layer in the design, dropped at the far end of the
        // path where the venue is. Its distance is the whole message.
        <img
          src={blockedPin.src}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[10.9%] top-[25.5%] w-[20.3%] select-none"
        />
      )}

      <div className="flex-1" />

      <div className="relative z-10 flex justify-center px-[16px]">
        {/* 220 wide in both states, where the username confirm's runs the full
            column. The design sizes this button per screen, not per product. */}
        <Cta onClick={onAct} disabled={busy} className="w-[220px]">
          {copy.cta}
        </Cta>
      </div>

      <MemoifyFooter className="relative z-10" />
    </div>
  );
}
