'use client';

import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
  IMemorollGalleryEvent,
  IMemorollGalleryPhoto,
  MemorollPhase,
} from '@/action/interfaces';
// Browser-to-backend since 2026-08-30: the join, the refresh and the poll
// are all calls a guest is actively living inside - see
// memoroll-client-api.ts for why they skip the server-action middleman.
import {
  readMemorollGalleryClient,
  sendMemorollWelcomeClient,
} from '@/action/memoroll-client-api';
import CameraScreen from '@/components/memoroll/guest/camera-screen';
import CountdownScreen from '@/components/memoroll/guest/countdown-screen';
import Cover from '@/components/memoroll/guest/cover';
import {
  DEFAULT_FILM,
  normalizeStoredFilm,
  type SelectableFilmId,
} from '@/components/memoroll/guest/films';
import DarkRoomScreen from '@/components/memoroll/guest/darkroom-screen';
import GalleryScreen, {
  type GalleryTab,
  type RevealClock,
} from '@/components/memoroll/guest/gallery-screen';
import type {
  GalleryGroup,
  GalleryPhoto,
} from '@/components/memoroll/guest/roll';
import UsernameScreen from '@/components/memoroll/guest/username-screen';
import type { Remaining } from '@/components/memoroll/ui/flip-counter';
import { colour } from '@/components/memoroll/ui/tokens';
import { useMemoifyProfile, useMemoifySession } from '@/app/session-provider';
import { removeSession } from '@/store/get-set-session';
// The motion constants and the camera's stamp faces are the demo's, on
// purpose: one source each, so the product and the walkthrough cannot drift
// (ADR 0007; the legacy faces are hbd-3i5's to retire).
import { homemadeApple, poppins } from '@/app/memoroll/demo/fonts';
import {
  directionBetween,
  pushVariants,
  reducedScreenVariants,
} from '@/components/memoroll/ui/motion';
import PushScreen from '@/components/memoroll/ui/push-screen';
import Toast from '@/components/memoroll/ui/toast';
import { useRoll } from './use-roll';

type Screen =
  'cover' | 'countdown' | 'username' | 'camera' | 'gallery' | 'darkroom';

/** How deep each screen sits in the guest's way through. */
const SCREEN_RANK: Record<Screen, number> = {
  cover: 0,
  countdown: 1,
  username: 1,
  camera: 2,
  gallery: 3,
  darkroom: 4,
};

/** The Reveal for a guest's own clock: "Fri 13 Nov, 21:00". */
function revealLabelFor(at: Date): string {
  return isNaN(at.getTime())
    ? ''
    : at.toLocaleString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
}

/** A photo with the heading its group sits under, before grouping. */
type RollEntry = { photo: GalleryPhoto; groupLabel: string };

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** The gallery's time heading, the way the design writes it: "May 3 at 07:30pm". */
function groupLabelFor(at: Date): string {
  const hour12 = ((at.getHours() + 11) % 12) + 1;
  const half = at.getHours() < 12 ? 'am' : 'pm';
  const minutes = String(at.getMinutes()).padStart(2, '0');
  return `${MONTHS[at.getMonth()]} ${at.getDate()} at ${String(hour12).padStart(
    2,
    '0'
  )}:${minutes}${half}`;
}

/** The Date Stamp the camera burns, in the redesign's own spelling:
 *  `5 3 ‘26` for May 3rd 2026 - month, day, curly-quoted year (the exact
 *  string the gallery's mock prints carry as PRINT_STAMP). */
function stampDateFor(at: Date): string {
  return `${at.getMonth() + 1} ${at.getDate()} ‘${String(
    at.getFullYear() % 100
  ).padStart(2, '0')}`;
}

/** "4th" for 4, because the reveal's ended-on line spells its day that way. */
function ordinal(day: number): string {
  const tens = day % 100;
  if (tens >= 11 && tens <= 13) return `${day}th`;
  const suffix = ['th', 'st', 'nd', 'rd'][day % 10] ?? 'th';
  return `${day}${suffix}`;
}

