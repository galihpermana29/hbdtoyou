'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import DemoDock from '../demo-dock';
import { DemoSkipLink, PillButton } from '../ui';
import { REDUCED_FADE, screenVariants } from '../variants';
import { StepProps, useCreatorState } from './config';
import ManageView from './manage';
import EventStep from './steps/event';
import FilmStep from './steps/film';
import PlaceStep from './steps/place';
import RevealStep from './steps/reveal';
import ShareStep from './steps/share';

interface WizardStep {
  key: string;
  /** The handwritten step title. */
  title: string;
  screen: React.ComponentType<StepProps>;
}

/**
 * The setup, one step per gate in the designer's flowchart. The step-array
 * shape mirrors the wedding Create Flow's wizard so a future integration
 * lifts steps rather than rewriting them; the visual style is Randos.
 */
const STEPS: WizardStep[] = [
  { key: 'event', title: 'First, the day itself', screen: EventStep },
  { key: 'reveal', title: 'Nobody peeks til the reveal', screen: RevealStep },
  { key: 'place', title: 'Only where the party is', screen: PlaceStep },
  { key: 'film', title: 'How much film to hand out', screen: FilmStep },
  { key: 'share', title: 'Put it on the tables', screen: ShareStep },
];

type View = { kind: 'wizard'; step: number } | { kind: 'manage' };

/**
 * The creator walkthrough: the five-step setup wizard on the paper ground,
 * and the live manage view on the camera's dark ground. The look left the
 * wizard when the film choice moved to the guest's shutter (hbd-xs7).
 * Local state only; no backend is called anywhere here.
 */
export default function CreatorDemo() {
  const reduce = useReducedMotion();
  const {
    config,
    patchConfig,
    hiddenIds,
    toggleHidden,
    unhideAll,
    published,
    setPublished,
    resetAll,
    hydrated,
  } = useCreatorState();
  const [view, setView] = useState<View | null>(null);

  // Wait for localStorage before choosing a side: a published MemoRoll
  // reopens on its live view, an unpublished one on its setup.
  if (hydrated && view === null) {
    setView(published ? { kind: 'manage' } : { kind: 'wizard', step: 0 });
  }

  const goNext = () => {
    setView((v) => {
      if (v?.kind !== 'wizard') return v;
      if (v.step >= STEPS.length - 1) {
        setPublished(true);
        return { kind: 'manage' };
      }
      return { kind: 'wizard', step: v.step + 1 };
    });
  };

  const goBack = () => {
    setView((v) =>
      v?.kind === 'wizard' && v.step > 0
        ? { kind: 'wizard', step: v.step - 1 }
        : v
    );
  };

  const dark = view?.kind === 'manage';
  const step = view?.kind === 'wizard' ? STEPS[view.step] : null;
  const stepIndex = view?.kind === 'wizard' ? view.step : 0;
  const lastStep = stepIndex === STEPS.length - 1;
  const StepScreen = step?.screen;

  return (
    <div
      className={`min-h-[100dvh] transition-colors duration-300 ${
        dark ? 'bg-[#161616]' : 'bg-[#e8e4dd]'
      }`}>
      <div
        className={`relative mx-auto flex min-h-[100dvh] max-w-[430px] flex-col overflow-x-clip shadow-2xl ${
          dark ? 'bg-[#212121]' : 'bg-[#f7f5f3]'
        }`}>
        <AnimatePresence mode="wait" initial={false}>
          {view && (
            <motion.div
              key={view.kind === 'wizard' ? `step-${view.step}` : 'manage'}
              variants={reduce ? undefined : screenVariants}
              initial={reduce ? { opacity: 0 } : 'enter'}
              animate={
                reduce ? { opacity: 1, transition: REDUCED_FADE } : 'center'
              }
              exit={reduce ? { opacity: 0, transition: REDUCED_FADE } : 'exit'}
              className="flex min-h-[100dvh] flex-col">
              {view.kind === 'manage' ? (
                <ManageView
                  config={config}
                  hiddenIds={hiddenIds}
                  toggleHidden={toggleHidden}
                  onEditSetup={() => setView({ kind: 'wizard', step: 0 })}
                />
              ) : (
                StepScreen &&
                step && (
                  <div className="flex flex-1 flex-col px-6 pb-10 pt-6">
                    <div className="relative">
                      {stepIndex > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          aria-label="Back a step"
                          className="absolute -left-3 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-[#212121]/15 bg-white text-[18px] text-[#212121] shadow-sm">
                          ‹
                        </button>
                      )}
                      <p
                        className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#212121]/50"
                        style={{ fontFamily: 'var(--font-mr-ui)' }}>
                        Set up your Memoroll · {stepIndex + 1} of {STEPS.length}
                      </p>
                      <div className="mt-2 flex justify-center gap-1.5">
                        {STEPS.map((s, i) => (
                          <span
                            key={s.key}
                            className={`h-[5px] rounded-full transition-all duration-300 ${
                              i === stepIndex
                                ? 'w-[22px] bg-[#ff3e09]'
                                : 'w-[5px] bg-[#212121]/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h1
                      className="mt-4 px-2 text-center text-[26px] leading-[1.9] text-[#212121]"
                      style={{ fontFamily: 'var(--font-mr-hand)' }}>
                      {step.title}
                    </h1>

                    <div className="mt-6 flex-1">
                      <StepScreen config={config} patch={patchConfig} />
                    </div>

                    <div className="mx-auto mt-10 w-[85%]">
                      <PillButton onClick={goNext}>
                        {lastStep ? 'Publish my Memoroll' : 'Next'}
                      </PillButton>
                      {published && (
                        <div className="mt-3">
                          <DemoSkipLink
                            onClick={() => setView({ kind: 'manage' })}>
                            back to the live view
                          </DemoSkipLink>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DemoDock chipLabel={`demo · ${dark ? 'live view' : 'setup'}`}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#212121]/50">
          Demo · creator side
        </p>
        <div className="mt-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              setPublished(true);
              setView({ kind: 'manage' });
            }}
            className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#212121] hover:bg-[#f2efe9]">
            Skip to the live view
          </button>
          <button
            type="button"
            onClick={unhideAll}
            className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#212121] hover:bg-[#f2efe9]">
            Unhide every shot
          </button>
        </div>
        <div className="mt-3 border-t border-[#212121]/10 pt-2">
          <button
            type="button"
            onClick={() => {
              resetAll();
              setView({ kind: 'wizard', step: 0 });
            }}
            className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#ff3e09] hover:bg-[#fff1ed]">
            Restart the setup
          </button>
          <a
            href="/memoroll/demo"
            className="block w-full rounded-full px-3 py-1.5 text-left text-[12px] text-[#212121] hover:bg-[#f2efe9]">
            Open the guest demo
          </a>
        </div>
      </DemoDock>
    </div>
  );
}
