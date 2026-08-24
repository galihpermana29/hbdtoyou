'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import BackPill from '../ui/back-pill';
import Cta from '../ui/cta';
import RollPrint from './print';
import type { GalleryPhoto } from './roll';

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
}: {
  photos: GalleryPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  showSwipeCue: boolean;
  onSwipeCueSeen: () => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [direction, setDirection] = useState(1);

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
          the demo renders the product in. */}
      <div className="mx-auto flex h-full w-full max-w-[430px] flex-col">
        <div className="flex items-center px-[16px] pt-[50px]">
          <BackPill onClick={onClose} label="Back to the gallery" />
        </div>

        <div className="relative mx-auto mt-[60px] h-[374px] w-[334px]">
          {behind.map(({ neighbour, pose }, layer) => (
            <RollPrint
              key={`behind-${layer}`}
              src={neighbour.src}
              size="card"
              blur={pose.blur}
              stamp={neighbour.stamp}
              shooter={neighbour.shooter}
              className="absolute w-[296px]"
              style={{
                left: pose.left,
                top: pose.top,
                transform: `rotate(${pose.rotate}deg)`,
              }}
            />
          ))}

          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={photo.id}
              className="absolute w-[296px] cursor-grab active:cursor-grabbing"
              style={{ left: DECK[2].left, top: DECK[2].top }}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * 120, rotate: direction * 8 }
              }
              animate={{ opacity: 1, x: 0, rotate: DECK[2].rotate }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      x: direction * -260,
                      rotate: direction * -10,
                    }
              }
              transition={
                reduce
                  ? { duration: 0.12, ease: EASE }
                  : { type: 'spring', stiffness: 260, damping: 24 }
              }
              drag={reduce ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragStart={onSwipeCueSeen}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80 || info.velocity.x < -500) advance(1);
                else if (info.offset.x > 80 || info.velocity.x > 500)
                  advance(-1);
              }}
              onTap={() => advance(1)}>
              <RollPrint
                src={photo.src}
                size="card"
                stamp={photo.stamp}
                shooter={null}
              />
            </motion.div>
          </AnimatePresence>

          {/* Once the wiggle has run its three passes the cue counts itself
              as seen: a hand parked forever stops being a cue. Under reduced
              motion it holds still instead and leaves on first touch. */}
          <AnimatePresence>
            {showSwipeCue && (
              <motion.span
                className="pointer-events-none absolute left-[167px] top-[219px] block w-[107px]"
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

        <div className="mt-[27px] flex justify-center">
          <Cta onClick={ask} className="w-[276px]">
            Who took this?
          </Cta>
        </div>
      </div>
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
