'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import {
  CENTRED,
  drawFilmStory,
  FILM_SLOTS,
  FILM_STORY_HEIGHT,
  FILM_STORY_WIDTH,
  filmCountFor,
  moveFraming,
  slotAt,
  type Framing,
} from '@/lib/memoroll-story-film';
import Cta from '../ui/cta';
import { REDUCED, SHEET_IN, SHEET_OUT } from '../ui/motion';
import { useSheetDrag } from '../ui/sheet-drag';
import { body } from '../ui/fonts';
import { colour } from '../ui/tokens';
import type { GalleryPhoto } from './roll';

/**
 * Share to an Instagram Story (owner, 2026-11-12): the Story is drawn here,
 * previewed, and handed to the phone's share sheet - where Instagram offers
 * "Story" - or saved, where a browser has no sheet for files.
 *
 * Two ways in, one sheet:
 * - a single print, from the photo preview;
 * - the guest's Roll (`roll`), from My Roll: one to four of their own prints
 *   (owner, 2026-11-14: "boleh juga dia pilih 1"), the count theirs to pick
 *   and Shuffle to swap which prints go in.
 *
 * The Story is the designed film strip (src/lib/memoroll-story-film.ts). The
 * paper/darkroom/flame drafts it replaced are still in memoroll-story.ts but
 * no longer offered (owner: hide them, do not delete them).
 *
 * Each print can be slid and pinched inside its window (owner, 2026-11-14),
 * never so far that the window shows past its edge; a double tap puts it
 * back in the middle. No swapping prints between windows - kept simple on
 * purpose (owner).
 *
 * Only prints the guest can already see reach this sheet - the preview hands
 * visible prints alone, My Roll hands the guest's own - so a veiled Shot
 * never leaves.
 */
