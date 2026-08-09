'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { DemoPhase } from '../demo-control';
import { GALLERY_COPY, MOCK_PHOTOS, MockPhoto } from '../mock';
import { Shot } from '../use-shots';
import {
  EASE,
  REDUCED_FADE,
  fadeUp,
  pressTap,
  staggerContainer,
} from '../variants';

type GalleryTab = 'all' | 'own';

interface RollPhoto extends MockPhoto {
  /** True for the guest's own shots so "Captured by you" can filter. */
  own: boolean;
}

/**
 * The collective gallery in its three flowchart endings, all on one screen:
 *  - during the event (guest-12): blurred, "Memoroll ends in" counting down
 *  - after the event, pre-reveal (guest-08 + guest-14's pill): blurred,
 *    the drop counting down, "Developing Memoroll…"
 *  - after the reveal (guest-05/09/13): the clear grid under handwritten
 *    timestamps, Download All, and the single-photo view of guest-10.
 */
export default function GalleryScreen({
  phase,
  shots,
  onBackToCamera,
}: {
  phase: Exclude<DemoPhase, 'before'>;
  shots: Shot[];
  onBackToCamera?: () => void;
}) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<GalleryTab>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{
    list: RollPhoto[];
    index: number;
  } | null>(null);

  const blurred = phase !== 'revealed';

  const ownPhotos = useMemo<RollPhoto[]>(
    () =>
      shots.map((shot) => {
        const at = new Date(shot.takenAt);
        const hhmm = `${at.getHours()}:${String(at.getMinutes()).padStart(2, '0')}`;
        return {
          id: shot.id,
          src: shot.dataUrl,
          camOwner: 'you',
          groupLabel: `May 3 ${hhmm}`,
          stamp: `03/05/2026 ${hhmm}`,
          own: true,
        };
      }),
    [shots]
  );

  const photos = useMemo<RollPhoto[]>(() => {
    const mock = MOCK_PHOTOS.map((p) => ({ ...p, own: false }));
    return tab === 'own' ? ownPhotos : [...mock, ...ownPhotos];
  }, [tab, ownPhotos]);

  /** Preserve first-seen order of the handwritten group labels. */
  const groups = useMemo(() => {
    const order: string[] = [];
    const byLabel = new Map<string, RollPhoto[]>();
    photos.forEach((p) => {
      if (!byLabel.has(p.groupLabel)) {
        order.push(p.groupLabel);
        byLabel.set(p.groupLabel, []);
      }
      byLabel.get(p.groupLabel)!.push(p);
    });
    return order.map((label) => ({ label, photos: byLabel.get(label)! }));
  }, [photos]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const openViewer = (photo: RollPhoto) => {
    if (blurred) return;
    const list = photos.filter((p) => p.camOwner === photo.camOwner);
    setViewer({ list, index: list.findIndex((p) => p.id === photo.id) });
  };

  return (
    <div className="relative flex flex-1 flex-col px-4 pb-24 pt-12">
      {onBackToCamera && (
        <button
          type="button"
          onClick={onBackToCamera}
          aria-label="Back to the camera"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#212121]/15 bg-white text-[18px] text-[#212121] shadow-sm">
          ‹
        </button>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={phase}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={reduce ? REDUCED_FADE : { duration: 0.35, ease: EASE }}>
          <h1
            className="px-4 text-center text-[26px] leading-[1.9] text-[#212121]"
            style={{ fontFamily: 'var(--font-mr-hand)' }}>
            {phase === 'developing'
              ? GALLERY_COPY.developingHeading
              : GALLERY_COPY.revealedHeading}
          </h1>
          {phase === 'developing' && (
            <div className="mt-1 flex justify-center">
              <CountdownPill prefix="" />
            </div>
          )}
          {phase === 'revealed' && (
            <p
              className="mt-2 text-center text-[16px] text-[#212121]"
              style={{ fontFamily: 'var(--font-mr-body)' }}>
              {GALLERY_COPY.revealedSub}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div
        className="mt-6 flex gap-3 text-[15px]"
        style={{ fontFamily: 'var(--font-mr-ui)' }}>
        {(
          [
            ['all', GALLERY_COPY.allTab],
            ['own', GALLERY_COPY.ownTab],
          ] as [GalleryTab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 transition-colors ${
              tab === key
                ? 'bg-[#212121] text-white'
                : 'border border-[#212121] bg-white text-[#212121]'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'own' && photos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16">
          <p
            className="text-[22px] text-[#212121]"
            style={{ fontFamily: 'var(--font-mr-hand)' }}>
            nothing yet
          </p>
          <p
            className="text-[14px] text-[#212121]/70"
            style={{ fontFamily: 'var(--font-mr-body)' }}>
            Your ten shots land here once you start shooting.
          </p>
        </div>
      ) : (
        <motion.div
          key={`${tab}-${blurred}`}
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? undefined : 'hidden'}
          animate={reduce ? undefined : 'show'}
          className="mt-5 flex flex-col gap-5">
          {(blurred
            ? // While the roll is hidden the design shows one continuous
              // grid (guest-08/12); the handwritten timestamps only appear
              // once the reveal has happened (guest-09/13).
              [{ label: 'hidden', photos }]
            : groups
          ).map((group) => (
            <div key={group.label}>
              {!blurred && (
                <p
                  className="mb-2 text-[19px] text-[#212121]"
                  style={{ fontFamily: 'var(--font-mr-hand)' }}>
                  {group.label}
                </p>
              )}
              <div className="grid grid-cols-3 gap-2.5">
                {group.photos.map((photo) => (
                  <motion.button
                    key={photo.id}
                    type="button"
                    variants={reduce ? undefined : fadeUp}
                    onClick={() => openViewer(photo)}
                    aria-label={
                      blurred
                        ? 'Still hidden until the reveal'
                        : `Open the shot from ${photo.camOwner}’s cam`
                    }
                    className={`relative bg-white p-1 shadow-sm ${
                      blurred ? 'cursor-default' : ''
                    }`}>
                    <span className="relative block aspect-[4/3] overflow-hidden">
                      <img
                        src={photo.src}
                        alt=""
                        loading="lazy"
                        className={`h-full w-full object-cover transition-[filter,transform] duration-700 ${
                          blurred
                            ? 'blur-[7px] brightness-[0.38] saturate-[0.8]'
                            : ''
                        } ${blurred && !reduce ? 'scale-110' : ''}`}
                      />
                      {blurred && (
                        <span
                          className="absolute bottom-0.5 right-1 text-[9px] text-white/90"
                          style={{ fontFamily: 'var(--font-mr-ui)' }}>
                          {photo.own ? 'yours' : `${photo.camOwner}’s`}
                        </span>
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {phase === 'during' && (
        <div className="pointer-events-none fixed bottom-16 left-1/2 z-30 w-max -translate-x-1/2 whitespace-nowrap">
          <CountdownPill prefix="Memoroll ends in " />
        </div>
      )}
      {phase === 'developing' && (
        <div className="pointer-events-none fixed bottom-16 left-1/2 z-30 w-max -translate-x-1/2 whitespace-nowrap">
          <span
            className="rounded-full bg-[#ffccce] px-5 py-2 text-[15px] text-[#ff1e1e] shadow"
            style={{ fontFamily: 'var(--font-mr-ui)' }}>
            Developing Memoroll…
          </span>
        </div>
      )}
      {phase === 'revealed' && (
        <div className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2">
          <motion.button
            type="button"
            whileTap={reduce ? undefined : pressTap}
            onClick={() =>
              setToast('demo: the real Memoroll bundles the roll for download')
            }
            className="h-[52px] w-[230px] bg-[#212121] text-[17px] text-white shadow-xl"
            style={{ fontFamily: 'var(--font-mr-ui)' }}>
            Download All
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduce ? REDUCED_FADE : { duration: 0.25, ease: EASE }}
            className="fixed bottom-20 left-1/2 z-40 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-[12px] text-white"
            style={{ fontFamily: 'var(--font-mr-ui)' }}>
            {toast}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewer && (
          <PhotoViewer
            list={viewer.list}
            index={viewer.index}
            onAdvance={() =>
              setViewer((v) =>
                v ? { ...v, index: (v.index + 1) % v.list.length } : v
              )
            }
            onClose={() => setViewer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** A pink pill ticking down, shared by guest-08 and guest-12. */
function CountdownPill({ prefix }: { prefix: string }) {
  const [secondsLeft, setSecondsLeft] = useState(24 * 60 * 60 - 1);
  useEffect(() => {
    const t = window.setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000
    );
    return () => window.clearInterval(t);
  }, []);
  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  const clock = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return (
    <span
      className="rounded-full bg-[#ffccce] px-4 py-1.5 text-[16px] tabular-nums text-[#ff1e1e] shadow-sm"
      style={{ fontFamily: 'var(--font-mr-ui)' }}>
      {prefix}
      {clock}
    </span>
  );
}

/**
 * Gallery-View (guest-10): the dark room where one cam's roll is flipped
 * through, one rotated polaroid at a time.
 */
function PhotoViewer({
  list,
  index,
  onAdvance,
  onClose,
}: {
  list: RollPhoto[];
  index: number;
  onAdvance: () => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const photo = list[index];
  const ownerLabel = photo.own ? 'Your cam' : `${photo.camOwner}’s cam`;
  const caption = photo.own
    ? 'tap to see what you captured'
    : `tap to see what ${photo.camOwner} has captured`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduce ? REDUCED_FADE : { duration: 0.25, ease: EASE }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#212121]/95 px-5"
      onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close the photo"
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[16px] text-white">
        ✕
      </button>

      <div
        className="text-center text-white"
        style={{ fontFamily: 'var(--font-mr-ui)' }}>
        <p className="text-[20px] font-medium">{ownerLabel}</p>
        <p className="mt-0.5 text-[15px] text-white/85">{photo.stamp}</p>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.figure
          key={photo.id}
          onClick={(e) => {
            e.stopPropagation();
            onAdvance();
          }}
          initial={
            reduce ? { opacity: 0 } : { opacity: 0, scale: 0.82, rotate: -9 }
          }
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, rotate: 4 }}
          transition={
            reduce
              ? REDUCED_FADE
              : { type: 'spring', stiffness: 260, damping: 24 }
          }
          className="relative mt-6 w-full max-w-[340px] cursor-pointer bg-white p-3 pb-4 shadow-2xl">
          <span className="relative block">
            <img
              src={photo.src}
              alt={`A shot from ${ownerLabel}`}
              className="w-full object-cover"
            />
            <span
              className="absolute bottom-2 right-3 text-[15px] text-white drop-shadow"
              style={{ fontFamily: 'var(--font-mr-hand)' }}>
              {photo.stamp}
            </span>
          </span>
        </motion.figure>
      </AnimatePresence>

      <p
        className="mt-6 text-[24px] font-semibold text-white"
        style={{ fontFamily: 'var(--font-mr-ui)' }}>
        {index + 1}/{list.length}
      </p>
      <p
        className="mt-3 text-[15px] text-white/90"
        style={{ fontFamily: 'var(--font-mr-body)' }}>
        {caption}
      </p>
    </motion.div>
  );
}
