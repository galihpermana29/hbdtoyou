'use client';

/**
 * Wedding Template 1 - Messages. Figma node 312:1742.
 * A scrollable list of Guest Messages on paper-textured cards with a fade-out
 * gradient at the bottom, which lets go as the list reaches its end, and a
 * scrollbar to the right that says where in the list a guest has reached and
 * scrolls it when dragged.
 * Animation: the title and each card fade up in a gentle stagger on scroll.
 *
 * The five the design draws are its own example wedding's. A reply left on an
 * invitation nobody was sent - the Showcase, the Create Flow's previews - adds
 * its message to the top of them until the page is reloaded, because there is
 * nowhere else for it to go.
 *
 * A guest replying on their own invitation is answered by the couple's backend
 * instead, and their message does not appear here: it is the couple's to read,
 * and a message on this wall would tell the guest their words were on the
 * invitation when only the couple can see them. See `RsvpCard.tsx`.
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
import type { Rsvp } from './RsvpCard';

const ASSET = '/templates/wedding-template-1';

/**
 * The height the design gives the list a guest reads through, and the track
 * beside it: Figma node 312:1746, 509 tall at y=131 in a 695-tall section.
 *
 * It is the design's height rather than the content's. The design draws five
 * messages and they fill it exactly, so a sixth is below the fold and is
 * reached by scrolling - which is the whole of what this section does.
 */
const LIST_HEIGHT = 509;

/**
 * The shortest the thumb is ever drawn, so that a couple with a hundred guests
 * still has a scrollbar somebody can see and take hold of.
 */
const MIN_THUMB_HEIGHT = 24;

/**
 * The height of the fade the design lays over the foot of the list: Figma node
 * 312:1785, 105 tall.
 *
 * It is also how far from the end the fade begins letting go, because the two
 * are the same distance. A fade at the foot of a list says there is more below
 * it; the messages it says that about are the ones under the band, so once
 * fewer than 105px of list are left below the fold the band is partly lying
 * over the last wish and nothing else, and by the end it is lying entirely.
 */
const FADE_HEIGHT = 105;

/**
 * How near an end counts as being at it.
 *
 * A pixel, because that is the resolution the list is reported at: `scrollTop`
 * is fractional and `scrollHeight` is a whole number rounded from something
 * that was not, so a list scrolled all the way down can still read as having a
 * fraction of a pixel to go. Without this the fade would park just short of
 * letting go and never quite arrive.
 */
const AT_AN_END = 1;

/**
 * The strength of that fade for a list scrolled this far, from 1 where the
 * design draws it to 0 at the end of the list.
 *
 * `below` is how much list is left under the fold and `scrollable` is how much
 * there was to begin with. It lets go over the last `FADE_HEIGHT` of the
 * scroll, or over the whole of it where there is less than that to scroll,
 * which is what keeps a list at rest at the design's own full strength whatever
 * the couple's wishes are: the design's five all but fill the box - they leave
 * 2px to scroll - so a band that let go over a fixed 105 would be gone from the
 * very frame the design draws, and `hbd-a09.8` says the design's fade stays.
 *
 * A list with nothing to scroll is that frame and nothing else. It is drawn as
 * the design draws it: what the band is dimming there is the design's own
 * decision about its own content, which this is not the bead to overturn.
 */
function fadeStrength(below: number, scrollable: number): number {
  if (scrollable <= AT_AN_END) return 1;
  if (below <= AT_AN_END) return 0;
  return Math.min(1, below / Math.min(FADE_HEIGHT, scrollable));
}

/** One guest's message, as the invitation prints it. */
export type GuestMessage = {
  name: string;
  date: string;
  message: string;
};

/**
 * The five the design draws, which are its own example wedding's.
 *
 * They stay: they are what the section looks like before anybody has replied,
 * and what a couple is shown when they choose the template. A guest's own
 * message joins them rather than replacing them.
 */
