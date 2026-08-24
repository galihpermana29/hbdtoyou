'use client';

import CameraScreen from '@/components/memoroll/guest/camera-screen';
import Cover from '@/components/memoroll/guest/cover';
import CountdownScreen from '@/components/memoroll/guest/countdown-screen';
import DarkRoomScreen from '@/components/memoroll/guest/darkroom-screen';
import {
  DEFAULT_FILM,
  normalizeStoredFilm,
  type SelectableFilmId,
} from '@/components/memoroll/guest/films';
import GalleryScreen, {
  type GalleryTab,
  type RevealClock,
} from '@/components/memoroll/guest/gallery-screen';
import type {
  GalleryGroup,
  GalleryPhoto,
} from '@/components/memoroll/guest/roll';
import LocationScreen, {
  type LocationState,
} from '@/components/memoroll/guest/location-screen';
import UsernameScreen from '@/components/memoroll/guest/username-screen';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import DemoControl, {
  DemoLighting,
  DemoPhase,
  DemoRoll,
  LIGHTING_SIMULATED,
} from './demo-control';
import { homemadeApple, poppins } from './fonts';
import {
  GALLERY_REMAINING,
  GALLERY_TALLY,
  MOCK_ALL_ROLL,
  MOCK_OWN_SHOTS,
  MOCK_WEDDING,
  REVEAL_ENDED_ON,
  SAMPLE_SOURCES,
  STAMP_DATE,
  VIEWFINDER_FALLBACK,
  type MockRollPhoto,
} from './mock';
import SsoLoginScreen from './screens/sso-login';
import { useShots, type Shot } from './use-shots';
import { REDUCED_FADE, screenVariants } from './variants';

/** The guest's last film pick survives a reload along with the roll. */
const FILM_STORAGE_KEY = 'memoroll-demo:film';

type Screen =
  | 'cover'
  | 'countdown'
  | 'sso'
  | 'username'
  | 'location'
  | 'camera'
  | 'gallery'
  | 'darkroom';

/** A photo with the heading its group sits under, before grouping. */
type RollEntry = { photo: GalleryPhoto; groupLabel: string };

/** One live camera Shot as a gallery entry, grouped under its capture time. */
function liveShotEntry(shot: Shot, handle: string): RollEntry {
  const at = new Date(shot.takenAt);
  const hour12 = ((at.getHours() + 11) % 12) + 1;
  const half = at.getHours() < 12 ? 'am' : 'pm';
  const minutes = String(at.getMinutes()).padStart(2, '0');
  return {
    photo: {
      id: shot.id,
      src: shot.url,
      // The Date Stamp is already baked into the pixels (ADR 0006).
      stamp: null,
      shooter: handle,
      own: true,
    },
    groupLabel: `May 3 at ${String(hour12).padStart(2, '0')}:${minutes}${half}`,
  };
}

/** One designed mock Shot as a gallery entry, signed with the guest's handle. */
function mockShotEntry(
  mock: Omit<MockRollPhoto, 'shooter'>,
  handle: string
): RollEntry {
  return {
    photo: {
      id: mock.id,
      src: mock.src,
      stamp: mock.stamp,
      shooter: handle,
      own: true,
    },
    groupLabel: mock.groupLabel,
  };
}

/** Fold a roll into the gallery's time groups, first-seen order kept. */
function groupRoll(entries: RollEntry[]): GalleryGroup[] {
  const order: string[] = [];
  const byLabel = new Map<string, GalleryPhoto[]>();
  entries.forEach(({ photo, groupLabel }) => {
    if (!byLabel.has(groupLabel)) {
      order.push(groupLabel);
      byLabel.set(groupLabel, []);
    }
    byLabel.get(groupLabel)!.push(photo);
  });
  return order.map((label) => ({ label, photos: byLabel.get(label)! }));
}

/**
 * The guest walkthrough: Cover -> countdown or sign-in -> "This you?" ->
 * location -> camera -> gallery -> the Dark Room. Local state only; nothing
 * here calls a backend.
 *
 * The screens themselves live in `src/components/memoroll/guest/` and take
 * plain props, so the real product renders exactly these components with real
 * data behind them (ADR 0007). This file is the demo's half of that: mock data,
 * and the state a surface has to hold - which for the gallery is the two
 * independent gates. The event phase gates everyone else's Shots; the guest's
 * own Roll answers only to its own develop, and the dock carries them as two
 * separate dials so their independence can be walked, not just read about.
 *
 * The camera holds no store of its own (ADR 0007), so this file also owns
 * what the camera only renders: the guest's film pick and its localStorage
 * memory, whether the How popup has been seen this walkthrough, and the
 * dock's stand-in for lighting hardware nobody's laptop has.
 */
