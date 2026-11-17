'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useCalmMotion } from '@/lib/use-calm-motion';

import { EASE_IN_OUT, EASE_OUT } from './ui';

/**
 * The home hero's signature motion: a deck of real gifts that flips itself.
 *
 * MemoRoll's hero is an arc of prints going round; this is its sibling for
 * the core product. The same memories can be given as a series page, a
 * playlist, a magazine, a front page, a scrapbook or a game - so the deck
 * shows exactly that: the front gift drops away, the ones behind step
 * forward, and the headline's last word changes with it (hero.tsx owns the
 * beat, so word and card are one gesture).
 *
 * How it is built (emilkowalski/skills: animate + choreograph):
 * - CSS transitions on `transform` and `opacity` only, so a click mid-flight
 *   retargets instead of restarting, and the page stays smooth while loading;
 * - cards stepping forward are on-screen movement: the strong ease-in-out;
 *   the front card leaving is an exit: the strong ease-out, and shorter;
 * - the leaving card fades out below the deck, then is put at the back
 *   while invisible, so nothing is ever seen travelling through the stack;
 * - the deck's entrance is the deck itself fanning open, lead card first,
 *   with gaps that shrink - there is no second, outer entrance;
 * - the beat is the progress pill's own CSS animation: pausing it (pointer
 *   over the deck, deck off screen) pauses the autoplay with it, and the two
 *   can never drift;
 * - the tilt under the pointer is decoration, so it is a spring, and only
 *   for a real pointer; reduced motion keeps a crossfade and drops the rest.
 *
 * The pictures are the product's own template thumbnails, cropped.
 */

export interface Gift {
  key: string;
  /** What the memories become, as the headline says it: "a series". */
  word: string;
  src: string;
  address: string;
  alt: string;
}

export const GIFTS: Gift[] = [
  {
    key: 'series',
    word: 'a series',
    src: '/home/gift-series.webp',
    address: 'memoify.live/your-series',
    alt: 'A gift made as the page of a streaming series',
  },
  {
    key: 'playlist',
    word: 'a playlist',
    src: '/home/gift-playlist.webp',
    address: 'memoify.live/your-playlist',
    alt: 'A gift made as a music playlist',
  },
  {
    key: 'magazine',
    word: 'a magazine',
    src: '/home/gift-magazine.webp',
    address: 'memoify.live/your-magazine',
    alt: 'A gift made as a magazine spread',
  },
  {
    key: 'frontpage',
    word: 'front-page news',
    src: '/home/gift-frontpage.webp',
    address: 'memoify.live/your-front-page',
    alt: 'A gift made as a newspaper front page',
  },
  {
    key: 'scrapbook',
    word: 'a scrapbook',
    src: '/home/gift-scrapbook.webp',
    address: 'memoify.live/your-scrapbook',
    alt: 'A gift made as a scrapbook',
  },
  {
    key: 'game',
    word: 'a game',
    src: '/home/gift-game.webp',
    address: 'memoify.live/your-game',
    alt: 'A gift made as a claw-machine game',
  },
];

/** How long one gift leads before the deck flips, in ms. */
const BEAT_MS = 3400;
/** Slots that can be seen; the two behind them are the wings. */
const VISIBLE = 4;
const OPACITY = [1, 1, 1, 0.72];
/** The fan's opening wave: lead first, gaps shrinking. */
const DEAL_DELAY = [0, 80, 130, 160];

/** The beat every part of the hero follows: which gift leads, and stepping. */
export function useGiftBeat() {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  // The leading gift, readable without waiting for a render.
  const lead = useRef(0);

  /** The front gift drops away and the next leads. */
  const next = useCallback(() => {
    const current = lead.current;
    lead.current = (current + 1) % GIFTS.length;
    setActive(lead.current);
    setLeaving((all) => (all.includes(current) ? all : [...all, current]));
    // Once it has faded below the deck it is put at the back, unseen.
    const timer = window.setTimeout(() => {
      setLeaving((all) => all.filter((index) => index !== current));
    }, 480);
    timers.current.push(timer);
  }, []);

  /** Straight to a gift, from its pill. */
  const jump = useCallback(
    (index: number) => {
      const current = lead.current;
      if (index === current) return;
      // One step on is the ordinary flip.
      if (index === (current + 1) % GIFTS.length) return next();
      lead.current = index;
      setActive(index);
    },
    [next]
  );

  return { active, leaving, next, jump };
}

