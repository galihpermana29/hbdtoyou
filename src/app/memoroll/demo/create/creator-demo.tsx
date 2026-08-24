'use client';

import Cover from '@/components/memoroll/guest/cover';
import CoverStep from '@/components/memoroll/creator/cover-step';
import NameStep from '@/components/memoroll/creator/name-step';
import PublishStep from '@/components/memoroll/creator/publish-step';
import QrSheet from '@/components/memoroll/creator/qr-sheet';
import RevealStep from '@/components/memoroll/creator/reveal-step';
import ShotsStep from '@/components/memoroll/creator/shots-step';
import TimeStep from '@/components/memoroll/creator/time-step';
import VenueStep from '@/components/memoroll/creator/venue-step';
import VibeStep from '@/components/memoroll/creator/vibe-step';
import WelcomeScreen from '@/components/memoroll/creator/welcome-screen';
import { ChevronLeftIcon } from '@/components/memoroll/ui/icons';
import { colour } from '@/components/memoroll/ui/tokens';
import {
  COVER_SLOTS,
  LAST_STEP,
  type MemorollDraft,
} from '@/components/memoroll/creator/draft';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import DemoDock from '../demo-dock';
import { SAMPLE_SOURCES } from '../mock';
import { REDUCED_FADE, screenVariants } from '../variants';

/** Where the QR sends a guest, once the browser has told us where we are. */
const GUEST_PATH = '/memoroll/demo';

/**
 * What the demo opens on: the design's own answers, so every step matches the
 * frame it was built from without anybody typing.
 *
 * The event's name is the one the design writes on the field and under the QR.
 * The design writes a different one on the Cover - "Elias & Freya's wedding" -
 * and that is the guest Cover's own example content rather than a second
 * answer: once the Cover is actually fed the creator's draft, as it is here,
 * there is only one name and this is it.
 */
const DESIGNED_DRAFT: MemorollDraft = {
  vibe: 'wedding',
  eventName: 'Freya & Elias’ Wedding',
  coverStyle: 'collage',
  photos: [
    SAMPLE_SOURCES[0],
    SAMPLE_SOURCES[1],
    ...Array<null>(COVER_SLOTS - 2).fill(null),
  ],
  opensOn: '03/05/2026',
  opensAt: '07:15 PM',
  venue: 'Park Hyatt Jakarta',
  address: 'Jl. M.H. Thamrin',
  onlyAtTheVenue: true,
  shotsPerGuest: 10,
  revealOn: '03/05/2026',
  revealAt: '07:15 PM',
};

/** The stack behind the welcome's sentence. */
const WELCOME_PHOTOS = SAMPLE_SOURCES.slice(2, 6);

type View =
  | { kind: 'welcome' }
  | { kind: 'step'; step: number }
  | { kind: 'preview' };

/**
 * The creator walkthrough: the welcome, the eight steps in the order the
 * steppers give, and the QR bottomsheet the last one hands over.
 *
 * Local state only. Nothing here fetches and nothing saves - the screens live
 * in `src/components/memoroll/creator/` and take a plain draft, so the product
 * will render exactly these with a record behind them (ADR 0007). This file is
 * the demo's half of that: the draft, and the state a surface has to hold.
 */