export default function MemorollDemo() {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<Screen>('cover');
  const [phase, setPhase] = useState<DemoPhase>('during');
  const [roll, setRoll] = useState<DemoRoll>('live');
  const [developedByHand, setDevelopedByHand] = useState(false);
  const [galleryTab, setGalleryTab] = useState<GalleryTab>('all');
  const [darkRoomHeld, setDarkRoomHeld] = useState(false);
  const [swipeCueSeen, setSwipeCueSeen] = useState(false);
  const [howSeen, setHowSeen] = useState(false);
  const [location, setLocation] = useState<LocationState>('asking');
  const [handle, setHandle] = useState('dhilafadhila');
  const [film, setFilm] = useState<SelectableFilmId>(DEFAULT_FILM);
  const [lighting, setLighting] = useState<DemoLighting>('detected');
  const { shots, addShot, clearShots, remaining } = useShots();

  useEffect(() => {
    try {
      setFilm(
        normalizeStoredFilm(window.localStorage.getItem(FILM_STORAGE_KEY))
      );
    } catch {
      // A blocked store just means the roll opens on the default film.
    }
  }, []);

  const pickFilm = (id: SelectableFilmId) => {
    setFilm(id);
    try {
      window.localStorage.setItem(FILM_STORAGE_KEY, id);
    } catch {
      // Quota or privacy mode: the pick still holds in memory.
    }
  };

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
    // The How popup rides over the camera itself, shown once on first entry.
    setScreen(phase === 'during' ? 'camera' : 'gallery');
  };

  const changePhase = (next: DemoPhase) => {
    setPhase(next);
    // The door opens the moment the demo clock says the event started.
    if (screen === 'countdown' && next !== 'before') setScreen('sso');
    // And walking back in time from the roll returns to the closed one.
    if (screen !== 'cover' && next === 'before') setScreen('countdown');
  };

  /** A guest's own Roll, from whichever dial the dock is on. */
  const ownEntries: RollEntry[] =
    roll === 'live'
      ? shots.map((shot) => liveShotEntry(shot, handle))
      : MOCK_OWN_SHOTS.slice(0, roll === 'nine' ? 9 : 10).map((mock) =>
          mockShotEntry(mock, handle)
        );

  const ownRemaining = roll === 'live' ? remaining : roll === 'nine' ? 1 : 0;
  const ownDeveloped = roll === 'developed' || developedByHand;
  const eventOver = phase === 'developing' || phase === 'revealed';
  /**
   * The Develop CTA appears at zero shots - or at the event's end for a guest
   * who never spent all ten, so nobody is stranded undeveloped forever.
   */
  const canDevelop = ownEntries.length > 0 && (ownRemaining === 0 || eventOver);

  const allEntries: RollEntry[] = [
    ...MOCK_ALL_ROLL.map((mock) => ({
      photo: {
        id: mock.id,
        src: mock.src,
        stamp: mock.stamp,
        shooter: mock.shooter,
        own: false,
      },
      groupLabel: mock.groupLabel,
    })),
    ...ownEntries,
  ];

  const reveal: RevealClock =
    phase === 'revealed'
      ? { state: 'past', endedOn: REVEAL_ENDED_ON }
      : { state: 'counting', remaining: GALLERY_REMAINING };

  const changeRoll = (next: DemoRoll) => {
    setRoll(next);
    setDevelopedByHand(false);
  };

  const openGallery = () => {
    setScreen(phase === 'before' ? 'countdown' : 'gallery');
  };

  const pinDarkRoom = () => {
    // A bath with nothing in it develops nothing: hand it the designed roll.
    if (ownEntries.length === 0) changeRoll('spent');
    setDarkRoomHeld(true);
    setScreen('darkroom');
  };

  const dark = screen === 'camera' || screen === 'darkroom';

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
            {screen === 'camera' && (
              <CameraScreen
                remaining={remaining}
                galleryCount={allEntries.length}
                film={film}
                onPickFilm={pickFilm}
                onShot={addShot}
                onOpenGallery={() => setScreen('gallery')}
                showHow={!howSeen}
                onHowSeen={() => setHowSeen(true)}
                fallbackSrc={VIEWFINDER_FALLBACK}
                stampDate={STAMP_DATE}
                stampFonts={{
                  hand: homemadeApple.style.fontFamily,
                  ui: poppins.style.fontFamily,
                }}
                simulatedLighting={LIGHTING_SIMULATED[lighting]}
              />
            )}
            {screen === 'gallery' && (
              <GalleryScreen
                eventName={MOCK_WEDDING.title}
                photoCount={GALLERY_TALLY.photos}
                participantCount={GALLERY_TALLY.participants}
                reveal={reveal}
                all={groupRoll(allEntries)}
                own={groupRoll(ownEntries)}
                ownDeveloped={ownDeveloped}
                canDevelop={canDevelop}
                tab={galleryTab}
                onTabChange={setGalleryTab}
                onDevelop={() => {
                  setDarkRoomHeld(false);
                  setScreen('darkroom');
                }}
                onBack={() =>
                  setScreen(phase === 'during' ? 'camera' : 'cover')
                }
                showSwipeCue={!swipeCueSeen}
                onSwipeCueSeen={() => setSwipeCueSeen(true)}
              />
            )}
            {screen === 'darkroom' && (
              <DarkRoomScreen
                photos={ownEntries.map((entry) => entry.photo)}
                hold={darkRoomHeld}
                onDeveloped={() => {
                  setDevelopedByHand(true);
                  setGalleryTab('myroll');
                  setScreen('gallery');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DemoControl
        phase={phase}
        onPhaseChange={changePhase}
        roll={roll}
        onRollChange={changeRoll}
        lighting={lighting}
        onLightingChange={setLighting}
        onOpenGallery={openGallery}
        onPinDarkRoom={pinDarkRoom}
        onReloadFilm={() => {
          clearShots();
          setDevelopedByHand(false);
        }}
        onRestart={() => {
          setLocation('asking');
          setGalleryTab('all');
          setSwipeCueSeen(false);
          setHowSeen(false);
          setScreen('cover');
        }}
      />
    </div>
  );
}
