'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BodyText,
  DemoSkipLink,
  HandHeading,
  PhoneMapDoodle,
  PillButton,
} from '../ui';

/**
 * Allow Location (guest-02). The real browser permission is asked for when
 * it exists, but ANY answer passes: being at the venue is the product's
 * gate, never the demo's. Denial keeps this designed screen on show with
 * the skip underneath.
 */
export default function LocationGateScreen({
  onPassed,
}: {
  onPassed: () => void;
}) {
  const [asking, setAsking] = useState(false);
  const done = useRef(false);

  const pass = () => {
    if (done.current) return;
    done.current = true;
    onPassed();
  };

  useEffect(() => {
    // Reset on (re)mount so strict mode's rehearsal cleanup does not leave
    // the gate permanently passed before anyone tapped it.
    done.current = false;
    return () => {
      // A late geolocation callback after unmount must not navigate again.
      done.current = true;
    };
  }, []);

  const askForLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      pass();
      return;
    }
    setAsking(true);
    navigator.geolocation.getCurrentPosition(
      () => pass(),
      () => pass(),
      { timeout: 6000, maximumAge: 600000 }
    );
    // Some browsers never call back when the prompt is dismissed.
    window.setTimeout(pass, 8000);
  };

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-14">
      <HandHeading>
        Prove you’re actually
        <br />
        here
      </HandHeading>
      <BodyText className="mt-3">
        We just need your location, not your life story.
      </BodyText>

      <div className="flex flex-1 items-center justify-center">
        <PhoneMapDoodle className="h-[280px] w-[240px]" />
      </div>

      <div className="mx-auto w-[85%]">
        <PillButton onClick={askForLocation}>
          {asking ? 'Checking…' : 'Allow My Location'}
        </PillButton>
        <div className="mt-3">
          <DemoSkipLink onClick={pass}>skip for now (demo)</DemoSkipLink>
        </div>
      </div>
    </div>
  );
}
