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
 * The viewfinder shows the event's own Cover photo when it has one (owner,
 * 2026-11-22): the artwork carries a stock party in its window, and a guest
 * waiting outside a wedding should be looking at that wedding. The photo is
 * laid over the artwork's window, and the flash pill, which the artwork draws
 * on top of its stock photo, is cut from the artwork again and laid over
 * that. An event with no Cover photo keeps the artwork as it is.
 *
 * The clock is not computed here. This component is handed what remains and
 * draws it, so the demo can hand it a fixed number and the product can hand it
 * a ticking one without the screen knowing which it is (ADR 0007).
 */
/**
 * Where things are in the camera artwork, as shares of its 706x539, measured
 * off the PNG: the viewfinder's window, and the flash pill inside it.
 */
const WINDOW = { left: 0, top: 12.8, width: 63.35, height: 74.6 };
const PILL = { left: 56.75, top: 15.65, width: 5.0, height: 12.7 };

export default function CountdownScreen({
  remaining,
  photo,
}: {
  remaining: Remaining;
  /** The event's Cover photo, shown in the camera's viewfinder. */
  photo?: string | null;
}) {
  return (
    <div
      className="relative flex min-h-full flex-1 flex-col overflow-hidden"
      style={{ background: colour.paper }}>
      {/* The camera lies on its side across the top, its shots counter riding
          over its bottom edge and running off the right of the screen. Both are
          the photograph rather than working controls, which is why they are
          exported artwork and not the real components hbd-qti.2 builds.
          The design's three "Portra 400" pills are repainted in the artwork
          with the roster's own names, Gold, Green and Clean (2026-11-13), so
          the picture does not name a film the camera does not have.
          Absolutely placed so the words below keep their position whatever the
          artwork does, and the design's own offsets are kept: 353x270 of the
          375 column for the camera, the counter at 69 across and 279 down. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[38px] select-none">
        <div className="absolute -left-[4%] top-0 w-[98%]">
          <img src={camera.src} alt="" className="block w-full" />
          {photo ? (
            <>
              <img
                src={photo}
                alt=""
                className="absolute object-cover"
                style={{
                  left: `${WINDOW.left}%`,
                  top: `${WINDOW.top}%`,
                  width: `${WINDOW.width}%`,
                  height: `${WINDOW.height}%`,
                  // The window's right corners are rounded; its left side
                  // runs off the artwork's edge.
                  borderRadius: '0 4.2% 4.2% 0 / 0 4.7% 4.7% 0',
                }}
              />
              {/* The artwork again, shown only through the pill's own
                  outline, so the pill sits on the new photo as it sat on
                  the old one. */}
              <div
                className="absolute rounded-full"
                style={{
                  left: `${PILL.left}%`,
                  top: `${PILL.top}%`,
                  width: `${PILL.width}%`,
                  height: `${PILL.height}%`,
                  backgroundImage: `url(${camera.src})`,
                  backgroundSize: `${10000 / PILL.width}% ${10000 / PILL.height}%`,
                  backgroundPosition: `${(PILL.left / (100 - PILL.width)) * 100}% ${(PILL.top / (100 - PILL.height)) * 100}%`,
                }}
              />
            </>
          ) : null}
        </div>
        <img
          src={shotsCounter.src}
          alt=""
          className="absolute left-[18.4%] top-[241px] w-[93.6%]"
        />
      </div>

      {/* Pinned where the design pins it (Frame 105, y 424 under a 42px
          status bar the browser draws itself = 382), rather than centred in
          what is left - centring floated the words 80px lower and left a band
          of bare paper under the camera. */}
      <div className="flex flex-1 flex-col items-center gap-[24px] px-[16px] pt-[382px]">
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
