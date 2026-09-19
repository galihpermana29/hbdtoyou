'use client';

import cameraDoodle from '@/assets/memoroll/cover-camera-doodle.png';
import hearts from '@/assets/memoroll/cover-hearts.png';
import tape from '@/assets/memoroll/cover-tape.png';
import Cta from '../ui/cta';
import MemoifyFooter from '../ui/memoify-footer';
import Wordmark from '../ui/wordmark';
import { PhotoIcon } from '../ui/icons';
import { colour } from '../ui/tokens';

/**
 * The Cover: the first thing a guest sees when they scan the QR, and the only
 * screen the creator gets to decorate.
 *
 * The design draws six of these. They are not six layouts - they are one screen
 * with three ways of showing the creator's photographs, which is exactly the
 * choice the creator's own "Make it yours" step offers: Collage, Taped wall,
 * Simple. Everything below the photographs is identical across all six: the
 * wordmark, the event name in script, the hearts on the left, the camera doodle
 * on the right, one line of invitation and one button.
 *
 * So this is one component with a Cover Style, rather than six components with
 * a shared bottom half that would drift apart the first time somebody edited
 * one of them.
 *
 * The demo and the real product both render this, fed a different set of
 * photographs (ADR 0007).
 */

export type CoverStyle = 'collage' | 'taped' | 'simple';

/**
 * The collage's six places, as fractions of the 375x455 hero so they hold at
 * any width. Taken from the design's own bounds; the rotations are read off the
 * exported frame, because a rotated node reports its bounding box rather than
 * its angle and the capture cannot tell us what it was turned by.
 */
const COLLAGE_SLOTS = [
  { left: -1.3, top: -5.5, width: 38.9, rotate: -6, pad: 4.5 },
  { left: -2.4, top: 31.4, width: 72, rotate: -8, pad: 3.7 },
  { left: 33.9, top: 2.8, width: 72, rotate: -8, pad: 3.7 },
  { left: 67.2, top: 37, width: 41.2, rotate: 10, pad: 4.3 },
  { left: -10.1, top: 56.6, width: 33.2, rotate: 8, pad: 4.3 },
  { left: 49.9, top: 25.1, width: 33.2, rotate: 3, pad: 4.3 },
];

/**
 * The design stacks five drop shadows on every print, each softer and further
 * away than the last. That is one shadow with a long tail rather than five
 * effects, and it is what stops the collage looking like stickers.
 */
const PRINT_SHADOW = [
  '1.27px 1.27px 3.18px rgba(0,0,0,0.12)',
  '4.45px 4.45px 6.36px rgba(0,0,0,0.11)',
  '9.54px 10.18px 8.27px rgba(0,0,0,0.06)',
  '16.54px 18.44px 10.18px rgba(0,0,0,0.02)',
].join(', ');

/**
 * A slot with nothing in it yet: peach, tiled with the wordmark, with the frame
 * of a photograph in the middle of it.
 *
 * The design draws this as a raster, so its two colours are read off the
 * exported frame rather than out of the capture (see `colour.waiting`). It is
 * one artwork in three places - a Collage slot, a taped print, a whole Simple
 * hero - which is why it takes no size and fills whatever it is put in.
 *
 * The number is only drawn while a creator is building the Cover, because it is
 * not a caption: it is which upload slot downstairs fills this one.
 */
function Waiting({ number }: { number?: number }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: colour.waiting }}>
      {/* The wordmark, laid across the slot on the diagonal, about two thirds
          of it wide - so a slot reads as MemoRoll's own paper rather than as a
          texture. The box is wider and taller than the slot it fills, so the
          pattern runs off every edge instead of ending inside one. */}
      <div
        aria-hidden
        className="absolute inset-[-40%] flex -rotate-[24deg] flex-col items-center justify-center gap-[28%]"
        style={{ color: colour.waitingMark }}>
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="flex w-full shrink-0 justify-center gap-[12%]"
            style={{ marginLeft: row % 2 ? '-22%' : '22%' }}>
            <Wordmark className="w-[36%]" flame={colour.waitingMark} title="" />
            <Wordmark className="w-[36%]" flame={colour.waitingMark} title="" />
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-[2%]"
        style={{ color: colour.flame }}>
        {number ? (
          <span
            className="text-[24px] font-semibold leading-[150%] tracking-[-0.011em]"
            style={{ color: colour.flame, fontFamily: 'var(--font-mr-body)' }}>
            {number}
          </span>
        ) : null}
        <PhotoIcon className="w-[34%]" />
      </div>
    </div>
  );
}

