'use client';

import {
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from 'framer-motion';
import { Download, Instagram } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import BackPill from '../ui/back-pill';
import Cta from '../ui/cta';
import RollPrint from './print';
import type { GalleryPhoto } from './roll';
import StorySheet from './story-sheet';

/**
 * One photo at a time over the gallery (guest-19/20): a deck of prints, the
 * front one sharp and swipeable, the next two fanned behind it out of focus.
 *
 * The front print is the one place a developed Shot keeps a secret: its
 * signature is peeled off the print and held behind "Who took this?", and only
 * that button hands the shooter's name over. The prints behind keep their
 * signatures because nobody can read them through the blur. Swiping to another
 * photo closes the secret again - each Shot's shooter is its own reveal.
 *
 * The hand cue is the designer's "pas awal awal aja": drawn over the first
 * preview a guest opens, put away the moment they touch anything, and gone on
 * its own once its wiggle has said what it came to say.
 *
 * APPROXIMATION, PENDING HER REFERENCE. The swipe cue is one of the two
 * moments the designer attached a video reference to, as a Gumlet link that
 * cannot be read from here, so the wiggle is built from the animation guidance
 * in this setup instead; re-cut it against her video when it is reachable.
 * The hand itself is redrawn from the exported frame, because the capture
 * holds it as raster fills with no colours to read.
 */

/**
 * One unit of the deck's own drawing, as a length.
 *
 * The frames draw the deck 334 wide with a 296 print, and the screen used to
 * be built at exactly that whatever the phone. On a real phone that left the
 * photo small and three stacked buttons taking the room it could have had
 * (owner, 2026-11-22). The deck is still drawn in the frame's numbers, but
 * each is now multiplied by this unit: as large as the column's width allows,
 * or the height left once the back pill, the signature and the one row of
 * buttons have theirs, whichever is smaller. It never drops below 0.8, where
 * the column scrolls instead, as a very short screen always did.
 *
 * 426 is the deck's height in units now that the print is 3:4: a 296 print
 * with its 7px border is 390 tall, set 22.9 down, plus the fan's overhang.
 */
const DECK_UNIT =
  'clamp(0.8px, min((min(100vw, 430px) - 32px) / 334, (100dvh - 240px) / 426), 1.19px)';
const u = (units: number) => `calc(${units} * var(--u))`;

/** How the three layers of the deck sit, front last, angles off the frames. */
const DECK = [
  { left: 11.64, top: 22.9, rotate: 2.5, blur: 6.98 },
  { left: 38.9, top: 0, rotate: 5, blur: 11.64 },
  { left: 0, top: 22.9, rotate: -1, blur: 0 },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PhotoPreview({
  photos,
  index,
  onIndexChange,
  showSwipeCue,
  onSwipeCueSeen,
  onClose,
  storyEventName,
  storyEventDate,
}: {
  photos: GalleryPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  showSwipeCue: boolean;
  onSwipeCueSeen: () => void;
  onClose: () => void;
  /**
   * The event's name, which turns on Share to Story (owner, 2026-11-12).
   * The product passes it; the demo passes nothing and the preview stays
   * the drawn one.
   */
  storyEventName?: string;
  /** The event's day, for the Story's film strip; today if absent. */
  storyEventDate?: Date;
}) {
  const reduce = useReducedMotion();
  const [storyOpen, setStoryOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [direction, setDirection] = useState(1);
  const [downloading, setDownloading] = useState(false);

  const photo = photos[index];
  /**
   * The two prints fanned behind the front one: the next photo directly
   * behind, the one after at the bottom. A deck of two has one neighbour to
   * show and a deck of one has none - a photo is never fanned behind itself.
   */
  const behind = (
    photos.length >= 3 ? [2, 1] : photos.length === 2 ? [1] : []
  ).map((step, at, steps) => ({
    neighbour: photos[(index + step) % photos.length],
    pose: DECK[at + (2 - steps.length)],
  }));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const advance = (step: number) => {
    onSwipeCueSeen();
    setRevealed(false);
    setDirection(step);
    onIndexChange((index + step + photos.length) % photos.length);
  };

  const ask = () => {
    onSwipeCueSeen();
    setRevealed(true);
  };

  /**
   * Hand the shown print over as a file. Asked for by the owner on
   * 2026-08-30 - the drawn frames carry no download control, so this is the
   * quiet outline pill under the flame CTA rather than anything new.
   *
   * Fetched as a blob first, because a cross-origin `download` attribute is
   * ignored and the print's pixels live on Cloudinary; what is saved is the
   * baked JPEG itself, marks and all (ADR 0006 - there is nothing else). A
   * fetch the host refuses falls back to opening the print, where a long
   * press saves it by hand.
   */
  const download = async () => {
    onSwipeCueSeen();
    if (downloading) return;
    setDownloading(true);
    try {
      // A print still uploading is a local blob and is read as it is; a
      // stored one goes through our own origin, because its host sends no
      // CORS header and a direct fetch is refused (see /api/memoroll/photo).
      const local = /^(blob|data):/.test(photo.src);
      const response = await fetch(
        local
          ? photo.src
          : `/api/memoroll/photo?url=${encodeURIComponent(
              photo.src
            )}&name=${encodeURIComponent(`memoroll-${photo.id}.jpg`)}`
      );
      if (!response.ok) throw new Error(String(response.status));
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `memoroll-${photo.id}.jpg`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(photo.src, '_blank', 'noopener');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photo preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.12 : 0.25, ease: EASE }}
      className="fixed inset-0 z-40 overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        // The frame's scrim is 50% black over a bare page, and the designer
        // approved it as a photo floating on a flat grey field. Over a live
        // gallery, 50% alone leaves the grid legible behind the deck, so the
        // backdrop is also blurred - the treatment her own tab-bar mock uses -
        // until the scrim reads as her frame does whatever is behind it.
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        fontFamily: 'var(--font-mr-body)',
      }}>
      {/* The sheet dims everything; what sits on it keeps to the phone column
          the demo renders the product in.
          On a phone (owner, 2026-11-12): the frame's 50px top is the iOS
          status bar, which a browser already draws outside the page, so the
          column starts at the safe area instead; the last button keeps clear
          of Safari's toolbar; a short screen tightens the gap above the
          print; and a very short one scrolls rather than clipping a button. */}
      <div
        className="mx-auto flex h-full w-full max-w-[430px] flex-col overflow-y-auto pb-[max(28px,calc(env(safe-area-inset-bottom)+16px))]"
        style={{ '--u': DECK_UNIT } as React.CSSProperties}>
        <div className="flex items-center px-[16px] pt-[max(16px,env(safe-area-inset-top))]">
          <BackPill onClick={onClose} label="Back to the gallery" />
        </div>

        <div
          className="relative mx-auto mt-[16px] shrink-0"
          style={{ width: u(334), height: u(426) }}>
          {behind.map(({ neighbour, pose }, layer) => (
            <RollPrint
              key={`behind-${layer}`}
              src={neighbour.src}
              size="card"
              blur={pose.blur}
              stamp={neighbour.stamp}
              shooter={neighbour.shooter}
              className="absolute"
              style={{
                width: u(296),
                left: u(pose.left),
                top: u(pose.top),
                transform: `rotate(${pose.rotate}deg)`,
              }}
            />
          ))}

          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <DeckCard
              key={photo.id}
              photo={photo}
              direction={direction}
              reduce={!!reduce}
              onDragStart={onSwipeCueSeen}
              onAdvance={advance}
            />
          </AnimatePresence>

          {/* Once the wiggle has run its three passes the cue counts itself
              as seen: a hand parked forever stops being a cue. Under reduced
              motion it holds still instead and leaves on first touch. */}
          <AnimatePresence>
            {showSwipeCue && (
              <motion.span
                className="pointer-events-none absolute block"
                style={{ left: u(167), top: u(250), width: u(107) }}
                animate={reduce ? undefined : { x: [0, -30, 0] }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 1.6,
                        delay: 0.8,
                        repeat: 2,
                        ease: 'easeInOut',
                      }
                }
                onAnimationComplete={reduce ? undefined : onSwipeCueSeen}>
                <SwipeHand />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* The signature's landing place, held open so nothing below it moves
          when the secret is told. */}
        <div className="mt-[12px] flex h-[30px] items-center justify-center gap-[10px]">
          <AnimatePresence>
            {revealed && (
              <motion.span
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 10, scale: 0.97, filter: 'blur(6px)' }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.12 : 0.7, ease: EASE }}
                className="flex items-center gap-[10px]">
                <span aria-hidden className="text-[24px] leading-none">
                  📸
                </span>
                <span className="text-[20px] font-medium leading-[150%] tracking-[-0.011em] text-white">
                  {photo.shooter}
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* One row, the deck's width: the question is the screen's one
            act and keeps its words; saving and sharing are a glyph each, so
            the print above gets the height two more rows used to take. */}
        <div
          className="mx-auto mt-[14px] flex shrink-0 items-center gap-[10px]"
          style={{ width: u(334) }}>
          <Cta onClick={ask} className="min-w-0 flex-1">
            Who took this?
          </Cta>
          <Cta
            tone="outline"
            onClick={download}
            disabled={downloading}
            label={downloading ? 'Saving…' : 'Download'}
            className="h-[52px] w-[52px] shrink-0">
            <Download aria-hidden size={22} strokeWidth={2} />
          </Cta>
          {storyEventName !== undefined ? (
            <Cta
              tone="outline"
              onClick={() => {
                onSwipeCueSeen();
                setStoryOpen(true);
              }}
              label="Share to IG Story"
              className="h-[52px] w-[52px] shrink-0">
              <Instagram aria-hidden size={22} strokeWidth={2} />
            </Cta>
          ) : null}
        </div>
      </div>
      <AnimatePresence>
        {storyOpen && storyEventName !== undefined ? (
          <StorySheet
            key="story"
            photos={[photo]}
            eventName={storyEventName}
            eventDate={storyEventDate ?? new Date()}
            onClose={() => setStoryOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/** The white hand and its arc, redrawn simply from the frame. */
function SwipeHand() {
  return (
    <svg
      viewBox="0 0 107 107"
      role="img"
      aria-label="Swipe to the next shot"
      className="h-full w-full">
      <path
        d="M60 22c-9-5-21-4-28 3"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M34 17l-5 10 11 1z" fill="#ffffff" />
      <path
        d="M52 40c0-4.4 3.6-8 8-8s8 3.6 8 8v16l12.5 4.5c4.5 1.6 7.5 5.9 7.5 10.7V80c0 9.9-8.1 18-18 18H57c-5.4 0-10.5-2.4-14-6.6L32.6 79c-2.3-2.8-1.9-6.9.9-9.2 2.7-2.2 6.7-1.9 9 .8l9.5 8.4V40z"
        fill="#ffffff"
      />
    </svg>
  );
}

const DECK_SPRING = { type: 'spring', duration: 0.45, bounce: 0.15 } as const;
const DECK_MOTION: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 120 }),
  center: { opacity: 1, x: 0, transition: DECK_SPRING },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -260,
    transition: DECK_SPRING,
  }),
};
const REDUCED_DECK: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.12, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: EASE } },
};

