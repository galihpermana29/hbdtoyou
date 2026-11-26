'use client';

import { trackMemoRoll } from '@/lib/memoroll-analytics';
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
  MAX_ZOOM,
  moveFraming,
  slotAt,
  type Framing,
} from '@/lib/memoroll-story-film';
import {
  Download,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Cta from '../ui/cta';
import { REDUCED, SHEET_IN, SHEET_OUT } from '../ui/motion';
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
  const [count, setCount] = useState(roll ? Math.min(3, most) : 1);
  /** Which of the guest's prints go in, in order; Shuffle redraws it. */
  const [order, setOrder] = useState<number[]>(() =>
    photos.map((_, index) => index)
  );
  /** Each window's framing, by layout, window and print: changing the count
   *  or the prints starts those windows centred again. */
  const [framings, setFramings] = useState<Record<string, Framing>>({});
  /**
   * Quarter turns given to each photo, by photo (owner, 2026-11-26). A guest
   * who held their phone sideways gets a print lying on its side, and until
   * now the Story could only show it that way. Kept by photo rather than by
   * window, so a photo stood upright stays upright when the layout changes.
   */
  const [turns, setTurns] = useState<Record<string, number>>({});
  /** The window the tools on the right act on. Tapping a photo picks it. */
  const [selected, setSelected] = useState(0);
  const [images, setImages] = useState<ImageBitmap[] | null>(null);
  const [story, setStory] = useState<Blob | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Pixels already fetched, by print - a reshuffle never fetches twice. */
  const bitmaps = useRef(new Map<string, ImageBitmap>());
  const fontsReady = useRef<Promise<unknown> | null>(null);
  /** Loads can overlap when choices change quickly; only the last counts. */
  const generation = useRef(0);
  const lastChosen = useRef('');

  const chosen = roll
    ? order.slice(0, count).map((index) => photos[index])
    : photos.slice(0, 1);
  const chosenKey = chosen.map((photo) => photo.id).join(',');
  const layout = filmCountFor(chosen.length);
  const turnOf = (slot: number) => turns[chosen[slot]?.id ?? ''] ?? 0;
  // A turned photo is a different shape, so it is framed afresh.
  const keyOf = (slot: number) =>
    `${layout}:${slot}:${chosen[slot]?.id}:${turnOf(slot)}`;
  const turnsKey = chosen.map((_, slot) => turnOf(slot)).join(',');
  const framingsNow = chosen.map((_, slot) => framings[keyOf(slot)] ?? CENTRED);

  /** A print's pixels, same-origin: a stored print's host sends no CORS
   *  header, and a canvas it tainted could not be read back. */
  const pixelsOf = useCallback(async (photo: GalleryPhoto) => {
    const cached = bitmaps.current.get(photo.id);
    if (cached) return cached;
    // Already ours to read: a local blob, or a file this site serves
    // itself (the demo's sample prints). The proxy is for the print
    // host alone and refuses anything else.
    const local = /^(blob:|data:|\/(?!\/))/.test(photo.src);
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

  /**
   * The photo stood on another side: its own pixels, turned by quarter
   * turns into a new bitmap. Turning the pixels rather than the drawing
   * means everything downstream (the fit, the slide, the pinch, the clamp
   * that keeps a window full) goes on working on a plain upright picture.
   */
  const turnedPixelsOf = useCallback(
    async (photo: GalleryPhoto, quarter: number) => {
      const upright = await pixelsOf(photo);
      const turn = ((quarter % 4) + 4) % 4;
      if (turn === 0) return upright;
      const key = `${photo.id}@${turn}`;
      const cached = bitmaps.current.get(key);
      if (cached) return cached;
      const sideways = turn % 2 === 1;
      const canvas = document.createElement('canvas');
      canvas.width = sideways ? upright.height : upright.width;
      canvas.height = sideways ? upright.width : upright.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return upright;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((turn * Math.PI) / 2);
      ctx.drawImage(upright, -upright.width / 2, -upright.height / 2);
      const turned = await createImageBitmap(canvas);
      bitmaps.current.set(key, turned);
      return turned;
    },
    [pixelsOf]
  );

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
    // A different set of photos clears the page; a turn keeps what is there
    // on screen until the turned photo is ready, so rotating does not blink.
    if (lastChosen.current !== chosenKey) setImages(null);
    lastChosen.current = chosenKey;
    setStory(null);
    Promise.all([
      Promise.all(
        chosen.map((photo, slot) => turnedPixelsOf(photo, turnOf(slot)))
      ),
      fontsReady.current,
    ])
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
  }, [chosenKey, turnsKey, turnedPixelsOf]);

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
      const key = keyOf(slot);
      setFramings((all) => ({
        ...all,
        [key]: change(all[key] ?? CENTRED),
      }));
    },
    // `chosenKey` stands for `chosen`.
    [layout, chosenKey, turnsKey]
  );

  const onPointerDown = (event: PointerEvent) => {
    if (!images) return;
    const at = toStory(event.clientX, event.clientY);
    if (pointers.current.size === 0) {
      active.current = slotAt(layout, at.x, at.y);
      pressedAt.current = at;
    }
    if (active.current < 0) return;
    setSelected(active.current);
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
        moveFraming(
          images[slot],
          FILM_SLOTS[layout][slot],
          f,
          0,
          0,
          factor,
          x,
          y
        )
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
        trackMemoRoll('memoroll_story_shared', {
          kind: roll ? 'roll' : 'print',
          how: 'shared',
        });
      } catch {
        // Dismissing the sheet is an answer, not a failure.
        trackMemoRoll('memoroll_story_shared', {
          kind: roll ? 'roll' : 'print',
          how: 'dismissed',
        });
      }
      return;
    }
    trackMemoRoll('memoroll_story_shared', {
      kind: roll ? 'roll' : 'print',
      how: 'saved',
    });
    save(story);
  };

  /**
   * The page's size on screen: 9 by 16, as tall as the room between the
   * title and the buttons, unless that would leave the tools no column - on
   * a short, wide phone the width decides instead. Measured rather than left
   * to CSS, which keeps one of the two limits and lets the picture stretch.
   */
  const roomRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState({ width: 225, height: 400 });
  useEffect(() => {
    const room = roomRef.current;
    if (!room) return;
    const measure = () => {
      const tools = 58;
      const high = room.clientHeight - 16;
      const wide = room.clientWidth - tools;
      const width = Math.max(120, Math.floor(Math.min(wide, (high * 9) / 16)));
      setPage({ width, height: Math.round((width * 16) / 9) });
    };
    measure();
    const watcher = new ResizeObserver(measure);
    watcher.observe(room);
    return () => watcher.disconnect();
  }, []);

  const chip = (on: boolean) =>
    on
      ? { background: colour.flame, color: '#ffffff' }
      : { background: colour.unchosen, color: colour.unchosenInk };

  /* ---- The tools beside the page, for the photo that is picked ---- */

  // The layout can shrink under the selection (four photos down to two).
  const picked = Math.min(selected, Math.max(0, chosen.length - 1));
  const pickedBox = FILM_SLOTS[layout][picked];
  const pickedPhoto = chosen[picked];
  const ready = Boolean(images?.[picked]);

  const turn = (by: number) => {
    if (!pickedPhoto) return;
    setTurns((all) => ({
      ...all,
      [pickedPhoto.id]: ((((all[pickedPhoto.id] ?? 0) + by) % 4) + 4) % 4,
    }));
  };
  /** Zoom about the middle of the window, for a thumb that cannot pinch. */
  const zoomBy = (factor: number) => {
    const photo = images?.[picked];
    if (!photo) return;
    update(picked, (f) =>
      moveFraming(
        photo,
        pickedBox,
        f,
        0,
        0,
        factor,
        pickedBox.x + pickedBox.w / 2,
        pickedBox.y + pickedBox.h / 2
      )
    );
  };
  const zoomNow = framingsNow[picked]?.zoom ?? 1;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(0, 0, 0, 0.6)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: reduce ? REDUCED : SHEET_IN }}
        exit={{ opacity: 0, transition: reduce ? REDUCED : SHEET_OUT }}
      />
      {/* The whole screen (owner, 2026-11-26): the Story is the thing being
          made here, and as a half sheet it was drawn at a quarter of the
          phone with two full-width buttons under it. Now the page takes
          every pixel the tools do not need. */}
      <motion.div
        role="dialog"
        aria-label={roll ? 'Share my roll to Story' : 'Share to Story'}
        className="relative flex h-full flex-col px-[16px] pb-[max(16px,env(safe-area-inset-bottom))] pt-[max(10px,env(safe-area-inset-top))]"
        style={{ background: colour.paper, fontFamily: 'var(--font-mr-body)' }}
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
        <div className="relative flex h-[44px] shrink-0 items-center justify-center">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute left-0 flex h-[40px] w-[40px] items-center justify-center rounded-full"
            style={{ background: colour.unchosen, color: colour.ink }}>
            <X size={20} strokeWidth={2.25} aria-hidden />
          </button>
          <h2
            className="text-[17px] font-bold leading-[150%]"
            style={{ color: colour.ink }}>
            {roll ? 'Share your roll' : 'Share to your Story'}
          </h2>
        </div>

        {/* The page and its tools. The page is as tall as the room allows
            and no wider than leaves the tools their column. */}
        <div
          ref={roomRef}
          className="flex min-h-0 flex-1 items-center justify-center gap-[10px] py-[8px]">
          <div
            className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-[12px]"
            style={{
              background: colour.track,
              width: page.width,
              height: page.height,
            }}>
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
            {images && chosen.length > 1 ? (
              // Which photo the tools will act on. Drawn over the page, never
              // into it: the saved Story has no outline.
              <div
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  left: `${(pickedBox.x / FILM_STORY_WIDTH) * 100}%`,
                  top: `${(pickedBox.y / FILM_STORY_HEIGHT) * 100}%`,
                  width: `${(pickedBox.w / FILM_STORY_WIDTH) * 100}%`,
                  height: `${(pickedBox.h / FILM_STORY_HEIGHT) * 100}%`,
                  borderRadius: 6,
                  boxShadow: `0 0 0 2px ${colour.flame}, 0 0 0 4px rgba(255, 255, 255, 0.85)`,
                }}
              />
            ) : null}
            {images ? null : (
              <span className="text-[13px]" style={{ color: colour.muted }}>
                {problem ?? 'Drawing your Story…'}
              </span>
            )}
          </div>

          <div
            role="toolbar"
            aria-label={
              chosen.length > 1 ? `Photo ${picked + 1} tools` : 'Photo tools'
            }
            aria-orientation="vertical"
            className="flex w-[48px] shrink-0 flex-col items-center gap-[10px]">
            {chosen.length > 1 ? (
              <span
                className="text-[11px] font-bold leading-[150%]"
                style={{ color: colour.muted }}>
                Photo {picked + 1}
              </span>
            ) : null}
            <Tool label="Rotate right" onClick={() => turn(1)} off={!ready}>
              <RotateCw size={20} strokeWidth={2.25} aria-hidden />
            </Tool>
            <Tool label="Rotate left" onClick={() => turn(-1)} off={!ready}>
              <RotateCcw size={20} strokeWidth={2.25} aria-hidden />
            </Tool>
            <Tool
              label="Zoom in"
              onClick={() => zoomBy(1.25)}
              off={!ready || zoomNow >= MAX_ZOOM - 0.001}>
              <ZoomIn size={20} strokeWidth={2.25} aria-hidden />
            </Tool>
            <Tool
              label="Zoom out"
              onClick={() => zoomBy(0.8)}
              off={!ready || zoomNow <= 1.001}>
              <ZoomOut size={20} strokeWidth={2.25} aria-hidden />
            </Tool>
          </div>
        </div>

        <p
          className="shrink-0 text-center text-[12px] leading-[150%]"
          style={{ color: colour.muted }}>
          {chosen.length > 1
            ? 'Tap a photo to pick it. Drag, pinch, or double-tap to re-centre.'
            : 'Drag to move, pinch to zoom, double-tap to re-centre.'}
        </p>

        {roll ? (
          <div className="mt-[10px] flex shrink-0 items-center justify-center gap-[8px]">
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
                    className="h-[36px] w-[44px] rounded-full text-[13px] font-bold"
                    style={chip(count === option)}>
                    {option}
                  </button>
                ))}
            </div>
            {photos.length > count ? (
              <button
                type="button"
                onClick={shuffle}
                className="h-[36px] rounded-full px-[14px] text-[13px] font-bold"
                style={chip(false)}>
                Shuffle
              </button>
            ) : null}
          </div>
        ) : null}

        {/* One row (owner, 2026-11-26): sharing is the point and gets the
            width; saving is the quiet way out beside it. */}
        <div className="mt-[10px] flex shrink-0 items-center gap-[8px]">
          <Cta
            tone="outline"
            label="Save image"
            onClick={() => {
              if (!story) return;
              trackMemoRoll('memoroll_story_shared', {
                kind: roll ? 'roll' : 'print',
                how: 'saved',
              });
              save(story);
            }}
            disabled={!story}
            className="h-[44px] w-[52px] shrink-0">
            <Download size={20} strokeWidth={2.25} aria-hidden />
          </Cta>
          <Cta
            onClick={share}
            disabled={!story}
            className="h-[44px] min-w-0 flex-1">
            Share to Story
          </Cta>
        </div>
      </motion.div>
    </div>
  );
}

/** One of the round tools beside the page: big enough for a thumb. */
function Tool({
  label,
  onClick,
  off,
  children,
}: {
  label: string;
  onClick: () => void;
  off: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={off}
      className="flex h-[48px] w-[48px] items-center justify-center rounded-full disabled:opacity-40"
      style={{ background: colour.unchosen, color: colour.ink }}>
      {children}
    </button>
  );
}
