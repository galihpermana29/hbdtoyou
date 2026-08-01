'use client';

/**
 * Wedding Template 1 - Messages. Figma node 312:1742.
 * A scrollable list of guest wishes on paper-textured cards with a fade-out
 * gradient at the bottom and a scrollbar to the right that says where in the
 * list a guest has reached and scrolls it when dragged.
 * Animation: the title and each wish card fade up in a gentle stagger on scroll.
 */

import { motion } from 'framer-motion';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import { fadeUp, fadeUpCenter, staggerContainer } from './variants';
import { useWeddingReveal } from './use-wedding-reveal';

const ASSET = '/templates/wedding-template-1';

/**
 * The height the design gives the list a guest reads through, and the track
 * beside it: Figma node 312:1746, 509 tall at y=131 in a 695-tall section.
 *
 * It is the design's height rather than the content's. The design draws five
 * wishes and they fill it exactly, so a sixth wish is below the fold and is
 * reached by scrolling - which is the whole of what this section does.
 */
const LIST_HEIGHT = 509;

/**
 * The shortest the thumb is ever drawn, so that a couple with a hundred guests
 * still has a scrollbar somebody can see and take hold of.
 */
const MIN_THUMB_HEIGHT = 24;

type Wish = {
  name: string;
  date: string;
  message: string;
  bordered?: boolean;
};

const wishes: Wish[] = [
  {
    name: 'Anin',
    date: '05-04-2026 00:21',
    message:
      'So happy to celebrate your big day! Wishing you both a lifetime of love and laughter.',
    bordered: true,
  },
  {
    name: 'John',
    date: '05-04-2026 00:21',
    message:
      'Cheers to the new Mr. and Mrs.! May your journey together be full of joy.',
  },
  {
    name: 'Jane',
    date: '05-04-2026 00:21',
    message:
      'Cheers to the new Mr. and Mrs.! May your journey together be full of joy.',
  },
  {
    name: 'Ari',
    date: '05-04-2026 00:21',
    message:
      'Happy wedding day! Can’t wait to see what the future holds for you both.',
  },
  {
    name: 'Zidane',
    date: '05-04-2026 00:21',
    message:
      'Cheers to the new Mr. and Mrs.! May your journey together be full of joy.',
  },
];

function WishCard({ name, date, message, bordered }: Wish) {
  return (
    <motion.div
      variants={fadeUp}
      className={`relative flex w-full shrink-0 flex-col items-start gap-[8px] rounded-[2px] px-[12px] py-[10px] ${
        bordered ? 'border border-solid border-white' : ''
      }`}>
      <img
        alt=""
        className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[2px] object-cover"
        src={`${ASSET}/paper.jpg`}
      />
      <div className="relative flex w-full shrink-0 items-start gap-[12px]">
        <div className="relative size-[24px] shrink-0">
          <img
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            height="24"
            width="24"
            src={`${ASSET}/messages-avatar.png`}
          />
        </div>
        <div className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px] leading-normal text-black [word-break:break-word]">
          <p className="relative w-full shrink-0 font-[family-name:var(--font-wt1-mono)] text-[16px] font-semibold">
            {name}
          </p>
          <p className="relative w-full shrink-0 font-[family-name:var(--font-wt1-mono)] text-[10px] font-normal">
            {date}
          </p>
        </div>
      </div>
      <p className="relative w-full shrink-0 font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-normal text-black [word-break:break-word]">
        {message}
      </p>
    </motion.div>
  );
}

/** Where the scrollbar's thumb is drawn in its track, in pixels. */
type Thumb = { height: number; top: number };

/**
 * A thumb filling its track, which is what a list with nothing to scroll has.
 *
 * It is what the server renders too, because nothing on the server knows how
 * tall a wish sets. The list is measured for real before the first paint.
 */
const NOTHING_TO_SCROLL: Thumb = { height: LIST_HEIGHT, top: 0 };

/**
 * What the list's own measurements say its scrollbar is.
 *
 * The design draws the thumb as a rectangle in a track and says nothing about
 * how it moves, so what it says here is the ordinary thing: the thumb takes as
 * much of the track as the visible list takes of the whole list, and sits as
 * far down the track as the list is scrolled.
 *
 * `travel` is how far the thumb has to move to say all of that, and `scrollable`
 * is how much list it is saying it about. Both come from here rather than from
 * wherever they are wanted, because a drag that scaled them differently from the
 * way the thumb is drawn would slide out from under the finger holding it.
 */
function scrollbarFor(box: HTMLDivElement) {
  const track = box.clientHeight;
  const visible = box.scrollHeight > 0 ? track / box.scrollHeight : 1;
  const height = Math.max(MIN_THUMB_HEIGHT, Math.min(track, track * visible));
  const scrollable = box.scrollHeight - track;
  const travel = track - height;
  const top = scrollable > 0 ? (travel * box.scrollTop) / scrollable : 0;

  return { thumb: { height, top }, scrollable, travel };
}

