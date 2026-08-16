'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import DemoControl, { DemoPhase } from './demo-control';
import CameraScreen from './screens/camera';
import GalleryScreen from './screens/gallery';
import LandingScreen from './screens/landing';
import LocationGateScreen from './screens/location-gate';
import OnboardScreen from './screens/onboard';
import SsoLoginScreen from './screens/sso-login';
import TimeGateScreen from './screens/time-gate';
import { useShots } from './use-shots';
import { REDUCED_FADE, screenVariants } from './variants';

type Screen =
  'landing' | 'gate' | 'sso' | 'location' | 'onboard' | 'camera' | 'gallery';

/**
 * The guest walkthrough, following the designer's MVP flowchart:
 * landing -> time gate -> SSO -> location gate -> onboard -> camera ->
 * gallery, with the gallery's ending decided by where the demo phase says
 * the event stands. Local state only; no backend is called anywhere here.
 */
export default function MemorollDemo() {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<Screen>('landing');
  const [phase, setPhase] = useState<DemoPhase>('during');
  const { shots, addShot, clearShots, remaining } = useShots();

  const enterFromLanding = () => {
    setScreen(phase === 'before' ? 'gate' : 'sso');
  };

  const passLocation = () => {
    // After the event there is nothing left to shoot: straight to the roll.
    setScreen(phase === 'during' ? 'onboard' : 'gallery');
  };

  const changePhase = (next: DemoPhase) => {
    setPhase(next);
    // The gate opens the moment the demo clock says the event started.
    if (screen === 'gate' && next !== 'before') setScreen('sso');
    // And walking back in time from the roll returns to the closed door.
    if (screen !== 'landing' && next === 'before') setScreen('gate');
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
            {screen === 'landing' && (
              <LandingScreen onEnter={enterFromLanding} />
            )}
            {screen === 'gate' && (
              <TimeGateScreen onBack={() => setScreen('landing')} />
            )}
            {screen === 'sso' && (
              <SsoLoginScreen onSignedIn={() => setScreen('location')} />
            )}
            {screen === 'location' && (
              <LocationGateScreen onPassed={passLocation} />
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
        onRestart={() => setScreen('landing')}
      />
    </div>
  );
}
