'use client';

import camera from '@/assets/memoroll/countdown-camera.png';
import shotsCounter from '@/assets/memoroll/countdown-shots-counter.png';
import { FlipCountdown, type Remaining } from '../ui/flip-counter';
import MemoifyFooter from '../ui/memoify-footer';
import Wordmark from '../ui/wordmark';
import { colour, type } from '../ui/tokens';

/**
 * The closed door (guest-04): what a guest gets when they follow the link
 * before the roll opens.
 *
 * The camera hangs off the top left at an angle, cropped by the screen edge -
 * a photograph of the thing they cannot use yet rather than an illustration of
 * one. It is the design's own camera artwork, exported, because it is a
 * rendered object with a lens and a shutter and not something to rebuild in
 * CSS.
 *
 * The clock is not computed here. This component is handed what remains and
 * draws it, so the demo can hand it a fixed number and the product can hand it
 * a ticking one without the screen knowing which it is (ADR 0007).
 */
export default function CountdownScreen({
  remaining,
}: {
  remaining: Remaining;
}) {
  return (
    <div
      className="relative flex min-h-full flex-1 flex-col overflow-hidden"
      style={{ background: colour.paper }}>
      {/* The camera lies on its side across the top, its shots counter riding
          over its bottom edge and running off the right of the screen. Both are
          the photograph rather than working controls, which is why they are
          exported artwork and not the real components hbd-qti.2 builds.
          Absolutely placed so the words below keep their position whatever the
          artwork does, and the design's own offsets are kept: 353x270 of the
          375 column for the camera, the counter at 69 across and 279 down. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[38px] select-none">
        <img
          src={camera.src}
          alt=""
          className="absolute -left-[4%] top-0 w-[98%]"
        />
        <img
          src={shotsCounter.src}
          alt=""
          className="absolute left-[18.4%] top-[241px] w-[93.6%]"
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-[24px] px-[16px] pt-[350px]">
        <Wordmark className="h-[16px] w-[128px]" title="" />

        <h1
          className={`text-center ${type.headingSoft}`}
          style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
          Come back when the function begins.
        </h1>

        <FlipCountdown remaining={remaining} />
      </div>

      <MemoifyFooter />
    </div>
  );
}