/**
 * Keeps the scrollbar reporting where the list of wishes actually is, and
 * scrolls the list when the thumb is dragged - which is what separates a
 * scrollbar from a picture of one.
 */
function useWishesScrollbar() {
  const viewport = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<Thumb>(NOTHING_TO_SCROLL);
  const grab = useRef<{ atClientY: number; scrolledTo: number } | null>(null);

  const measure = useCallback(() => {
    const box = viewport.current;
    if (box) setThumb(scrollbarFor(box).thumb);
  }, []);

  useLayoutEffect(() => {
    const box = viewport.current;
    const wishes = list.current;
    if (!box || !wishes) return;

    // Measured here rather than left to the observer's first callback, which
    // arrives after a frame has been painted: a guest would see the thumb
    // filling the whole track and then jump.
    measure();

    // Both are watched. The box a guest reads through changes size with the
    // window, and the list inside it changes size when a wish is left, when a
    // long one wraps to another line, and when the template's fonts land and
    // every card reflows under them.
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(wishes);
    return () => observer.disconnect();
  }, [measure]);

  const startDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const box = viewport.current;
    if (!box) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    grab.current = { atClientY: event.clientY, scrolledTo: box.scrollTop };
  }, []);

  const dragTo = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const held = grab.current;
    const box = viewport.current;
    if (!held || !box) return;

    // One pixel of thumb is worth however many pixels of wishes are hidden.
    const { scrollable, travel } = scrollbarFor(box);
    if (travel <= 0 || scrollable <= 0) return;

    box.scrollTop =
      held.scrolledTo +
      ((event.clientY - held.atClientY) * scrollable) / travel;
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    grab.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  return { viewport, list, thumb, measure, startDrag, dragTo, endDrag };
}

export default function Messages() {
  const fadeUpCenterReveal = useWeddingReveal(fadeUpCenter);
  const staggerReveal = useWeddingReveal(staggerContainer);
  const { viewport, list, thumb, measure, startDrag, dragTo, endDrag } =
    useWishesScrollbar();

  return (
    <section className="relative h-[695px] w-full overflow-hidden bg-[#090909]">
      {/* section title */}
      <motion.div
        className="absolute left-[calc(50%+0.5px)] top-[60px] h-[31px] w-[142px]"
        {...fadeUpCenterReveal}
      >
        <p className="absolute left-[12px] top-0 w-[123px] font-[family-name:var(--font-wt1-script)] text-[48px] leading-normal text-[rgba(250,250,250,0.98)]">
          Messages
        </p>
        <div className="absolute left-0 top-[50px] h-px w-[142px] bg-[#fafafa]" />
      </motion.div>

      {/* wishes list + scrollbar */}
      <div
        className="absolute left-[16px] top-[131px] flex w-[343px] items-start gap-[4px]"
        style={{ height: LIST_HEIGHT }}>
        {/*
          The list scrolls on its own axis inside the box the design draws, and
          its own scrollbar is hidden: the design draws one beside the list
          rather than over it, 4px wide, which no browser can be asked for.
          `tabIndex` is what lets a guest who is not holding a mouse reach the
          wishes past the fold.
        */}
        <motion.div
          ref={viewport}
          onScroll={measure}
          // Measured again once the cards have finished arriving: a card still
          // sliding up into place is offset below where it comes to rest, and
          // adds that travel to the length of the list until it lands.
          onAnimationComplete={measure}
          tabIndex={0}
          role="region"
          aria-label="Messages from guests"
          className="h-full min-w-px flex-[1_0_0] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          {...staggerReveal}>
          <div ref={list} className="flex flex-col items-start gap-[16px]">
            {wishes.map((wish, i) => (
              <WishCard key={i} {...wish} />
            ))}
          </div>
        </motion.div>

        {/* scrollbar */}
        <div className="relative h-full w-[4px] shrink-0 overflow-clip bg-[#4a4a4a]">
          <div
            className="absolute left-0 w-[4px] bg-[#7b7b7b]"
            style={{ height: thumb.height, top: thumb.top }}
          />
        </div>

        {/*
          What a guest takes hold of, drawn nowhere. The design gives the thumb
          4px of width, which is too little to catch with a mouse, so what
          receives the drag is the thumb's height and a few pixels of reach
          either side of it. It cannot be part of the thumb: the track clips its
          contents, as the design says it does, and a clipped edge takes no
          pointer with it.
        */}
        <div
          className="absolute right-[-8px] w-[16px] touch-none"
          style={{ height: thumb.height, top: thumb.top }}
          onPointerDown={startDrag}
          onPointerMove={dragTo}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
      </div>

      {/* bottom fade-out gradient */}
      <div
        className="pointer-events-none absolute left-[16px] top-[536px] h-[105px] w-[335px]"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.8) 6.667%, rgba(102,102,102,0) 194.29%)',
        }}
      />
    </section>
  );
}