export default function CreatorDemo() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<View>({ kind: 'welcome' });
  const [draft, setDraft] = useState<MemorollDraft>(DESIGNED_DRAFT);
  const [qrOpen, setQrOpen] = useState(false);
  const [origin, setOrigin] = useState('');

  // Read after mount rather than during render, so the first client render is
  // the server's and the QR is not a hydration mismatch.
  useEffect(() => setOrigin(window.location.origin), []);

  const patch = (partial: Partial<MemorollDraft>) =>
    setDraft((previous) => ({ ...previous, ...partial }));

  const goToStep = (step: number) =>
    setView({ kind: 'step', step: Math.min(Math.max(step, 1), LAST_STEP) });

  const step = view.kind === 'step' ? view.step : 0;
  const next = () => goToStep(step + 1);
  const back = () => goToStep(step - 1);

  /**
   * Hold a picked photograph the way a surface with no backend can: as an
   * object URL. The product will upload the same file instead, which is why
   * the step hands one up rather than a URL it invented (ADR 0007).
   *
   * The URL it replaces is released, because a demo left open while somebody
   * tries six photographs in one slot would otherwise hold all six in memory.
   */
  const setPhoto = (slot: number, photo: File) =>
    setDraft((previous) => {
      const photos = [...previous.photos];
      const replaced = photos[slot];
      if (replaced?.startsWith('blob:')) URL.revokeObjectURL(replaced);
      photos[slot] = URL.createObjectURL(photo);
      return { ...previous, photos };
    });

  const guestUrl = `${origin}${GUEST_PATH}`;

  /**
   * Hand the link over the way the phone offers to.
   *
   * The design draws no confirmation, so there is none to draw: the share sheet
   * is its own answer, and the clipboard fallback is what a desktop browser
   * leaves when there is no sheet to open.
   */
  const shareLink = () => {
    if (typeof navigator === 'undefined') return;
    if (navigator.share) {
      navigator.share({ title: draft.eventName, url: guestUrl }).catch(() => {
        // Somebody dismissed the sheet. That is an answer, not a failure.
      });
      return;
    }
    navigator.clipboard?.writeText(guestUrl).catch(() => {
      // A context that refuses the clipboard still has the link on screen.
    });
  };

  return (
    <div className="min-h-[100dvh] bg-[#e8e4dd] transition-colors duration-300">
      <div
        className="relative mx-auto flex min-h-[100dvh] max-w-[430px] flex-col overflow-x-clip shadow-2xl"
        style={{
          background: view.kind === 'welcome' ? colour.ink : colour.paper,
        }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view.kind === 'step' ? `step-${view.step}` : view.kind}
            variants={reduce ? undefined : screenVariants}
            initial={reduce ? { opacity: 0 } : 'enter'}
            animate={
              reduce ? { opacity: 1, transition: REDUCED_FADE } : 'center'
            }
            exit={reduce ? { opacity: 0, transition: REDUCED_FADE } : 'exit'}
            className="flex min-h-[100dvh] flex-col">
            {view.kind === 'welcome' && (
              <WelcomeScreen
                photos={WELCOME_PHOTOS}
                onStart={() => goToStep(1)}
              />
            )}

            {/* The design draws a Preview button and no Preview screen, so
                this is the smallest thing that button can honestly do: the
                Cover at full size, with the same round flame control the QR
                sheet is left by. No new vocabulary, and nothing invented that
                the design would have had to draw. */}
            {view.kind === 'preview' && (
              <div className="relative flex min-h-full flex-1 flex-col">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => goToStep(LAST_STEP)}
                  className="absolute left-[16px] top-[16px] z-20 flex h-[44px] w-[48px] items-center justify-center rounded-full"
                  style={{ background: colour.flame, color: '#fafafa' }}>
                  <ChevronLeftIcon className="h-[24px] w-[24px]" />
                </button>
                <Cover
                  eventName={draft.eventName}
                  photos={draft.photos}
                  style={draft.coverStyle}
                  onEnter={() => goToStep(LAST_STEP)}
                />
              </div>
            )}

            {step === 1 && (
              <VibeStep
                vibe={draft.vibe}
                onChange={(vibe) => patch({ vibe })}
                onContinue={next}
              />
            )}
            {step === 2 && (
              <NameStep
                eventName={draft.eventName}
                onChange={(eventName) => patch({ eventName })}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 3 && (
              <CoverStep
                eventName={draft.eventName}
                coverStyle={draft.coverStyle}
                photos={draft.photos}
                onStyleChange={(coverStyle) => patch({ coverStyle })}
                onPhotoChange={setPhoto}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 4 && (
              <TimeStep
                opensOn={draft.opensOn}
                opensAt={draft.opensAt}
                onChange={patch}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 5 && (
              <VenueStep
                venue={draft.venue}
                address={draft.address}
                onlyAtTheVenue={draft.onlyAtTheVenue}
                onChange={patch}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 6 && (
              <ShotsStep
                shotsPerGuest={draft.shotsPerGuest}
                onChange={(shotsPerGuest) => patch({ shotsPerGuest })}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 7 && (
              <RevealStep
                revealOn={draft.revealOn}
                revealAt={draft.revealAt}
                onChange={patch}
                onBack={back}
                onCreate={next}
              />
            )}
            {step === 8 && (
              <PublishStep
                eventName={draft.eventName}
                coverStyle={draft.coverStyle}
                photos={draft.photos}
                onEdit={() => goToStep(1)}
                onPreview={() => setView({ kind: 'preview' })}
                onShowQr={() => setQrOpen(true)}
                onPublish={() => setQrOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {qrOpen && (
            <QrSheet
              eventName={draft.eventName}
              url={guestUrl}
              onClose={() => setQrOpen(false)}
              onShareLink={shareLink}
            />
          )}
        </AnimatePresence>
      </div>

      <DemoDock chipLabel="demo · creator">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#212121]/50">
          Demo · creator side
        </p>
        <div className="mt-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              setQrOpen(false);
              setView({ kind: 'welcome' });
            }}
            className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#ff3e09] hover:bg-[#fff1ed]">
            Start again
          </button>
          <button
            type="button"
            onClick={() => {
              setQrOpen(false);
              setDraft(DESIGNED_DRAFT);
            }}
            className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#212121] hover:bg-[#f2efe9]">
            Reset the answers
          </button>
          <a
            href={GUEST_PATH}
            className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#212121] hover:bg-[#f2efe9]">
            Open the guest demo
          </a>
        </div>
      </DemoDock>
    </div>
  );
}