/**
 * The top print of the deck, as a finger handles it (Emil Kowalski, gestures
 * skill). While the finger is down the card IS the finger - 1:1 along x, no
 * elastic, no spring - and it tilts with the drag the way a print held at
 * the bottom would. On release it either flies on to the next print (past
 * SWIPE_DISTANCE, or flicked faster than SWIPE_SPEED) carrying the drag's
 * direction, or a spring sets it back. Each card owns its motion value, so
 * the one leaving and the one arriving never share a position.
 *
 * On a phone the swipe used to need several slow, careful tries (owner,
 * 2026-11-22), for three reasons, each fixed here:
 *
 * - The print left vertical movement to the browser (`pan-y`). A thumb never
 *   moves in a straight line, and the moment Safari read the start of a
 *   swipe as a scroll it took the gesture away mid-drag. The print now keeps
 *   every touch that starts on it; the column still scrolls from anywhere
 *   else, and since the deck is sized to the screen it rarely has to.
 * - 80px was most of a thumb's comfortable reach on a print this size, so a
 *   natural short swipe fell short and sprang back.
 * - A drag that fell short was then read as a tap, which always goes
 *   forward - so a short swipe back went the wrong way. A touch that moved
 *   is no longer a tap.
 *
 * The print that is leaving also stops taking touches, so a second swipe
 * made before it has gone lands on the print underneath it.
 */
