'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  renderRollStory,
  renderStory,
  STORY_THEMES,
  type StoryTheme,
} from '@/lib/memoroll-story';
import Cta from '../ui/cta';
import { body, mono, script } from '../ui/fonts';
import { colour } from '../ui/tokens';
import type { GalleryPhoto } from './roll';

/**
 * Share to an Instagram Story (owner, 2026-11-12): the Story is drawn here,
 * previewed, and handed to the phone's share sheet - where Instagram offers
 * "Story" - or saved, where a browser has no sheet for files.
 *
 * Two kinds, one sheet:
 * - a single print, from the photo preview;
 * - the guest's Roll (`roll`), from My Roll: two to four of their own prints
 *   laid out together, the count theirs to pick and Shuffle to swap which
 *   prints go in.
 *
 * DRAFT: the themes and layouts are drawn from the MemoRoll palette (see
 * src/lib/memoroll-story.ts), awaiting a designed template.
 *
 * Only prints the guest can already see reach this sheet - the preview hands
 * visible prints alone, My Roll hands the guest's own - so a veiled Shot
 * never leaves.
 */
export default function StorySheet({
  photos,
  eventName,
  roll = false,
  onClose,
}: {
  /** The print to share, or - with `roll` - the guest's own to pick from. */
  photos: GalleryPhoto[];
  eventName: string;
  roll?: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const most = Math.min(4, photos.length);
  const [theme, setTheme] = useState<StoryTheme>('paper');
  const [count, setCount] = useState(Math.min(3, most));
  /** Which of the guest's prints go in, in order; Shuffle redraws it. */
  const [order, setOrder] = useState<number[]>(() =>
    photos.map((_, index) => index)
  );
  const [story, setStory] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  /** Pixels already fetched, by print - a reshuffle never fetches twice. */
  const bitmaps = useRef(new Map<string, ImageBitmap>());
  const fontsReady = useRef<Promise<unknown> | null>(null);
  /** Draws can overlap when choices change quickly; only the last counts. */
  const generation = useRef(0);

  const chosen = roll
    ? order.slice(0, count).map((index) => photos[index])
    : photos.slice(0, 1);
  const chosenKey = chosen.map((photo) => photo.id).join(',');

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
    // The canvas never falls back the way CSS does: warm the faces first. A
    // face that will not warm is not fatal - the Story draws in the fallback.
    fontsReady.current ??= Promise.all([
      document.fonts?.load(`56px ${script.style.fontFamily}`),
      document.fonts?.load(`30px ${mono.style.fontFamily}`),
    ]).catch(() => undefined);
    const fonts = {
      body: body.style.fontFamily,
      script: script.style.fontFamily,
      mono: mono.style.fontFamily,
    };
    setStory(null);
    Promise.all([Promise.all(chosen.map(pixelsOf)), fontsReady.current])
      .then(([images]) =>
        roll
          ? renderRollStory({
              photos: images,
              eventName,
              shooter: chosen[0]?.shooter ?? '',
              theme,
              fonts,
            })
          : renderStory({
              photo: images[0],
              eventName,
              // Only a guest's own print is signed: who took anyone else's is
              // the preview's "Who took this?" secret, and a Story must not
              // tell it.
              shooter: chosen[0]?.own ? chosen[0].shooter ?? '' : '',
              theme,
              fonts,
            })
      )
      .then((blob) => {
        if (run !== generation.current) return;
        setProblem(null);
        setStory(blob);
        setPreviewUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return URL.createObjectURL(blob);
        });
      })
      .catch(() => {
        if (run === generation.current)
          setProblem('The Story could not be drawn.');
      });
    // `chosenKey` stands for `chosen`, which is rebuilt every render.
  }, [chosenKey, theme, roll, eventName, pixelsOf]);

  // On close, the last preview's URL goes too; each earlier one was revoked
  // as the next landed.
  const lastPreview = useRef<string | null>(null);
  lastPreview.current = previewUrl;
  useEffect(
    () => () => {
      if (lastPreview.current) URL.revokeObjectURL(lastPreview.current);
    },
    []
  );

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

  const name = `memoroll-story-${roll ? 'roll' : chosen[0]?.id ?? 'print'}.png`;

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
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: 'rgba(0, 0, 0, 0.6)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        role="dialog"
        aria-label={roll ? 'Share my roll to Story' : 'Share to Story'}
        className="relative flex flex-col items-center gap-[14px] px-[16px] pb-[32px] pt-[20px]"
        style={{
          background: colour.paper,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          fontFamily: 'var(--font-mr-body)',
        }}
        initial={reduce ? { opacity: 0 } : { y: '100%' }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        transition={{ duration: reduce ? 0.12 : 0.3, ease: [0.32, 0.72, 0, 1] }}>
        <h2
          className="text-[18px] font-bold leading-[150%]"
          style={{ color: colour.ink }}>
          {roll ? 'Share your roll' : 'Share to your Story'}
        </h2>

        <div
          className="relative flex aspect-[9/16] h-[48dvh] max-h-[440px] items-center justify-center overflow-hidden rounded-[12px]"
          style={{ background: colour.track }}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={roll ? 'Your roll as a Story' : 'Your Story'}
              className="h-full w-full object-cover transition-opacity duration-150"
              style={{ opacity: story ? 1 : 0.6 }}
            />
          ) : (
            <span className="text-[13px]" style={{ color: colour.muted }}>
              {problem ?? 'Drawing your Story…'}
            </span>
          )}
        </div>

        {roll ? (
          <div className="flex items-center gap-[8px]">
            <div
              role="radiogroup"
              aria-label="How many photos"
              className="flex gap-[6px]">
              {[2, 3, 4]
                .filter((option) => option <= most)
                .map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={count === option}
                    aria-label={`${option} photos`}
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

        <div
          role="radiogroup"
          aria-label="Story style"
          className="flex gap-[8px]">
          {STORY_THEMES.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={theme === option.id}
              onClick={() => setTheme(option.id)}
              className="rounded-full px-[14px] py-[6px] text-[13px] font-bold"
              style={chip(theme === option.id)}>
              {option.label}
            </button>
          ))}
        </div>

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
    </div>
  );
}
