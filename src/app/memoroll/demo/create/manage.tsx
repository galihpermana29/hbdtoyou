'use client';

import dayjs from 'dayjs';
import { motion, useReducedMotion } from 'framer-motion';
import { MOCK_LIVE_STATUS, MOCK_PHOTOS } from '../mock';
import { DemoToast, useDemoToast } from '../ui';
import { fadeUp, staggerContainer } from '../variants';
import { MemorollConfig, effectiveReveal } from './config';

/**
 * The manage view: the couple's side of the event while it runs, on the
 * camera's dark ground because this is the dark room. A live status card
 * (the backend's photo_count / photo_storage_used_mb vocabulary, mocked) and
 * the moderation gallery - the POV precedent of reviewing and hiding guests'
 * photos, the backend's review_status on wedding_guest_photos, local state.
 */
export default function ManageView({
  config,
  hiddenIds,
  toggleHidden,
  onEditSetup,
}: {
  config: MemorollConfig;
  hiddenIds: string[];
  toggleHidden: (id: string) => void;
  onEditSetup: () => void;
}) {
  const reduce = useReducedMotion();
  const { toast, showToast } = useDemoToast();

  const reveal = effectiveReveal(config);
  const revealDay = dayjs(reveal.date);
  const revealLabel = `${
    revealDay.isValid() ? revealDay.format('D MMM') : reveal.date
  } · ${reveal.time}`;
  const storagePct = Math.min(
    100,
    Math.round(
      (MOCK_LIVE_STATUS.storageUsedMb / MOCK_LIVE_STATUS.storageLimitMb) * 100
    )
  );

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
      className="flex flex-1 flex-col px-5 pb-24 pt-10">
      <motion.div variants={reduce ? undefined : fadeUp}>
        <div className="flex items-center justify-center gap-2">
          <motion.span
            animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
            transition={
              reduce ? undefined : { duration: 1.8, repeat: Infinity }
            }
            className="h-[8px] w-[8px] rounded-full bg-[#ff3e09]"
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60"
            style={{ fontFamily: 'var(--font-mr-ui)' }}>
            Live
          </span>
        </div>
        <h1
          className="mt-1 text-center text-[26px] leading-[1.9] text-white"
          style={{ fontFamily: 'var(--font-mr-hand)' }}>
          Your Memoroll, rolling
        </h1>
        <p
          className="text-center text-[13px] text-white/70"
          style={{ fontFamily: 'var(--font-mr-body)' }}>
          {config.eventName} · reveals {revealLabel}
        </p>
      </motion.div>

      {/* The live status card. */}
      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="mt-7 rounded-[10px] border border-white/15 bg-white/5 p-5">
        <div className="flex text-center text-white">
          <div className="flex-1">
            <span
              className="block text-[34px] leading-[1.2]"
              style={{ fontFamily: 'var(--font-mr-hand)' }}>
              {MOCK_LIVE_STATUS.photoCount}
            </span>
            <span
              className="mt-1 block text-[11px] text-white/60"
              style={{ fontFamily: 'var(--font-mr-ui)' }}>
              shots on the roll
            </span>
          </div>
          <div className="w-px bg-white/15" />
          <div className="flex-1">
            <span
              className="block text-[34px] leading-[1.2]"
              style={{ fontFamily: 'var(--font-mr-hand)' }}>
              {MOCK_LIVE_STATUS.guestsJoined}
            </span>
            <span
              className="mt-1 block text-[11px] text-white/60"
              style={{ fontFamily: 'var(--font-mr-ui)' }}>
              of {MOCK_LIVE_STATUS.guestsInvited} guests shooting
            </span>
          </div>
        </div>
        <div className="mt-5">
          <div className="h-[6px] overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#ff3e09]"
              style={{ width: `${storagePct}%` }}
            />
          </div>
          <p
            className="mt-1.5 text-[11px] text-white/60"
            style={{ fontFamily: 'var(--font-mr-ui)' }}>
            {MOCK_LIVE_STATUS.storageUsedMb} MB of{' '}
            {Math.round(MOCK_LIVE_STATUS.storageLimitMb / 1024)} GB of film
            developed
          </p>
        </div>
      </motion.div>

      {/* The moderation gallery. */}
      <motion.div variants={reduce ? undefined : fadeUp} className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2
            className="text-[19px] text-white"
            style={{ fontFamily: 'var(--font-mr-hand)' }}>
            the roll, as it comes in
          </h2>
          {hiddenIds.length > 0 && (
            <span
              className="text-[11px] text-white/60"
              style={{ fontFamily: 'var(--font-mr-ui)' }}>
              {hiddenIds.length} hidden
            </span>
          )}
        </div>
        <p
          className="mt-1 text-[12px] leading-relaxed text-white/60"
          style={{ fontFamily: 'var(--font-mr-body)' }}>
          Only you see the shots before the reveal. Tap one to pull it from the
          roll - hidden shots never develop for anyone else.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {MOCK_PHOTOS.map((photo) => {
            const hidden = hiddenIds.includes(photo.id);
            return (
              <button
                key={photo.id}
                type="button"
                aria-pressed={hidden}
                aria-label={
                  hidden
                    ? `Put the shot from ${photo.camOwner} back on the roll`
                    : `Hide the shot from ${photo.camOwner}`
                }
                onClick={() => {
                  toggleHidden(photo.id);
                  showToast(
                    hidden
                      ? 'Back on the roll - it develops with the rest'
                      : 'Hidden - it stays out of the reveal'
                  );
                }}
                className="relative bg-white p-1 shadow-sm">
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <img
                    src={photo.src}
                    alt=""
                    loading="lazy"
                    className={`h-full w-full object-cover transition-[filter,opacity] duration-300 ${
                      hidden ? 'opacity-30 grayscale' : ''
                    }`}
                  />
                  <span
                    className="absolute bottom-0.5 right-1 text-[9px] text-white/90 drop-shadow"
                    style={{ fontFamily: 'var(--font-mr-ui)' }}>
                    {photo.camOwner}&rsquo;s
                  </span>
                  {hidden && (
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[17px] text-[#212121]"
                      style={{ fontFamily: 'var(--font-mr-hand)' }}>
                      hidden
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="mx-auto mt-10 flex w-full max-w-[300px] flex-col gap-3">
        <a
          href="/memoroll/demo"
          className="block h-[52px] w-full rounded-full bg-[#ff3e09] text-center text-[16px] leading-[52px] text-white shadow-[0_6px_18px_rgba(255,62,9,0.35)]"
          style={{ fontFamily: 'var(--font-mr-ui)' }}>
          See it as a guest
        </a>
        <button
          type="button"
          onClick={onEditSetup}
          className="h-[52px] w-full rounded-full border border-white/25 text-[16px] text-white"
          style={{ fontFamily: 'var(--font-mr-ui)' }}>
          Edit the setup
        </button>
      </motion.div>

      <DemoToast message={toast} />
    </motion.div>
  );
}