export default function GiftDeck({
  active,
  leaving,
  onNext,
  onJump,
}: {
  active: number;
  leaving: number[];
  onNext: () => void;
  onJump: (index: number) => void;
}) {
  const reduce = useCalmMotion();
  const count = GIFTS.length;
  const frame = useRef<HTMLDivElement>(null);
  const onScreen = useInView(frame, { amount: 0.35 });
  const [hovered, setHovered] = useState(false);

  // The fan opens once, after the first paint.
  const [dealt, setDealt] = useState(false);
  const [dealing, setDealing] = useState(true);
  useEffect(() => {
    const open = requestAnimationFrame(() => setDealt(true));
    const settle = window.setTimeout(() => setDealing(false), 1100);
    return () => {
      cancelAnimationFrame(open);
      window.clearTimeout(settle);
    };
  }, []);

  // Decoration: the deck leans a little toward a real pointer.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 120, damping: 18 });
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);
  const lean = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!fine || reduce) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    tiltY.set(x * 7);
    tiltX.set(-y * 5);
  };
  const settle = () => {
    tiltX.set(0);
    tiltY.set(0);
    setHovered(false);
  };

  const running = !reduce && onScreen && !hovered;

  return (
    <div className="mx-auto w-full max-w-[860px] [--peek:16px] md:[--peek:26px]">
      <div
        ref={frame}
        role="group"
        aria-label="Examples of gifts made with Memoify"
        onPointerMove={lean}
        onPointerEnter={() => fine && setHovered(true)}
        onPointerLeave={settle}
        className="relative pt-[calc(var(--peek)*3)]"
        style={{ perspective: 1400 }}>
        <motion.div
          className="relative aspect-[1040/648]"
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
          {GIFTS.map((gift, index) => {
            const position = (index - active + count) % count;
            const isLeaving = leaving.includes(index);
            const front = position === 0 && !isLeaving;
            const seen = position < VISIBLE;
            // Where it rests: each slot back sits higher and a little smaller.
            const slot = Math.min(position, VISIBLE);
            let transform = `translate3d(0, calc(var(--peek) * ${-slot}), 0) scale(${1 - slot * 0.06})`;
            let opacity = seen ? OPACITY[position] : 0;
            let transition = `transform 720ms ${EASE_IN_OUT}, opacity 520ms ${EASE_OUT}`;
            if (reduce) {
              // A crossfade in place: no travel.
              transform = 'none';
              opacity = front ? 1 : 0;
              transition = `opacity 200ms ${EASE_OUT}`;
            } else if (!dealt) {
              transform = 'translate3d(0, 28px, 0) scale(0.97)';
              opacity = 0;
              transition = 'none';
            } else if (isLeaving) {
              // The exit: down and toward the viewer, gone before it lands.
              transform = 'translate3d(0, 16%, 0) scale(1.05) rotate(-1.5deg)';
              opacity = 0;
              transition = `transform 460ms ${EASE_OUT}, opacity 320ms ${EASE_OUT}`;
            } else if (position === count - 1) {
              // Just put at the back: it was invisible and stays so.
              transition = 'none';
            } else if (dealing && seen) {
              transition = `transform 760ms ${EASE_OUT} ${DEAL_DELAY[position]}ms, opacity 520ms ${EASE_OUT} ${DEAL_DELAY[position]}ms`;
            }
            return (
              <div
                key={gift.key}
                aria-hidden={!front}
                className="absolute inset-0 origin-top will-change-transform"
                style={{
                  transform,
                  opacity,
                  transition,
                  zIndex: isLeaving ? count + 1 : count - position,
                  pointerEvents: front ? 'auto' : 'none',
                }}>
                <button
                  type="button"
                  tabIndex={front ? 0 : -1}
                  onClick={onNext}
                  aria-label={`${gift.alt}. Show the next gift`}
                  className="group block h-full w-full overflow-hidden rounded-[14px] border border-black/10 bg-[#f4f1ed] text-left shadow-[0_28px_56px_-24px_rgba(90,42,18,0.38)] md:rounded-[20px]">
                  <span className="flex h-[9%] min-h-[22px] items-center gap-[5px] border-b border-black/10 bg-[#f4f1ed] px-3 md:px-4">
                    <span className="size-[7px] rounded-full bg-[#ff3e09] md:size-[9px]" />
                    <span className="size-[7px] rounded-full bg-[#e0dabf] md:size-[9px]" />
                    <span className="size-[7px] rounded-full bg-[#e0dabf] md:size-[9px]" />
                    <span className="mx-auto truncate rounded-full bg-white px-3 py-[2px] text-[9px] font-medium text-[#8a847d] md:px-8 md:text-[11px]">
                      {gift.address}
                    </span>
                    <span className="w-[31px] md:w-[37px]" />
                  </span>
                  <img
                    src={gift.src}
                    alt=""
                    width={1040}
                    height={594}
                    decoding="async"
                    // The lead paints first; the rest of the deck can wait.
                    loading={index < 2 ? 'eager' : 'lazy'}
                    draggable={false}
                    className="block h-[91%] w-full object-cover object-top"
                  />
                </button>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* The beat: one pill per gift, the leading one filling as it plays. */}
      <div className="mt-6 flex items-center justify-center gap-[6px]">
        {GIFTS.map((gift, index) => {
          const on = index === active;
          return (
            <button
              key={gift.key}
              type="button"
              onClick={() => onJump(index)}
              aria-label={`Show the gift made as ${gift.word}`}
              aria-current={on}
              className="group flex h-6 items-center">
              <span className="relative block h-[5px] w-7 overflow-hidden rounded-full bg-[#e3d8cb]">
                {on ? (
                  <span
                    key={active}
                    onAnimationEnd={onNext}
                    className="absolute inset-0 origin-left rounded-full bg-[#ff3e09]"
                    style={
                      reduce
                        ? undefined
                        : {
                            animation: `home-beat ${BEAT_MS}ms linear both`,
                            animationPlayState: running ? 'running' : 'paused',
                          }
                    }
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
