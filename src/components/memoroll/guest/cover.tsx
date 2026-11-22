'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import cameraDoodle from '@/assets/memoroll/cover-camera-doodle.png';
import hearts from '@/assets/memoroll/cover-hearts.png';
import tape from '@/assets/memoroll/cover-tape.png';
import SignedInAs from '../ui/signed-in-as';
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
 * The Cover's entrance (the designer's motion reference, 2026-11-12, its
 * first six seconds). Nothing is on the paper; then the prints are thrown
 * onto it one after another from a point low in the middle, each spinning
 * and growing into its place; the wordmark arrives; the couple's name is
 * written; the hearts and the camera drop in beside it; a flash goes off;
 * and only then does the invitation and its button appear.
 *
 * Times are seconds from the moment the Cover mounts, read off the reference
 * frame by frame.
 */
const ENTRANCE = {
  /** The first print leaves the point here, and one follows every `gap`. */
  prints: 0.3,
  gap: 0.22,
  flight: 0.6,
  wordmark: 2.0,
  name: 2.3,
  hearts: 2.7,
  camera: 2.9,
  flash: 3.5,
  invitation: 3.9,
  button: 4.2,
  footer: 4.6,
} as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Whether the entrance has been seen on this page load. It is an entrance:
 * a guest who comes back to the Cover from the gallery, or whose event
 * changes phase under them, has already arrived, and replaying it left them
 * looking at bare paper for five seconds each time (found 2026-11-22).
 * Only ever set in the browser, after a Cover has mounted.
 */
let entranceSeen = false;

/** Ink up to where the pen is, fading out over the stretch just behind it. */
const NAME_PEN =
  'linear-gradient(90deg, #000 calc(var(--pen) - 45%), transparent var(--pen))';

/**
 * How a strip of tape sits on a corner of the taped print: its middle on the
 * corner itself, lying across it at 45 degrees.
 *
 * The artwork is already a strip drawn at an angle (about 33.5 degrees,
 * rising to the right). The frame's -36 was that angle, and it was applied
 * on top of the drawing as well, which stood the tape nearly upright beside
 * the corner instead of across it (owner, 2026-11-22). Only the difference
 * to 45 is turned here, and the strip is hung by its middle, so the two
 * corners are the print's own two corners and nothing else to keep in step.
 */
const TAPE = { x: '-50%', y: '-50%', rotate: -11.5 } as const;

/** The hero's height, which the collage's flight is measured against. */
const HERO_HEIGHT = 455;

/**
 * Where the entrance stands. Every part is told its state rather than left
 * to animate on mount, because the Cover is drawn inside the flow's own
 * AnimatePresence, and a presence that skips its children's first animation
 * skips these too.
 *
 * - `still`: no entrance; everything is in its place and nothing moves.
 * - `waiting`: the entrance is about to play; everything is held at its start.
 * - `playing`: each part moves to its place at its own second.
 */
type Stage = 'still' | 'waiting' | 'playing';

/** Something that fades up into its place at a given second. */
function rise(stage: Stage, delay: number, from = 10) {
  return {
    initial: false,
    animate:
      stage === 'waiting' ? { opacity: 0, y: from } : { opacity: 1, y: 0 },
    transition:
      stage === 'playing'
        ? { delay, duration: 0.5, ease: EASE_OUT }
        : { duration: 0 },
  } as const;
}

