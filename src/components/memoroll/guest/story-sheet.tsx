'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import {
  renderStory,
  STORY_THEMES,
  type StoryTheme,
} from '@/lib/memoroll-story';
import Cta from '../ui/cta';
import { REDUCED, SHEET_IN, SHEET_OUT } from '../ui/motion';
import { useSheetDrag } from '../ui/sheet-drag';
import { body, mono, script } from '../ui/fonts';
import { colour } from '../ui/tokens';
import type { GalleryPhoto } from './roll';

/**
 * Share a print to an Instagram Story (owner, 2026-11-12): the Story is drawn
 * here, previewed, and handed to the phone's share sheet - where Instagram
 * offers "Story" - or saved, where a browser has no sheet for files.
 *
 * DRAFT: the three themes are a starting point drawn from the MemoRoll
 * palette (see src/lib/memoroll-story.ts), awaiting a designed template.
 *
 * Only prints the guest can already see reach this sheet: the preview it
 * opens from is handed visible prints alone, so a veiled Shot never leaves.
 */
export default function StorySheet({
  photo,
  eventName,
  onClose,
}: {
  photo: GalleryPhoto;
  eventName: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const { backdropOpacity, dragProps } = useSheetDrag(onClose);
  const [theme, setTheme] = useState<StoryTheme>('paper');
  const [story, setStory] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const bitmap = useRef<ImageBitmap | null>(null);
  /** The theme to draw with when the pixels land - a pick made while the
   *  print was still loading must not be drawn over with the default. */
  const themeRef = useRef<StoryTheme>('paper');

  // The print's pixels, once: same-origin, or the canvas could not be read
  // back (a stored print's host sends no CORS header - /api/memoroll/photo).
  useEffect(() => {
    let cancelled = false;
    const local = /^(blob|data):/.test(photo.src);
    const src = local
      ? photo.src
      : `/api/memoroll/photo?url=${encodeURIComponent(photo.src)}`;
    Promise.all([
      fetch(src).then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.blob();
      }),
      // The canvas never falls back the way CSS does: warm the faces first.
      // A face that will not warm is not fatal - the Story draws in the
      // fallback rather than not at all.
      document.fonts
        ?.load(`56px ${script.style.fontFamily}`)
        .catch(() => undefined),
      document.fonts
        ?.load(`30px ${mono.style.fontFamily}`)
        .catch(() => undefined),
    ])
      .then(([blob]) => createImageBitmap(blob))
      .then((image) => {
        if (cancelled) {
          image.close();
          return;
        }
        bitmap.current = image;
        setProblem(null);
        draw(themeRef.current);
      })
      .catch(() => {
        if (!cancelled) setProblem('This print could not be loaded.');
      });
    return () => {
      cancelled = true;
      bitmap.current?.close();
      bitmap.current = null;
    };
    // `draw` reads refs and setters only, so the print is the one input.
  }, [photo.src]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const draw = (next: StoryTheme) => {
    const image = bitmap.current;
    if (!image) return;
    renderStory({
      photo: image,
      eventName,
      // Only a guest's own print is signed: who took anyone else's is the
      // preview's "Who took this?" secret, and a Story must not tell it.
      shooter: photo.own ? (photo.shooter ?? '') : '',
      theme: next,
      fonts: {
        body: body.style.fontFamily,
        script: script.style.fontFamily,
        mono: mono.style.fontFamily,
      },
    })
      .then((blob) => {
        setStory(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      })
      .catch(() => setProblem('The Story could not be drawn.'));
  };

  const pick = (next: StoryTheme) => {
    themeRef.current = next;
    setTheme(next);
    draw(next);
  };

  const fileOf = (blob: Blob) =>
    new File([blob], `memoroll-story-${photo.id}.png`, { type: 'image/png' });

  const save = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `memoroll-story-${photo.id}.png`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /** The phone's share sheet, where Instagram offers Story; a save where
   *  the browser cannot share files. */
  const share = async () => {
    if (!story) return;
    const file = fileOf(story);
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
          aria-label="Share to Story"
          className="relative flex flex-col items-center gap-[16px] px-[16px] pb-[32px] pt-[20px]"
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
            Share to your Story
          </h2>

          <div
            className="flex aspect-[9/16] h-[52dvh] max-h-[460px] items-center justify-center overflow-hidden rounded-[12px]"
            style={{ background: colour.track }}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Your Story"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[13px]" style={{ color: colour.muted }}>
                {problem ?? 'Drawing your Story…'}
              </span>
            )}
          </div>

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
                onClick={() => pick(option.id)}
                className="rounded-full px-[14px] py-[6px] text-[13px] font-bold"
                style={
                  theme === option.id
                    ? { background: colour.flame, color: '#ffffff' }
                    : { background: colour.unchosen, color: colour.unchosenInk }
                }>
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
      </motion.div>
    </div>
  );
}
