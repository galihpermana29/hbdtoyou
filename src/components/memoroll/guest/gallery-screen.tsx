'use client';

import { trackMemoRoll } from '@/lib/memoroll-analytics';
import galleryCamera from '@/assets/memoroll/gallery-camera.svg';
import rollCamera from '@/assets/memoroll/wordmark-camera.svg';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import BackPill from '../ui/back-pill';
import { FlipNumber, type Remaining } from '../ui/flip-counter';
import HeaderRule from '../ui/header-rule';
import MemoifyFooter from '../ui/memoify-footer';
import { colour, pillShadow } from '../ui/tokens';
import Cta from '../ui/cta';
import LockedPopup from './locked-popup';
import { EASE_OUT } from '../ui/motion';
import PhotoPreview from './photo-preview';
import StorySheet from './story-sheet';
import RollPrint from './print';
import type { GalleryGroup, GalleryPhoto } from './roll';

/**
 * The Gallery (guest-13 through guest-18): every Shot at the event, behind the
 * two gates the product is built around, and they are independent.
 *
 * ALL is the Collective Gallery. Everyone else's Shots stay veiled until the
 * creator's Reveal, whatever a guest did with their own Roll - the How popup's
 * "Nobody sees anything until the big reveal" is a claim about other people's
 * shots, and this screen is where it is kept. A guest's own Shots are never
 * veiled to them once developed, even here, mid-event.
 *
 * My Roll is the guest's own. It develops when *their* shots hit zero - or
 * when the event ends with shots still unspent, so nobody is stranded
 * undeveloped forever - and it waits for nobody: sharp immediately, with the
 * countdown beside it still running.
 *
 * The screen fetches nothing and holds no clock. It is handed the groups, the
 * gates' verdicts and what remains on the reveal clock, so the demo can pass
 * mock data and the product real data (ADR 0007). The only state here is the
 * guest's: which tab they are on comes from the caller (the Develop ceremony
 * returns them to My Roll), which photo they opened stays here.
 */

export type GalleryTab = 'all' | 'myroll';

/** What the gallery's clock says: counting to the Reveal, or the Reveal past. */
export type RevealClock =
  | { state: 'counting'; remaining: Remaining }
  | { state: 'past'; endedOn: string };

/**
 * How each print in a row of three sits: nudged and turned a degree or two,
 * so the rows read as prints laid on a table rather than a grid of tiles. The
 * offsets are the design's own; the angles are read off the exported frames,
 * because a rotated node reports its bounding box rather than its angle.
 */
const JITTER = [
  { x: 5, y: 2, r: -2 },
  { x: -7.5, y: 12, r: 2.5 },
  { x: 2.5, y: 3.7, r: -1 },
  { x: -3.3, y: 5.2, r: 2 },
  { x: 3.5, y: 0, r: -2 },
  { x: -3, y: 5, r: 1.5 },
];

/**
 * "Ends in" and the reveal clock on the same flip tiles the countdown screen
 * turns, at the gallery's small size, without the unit words that screen
 * writes under them. Three pairs, hours to seconds; days fold into hours,
 * because three pairs is all the design gives the clock room for.
 */
function EndsIn({ remaining }: { remaining: Remaining }) {
  const units: Array<[number, string]> = [
    [remaining.days * 24 + remaining.hours, 'hours'],
    [remaining.minutes, 'minutes'],
    [remaining.seconds, 'seconds'],
  ];
  return (
    <span className="inline-flex items-center gap-[4px]">
      {units.map(([value, word], index) => (
        <span key={word} className="inline-flex items-center gap-[4px]">
          {index > 0 && (
            <span
              className="text-[12px] font-bold leading-[150%]"
              style={{
                color: colour.inkSoft,
                fontFamily: 'var(--font-mr-body)',
              }}>
              :
            </span>
          )}
          <FlipNumber value={value} size="small" label={word} />
        </span>
      ))}
    </span>
  );
}