const DESIGNED_MESSAGES: GuestMessage[] = [
  {
    name: 'Anin',
    date: '05-04-2026 00:21',
    message:
      'So happy to celebrate your big day! Wishing you both a lifetime of love and laughter.',
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

/**
 * How the design dates a Guest Message: `05-04-2026 00:21`, node 312:1749.
 * Day, month, year, then the hour and minute the guest replied at.
 */
function formatGuestMessageDate(at: Date): string {
  const two = (part: number) => String(part).padStart(2, '0');
  return (
    `${two(at.getDate())}-${two(at.getMonth() + 1)}-${at.getFullYear()} ` +
    `${two(at.getHours())}:${two(at.getMinutes())}`
  );
}

/**
 * Every Guest Message the invitation has, newest first.
 *
 * A guest who has just replied is put at the top rather than at the end,
 * because the list is 509 tall and holds the design's five exactly: a sixth
 * appended below the fold would be a reply a guest was told had arrived and
 * then could not see. An RSVP with nothing written in it is not a Guest
 * Message at all - the design marks that field Optional, and a card with a
 * name and no words would be a stranger saying nothing.
 */
function guestMessagesIn(rsvps: Rsvp[]): GuestMessage[] {
  const written = rsvps
    .filter((rsvp) => rsvp.message !== '')
    .map((rsvp) => ({
      name: rsvp.name,
      date: formatGuestMessageDate(rsvp.repliedAt),
      message: rsvp.message,
    }))
    .reverse();

  return [...written, ...DESIGNED_MESSAGES];
}

/**
 * One Guest Message on its paper card.
 *
 * `bordered` is the white outline the design draws around the first card and
 * no other, node 312:1747. It is drawn by where a message sits rather than
 * carried by the message, so it stays on the newest one once a guest has left
 * theirs - which is the same card the design put it on.
 */
function GuestMessageCard({
  name,
  date,
  message,
  bordered,
}: GuestMessage & { bordered: boolean }) {
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
        <div className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px] leading-[normal] text-black [word-break:break-word]">
          <p className="relative w-full shrink-0 font-[family-name:var(--font-wt1-mono)] text-[16px] font-semibold">
            {name}
          </p>
          <p className="relative w-full shrink-0 font-[family-name:var(--font-wt1-mono)] text-[10px] font-normal">
            {date}
          </p>
        </div>
      </div>
      <p className="relative w-full shrink-0 font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-black [word-break:break-word]">
        {message}
      </p>
    </motion.div>
  );
}

/** Where the scrollbar's thumb is drawn in its track, in pixels. */
type Thumb = { height: number; top: number };

/** How far down the list is, as the two marks that report it draw themselves. */
type Reading = { thumb: Thumb; fade: number };

/**
 * A list nobody has scrolled: a thumb filling its track, and the fade at its
 * full strength, which is the design's own frame.
 *
 * It is what the server renders too, because nothing on the server knows how
 * tall a message sets. The list is measured for real before the first paint, so
 * this is a frame the design draws rather than a guess a guest ever reads
 * through - and a guest whose JavaScript never runs is left with it.
 */
const AT_REST: Reading = { thumb: { height: LIST_HEIGHT, top: 0 }, fade: 1 };

/**
 * What the list's own measurements say its scrollbar and its fade are.
 *
 * The design draws the thumb as a rectangle in a track and says nothing about
 * how it moves, so what it says here is the ordinary thing: the thumb takes as
 * much of the track as the visible list takes of the whole list, and sits as
 * far down the track as the list is scrolled.
 *
 * `fade` is the strength of the band over the foot of the list, and it follows
 * the same reading: full while a fade's worth of messages is still below the
 * fold, then letting go in step with what is left, and gone once nothing is -
 * because a band at the foot of a list promises more below, and at the end of
 * the list there is none to promise.
 *
 * `travel` is how far the thumb has to move to say all of that, and `scrollable`
 * is how much list it is saying it about. Both come from here rather than from
 * wherever they are wanted, because a drag that scaled them differently from the
 * way the thumb is drawn would slide out from under the finger holding it.
 */
function readingFor(box: HTMLDivElement) {
  const track = box.clientHeight;
  const visible = box.scrollHeight > 0 ? track / box.scrollHeight : 1;
  const height = Math.max(MIN_THUMB_HEIGHT, Math.min(track, track * visible));
  const scrollable = box.scrollHeight - track;
  const travel = track - height;
  const top = scrollable > 0 ? (travel * box.scrollTop) / scrollable : 0;
  const below = Math.max(0, scrollable - box.scrollTop);

  return {
    thumb: { height, top },
    fade: fadeStrength(below, scrollable),
    scrollable,
    travel,
  };
}

/**
 * Keeps the scrollbar and the fade reporting where the list of Guest Messages
 * actually is, and scrolls the list when the thumb is dragged - which is what
 * separates a scrollbar from a picture of one.
 */