const SWIPE_DISTANCE = 44;
const SWIPE_SPEED = 320;

function DeckCard({
  photo,
  direction,
  reduce,
  onDragStart,
  onAdvance,
}: {
  photo: GalleryPhoto;
  direction: number;
  reduce: boolean;
  onDragStart: () => void;
  onAdvance: (step: number) => void;
}) {
  const x = useMotionValue(0);
  const isPresent = useIsPresent();
  /** Whether this touch moved the print, which makes it not a tap. */
  const moved = useRef(false);
  // A held print turns as it is pulled: about 8deg at a 260px pull.
  const tilt = useTransform(x, [-260, 0, 260], [-8, 0, 8]);

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        width: u(296),
        left: u(DECK[2].left),
        top: u(DECK[2].top),
        x,
        rotate: DECK[2].rotate,
        pointerEvents: isPresent ? 'auto' : 'none',
      }}
      // The print inside is an <img>: without this a mouse drag starts the
      // browser's own image drag, which cancels the gesture before the card
      // moves (globals.css, [data-deck-card] img).
      data-deck-card=""
      custom={direction}
      // Variants rather than objects: the leaving card is handed the newest
      // direction through AnimatePresence's `custom`, so it always flies out
      // the way the swipe went - an object would keep the direction from
      // the render before it started leaving.
      variants={reduce ? REDUCED_DECK : DECK_MOTION}
      initial="enter"
      animate="center"
      exit="exit"
      drag={reduce ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      dragTransition={{ bounceStiffness: 500, bounceDamping: 40 }}
      onPointerDown={() => {
        moved.current = false;
      }}
      onDragStart={() => {
        moved.current = true;
        onDragStart();
      }}
      onDragEnd={(_, info) => {
        const { offset, velocity } = info;
        // Mostly sideways, and either far enough or fast enough. A flick
        // must also have gone the way it was thrown: a print dragged right
        // and let go while drifting left is a swipe right.
        const sideways = Math.abs(offset.x) > Math.abs(offset.y) * 0.6;
        const far = Math.abs(offset.x) > SWIPE_DISTANCE;
        const fast =
          Math.abs(velocity.x) > SWIPE_SPEED &&
          Math.abs(offset.x) > 12 &&
          Math.sign(velocity.x) === Math.sign(offset.x);
        if (sideways && (far || fast)) onAdvance(offset.x < 0 ? 1 : -1);
      }}
      onTap={() => {
        if (!moved.current) onAdvance(1);
      }}>
      {/* The print keeps every touch that starts on it (see above). It is
          said here and not on the card, because a card that drags along x
          is given `pan-y` by the motion library whatever its own style
          asks for; the browser honours the strictest answer between a
          touch's target and its ancestors, and this one is the strictest. */}
      <motion.div style={{ rotate: reduce ? 0 : tilt, touchAction: 'none' }}>
        <RollPrint
          src={photo.src}
          size="card"
          stamp={photo.stamp}
          shooter={null}
        />
      </motion.div>
    </motion.div>
  );
}