/** One of the two tab pills, cream when chosen, dark when not. */
function TabPill({
  chosen,
  onClick,
  children,
}: {
  chosen: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={chosen}
      className="rounded-full px-[12px] py-[8px] text-[12px] font-extrabold italic leading-[150%] tracking-[-0.011em]"
      style={{
        background: chosen ? colour.cream : colour.pill,
        color: chosen ? colour.ink : colour.cream,
        boxShadow: pillShadow,
        fontFamily: 'var(--font-mr-body)',
      }}>
      {children}
    </button>
  );
}

/**
 * A tab with nothing in it (owner, 2026-11-22: it was two pills over bare
 * paper, which reads as a page that failed to load). It says what the tab is
 * for and why it is empty, and where the guest can still shoot it sends them
 * to the camera, because the only thing that fills this page is a shot.
 *
 * The words depend on two things: whose prints the tab holds, and whether
 * this guest can still take one. After the event nothing can be added, so
 * there is nothing to offer, only something to say.
 */
function EmptyRoll({
  tab,
  onShoot,
}: {
  tab: GalleryTab;
  onShoot?: () => void;
}) {
  const everyone = tab === 'all';
  const title = everyone ? 'No shots yet' : 'Your roll is empty';
  const body = onShoot
    ? everyone
      ? 'Be the first. Every shot taken here lands on this page.'
      : 'Nothing on it yet. Your shots land here as you take them.'
    : everyone
      ? 'Nobody has taken a shot at this one.'
      : 'You have not taken a shot at this one.';
  const reduce = useReducedMotion();
  /**
   * The little scene plays from a state this component sets itself, not from
   * a mount animation: the gallery draws its tabs inside a presence that
   * skips its children's first animation, and an empty roll is most often
   * the first thing a guest sees here.
   */
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const still = Boolean(reduce);
  const on = shown || still;
  /** Something that comes up into place, a beat after the one before it. */
  const rise = (delay: number) => ({
    initial: false as const,
    animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    transition: still
      ? { duration: 0 }
      : { delay, duration: 0.45, ease: EASE_OUT },
  });

  return (
    <div className="flex flex-col items-center px-[24px] pb-[24px] pt-[32px] text-center">
      {/* A roll with nothing on it yet: three blank prints dealt out in a
          fan, the camera set down on top of them, and every few seconds its
          flash goes off - the camera is ready, the prints are waiting. The
          camera breathes a little so the page is not a still picture; none
          of it loops fast enough to pull the eye off the button. */}
      <div aria-hidden className="relative h-[124px] w-[190px] select-none">
        {BLANK_PRINTS.map((print, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-[18px] block h-[78px] w-[60px] bg-white p-[4px]"
            style={{
              marginLeft: -30,
              boxShadow:
                '0 1px 2px rgba(0,0,0,0.10), 0 6px 14px rgba(0,0,0,0.08)',
            }}
            initial={false}
            animate={
              on
                ? { x: print.x, y: print.y, rotate: print.rotate, opacity: 1 }
                : { x: 0, y: 14, rotate: 0, opacity: 0 }
            }
            transition={
              still
                ? { duration: 0 }
                : {
                    delay: 0.08 + i * 0.09,
                    type: 'spring',
                    duration: 0.7,
                    bounce: 0.28,
                  }
            }>
            {/* Undeveloped: the paper's own grey, no picture. */}
            <span
              className="block h-full w-full"
              style={{ background: '#e9e5df' }}
            />
          </motion.span>
        ))}

        <motion.div
          className="absolute left-1/2 top-[38px] w-[92px]"
          style={{ marginLeft: -46 }}
          initial={false}
          animate={
            on
              ? { scale: 1, opacity: 1, y: 0 }
              : { scale: 0.5, opacity: 0, y: -18 }
          }
          transition={
            still
              ? { duration: 0 }
              : { delay: 0.38, type: 'spring', duration: 0.6, bounce: 0.4 }
          }>
          <motion.img
            src={rollCamera.src}
            alt=""
            className="block w-full"
            style={{ rotate: -8 }}
            animate={
              still ? undefined : { y: [0, -4, 0], rotate: [-8, -5, -8] }
            }
            transition={{
              delay: 1,
              duration: 3.6,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
          {/* The flash: a four-pointed glint off the camera's shoulder. */}
          {still ? null : (
            <motion.svg
              viewBox="0 0 24 24"
              className="absolute -right-[10px] -top-[14px] h-[26px] w-[26px]"
              animate={{
                scale: [0, 1.15, 0],
                opacity: [0, 1, 0],
                rotate: [0, 20, 40],
              }}
              transition={{
                delay: 1.2,
                duration: 0.7,
                ease: 'easeOut',
                repeat: Infinity,
                repeatDelay: 2.9,
              }}>
              <path
                d="M12 0C12.9 6.6 16.5 10.2 24 12C16.5 13.8 12.9 17.4 12 24C11.1 17.4 7.5 13.8 0 12C7.5 10.2 11.1 6.6 12 0Z"
                fill={colour.stamp}
              />
            </motion.svg>
          )}
        </motion.div>
      </div>

      <motion.h3
        {...rise(0.5)}
        className="mt-[18px] text-[20px] font-medium leading-[130%] tracking-[-0.02em]"
        style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
        {title}
      </motion.h3>
      <motion.p
        {...rise(0.58)}
        className="mt-[6px] max-w-[250px] text-[14px] leading-[150%] tracking-[-0.011em]"
        style={{ color: colour.muted, fontFamily: 'var(--font-mr-body)' }}>
        {body}
      </motion.p>
      {onShoot ? (
        <motion.div {...rise(0.68)} className="mt-[24px]">
          <Cta onClick={onShoot} className="w-[210px]">
            {everyone ? 'Take the first shot' : 'Take your first shot'}
          </Cta>
        </motion.div>
      ) : null}
    </div>
  );
}

/** Where the three blank prints land, left to right, behind the camera. */
const BLANK_PRINTS = [
  { x: -52, y: 6, rotate: -16 },
  { x: 0, y: -12, rotate: 3 },
  { x: 52, y: 6, rotate: 15 },
] as const;

export default function GalleryScreen({
  eventName,
  photoCount,
  participantCount,
  reveal,
  revealsAt,
  all,
  own,
  ownDeveloped,
  othersDeveloped: othersDevelopedProp,
  canDevelop,
  tab,
  onTabChange,
  onDevelop,
  onBack,
  onShoot,
  onLogout,
  showSwipeCue,
  onSwipeCueSeen,
  storyExport = false,
  eventDate,
}: {
  eventName: string;
  /** The event's day, printed on a Story's film strip; today if absent. */
  eventDate?: Date;
  photoCount: number;
  participantCount: number;
  reveal: RevealClock;
  /** The Reveal as a moment, for the card under a print that is still shut. */
  revealsAt?: Date;
  all: GalleryGroup[];
  own: GalleryGroup[];
  /** The guest's own gate: their Roll through the Dark Room, Reveal or not. */
  ownDeveloped: boolean;
  /**
   * Everyone else's gate, beyond the clock: even past the Reveal, the
   * collective stays Veiled until this is true. The product hands the
   * unveiling to the guest's own press (owner, 2026-08-30) - the Reveal
   * arrives, and Develop My Roll is how each guest opens it for themselves.
   * Absent - the demo - the clock alone decides, as the frames drew it.
   */
  othersDeveloped?: boolean;
  /**
   * Whether Develop My Roll is offered. Where `othersDeveloped` is given (the
   * product, and the demo's own roll), this is "the Reveal has come and this
   * guest has not developed yet", and the button is on both tabs: it opens
   * everyone's prints, not one tab's (owner, 2026-11-13). Where it is absent
   * (the demo's designed roll states), it is the old per-tab door.
   */
  canDevelop: boolean;
  tab: GalleryTab;
  onTabChange: (tab: GalleryTab) => void;
  onDevelop: () => void;
  onBack: () => void;
  /**
   * Go and take a shot, when this guest still can: the event is on, they
   * are in, and their Roll has shots left. An empty tab offers it. Absent,
   * an empty tab only says that it is empty.
   */
  onShoot?: () => void;
  /**
   * Sign this guest out, when the surface offers it (owner asked,
   * 2026-08-30 - shared phones at a party change hands). Absent - the demo -
   * the header keeps its symmetric spacer and nothing new is drawn.
   */
  onLogout?: () => void;
  /** The preview's hand cue, early on and never again. */
  showSwipeCue: boolean;
  onSwipeCueSeen: () => void;
  /** Offer Share to Story in the preview - the product's, not the demo's. */
  storyExport?: boolean;
}) {
  const reduce = useReducedMotion();
  const [opened, setOpened] = useState<number | null>(null);
  /** A shut print was tapped: say why it is shut, and until when. */
  const [lockedOpen, setLockedOpen] = useState(false);

  const revealed = reveal.state === 'past';
  /** Does the guest's own press hold everyone else's prints shut? */
  const gatedByPress = othersDevelopedProp !== undefined;
  const othersDeveloped = othersDevelopedProp ?? true;
  const groups = tab === 'all' ? all : own;

  /** The Reveal gates everyone else's Shots, never a guest's own - and the
   *  guest's own press can hold that gate shut past the clock. */
  const sharp = (photo: GalleryPhoto) =>
    photo.own ? ownDeveloped : revealed && othersDeveloped;

  /** What the preview can flip through: only what this guest may see. */
  const visible = groups.flatMap((group) => group.photos).filter(sharp);

  /** The guest's own prints they can see - what a Roll Story is made of. */
  const ownVisible = visible.filter((photo) => photo.own);
  const [rollStoryOpen, setRollStoryOpen] = useState(false);
  const [today] = useState(() => new Date());
  const storyDate = eventDate ?? today;
  const showDevelop = gatedByPress
    ? canDevelop
    : canDevelop && (tab === 'myroll' ? !ownDeveloped : !othersDeveloped);
  /** Share my roll: My Roll, one print or more (owner, 2026-11-14), and nothing louder above
   *  the fold - Develop My Roll keeps the slot while it is the next step. */
  // Only prints that have developed can go into a Story: `ownVisible` holds
  // the sharp ones alone, so a veiled roll offers nothing until Develop.
  const showRollStory =
    storyExport &&
    tab === 'myroll' &&
    ownDeveloped &&
    ownVisible.length >= 1 &&
    !showDevelop;

  return (
    <div
      className="relative flex min-h-full flex-1 flex-col overflow-x-clip"
      style={{ background: colour.paper, fontFamily: 'var(--font-mr-body)' }}>
      {/* The frame's 50px top is the iOS status bar, drawn outside the page
          in a browser (owner, 2026-11-12): start at the safe area instead. */}
      {/* Sticky, like a navbar (owner, 2026-11-12): the event stays named
          while the roll scrolls under it, on the page's own paper so prints
          pass behind rather than through. */}
      <header
        className="sticky top-0 z-30 pt-[max(16px,env(safe-area-inset-top))]"
        style={{ background: colour.paper }}>
        <div className="flex items-center justify-between px-[16px]">
          <BackPill onClick={onBack} label="Back" />
          <h1
            className="flex-1 text-center text-[20px] font-bold leading-[150%] tracking-[-0.011em]"
            style={{ color: colour.ink }}>
            Gallery
          </h1>
          {/* The spacer that kept the title centred becomes the way out when
              the surface offers one: same 48px, so the title never moves. */}
          {onLogout ? (
            // The bare glyph, nothing drawn around it: this header owns one
            // strong control - the flame pill - and a second boxed control
            // was shouting over it. The 48px slot stays as the hit area and
            // the title's counterweight; the ink is softened so the glyph
            // sits with the header's quiet text, not its buttons.
            <button
              type="button"
              aria-label="Log out"
              onClick={onLogout}
              className="flex h-[44px] w-[48px] items-center justify-center"
              style={{ color: colour.ink, opacity: 0.55 }}>
              <svg
                viewBox="0 0 24 24"
                className="h-[16px] w-[16px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          ) : (
            <span aria-hidden className="w-[48px]" />
          )}
        </div>

        <div className="relative mt-[12px]">
          {/* The rotated camera, bleeding off the right edge. The design's own
              artwork, exported - but placed against the frame image rather
              than the captured bounds: the node is rotated, and a rotated
              node's bounds in the capture are its unrotated box, which put the
              camera a row too low and a size too small. In the frame its top
              edge rides level with the Gallery title's baseline and it spans
              all three header rows. Anchored to the header's foot (owner,
              2026-11-12): the crop is meant to be cut by the rule, not to
              float a row above it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-[-4px] h-[100px] w-[142px] select-none overflow-hidden">
            <img src={galleryCamera.src} alt="" className="w-full" />
          </div>

          <div className="flex flex-col gap-[4px] px-[16px] py-[10px]">
            <div className="flex h-[18px] items-center gap-[6px]">
              {reveal.state === 'counting' ? (
                <>
                  <span
                    className="text-[12px] font-bold leading-[150%] tracking-[-0.011em]"
                    style={{ color: colour.ink }}>
                    Ends in
                  </span>
                  <EndsIn remaining={reveal.remaining} />
                </>
              ) : (
                <>
                  <span
                    className="text-[12px] font-bold leading-[150%] tracking-[-0.011em]"
                    style={{ color: colour.ink }}>
                    Ended on
                  </span>
                  <span
                    className="text-[12px] font-extrabold leading-[150%] tracking-[-0.011em]"
                    style={{ color: colour.ink }}>
                    {reveal.endedOn}
                  </span>
                </>
              )}
            </div>

            <h2
              className="text-[20px] font-extrabold leading-[150%] tracking-[-0.011em]"
              style={{ color: colour.ink }}>
              {eventName}
            </h2>

            <div className="flex items-center gap-[4px]">
              <span
                className="text-[12px] font-medium leading-[150%] tracking-[-0.011em]"
                style={{ color: colour.ink }}>
                {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
              </span>
              <span
                className="text-[14px] font-medium leading-[150%] tracking-[-0.011em]"
                style={{ color: colour.ink }}>
                ・
              </span>
              <span
                className="text-[12px] font-medium leading-[150%] tracking-[-0.011em]"
                style={{ color: colour.ink }}>
                {participantCount}{' '}
                {participantCount === 1 ? 'Participant' : 'Participants'}
              </span>
            </div>
          </div>

          <HeaderRule tint="rgba(206, 206, 206, 0.7)" />
        </div>
      </header>

      <div className="flex flex-1 flex-col px-[16px] pb-[16px] pt-[19px]">
        <div className="flex items-center gap-[12px]">
          <TabPill chosen={tab === 'all'} onClick={() => onTabChange('all')}>
            ALL
          </TabPill>
          <TabPill
            chosen={tab === 'myroll'}
            onClick={() => onTabChange('myroll')}>
            My Roll
          </TabPill>
        </div>

        {/* One tab leaves at once and the other comes up in its place. The
            old tab used to fade out first and the new one wait for it, which
            on a phone was a blink, not a transition (owner, 2026-11-22): the
            prints went away, then for a moment there was nothing under the
            pills, then the other tab faded in. Measured, the swap landed
            170ms after the press; it now lands in the next frame, and the
            only thing that moves is the new tab arriving. */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: reduce ? 0 : 6 }}
          animate={{
            opacity: 1,
            y: 0,
            // Switched tens of times a visit: short, ease-out.
            transition: { duration: reduce ? 0.12 : 0.2, ease: EASE_OUT },
          }}
          className="mt-[24px] flex flex-col gap-[12px]">
          {groups.every((group) => group.photos.length === 0) ? (
            <EmptyRoll tab={tab} onShoot={onShoot} />
          ) : null}
          {groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-[8px]">
              <h3
                className="text-[14px] font-medium leading-[150%] tracking-[-0.011em]"
                style={{ color: colour.ink }}>
                {group.label}
              </h3>
              <div className="flex flex-col">
                {chunk(group.photos, 3).map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((photo, columnIndex) => {
                      const jitter =
                        JITTER[(rowIndex * 3 + columnIndex) % JITTER.length];
                      const pose = {
                        transform: `translate(${jitter.x}px, ${jitter.y}px) rotate(${jitter.r}deg)`,
                      };
                      return (
                        <span key={photo.id} className="block w-1/3">
                          {sharp(photo) ? (
                            <button
                              type="button"
                              aria-label="Open this shot"
                              className="block w-full"
                              onClick={() => {
                                trackMemoRoll('memoroll_photo_previewed', {
                                  own: photo.own,
                                  tab,
                                });
                                setOpened(
                                  visible.findIndex(
                                    (candidate) => candidate.id === photo.id
                                  )
                                );
                              }}>
                              <RollPrint
                                src={photo.src}
                                size="grid"
                                stamp={photo.stamp}
                                shooter={
                                  tab === 'myroll' ? photo.shooter : null
                                }
                                style={pose}
                              />
                            </button>
                          ) : (
                            <button
                              type="button"
                              aria-label="Why can’t I see this shot?"
                              className="block w-full"
                              onClick={() => {
                                trackMemoRoll('memoroll_locked_print_tapped', {
                                  own: photo.own,
                                  tab,
                                });
                                setLockedOpen(true);
                              }}>
                              <RollPrint
                                src={photo.src}
                                size="grid"
                                veiled
                                style={pose}
                              />
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </motion.div>

        {/* "CTA muncul pas udah 0 shots nya": the door to the Dark Room, the
            moment there is nothing left to shoot. It rides above the fold so a
            guest scrolling their veiled Roll is never without it. */}
        <AnimatePresence>
          {showRollStory && (
            <motion.div
              key="roll-story"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduce ? 0.12 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="sticky bottom-[24px] z-20 mt-[24px] flex justify-center">
              <Cta onClick={() => setRollStoryOpen(true)} className="w-[276px]">
                Share my roll to Story
              </Cta>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDevelop && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduce ? 0.12 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="sticky bottom-[24px] z-20 mt-[24px] flex justify-center">
              <Cta onClick={onDevelop} className="w-[276px]">
                Develop My Roll
              </Cta>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MemoifyFooter />

      <AnimatePresence>
        {opened !== null && visible[opened] && (
          <PhotoPreview
            photos={visible}
            index={opened}
            onIndexChange={setOpened}
            showSwipeCue={showSwipeCue}
            onSwipeCueSeen={onSwipeCueSeen}
            onClose={() => setOpened(null)}
            storyEventName={storyExport ? eventName : undefined}
            storyEventDate={storyDate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lockedOpen && (
          <LockedPopup
            revealsAt={revealsAt}
            canDevelop={revealed && canDevelop}
            onDevelop={() => {
              setLockedOpen(false);
              onDevelop();
            }}
            onDone={() => setLockedOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Present, so the sheet slides away the way it came in. */}
      <AnimatePresence>
        {rollStoryOpen && showRollStory ? (
          // Pinned to the viewport: the gallery scrolls, and a sheet anchored
          // to its foot would open somewhere below the fold.
          <div
            key="roll-story"
            className="fixed inset-0 z-50 mx-auto max-w-[430px]">
            <StorySheet
              roll
              photos={ownVisible}
              eventName={eventName}
              eventDate={storyDate}
              onClose={() => setRollStoryOpen(false)}
            />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** Rows of three, the way the design lays prints out. */
function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let at = 0; at < items.length; at += size) {
    rows.push(items.slice(at, at + size));
  }
  return rows;
}