function Print({
  src,
  pad,
  waitingNumber,
  className = '',
  style,
}: {
  src: string | null;
  pad: number;
  waitingNumber?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute overflow-hidden bg-white ${className}`}
      style={{ padding: `${pad}%`, boxShadow: PRINT_SHADOW, ...style }}>
      {src ? (
        <img src={src} alt="" className="block h-full w-full object-cover" />
      ) : (
        <Waiting number={waitingNumber} />
      )}
    </div>
  );
}

/** The hero: whichever way this Cover shows its photographs. */
function Hero({
  style,
  photos,
  draft,
}: {
  style: CoverStyle;
  photos: (string | null)[];
  draft: boolean;
}) {
  const filled = photos.filter(Boolean) as string[];

  /**
   * Which photograph a slot draws, and it is two different questions.
   *
   * A creator building a Cover is looking at their own slots, so slot three is
   * whatever is in slot three and nothing if that is nothing - which is the
   * whole point of the numbered waiting slots under it.
   *
   * A guest is looking at a finished Cover, so a creator who gave two
   * photographs to a six-slot Collage gets those two repeated round the collage
   * rather than four holes advertising what they did not upload.
   */
  const at = (index: number) => {
    if (draft) return photos[index] ?? null;
    if (filled.length === 0) return null;
    return filled[index % filled.length];
  };

  if (style === 'simple') {
    // One photograph, full bleed, fading out into the paper so it ends without
    // an edge.
    const src = at(0);
    return (
      <div className="relative h-full w-full overflow-hidden">
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <Waiting />
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-[38%]"
          style={{
            background: `linear-gradient(180deg, rgba(247,245,243,0) 0%, ${colour.paper} 100%)`,
          }}
        />
      </div>
    );
  }

  if (style === 'taped') {
    // One print, squared up in the middle, held to the wall by two strips of
    // tape across opposite corners.
    return (
      <div className="relative h-full w-full overflow-hidden">
        <Print
          src={at(0)}
          pad={4.5}
          style={{
            left: '20.2%',
            top: '10.7%',
            width: '64.4%',
            height: '75.7%',
          }}
        />
        <img
          src={tape.src}
          alt=""
          className="absolute left-[12.4%] top-[18%] w-[24.7%] -rotate-[36deg]"
        />
        <img
          src={tape.src}
          alt=""
          className="absolute left-[64.3%] top-[86.8%] w-[24.7%] -rotate-[36deg]"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {COLLAGE_SLOTS.map((slot, i) => (
        <Print
          key={i}
          src={at(i)}
          pad={slot.pad}
          waitingNumber={draft ? i + 1 : undefined}
          style={{
            left: `${slot.left}%`,
            top: `${slot.top}%`,
            width: `${slot.width}%`,
            aspectRatio: i === 1 || i === 2 ? '270 / 170' : '145 / 208',
            transform: `rotate(${slot.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function Cover({
  eventName,
  photos,
  style = 'collage',
  draft = false,
  ctaLabel = 'Let’s Shoot!',
  onEnter,
}: {
  /** The creator's own words, set in script. Any length, any script. */
  eventName: string;
  /** One entry per slot. A slot with nothing in it is still waiting. */
  photos: (string | null)[];
  style?: CoverStyle;
  /**
   * Whether this Cover is still being built.
   *
   * A draft draws its empty slots, numbered, because the creator is looking at
   * them next to the uploads that fill them. A finished Cover never does: it
   * repeats what it was given rather than advertising what it was not.
   */
  draft?: boolean;
  /** "Let's Shoot!" everywhere except the first template, which says "Get me in". */
  ctaLabel?: string;
  onEnter: () => void;
}) {
  return (
    <div
      className="relative flex min-h-full flex-1 flex-col overflow-hidden"
      style={{ background: colour.paper }}>
      <div className="relative h-[455px] shrink-0">
        <Hero style={style} photos={photos} draft={draft} />
      </div>

      {/* Both stickers sit half off the screen in the design, which is what
          makes them read as things dropped onto the page rather than a border
          around it. */}
      <img
        src={hearts.src}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-20%] top-[58.9%] w-[58.4%] select-none"
      />
      <img
        src={cameraDoodle.src}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[81.7%] top-[58.6%] w-[29%] select-none"
      />

      {/* -31px: the design's text column (Frame 89, y 424) starts inside the
          455-tall hero, tucked into the collage's white space, rather than
          after it. */}
      <div className="relative z-10 -mt-[31px] flex flex-1 flex-col items-center px-[16px]">
        <Wordmark className="h-[16px] w-[128px]" />

        {/* The event name is the creator's, so it is one string that wraps
            rather than the design's two hand-broken lines - but it wraps in
            the design's own 210px column, which is what breaks
            "Elias & Freya's wedding" into the two centred lines the frame
            draws instead of one line running under the camera doodle. A long
            name steps down a size; a 32px script twice the designed length
            would otherwise spill past three lines. */}
        <h1
          className={`mt-[24px] max-w-[230px] text-center ${
            eventName.length > 28
              ? 'text-[24px] leading-[30px]'
              : 'text-[32px] leading-[38px]'
          }`}
          style={{ color: '#000000', fontFamily: 'var(--font-mr-script)' }}>
          {eventName}
        </h1>

        <p
          className="mt-[64px] text-center text-[14px] font-normal leading-[150%] tracking-[-0.011em]"
          style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
          join others capture the moments
        </p>

        <Cta onClick={onEnter} className="mt-[11px] w-[210px]">
          {ctaLabel}
        </Cta>
      </div>

      <MemoifyFooter className="relative z-10" />
    </div>
  );
}