function useMessagesScrollbar() {
  const viewport = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [reading, setReading] = useState<Reading>(AT_REST);
  const grab = useRef<{ atClientY: number; scrolledTo: number } | null>(null);

  const measure = useCallback(() => {
    const box = viewport.current;
    if (!box) return;
    const { thumb, fade } = readingFor(box);
    setReading({ thumb, fade });
  }, []);

  useLayoutEffect(() => {
    const box = viewport.current;
    const messages = list.current;
    if (!box || !messages) return;

    // Measured here rather than left to the observer's first callback, which
    // arrives after a frame has been painted: a guest would see the thumb
    // filling the whole track and then jump.
    measure();

    // Both are watched. The box a guest reads through changes size with the
    // window, and the list inside it changes size when a message is left, when
    // a long one wraps to another line, and when the template's fonts land and
    // every card reflows under them.
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(messages);
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

    // One pixel of thumb is worth however many pixels of messages are hidden.
    const { scrollable, travel } = readingFor(box);
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

  return {
    viewport,
    list,
    thumb: reading.thumb,
    fade: reading.fade,
    measure,
    startDrag,
    dragTo,
    endDrag,
  };
}

export default function Messages({
  rsvps = [],
}: {
  /** The replies this page has taken, which the invitation prints on its own. */
  rsvps?: Rsvp[];
}) {
  const fadeUpCenterReveal = useWeddingReveal(fadeUpCenter);
  const staggerReveal = useWeddingReveal(staggerContainer);
  const { viewport, list, thumb, fade, measure, startDrag, dragTo, endDrag } =
    useMessagesScrollbar();
  const messages = guestMessagesIn(rsvps);

  return (
    <section className="relative h-[695px] w-full overflow-hidden bg-[#090909]">
      {/* section title */}
      <motion.div
        className="absolute left-[calc(50%+0.5px)] top-[60px] h-[31px] w-[142px]"
        {...fadeUpCenterReveal}>
        <p className="absolute left-[12px] top-0 w-[123px] font-[family-name:var(--font-wt1-script)] text-[48px] leading-[normal] text-[rgba(250,250,250,0.98)]">
          Messages
        </p>
        <div className="absolute left-0 top-[50px] h-px w-[142px] bg-[#fafafa]" />
      </motion.div>

      {/* Guest Messages list + scrollbar */}
      <div
        className="absolute left-[16px] top-[131px] flex w-[343px] items-start gap-[4px]"
        style={{ height: LIST_HEIGHT }}>
        {/*
          The list scrolls on its own axis inside the box the design draws, and
          its own scrollbar is hidden: the design draws one beside the list
          rather than over it, 4px wide, which no browser can be asked for.
          `tabIndex` is what lets a guest who is not holding a mouse reach the
          messages past the fold.
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
            {messages.map((message, i) => (
              <GuestMessageCard key={i} {...message} bordered={i === 0} />
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

      {/*
        The fade the design lays over the foot of the list, node 312:1785. Both
        its stops sit OUTSIDE the box: solving the node's gradientTransform puts
        the first at normalised y=1.0667, just below the bottom edge, and the
        second at y=-0.9429, above the top edge. Measured up from the bottom
        edge, the way `to top` measures, that is -6.67% and 194.29% - so the
        bottom edge is itself already a little way into the fade, at 0.773 alpha
        rather than the stop's own 0.8. Dropping the first stop's minus sign
        clamps it back to 0.8 and darkens that edge. The check asserts the
        gradient, stops and all, so flipping the sign is a red run rather than
        a quiet darkening.

        `aria-hidden` is what the check finds the box by - the one decorative
        veil in the section that owns the scrollable list - and it is true
        anyway: the band says nothing a screen reader should read over the
        wishes beneath it.

        `opacity` is what keeps it honest now that the list scrolls: the band
        promises more below, and at the end of the list there is none, so it
        would be dimming the last wish to say something untrue. A guest still
        meets the section in the design's own frame, because a list at rest is
        always at full strength - see `fadeStrength`.

        The transition is for the shortest scroll rather than the longest. A
        list with 2px to go, which is what the design's own five leave, hands
        the band its whole range in one notch of a wheel, and the band should
        lift off the last wish rather than blink off it. Over a longer scroll it
        is short enough to read as the band keeping up.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[16px] top-[536px] w-[335px]"
        style={{
          height: FADE_HEIGHT,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.8) -6.67%, rgba(102,102,102,0) 194.29%)',
          opacity: fade,
          transition: 'opacity 150ms ease-out',
        }}
      />
    </section>
  );
}