/** The reveal's past tense, the way the design writes it: "May 4th 2026, 12:00PM". */
function endedOnLabel(at: Date): string {
  const hour12 = ((at.getHours() + 11) % 12) + 1;
  const half = at.getHours() < 12 ? 'AM' : 'PM';
  const minutes = String(at.getMinutes()).padStart(2, '0');
  return `${MONTHS[at.getMonth()]} ${ordinal(at.getDate())} ${at.getFullYear()}, ${String(
    hour12
  ).padStart(2, '0')}:${minutes}${half}`;
}

/** What is left on a clock counting to `target`, floored at zero. */
function remainingUntil(target: number, now: number): Remaining {
  const left = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(left / 86_400),
    hours: Math.floor((left % 86_400) / 3_600),
    minutes: Math.floor((left % 3_600) / 60),
    seconds: left % 60,
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
 * The guest walkthrough with the event behind it: Cover -> the closed door or
 * "Get me in" -> "This you?" -> camera -> gallery. The same
 * screens the demo renders (ADR 0007); this file is the product's half - the
 * reads, the clock, and the Roll on its way to the event.
 *
 * Where each piece of truth lives (settled 2026-08-29):
 *
 * - The event keeps the Roll's count. `shots_remaining` is the server's,
 *   minus only the local tail still uploading, so a cleared browser refunds
 *   nothing and a second device shows the same Roll.
 * - The phase is the clock's. The server said where the event stood when the
 *   page opened; after that the schedule it handed over is enough, and the
 *   door opens or the Reveal arrives without a reload.
 * - Every print stays veiled until the Reveal has come AND this guest has
 *   pressed Develop My Roll, their own included (owner, 2026-11-13: like a
 *   disposable, nobody sees their own shots before the lab does). From
 *   2026-08-30 until then a guest's own prints were sharp from capture.
 * - The handle signs local prints only, until the backend has somewhere to
 *   put it (the display_name ask, 2026-08-29): everything the server echoes
 *   back is signed with the account's own name.
 */
export default function MemorollGuest({
  code,
  event,
}: {
  code: string;
  event: IMemorollGalleryEvent;
}) {
  const reduce = useReducedMotion();
  const session = useMemoifySession();
  const profile = useMemoifyProfile();

  const [screen, setScreen] = useState<Screen>('cover');
  const [galleryTab, setGalleryTab] = useState<GalleryTab>('all');
  const [handle, setHandle] = useState('');
  const [handleConfirmed, setHandleConfirmed] = useState(false);
  const [film, setFilm] = useState<SelectableFilmId>(DEFAULT_FILM);
  const [howSeen, setHowSeen] = useState(false);
  const [swipeCueSeen, setSwipeCueSeen] = useState(false);
  const [joining, setJoining] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  /** Whether this device's stored answers have been read yet - the walk-back-in
   *  waits for them, so a returning guest is not asked "This you?" twice. */
  const [deviceKnown, setDeviceKnown] = useState(false);
  /**
   * Whether THIS guest has opened the collective: past the Reveal the wall
   * stays Veiled until they press Develop My Roll and walk the Dark Room
   * (owner, 2026-08-30 - the unveiling is the guest's own act, not the
   * clock's). Per person per event, remembered on this device.
   */
  const [unveiled, setUnveiled] = useState(false);
  /** This tab pressed "Get me in" and went to Google. Its return finishes the
   *  press; a signed-in person opening the link cold carries no such mark and
   *  still joins by hand. */
  const [returningFromSignIn, setReturningFromSignIn] = useState(false);

  /** What the event has answered since joining. */
  const [serverPhotos, setServerPhotos] = useState<IMemorollGalleryPhoto[]>([]);
  const [participant, setParticipant] = useState<{
    shots_used: number;
    shots_remaining: number;
  } | null>(null);
  const [photoCount, setPhotoCount] = useState<number | null>(null);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startsMs = Date.parse(event.starts_at);
  /**
   * The Reveal. `ends_at` is it for every event this app creates - shooting
   * runs to the Reveal (CONTEXT.md) - and a foreign event with a later
   * `reveal_at` only reveals later than this clock says, never earlier,
   * because the server still withholds the photos.
   */
  const revealMs = Date.parse(event.ends_at);

  const phase: MemorollPhase =
    now < startsMs ? 'upcoming' : now < revealMs ? 'ongoing' : 'revealed';
  const revealed = phase === 'revealed';

  const userId = session?.userId ?? null;

  /**
   * Local state is scoped by the person, not just the event: a shared browser
   * is two guests, and an event-only key handed the second one the first
   * one's handle, develop state and upload queue (found live, 2026-08-29,
   * when a second test account skipped "This you?" and read the first
   * account's name). Nothing here is readable before sign-in, so a key
   * without a person has nobody to answer for.
   */
  const storageKey = useCallback(
    (what: string) => `memoroll:${code}:${userId}:${what}`,
    [code, userId]
  );

  /** The tab's own pre-sign-in mark. Deliberately not user-scoped: it is set
   *  before there is a user, and spent the moment there is one. */
  const enteringKey = `memoroll:${code}:entering`;

  // What this device already knows FOR THIS PERSON: the film pick, the
  // confirmed handle, the seen popups, and whether this Roll has been through
  // the Dark Room. Reset first, because this re-runs when the person changes
  // - a signed-out mount, or another account - and what it read for the last
  // one must not survive into this one.
  useEffect(() => {
    setHandleConfirmed(false);
    setHowSeen(false);
    setUnveiled(false);
    if (!userId) return;
    try {
      setFilm(
        normalizeStoredFilm(window.localStorage.getItem(storageKey('film')))
      );
      const storedHandle = window.localStorage.getItem(storageKey('handle'));
      if (storedHandle) {
        setHandle(storedHandle);
        setHandleConfirmed(true);
      }
      setHowSeen(window.localStorage.getItem(storageKey('how-seen')) === '1');
      setUnveiled(window.localStorage.getItem(storageKey('unveiled')) === '1');
    } catch {
      // A blocked store just means the defaults stand for this visit.
    }
    setDeviceKnown(true);
  }, [storageKey, userId]);

  // The walk-back-in mark, read once per mount - see the effect below.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(enteringKey) === '1') {
        window.sessionStorage.removeItem(enteringKey);
        setReturningFromSignIn(true);
      }
    } catch {
      // A blocked store means the guest presses Get me in once more.
    }
  }, [enteringKey]);

  // The signed-in identity is where the handle starts; theirs to correct on
  // "This you?", and the correction outlives the visit.
  useEffect(() => {
    if (!handleConfirmed && profile?.fullname) setHandle(profile.fullname);
  }, [handleConfirmed, profile?.fullname]);

  /**
   * The welcome email (2026-11-13): asked for once a "Get me in" has joined -
   * straight away, or on the way back from Google - and once per guest per
   * roll on this device, so walking back in through the Cover does not mail
   * the guest again. Never in the way: the guest walks on whatever the answer,
   * and a failed send is tried again on their next "Get me in".
   */
  const welcomedHere = useRef(false);
  /**
   * The welcome email, once per guest per event (owner, 2026-11-14: "only 1
   * ... save it on localstorage"). The mark goes down BEFORE the request, so
   * a second tap - or a tap while the first is still in flight - never sends
   * another. It is lifted again only when the request certainly never left
   * (no session to sign it with); a timeout or an error from the backend may
   * still have sent the email, so it stays down.
   */
  const sendWelcomeOnce = () => {
    if (!userId) return;
    const key = storageKey('welcomed');
    try {
      if (window.localStorage.getItem(key)) return;
      window.localStorage.setItem(key, String(Date.now()));
    } catch {
      // No store to keep the mark in: this tab's memory keeps it instead.
      if (welcomedHere.current) return;
    }
    welcomedHere.current = true;
    void sendMemorollWelcomeClient(code).then((answer) => {
      if (answer.success || answer.message !== 'You are not signed in') return;
      welcomedHere.current = false;
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Nothing was kept.
      }
    });
  };
  const remember = useCallback(
    (what: string, value: string) => {
      try {
        window.localStorage.setItem(storageKey(what), value);
      } catch {
        // Quota or privacy mode: the choice still holds in memory.
      }
    },
    [storageKey]
  );

  const pickFilm = (id: SelectableFilmId) => {
    setFilm(id);
    remember('film', id);
  };

  const onRegistered = useCallback((photo: IMemorollGalleryPhoto) => {
    setServerPhotos((previous) =>
      previous.some((existing) => existing.id === photo.id)
        ? previous
        : [...previous, photo]
    );
    setPhotoCount((count) => (count === null ? count : count + 1));
    setParticipant((previous) =>
      previous
        ? {
            shots_used: previous.shots_used + 1,
            shots_remaining: Math.max(0, previous.shots_remaining - 1),
          }
        : previous
    );
  }, []);

  const { pending, addShot } = useRoll(code, userId, {
    canUpload: phase === 'ongoing',
    displayName: handle,
    onRegistered,
  });

  /**
   * The Roll's true count: the event's, minus the tail it has not received
   * yet. Until the join answers, the whole limit stands so the camera is
   * never offered on numbers nobody vouched for.
   */
  const remaining = Math.max(
    0,
    (participant?.shots_remaining ?? event.shot_limit) - pending.length
  );

  const joined = participant !== null;

  /** Ask the event where things stand, as the participant this guest now is. */
  const refresh = useCallback(async () => {
    const answer = await readMemorollGalleryClient(code);
    if (!answer.success || !answer.data) return false;
    setServerPhotos(answer.data.photos ?? []);
    if (answer.data.participant) setParticipant(answer.data.participant);
    setPhotoCount(answer.data.photo_count ?? null);
    return true;
  }, [code]);

  /**
   * "Get me in". Before the door opens it leads to the closed one; signed
   * out it is the sign-in, which lands back on this address; signed in it
   * joins - the deliberate act the preview never performs - and walks on to
   * "This you?" or, after the Reveal, straight into the gallery.
   */
  const enterFromCover = async () => {
    setProblem(null);
    if (phase === 'upcoming') {
      setScreen('countdown');
      return;
    }
    if (!session?.accessToken) {
      // Mark this tab before leaving for Google, so the return can finish
      // the press instead of asking for it again. sessionStorage on purpose:
      // the mark must not outlive the tab or leak to a cold visit.
      try {
        window.sessionStorage.setItem(enteringKey, '1');
      } catch {
        // A blocked store means the guest presses Get me in once more.
      }
      signIn('google', { callbackUrl: `/memoroll/${code}` });
      return;
    }
    if (joining) return;
    setJoining(true);
    const landed = await refresh();
    setJoining(false);
    if (!landed) {
      setProblem('The roll could not be opened. Try again in a moment.');
      return;
    }
    sendWelcomeOnce();
    if (revealed) {
      setGalleryTab('all');
      setScreen('gallery');
      return;
    }
    setScreen(handleConfirmed ? 'camera' : 'username');
  };

  // The door opens the moment the clock says so: the closed screen walks
  // back to the Cover, whose button now leads in.
  useEffect(() => {
    if (screen === 'countdown' && phase !== 'upcoming') setScreen('cover');
  }, [phase, screen]);

  // The walk back in: a tab that pressed "Get me in" and went to Google
  // finishes that press on return - straight through the join, to "This
  // you?" or wherever the phase leads - instead of showing the Cover and
  // asking for the same press twice. Waits for the device's stored answers
  // so a guest who confirmed their handle before is not asked again, and
  // for the session, whose absence means the sign-in was abandoned and the
  // button simply remains. `enterFromCover` is deliberately not a
  // dependency: the spent flag makes this run at most once.
  useEffect(() => {
    if (!returningFromSignIn || !deviceKnown) return;
    if (!session?.accessToken) return;
    setReturningFromSignIn(false);
    void enterFromCover();
  }, [returningFromSignIn, deviceKnown, session?.accessToken]);

  /**
   * The walk back in for a guest who was already here: a stored handle for
   * this person and this roll means they joined on this device before, so a
   * reload carries them past the Cover instead of asking for a press they
   * already gave (owner's call, 2026-08-30). First-timers keep the
   * deliberate "Get me in" - and one attempt only, so a failed resume
   * leaves the Cover's own button rather than a loop.
   */
  const resumed = useRef(false);
  useEffect(() => {
    if (resumed.current) return;
    if (!deviceKnown || !handleConfirmed) return;
    if (!session?.accessToken || joining || joined) return;
    if (screen !== 'cover' || phase === 'upcoming') return;
    resumed.current = true;
    void enterFromCover();
  }, [
    deviceKnown,
    handleConfirmed,
    session?.accessToken,
    joining,
    joined,
    screen,
    phase,
  ]);

  /**
   * Hand the phone to the next guest (owner asked, 2026-08-30): destroy the
   * session the way the navbar's Logout does, forget this person's handle
   * for this roll so "This you?" asks the newcomer, and reload signed out -
   * the full page load is what hands SessionProvider the empty session.
   */
  const logout = async () => {
    try {
      window.localStorage.removeItem(storageKey('handle'));
    } catch {
      // A blocked store still signs out; the handle just lingers for the
      // same person's return.
    }
    try {
      await removeSession();
    } catch {
      // The reload below lands on whatever the truth is either way.
    }
    window.location.reload();
  };

  /** Who this browser is signed in as, shown where a guest walks in. */
  const account =
    session?.accessToken && profile?.email
      ? { email: profile.email, onSwitch: logout }
      : undefined;

  const confirmHandle = (next: string) => {
    setHandle(next);
    setHandleConfirmed(true);
    remember('handle', next);
    setScreen('camera');
  };

  /**
   * The guest's own prints: what the event holds, plus the uploading tail.
   *
   * Grouped by the person, not the minute - the owner's call, 2026-08-30: a
   * capture-time heading sliced one guest's roll into arbitrary minutes, and
   * a roll is somebody's whole take on the day, one pile of prints under one
   * name. So My Roll is a single group under the guest's own handle.
   */
  /**
   * Whose photo is this? The backend's own word, `is_mine` (2026-08-30) -
   * never name-matching, which two guests sharing a handle would break. The
   * fallback below serves only an older backend that has not stamped the
   * field: before the Reveal such a backend sent only the caller's own, and
   * after it the name is all there was.
   */
  const isMine = useCallback(
    (photo: IMemorollGalleryPhoto): boolean =>
      photo.is_mine ??
      (!revealed ||
        (!!handle && photo.uploader_name === handle) ||
        (!!profile?.fullname && photo.uploader_name === profile.fullname)),
    [handle, profile?.fullname, revealed]
  );

  const ownEntries: RollEntry[] = useMemo(() => {
    // Grouped by the minute of capture, the way the design's headings read -
    // per-person grouping had a day (2026-08-30) and was reverted the same
    // evening.
    const mine = serverPhotos.filter(isMine);
    const fromServer = mine.map((photo) => ({
      photo: {
        id: photo.id,
        src: photo.photo_url,
        // The Date Stamp is already baked into the pixels (ADR 0006).
        stamp: null,
        shooter: handle || photo.uploader_name,
        own: true,
      },
      groupLabel: groupLabelFor(new Date(photo.create_time)),
    }));
    const fromQueue = pending.map((shot) => ({
      photo: {
        id: shot.id,
        src: shot.url,
        stamp: null,
        shooter: handle,
        own: true,
      },
      groupLabel: groupLabelFor(new Date(shot.takenAt)),
    }));
    return [...fromServer, ...fromQueue];
  }, [handle, isMine, pending, serverPhotos]);

  /**
   * ALL is the Collective Gallery, whole at last: since 2026-08-30 the
   * backend sends every guest's photos even before the Reveal, so the wall
   * the design draws is real - other people's prints on the table, Veiled
   * until the Reveal lifts them (the component keeps that gate: own is
   * sharp, everyone else's waits on `revealed`). Grouped by the minute of
   * capture, the design's own headings, so the wall reads as the evening
   * unfolding rather than as a roster.
   */
  const allEntries: RollEntry[] = useMemo(() => {
    const others = serverPhotos
      .filter((photo) => !isMine(photo))
      .map((photo) => ({
        photo: {
          id: photo.id,
          src: photo.photo_url,
          stamp: null,
          shooter: photo.uploader_name,
          own: false,
        },
        groupLabel: groupLabelFor(new Date(photo.create_time)),
      }));
    return [...others, ...ownEntries];
  }, [isMine, ownEntries, serverPhotos]);

  /**
   * Who the tally can vouch for: the people whose prints are on the table.
   * The gallery endpoint answers no participant count (a backend ask,
   * 2026-08-29), so the one printed is the count of distinct hands visible
   * rather than a number invented.
   */
  const participantCount = useMemo(() => {
    const names = new Set(serverPhotos.map((photo) => photo.uploader_name));
    // This guest counts once, under the name their own prints carry - the
    // handle, since registrations send it as display_name. Adding the
    // account's fullname here counted a renamed guest twice.
    if (joined) names.add(handle || profile?.fullname || 'me');
    return names.size;
  }, [handle, joined, profile?.fullname, serverPhotos]);

  const reveal: RevealClock = revealed
    ? { state: 'past', endedOn: endedOnLabel(new Date(revealMs)) }
    : { state: 'counting', remaining: remainingUntil(revealMs, now) };

  // One veil over the whole roll (owner, 2026-11-13): a guest's own prints
  // open with everyone else's - after the Reveal, once they have pressed
  // Develop My Roll and watched the Dark Room - and not before.

  // The gallery answers change while a guest is elsewhere - other people are
  // shooting too - so walking into the gallery asks the event again.
  useEffect(() => {
    if (screen === 'gallery' && joined) void refresh();
  }, [screen, joined, refresh]);

  // The room breathes while a guest is in it (owner's call, 2026-08-30):
  // before the Reveal the server sends no one else's prints, but the count
  // climbing is how a guest feels the other cameras going - so the gallery
  // and the camera ask again every half minute while they are open. A
  // half-minute because pre-reveal the only thing that changes is numbers.
  useEffect(() => {
    if (!joined || (screen !== 'gallery' && screen !== 'camera')) return;
    const timer = setInterval(() => void refresh(), 30_000);
    return () => clearInterval(timer);
  }, [screen, joined, refresh]);

  // Coming back to the tab is coming back to the party.
  useEffect(() => {
    if (!joined) return;
    const onFocus = () => void refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [joined, refresh]);

  // And the Reveal blooms on its own: the moment the clock crosses zero,
  // everybody's prints are asked for rather than waiting for a re-entry.
  useEffect(() => {
    if (revealed && joined) void refresh();
  }, [revealed, joined, refresh]);

  const dark = screen === 'camera' || screen === 'darkroom';

  /**
   * The guest's way through as a navigation stack, so each move is a push
   * (deeper) or a pop (back out). The Dark Room is a ceremony rather than a
   * place: going into it and coming out to the developed wall crossfade.
   */
  const lastScreen = useRef(screen);
  const direction = useRef(0);
  if (screen !== lastScreen.current) {
    direction.current =
      screen === 'darkroom' || lastScreen.current === 'darkroom'
        ? 0
        : directionBetween(
            SCREEN_RANK[lastScreen.current],
            SCREEN_RANK[screen]
          );
    lastScreen.current = screen;
  }

  return (
    <div
      className={`min-h-[100dvh] transition-colors duration-300 ${
        dark ? 'bg-[#161616]' : 'bg-[#e8e4dd]'
      }`}>
      <div
        className={`relative mx-auto flex min-h-[100dvh] max-w-[430px] flex-col overflow-x-clip shadow-2xl ${
          dark ? 'bg-[#212121]' : 'bg-[#f7f5f3]'
        }`}>
        <AnimatePresence
          mode="popLayout"
          initial={false}
          custom={direction.current}>
          <PushScreen
            key={screen}
            custom={direction.current}
            variants={reduce ? reducedScreenVariants : pushVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex min-h-[100dvh] flex-col"
            // Its own ground, so the screen beneath a push never shows
            // through - the same colour the frame around it wears.
            style={{ background: dark ? '#212121' : '#f7f5f3' }}>
            {screen === 'cover' && (
              <Cover
                eventName={event.host_name}
                photos={event.cover_photo_urls ?? []}
                style={
                  event.cover_style === 'taped' ||
                  event.cover_style === 'simple'
                    ? event.cover_style
                    : 'collage'
                }
                ctaLabel={joining ? 'Opening…' : 'Get me in'}
                onEnter={enterFromCover}
                account={account}
              />
            )}
            {screen === 'countdown' && (
              <CountdownScreen remaining={remainingUntil(startsMs, now)} />
            )}
            {screen === 'username' && (
              <UsernameScreen
                handle={handle}
                onConfirm={confirmHandle}
                account={account}
              />
            )}
            {screen === 'camera' && (
              <CameraScreen
                remaining={remaining}
                rollSize={event.shot_limit}
                revealLabel={revealLabelFor(new Date(revealMs))}
                galleryCount={photoCount ?? allEntries.length}
                film={film}
                onPickFilm={pickFilm}
                onShot={addShot}
                onOpenGallery={() => setScreen('gallery')}
                showHow={!howSeen}
                onHowSeen={() => {
                  setHowSeen(true);
                  remember('how-seen', '1');
                }}
                fallbackSrc={event.cover_photo_urls?.[0] ?? ''}
                stampDate={stampDateFor(new Date(startsMs))}
                stampFonts={{
                  hand: homemadeApple.style.fontFamily,
                  ui: poppins.style.fontFamily,
                }}
              />
            )}
            {screen === 'gallery' && (
              <GalleryScreen
                eventName={event.host_name}
                eventDate={new Date(startsMs)}
                photoCount={photoCount ?? allEntries.length}
                participantCount={participantCount}
                reveal={reveal}
                all={groupRoll(allEntries)}
                own={groupRoll(ownEntries)}
                ownDeveloped={unveiled}
                othersDeveloped={unveiled}
                canDevelop={revealed && !unveiled}
                tab={galleryTab}
                onTabChange={setGalleryTab}
                onDevelop={() => setScreen('darkroom')}
                onBack={() =>
                  setScreen(phase === 'ongoing' && joined ? 'camera' : 'cover')
                }
                onLogout={logout}
                showSwipeCue={!swipeCueSeen}
                onSwipeCueSeen={() => setSwipeCueSeen(true)}
                storyExport
              />
            )}
            {screen === 'darkroom' && (
              <DarkRoomScreen
                photos={allEntries.map((entry) => entry.photo)}
                hold={false}
                onDeveloped={() => {
                  setUnveiled(true);
                  remember('unveiled', '1');
                  setGalleryTab('all');
                  setScreen('gallery');
                }}
              />
            )}
          </PushScreen>
        </AnimatePresence>

        <Toast
          role="alert"
          message={problem}
          background={colour.ink}
          color={colour.paper}
          onDismiss={() => setProblem(null)}
        />
      </div>
    </div>
  );
}