/** A transition that only takes time while the entrance is playing. */
function during<T extends object>(stage: Stage, transition: T) {
  return stage === 'playing' ? transition : { duration: 0 };
}

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
  rotate = 0,
  thrown,
  stage = 'still',
}: {
  src: string | null;
  pad: number;
  waitingNumber?: number;
  className?: string;
  style?: React.CSSProperties;
  /** The angle the print lies at, in degrees. */
  rotate?: number;
  /**
   * Set while the Cover makes its entrance: where the print starts from,
   * relative to its place, and when it is thrown.
   */
  thrown?: { x: string; y: string; delay: number };
  stage?: Stage;
}) {
  const held = stage === 'waiting' && thrown;
  return (
    <motion.div
      className={`absolute overflow-hidden bg-white ${className}`}
      style={{ padding: `${pad}%`, boxShadow: PRINT_SHADOW, rotate, ...style }}
      initial={false}
      animate={
        held
          ? // A speck at the point, most of a turn away from how it lands.
            { x: thrown.x, y: thrown.y, scale: 0.03, rotate: rotate - 150 }
          : { x: 0, y: 0, scale: 1, rotate }
      }
      transition={
        stage === 'playing' && thrown
          ? { delay: thrown.delay, duration: ENTRANCE.flight, ease: EASE_OUT }
          : { duration: 0 }
      }>
      {src ? (
        <img src={src} alt="" className="block h-full w-full object-cover" />
      ) : (
        <Waiting number={waitingNumber} />
      )}
    </motion.div>
  );
}

