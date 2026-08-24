'use client';

import Cover from '@/components/memoroll/guest/cover';
import CountdownScreen from '@/components/memoroll/guest/countdown-screen';
import LocationScreen, {
  type LocationState,
} from '@/components/memoroll/guest/location-screen';
import UsernameScreen from '@/components/memoroll/guest/username-screen';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import DemoControl, { DemoPhase } from './demo-control';
import { MOCK_WEDDING, SAMPLE_SOURCES } from './mock';
import CameraScreen from './screens/camera';
import GalleryScreen from './screens/gallery';
import OnboardScreen from './screens/onboard';
import SsoLoginScreen from './screens/sso-login';
import { useShots } from './use-shots';
import { REDUCED_FADE, screenVariants } from './variants';

type Screen =
  | 'cover'
  | 'countdown'
  | 'sso'
  | 'username'
  | 'location'
  | 'onboard'
  | 'camera'
  | 'gallery';

/**
 * The guest walkthrough: Cover -> countdown or sign-in -> "This you?" ->
 * location -> camera -> gallery. Local state only; nothing here calls a
 * backend.
 *
 * The screens themselves live in `src/components/memoroll/guest/` and take
 * plain props, so the real product renders exactly these components with real
 * data behind them (ADR 0007). This file is the demo's half of that: mock data,
 * and the state a surface has to hold.
 *
 * The camera, the gallery and the onboarding are still the old design, and are
 * replaced by hbd-qti.2 and hbd-qti.3.
 */
export default function MemorollDemo() {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<Screen>('cover');
  const [phase, setPhase] = useState<DemoPhase>('during');
  const [location, setLocation] = useState<LocationState>('asking');
  const [handle, setHandle] = useState('dhilafadhila');
  const { shots, addShot, clearShots, remaining } = useShots();

  const enterFromCover = () => {
    setScreen(phase === 'before' ? 'countdown' : 'sso');
  };

  /**
   * The demo walks through Location Blocked once on the way in, because it is
   * one of the designed screens and a walkthrough that never reaches it would
   * be hiding a third of what the gate does. A guest with a real phone either
   * is at the venue or is not.
   */
  const answerLocation = () => {
    if (location === 'asking') {
      setLocation('blocked');
      return;
    }
    setLocation('asking');
    // After the event there is nothing left to shoot: straight to the roll.
    setScreen(phase === 'during' ? 'onboard' : 'gallery');
  };

  const changePhase = (next: DemoPhase) => {
    setPhase(next);
    // The door opens the moment the demo clock says the event started.
    if (screen === 'countdown' && next !== 'before') setScreen('sso');
    // And walking back in time from the roll returns to the closed one.
    if (screen !== 'cover' && next === 'before') setScreen('countdown');
  };

  const galleryPhase = phase === 'before' ? 'during' : phase;
  const dark = screen === 'camera';

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
          <motion.div
            key={screen}
            variants={reduce ? undefined : screenVariants}
            initial={reduce ? { opacity: 0 } : 'enter'}
            animate={
              reduce ? { opacity: 1, transition: REDUCED_FADE } : 'center'
            }
            exit={reduce ? { opacity: 0, transition: REDUCED_FADE } : 'exit'}
            className="flex min-h-[100dvh] flex-col">
            {screen === 'cover' && (
              <Cover
                eventName={MOCK_WEDDING.title}
                photos={SAMPLE_SOURCES.slice(0, 6)}
                style="collage"
                ctaLabel="Get me in"
                onEnter={enterFromCover}
              />
            )}
            {screen === 'countdown' && (
              <CountdownScreen
                remaining={{ days: 6, hours: 7, minutes: 6, seconds: 7 }}
              />
            )}
            {screen === 'sso' && (
              <SsoLoginScreen onSignedIn={() => setScreen('username')} />
            )}
            {screen === 'username' && (
              <UsernameScreen
                handle={handle}
                onConfirm={(next) => {
                  setHandle(next);
                  setScreen('location');
                }}
              />
            )}
            {screen === 'location' && (
              <LocationScreen state={location} onAct={answerLocation} />
            )}
            {screen === 'onboard' && (
              <OnboardScreen onDone={() => setScreen('camera')} />
            )}
            {screen === 'camera' && (
              <CameraScreen
                remaining={remaining}
                lastShot={shots.length ? shots[shots.length - 1] : null}
                onCapture={addShot}
                onOpenGallery={() => setScreen('gallery')}
              />
            )}
            {screen === 'gallery' && (
              <GalleryScreen
                phase={galleryPhase}
                shots={shots}
                onBackToCamera={
                  phase === 'during' ? () => setScreen('camera') : undefined
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DemoControl
        phase={phase}
        onPhaseChange={changePhase}
        onReloadFilm={clearShots}
        onRestart={() => {
          setLocation('asking');
          setScreen('cover');
        }}
      />
    </div>
  );
}