export default function StorySheet({
  photos,
  eventName,
  eventDate,
  roll = false,
  onClose,
}: {
  /** The print to share, or - with `roll` - the guest's own to pick from. */
  photos: GalleryPhoto[];
  eventName: string;
  /** The event's day, printed on the strip. */
  eventDate: Date;
  roll?: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const most = Math.min(4, photos.length);
  const { backdropOpacity, dragProps } = useSheetDrag(onClose);
  const [count, setCount] = useState(roll ? Math.min(3, most) : 1);
  /** Which of the guest's prints go in, in order; Shuffle redraws it. */
  const [order, setOrder] = useState<number[]>(() =>
    photos.map((_, index) => index)
  );
  /** Each window's framing, by layout, window and print: changing the count
   *  or the prints starts those windows centred again. */
  const [framings, setFramings] = useState<Record<string, Framing>>({});
  const [images, setImages] = useState<ImageBitmap[] | null>(null);
  const [story, setStory] = useState<Blob | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Pixels already fetched, by print - a reshuffle never fetches twice. */
  const bitmaps = useRef(new Map<string, ImageBitmap>());
  const fontsReady = useRef<Promise<unknown> | null>(null);
  /** Loads can overlap when choices change quickly; only the last counts. */
  const generation = useRef(0);

  const chosen = roll
    ? order.slice(0, count).map((index) => photos[index])
    : photos.slice(0, 1);
  const chosenKey = chosen.map((photo) => photo.id).join(',');
  const layout = filmCountFor(chosen.length);
  const keyOf = (slot: number) => `${layout}:${slot}:${chosen[slot]?.id}`;
  const framingsNow = chosen.map(
    (_, slot) => framings[keyOf(slot)] ?? CENTRED
  );

  /** A print's pixels, same-origin: a stored print's host sends no CORS
   *  header, and a canvas it tainted could not be read back. */
  const pixelsOf = useCallback(async (photo: GalleryPhoto) => {
    const cached = bitmaps.current.get(photo.id);
    if (cached) return cached;
    const local = /^(blob|data):/.test(photo.src);
    const response = await fetch(
      local
        ? photo.src
        : `/api/memoroll/photo?url=${encodeURIComponent(photo.src)}`
    );
    if (!response.ok) throw new Error(String(response.status));
    const image = await createImageBitmap(await response.blob());
    bitmaps.current.set(photo.id, image);
    return image;
  }, []);

  useEffect(() => {
    const cache = bitmaps.current;
    return () => {
      cache.forEach((image) => image.close());
      cache.clear();
    };
  }, []);

  useEffect(() => {
    const run = ++generation.current;
    // The canvas never falls back the way CSS does: warm the three weights
    // the strip is set in first. A face that will not warm is not fatal -
    // the Story draws in the fallback.
    fontsReady.current ??= Promise.all(
      [200, 300, 400].map((weight) =>
        document.fonts?.load(`${weight} 40px ${body.style.fontFamily}`)
      )
    ).catch(() => undefined);
    setImages(null);
    setStory(null);
    Promise.all([Promise.all(chosen.map(pixelsOf)), fontsReady.current])
      .then(([loaded]) => {
        if (run !== generation.current) return;
        setProblem(null);
        setImages(loaded);
      })
      .catch(() => {
        if (run === generation.current)
          setProblem('The Story could not be drawn.');
      });
    // `chosenKey` stands for `chosen`, which is rebuilt every render.
  }, [chosenKey, pixelsOf]);

  // The preview is the Story itself, drawn again on every move of a finger;
  // the PNG to share follows once the prints stop moving.
  const day = eventDate.toDateString();
  const framingKey = framingsNow
    .map((f) => `${f.zoom.toFixed(4)},${f.cx.toFixed(4)},${f.cy.toFixed(4)}`)
    .join(';');
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !images) return;
    const frame = requestAnimationFrame(() =>
      drawFilmStory(ctx, {
        photos: images,
        framings: framingsNow,
        eventName,
        date: eventDate,
        fonts: { body: body.style.fontFamily },
      })
    );
    setStory(null);
    const settle = setTimeout(() => {
      canvas.toBlob((blob) => blob && setStory(blob), 'image/png');
    }, 250);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
    // `framingKey` stands for `framingsNow`, and `day` for `eventDate`: both
    // are new objects on every render of the caller's ticking clock.
  }, [images, framingKey, eventName, day]);

  /* ---- Sliding and pinching a print inside its window ---- */

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  /** The window being moved, for as long as a finger is down. */
  const active = useRef<number>(-1);
  const pressedAt = useRef<{ x: number; y: number } | null>(null);
  const lastTap = useRef<{ slot: number; at: number } | null>(null);

  /** A point on the screen, in Story pixels. */
  const toStory = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * FILM_STORY_WIDTH,
      y: ((clientY - rect.top) / rect.height) * FILM_STORY_HEIGHT,
    };
  };

  const update = useCallback(
    (slot: number, change: (current: Framing) => Framing) => {
      const key = `${layout}:${slot}:${chosen[slot]?.id}`;
      setFramings((all) => ({
        ...all,
        [key]: change(all[key] ?? CENTRED),
      }));
    },
    // `chosenKey` stands for `chosen`.
    [layout, chosenKey]
  );

  const onPointerDown = (event: PointerEvent) => {
    if (!images) return;
    const at = toStory(event.clientX, event.clientY);
    if (pointers.current.size === 0) {
      active.current = slotAt(layout, at.x, at.y);
      pressedAt.current = at;
    }
    if (active.current < 0) return;
    try {
      canvasRef.current?.setPointerCapture(event.pointerId);
    } catch {
      // A pointer the browser no longer knows; its moves still arrive here.
    }
    pointers.current.set(event.pointerId, at);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const previous = pointers.current.get(event.pointerId);
    const slot = active.current;
    if (!previous || slot < 0 || !images?.[slot]) return;
    const at = toStory(event.clientX, event.clientY);
    const others = Array.from(pointers.current.entries()).filter(
      ([id]) => id !== event.pointerId
    );
    const box = FILM_SLOTS[layout][slot];
    const photo = images[slot];
    if (others.length === 0) {
      update(slot, (f) =>
        moveFraming(photo, box, f, at.x - previous.x, at.y - previous.y)
      );
    } else {
      // Two fingers: the photo scales with their spread about the point
      // between them, and follows that point as it moves.
      const other = others[0][1];
      const before = Math.hypot(previous.x - other.x, previous.y - other.y);
      const after = Math.hypot(at.x - other.x, at.y - other.y);
      const midBefore = {
        x: (previous.x + other.x) / 2,
        y: (previous.y + other.y) / 2,
      };
      const midAfter = { x: (at.x + other.x) / 2, y: (at.y + other.y) / 2 };
      update(slot, (f) =>
        moveFraming(
          photo,
          box,
          f,
          midAfter.x - midBefore.x,
          midAfter.y - midBefore.y,
          before > 0 ? after / before : 1,
          midBefore.x,
          midBefore.y
        )
      );
    }
    pointers.current.set(event.pointerId, at);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!pointers.current.delete(event.pointerId)) return;
    if (pointers.current.size > 0) return;
    const slot = active.current;
    active.current = -1;
    // A tap that barely moved; two on the same print, quickly, re-centre it.
    const at = toStory(event.clientX, event.clientY);
    const start = pressedAt.current;
    if (!start || Math.hypot(at.x - start.x, at.y - start.y) > 24) return;
    const now = performance.now();
    if (lastTap.current?.slot === slot && now - lastTap.current.at < 320) {
      lastTap.current = null;
      update(slot, () => CENTRED);
    } else {
      lastTap.current = { slot, at: now };
    }
  };

  // The sheet itself drags down to close, and its drag listens natively on
  // the sheet; a finger on a print is moving the print, not the sheet, so
  // the press is caught here before it can bubble there.
  const pressRef = useRef(onPointerDown);
  pressRef.current = onPointerDown;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onPress = (event: PointerEvent) => {
      event.stopPropagation();
      pressRef.current(event);
    };
    canvas.addEventListener('pointerdown', onPress);
    return () => canvas.removeEventListener('pointerdown', onPress);
  }, []);

  // A mouse wheel zooms on a desktop. Not a React handler: React's wheel
  // listener is passive, and the page must not scroll under the zoom.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !images) return;
    const onWheel = (event: WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * FILM_STORY_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * FILM_STORY_HEIGHT;
      const slot = slotAt(layout, x, y);
      if (slot < 0 || !images[slot]) return;
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0015);
      update(slot, (f) =>
        moveFraming(images[slot], FILM_SLOTS[layout][slot], f, 0, 0, factor, x, y)
      );
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [images, layout, update]);

  /** A fresh pick of the guest's prints, never the same lead print twice in
   *  a row when there is another to lead with. */
  const shuffle = () =>
    setOrder((current) => {
      const next = photos.map((_, index) => index);
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      if (next.length > 1 && next[0] === current[0])
        [next[0], next[1]] = [next[1], next[0]];
      return next;
    });

  const name = `memoroll-story-${roll ? 'roll' : (chosen[0]?.id ?? 'print')}.png`;

  const save = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /** The phone's share sheet, where Instagram offers Story; a save where
   *  the browser cannot share files. */
  const share = async () => {
    if (!story) return;
    const file = new File([story], name, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
      } catch {
        // Dismissing the sheet is an answer, not a failure.
      }
      return;
    }
    save(story);
  };

  const chip = (on: boolean) =>
    on
      ? { background: colour.flame, color: '#ffffff' }
      : { background: colour.unchosen, color: colour.unchosenInk };

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      {/* Outer: the scrim arriving and leaving with the sheet. Inner: the
          scrim itself, dimming as a finger drags the sheet down. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: reduce ? REDUCED : SHEET_IN }}
        exit={{ opacity: 0, transition: reduce ? REDUCED : SHEET_OUT }}>
        <motion.button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute inset-0 cursor-default"
          style={{ background: 'rgba(0, 0, 0, 0.6)', opacity: backdropOpacity }}
        />
      </motion.div>
      <motion.div
        className="relative"
        initial={reduce ? { opacity: 0 } : { transform: 'translateY(100%)' }}
        animate={
          reduce
            ? { opacity: 1, transition: REDUCED }
            : { transform: 'translateY(0%)', transition: SHEET_IN }
        }
        exit={
          reduce
            ? { opacity: 0, transition: REDUCED }
            : { transform: 'translateY(100%)', transition: SHEET_OUT }
        }>
        <motion.div
          role="dialog"
          aria-label={roll ? 'Share my roll to Story' : 'Share to Story'}
          className="relative flex flex-col items-center gap-[14px] px-[16px] pb-[32px] pt-[20px]"
          {...dragProps}
          style={{
            ...dragProps.style,
            background: colour.paper,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            fontFamily: 'var(--font-mr-body)',
          }}>
          <h2
            className="text-[18px] font-bold leading-[150%]"
            style={{ color: colour.ink }}>
            {roll ? 'Share your roll' : 'Share to your Story'}
          </h2>

          <div
            className="relative flex aspect-[9/16] h-[48dvh] max-h-[440px] items-center justify-center overflow-hidden rounded-[12px]"
            style={{ background: colour.track }}>
            <canvas
              ref={canvasRef}
              width={FILM_STORY_WIDTH}
              height={FILM_STORY_HEIGHT}
              role="img"
              aria-label={roll ? 'Your roll as a Story' : 'Your Story'}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
              style={{ opacity: images ? 1 : 0 }}
            />
            {images ? null : (
              <span className="text-[13px]" style={{ color: colour.muted }}>
                {problem ?? 'Drawing your Story…'}
              </span>
            )}
          </div>
          <p
            className="-mt-[6px] text-[12px] leading-[150%]"
            style={{ color: colour.muted }}>
            Drag or pinch a photo to fit it. Double-tap to reset.
          </p>

          {roll ? (
            <div className="flex items-center gap-[8px]">
              <div
                role="radiogroup"
                aria-label="How many photos"
                className="flex gap-[6px]">
                {[1, 2, 3, 4]
                  .filter((option) => option <= most)
                  .map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={count === option}
                      aria-label={option === 1 ? '1 photo' : `${option} photos`}
                      onClick={() => setCount(option)}
                      className="h-[32px] w-[40px] rounded-full text-[13px] font-bold"
                      style={chip(count === option)}>
                      {option}
                    </button>
                  ))}
              </div>
              {photos.length > count ? (
                <button
                  type="button"
                  onClick={shuffle}
                  className="h-[32px] rounded-full px-[14px] text-[13px] font-bold"
                  style={chip(false)}>
                  Shuffle
                </button>
              ) : null}
            </div>
          ) : null}

          <Cta onClick={share} disabled={!story} className="h-[44px] w-full">
            Share to Story
          </Cta>
          <Cta
            tone="outline"
            onClick={() => story && save(story)}
            disabled={!story}
            className="-mt-[4px] h-[44px] w-full">
            Save image
          </Cta>
        </motion.div>
      </motion.div>
    </div>
  );
}