/** The hero: whichever way this Cover shows its photographs. */
function Hero({
  style,
  photos,
  draft,
  stage,
}: {
  style: CoverStyle;
  photos: (string | null)[];
  draft: boolean;
  /** Where the Cover's entrance stands. */
  stage: Stage;
}) {
  const animated = stage !== 'still';
  const waiting = stage === 'waiting';
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
      <motion.div
        className="relative h-full w-full overflow-hidden"
        // One photograph has nowhere to be thrown from: it comes up out of
        // the paper instead, over the time the collage takes to land.
        initial={false}
        animate={
          waiting ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }
        }
        transition={during(stage, {
          delay: ENTRANCE.prints,
          duration: 1.2,
          ease: EASE_OUT,
        })}>
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
      </motion.div>
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
          // The print's middle is 48.55% down a 455px hero; the point is
          // 96% down it.
          stage={stage}
          thrown={
            animated
              ? {
                  x: '0%',
                  y: `${HERO_HEIGHT * (0.96 - 0.4855)}px`,
                  delay: ENTRANCE.prints,
                }
              : undefined
          }
        />
        {/* The tape goes on once the print has landed. */}
        <motion.img
          src={tape.src}
          alt=""
          className="absolute w-[24.7%]"
          style={{ ...TAPE, left: '20.2%', top: '10.7%' }}
          initial={false}
          animate={
            waiting ? { opacity: 0, scale: 1.4 } : { opacity: 1, scale: 1 }
          }
          transition={during(stage, {
            delay: ENTRANCE.prints + ENTRANCE.flight,
            duration: 0.25,
            ease: EASE_OUT,
          })}
        />
        <motion.img
          src={tape.src}
          alt=""
          className="absolute w-[24.7%]"
          style={{ ...TAPE, left: '84.6%', top: '86.4%' }}
          initial={false}
          animate={
            waiting ? { opacity: 0, scale: 1.4 } : { opacity: 1, scale: 1 }
          }
          transition={during(stage, {
            delay: ENTRANCE.prints + ENTRANCE.flight + 0.12,
            duration: 0.25,
            ease: EASE_OUT,
          })}
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
          }}
          rotate={slot.rotate}
          // From the point (the middle, 96% down the hero) to this slot,
          // written against the print's own box so it holds at any width:
          // across, the gap between the two middles as a share of the
          // print's width; down, the hero's pixels less half the print.
          stage={stage}
          thrown={
            animated
              ? {
                  x: `${((50 - slot.left - slot.width / 2) / slot.width) * 100}%`,
                  y: `calc(${HERO_HEIGHT * (0.96 - slot.top / 100)}px - 50%)`,
                  delay: ENTRANCE.prints + i * ENTRANCE.gap,
                }
              : undefined
          }
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
  account,
  entrance = false,
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
  /** The account this browser is already signed in as, if any. */
  account?: { email: string; onSwitch: () => void };
  /**
   * Whether the Cover makes its entrance. Only where a guest meets it: the
   * creator's own previews of a Cover stay still.
   */
  entrance?: boolean;
}) {
  const reduce = useReducedMotion();
  /**
   * The entrance plays once, for a guest. A creator building their Cover is
   * looking at their own slots and must not have them thrown about on every
   * edit; and anyone can cut it short by touching the screen, because five
   * seconds is a long time to a guest who only wants in.
   */
  const [skipped, setSkipped] = useState(false);
  const [started, setStarted] = useState(false);
  /** Decided once, as this Cover mounts: is this the first one this visit? */
  const [first] = useState(() => !entranceSeen);
  const animated = entrance && first && !draft && !reduce && !skipped;
  const stage: Stage = !animated ? 'still' : started ? 'playing' : 'waiting';
  const waiting = stage === 'waiting';
  /**
   * Whether the button has arrived. Until it has, it takes no touches, so a
   * touch where it will be cuts the entrance short like a touch anywhere
   * else. Once it has, a press on it is a press on it: cutting the entrance
   * short remounts the Cover, and a mouse's click was lost in the remount,
   * so the first click on the button did nothing (found 2026-11-22).
   */
  const [buttonHere, setButtonHere] = useState(false);
  /** Whether the entrance has run its course, after which nothing skips. */
  const [over, setOver] = useState(false);
  useEffect(() => {
    if (entrance && !draft) entranceSeen = true;
    // One frame held at the start, so the first thing painted is bare paper.
    const id = requestAnimationFrame(() => setStarted(true));
    const button = window.setTimeout(
      () => setButtonHere(true),
      ENTRANCE.button * 1000
    );
    const end = window.setTimeout(
      () => setOver(true),
      (ENTRANCE.footer + 0.6) * 1000
    );
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(button);
      window.clearTimeout(end);
    };
  }, []);
  const words = eventName.split(' ');

  return (
    <div
      // Remounting is what ends the entrance: every part comes back already
      // in its place.
      key={animated ? 'entrance' : 'still'}
      onPointerDown={
        animated && !over
          ? (event) => {
              // A press on something that is there to be pressed is not a
              // request to skip.
              if ((event.target as HTMLElement).closest('button, a')) return;
              setSkipped(true);
            }
          : undefined
      }
      className="relative flex min-h-full flex-1 flex-col overflow-hidden"
      style={{ background: colour.paper }}>
      <div className="relative h-[455px] shrink-0">
        <Hero style={style} photos={photos} draft={draft} stage={stage} />
      </div>

      {/* Both stickers sit half off the screen in the design, which is what
          makes them read as things dropped onto the page rather than a border
          around it. The hearts are one drawing, so they are uncovered from
          the top down, which is the order the reference pops them in; the
          camera swings in from off the right edge. */}
      <motion.img
        src={hearts.src}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-20%] top-[58.9%] w-[58.4%] select-none"
        initial={false}
        animate={{
          clipPath: waiting ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)',
        }}
        transition={during(stage, {
          delay: ENTRANCE.hearts,
          duration: 0.7,
          ease: 'easeOut',
        })}
      />
      <motion.img
        src={cameraDoodle.src}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[81.7%] top-[58.6%] w-[29%] select-none"
        initial={false}
        animate={waiting ? { x: '110%', rotate: 25 } : { x: '0%', rotate: 0 }}
        transition={during(stage, {
          delay: ENTRANCE.camera,
          type: 'spring',
          duration: 0.6,
          bounce: 0.3,
        })}
      />

      {/* -31px: the design's text column (Frame 89, y 424) starts inside the
          455-tall hero, tucked into the collage's white space, rather than
          after it. */}
      <div className="relative z-10 -mt-[31px] flex flex-1 flex-col items-center px-[16px]">
        <motion.div {...rise(stage, ENTRANCE.wordmark, 6)}>
          <Wordmark className="h-[16px] w-[128px]" />
        </motion.div>

        {/* The event name is the creator's, so it is one string that wraps
            rather than the design's two hand-broken lines - but it wraps in
            the design's own 210px column, which is what breaks
            "Elias & Freya's wedding" into the two centred lines the frame
            draws instead of one line running under the camera doodle. A long
            name steps down a size; a 32px script twice the designed length
            would otherwise spill past three lines.
            On the entrance it is written rather than shown: each word is
            uncovered from its left, one after the other. Whole words, so the
            script's joins between letters are never cut apart. */}
        <h1
          aria-label={eventName}
          className={`mt-[24px] max-w-[230px] text-center ${
            eventName.length > 28
              ? 'text-[24px] leading-[30px]'
              : 'text-[32px] leading-[38px]'
          }`}
          style={{ color: '#000000', fontFamily: 'var(--font-mr-script)' }}>
          {words.map((word, i) => (
            // The site's stylesheet sets a font on every element, so a span
            // does not inherit the script from its heading: it has to be
            // told to.
            <span
              key={`${word}-${i}`}
              aria-hidden
              style={{ fontFamily: 'inherit' }}>
              <motion.span
                className="inline-block"
                style={{
                  // A pen, not a guillotine: the word is uncovered behind a
                  // soft edge, so a letter half written fades out instead of
                  // being sliced (owner, 2026-11-22: the hard edge read as
                  // the name being cut off). The padding, taken back by the
                  // margin, keeps the script's tails and overhang inside
                  // the mask's box.
                  fontFamily: 'inherit',
                  padding: '0.3em 0.25em',
                  margin: '-0.3em -0.25em',
                  maskImage: NAME_PEN,
                  WebkitMaskImage: NAME_PEN,
                }}
                initial={false}
                animate={{ '--pen': waiting ? '0%' : '150%' }}
                transition={during(stage, {
                  delay: ENTRANCE.name + i * 0.16,
                  duration: 0.3,
                  ease: 'linear',
                })}>
                {word}
              </motion.span>
              {i < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </h1>

        <motion.p
          {...rise(stage, ENTRANCE.invitation, 6)}
          className="mt-[64px] text-center text-[14px] font-normal leading-[150%] tracking-[-0.011em]"
          style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
          join others capture the moments
        </motion.p>

        {/* The button opens out from its own middle, the way the reference
            grows it. */}
        <motion.div
          className="mt-[11px]"
          style={{
            pointerEvents: stage === 'still' || buttonHere ? 'auto' : 'none',
          }}
          initial={false}
          animate={
            waiting ? { opacity: 0, scale: 0.4 } : { opacity: 1, scale: 1 }
          }
          transition={during(stage, {
            delay: ENTRANCE.button,
            type: 'spring',
            duration: 0.5,
            bounce: 0.25,
          })}>
          <Cta onClick={onEnter} className="w-[210px]">
            {ctaLabel}
          </Cta>
        </motion.div>
        {account ? (
          <motion.div {...rise(stage, ENTRANCE.button + 0.2, 6)}>
            <SignedInAs
              email={account.email}
              onSwitch={account.onSwitch}
              className="mt-[10px] w-[260px]"
            />
          </motion.div>
        ) : null}
      </div>

      <motion.div
        className="relative z-10"
        {...rise(stage, ENTRANCE.footer, 0)}>
        <MemoifyFooter />
      </motion.div>

      {/* The flash: the whole Cover whites out for an instant, between the
          name being written and the invitation appearing. */}
      {animated ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 bg-white"
          initial={false}
          animate={{ opacity: waiting ? 0 : [0, 0.75, 0] }}
          transition={{
            delay: ENTRANCE.flash,
            duration: 0.5,
            times: [0, 0.3, 1],
            ease: 'easeOut',
          }}
        />
      ) : null}
    </div>
  );
}
