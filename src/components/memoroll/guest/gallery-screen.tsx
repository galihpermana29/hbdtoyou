'use client';

import galleryCamera from '@/assets/memoroll/gallery-camera.svg';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import BackPill from '../ui/back-pill';
import { FlipNumber, type Remaining } from '../ui/flip-counter';
import HeaderRule from '../ui/header-rule';
import MemoifyFooter from '../ui/memoify-footer';
import { colour, pillShadow } from '../ui/tokens';
import Cta from '../ui/cta';
import PhotoPreview from './photo-preview';
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

export default function GalleryScreen({
  eventName,
  photoCount,
  participantCount,
  reveal,
  all,
  own,
  ownDeveloped,
  canDevelop,
  tab,
  onTabChange,
  onDevelop,
  onBack,
  showSwipeCue,
  onSwipeCueSeen,
}: {
  eventName: string;
  photoCount: number;
  participantCount: number;
  reveal: RevealClock;
  all: GalleryGroup[];
  own: GalleryGroup[];
  /** The guest's own gate: their Roll through the Dark Room, Reveal or not. */
  ownDeveloped: boolean;
  /** Shots at zero, or the event over with shots unspent - either opens the door. */
  canDevelop: boolean;
  tab: GalleryTab;
  onTabChange: (tab: GalleryTab) => void;
  onDevelop: () => void;
  onBack: () => void;
  /** The preview's hand cue, early on and never again. */
  showSwipeCue: boolean;
  onSwipeCueSeen: () => void;
}) {
  const reduce = useReducedMotion();
  const [opened, setOpened] = useState<number | null>(null);

  const revealed = reveal.state === 'past';
  const groups = tab === 'all' ? all : own;

  /** The Reveal gates everyone else's Shots, never a guest's own. */
  const sharp = (photo: GalleryPhoto) => (photo.own ? ownDeveloped : revealed);

  /** What the preview can flip through: only what this guest may see. */
  const visible = groups.flatMap((group) => group.photos).filter(sharp);

  return (
    <div
      className="relative flex min-h-full flex-1 flex-col overflow-x-clip"
      style={{ background: colour.paper, fontFamily: 'var(--font-mr-body)' }}>
      <header className="pt-[50px]">
        <div className="flex items-center justify-between px-[16px]">
          <BackPill onClick={onBack} label="Back" />
          <h1
            className="flex-1 text-center text-[20px] font-bold leading-[150%] tracking-[-0.011em]"
            style={{ color: colour.ink }}>
            Gallery
          </h1>
          <span aria-hidden className="w-[48px]" />
        </div>

        <div className="relative mt-[12px]">
          {/* The rotated camera, bleeding off the right edge. The design's own
              artwork, exported - but placed against the frame image rather
              than the captured bounds: the node is rotated, and a rotated
              node's bounds in the capture are its unrotated box, which put the
              camera a row too low and a size too small. In the frame its top
              edge rides level with the Gallery title's baseline and it spans
              all three header rows. */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-4px] top-[-20px] h-[100px] w-[142px] select-none overflow-hidden">
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
                {photoCount} Photos
              </span>
              <span
                className="text-[14px] font-medium leading-[150%] tracking-[-0.011em]"
                style={{ color: colour.ink }}>
                ・
              </span>
              <span
                className="text-[12px] font-medium leading-[150%] tracking-[-0.011em]"
                style={{ color: colour.ink }}>
                {participantCount} Participants
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

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: reduce ? 0.12 : 0.3 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="mt-[24px] flex flex-col gap-[12px]">
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
                                onClick={() =>
                                  setOpened(
                                    visible.findIndex(
                                      (candidate) => candidate.id === photo.id
                                    )
                                  )
                                }>
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
                              <RollPrint
                                src={photo.src}
                                size="grid"
                                veiled
                                style={pose}
                              />
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
        </AnimatePresence>

        {/* "CTA muncul pas udah 0 shots nya": the door to the Dark Room, the
            moment there is nothing left to shoot. It rides above the fold so a
            guest scrolling their veiled Roll is never without it. */}
        <AnimatePresence>
          {tab === 'myroll' && canDevelop && !ownDeveloped && (
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
          />
        )}
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
