'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import BrideGroom from './BrideGroom';
import EventDetails from './EventDetails';
import Footer from './Footer';
import Gallery from './Gallery';
import Hero, { OPENING } from './Hero';
import HolyVerse from './HolyVerse';
import LoveStory from './LoveStory';
import Messages from './Messages';
import PhotoShare from './PhotoShare';
import RsvpCard, { type ReplyingGuest, type Rsvp } from './RsvpCard';
import TokenOfLove from './TokenOfLove';
import VinylWidget from './VinylWidget';
import { SealedProvider } from './sealed-context';
import { useBeginAtTheTop, type Scroller } from './use-begin-at-the-top';
import { useFitToPhone } from './use-fit-to-phone';
import { EASE } from './variants';
import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

export interface WeddingTemplate1Props {
  /**
   * The wedding this invitation is for. The Showcase hands it Example Content,
   * the Create Flow hands it what the couple has typed so far, and an
   * Invitation Viewer will hand it a published record.
   */
  content?: WeddingTemplate1Content;
  /**
   * The Guest Messages already on the wall when a guest arrives.
   *
   * Read by the viewer and handed down rather than fetched here, because this
   * component is also the Site Preview and the Showcase, and neither of those
   * is anybody's invitation to read replies from. Empty everywhere but the
   * Invitation Viewer.
   */
  written?: Rsvp[];
  /**
   * Show the invitation the way a guest is sent it: sealed behind the envelope
   * until they open it, and revealed section by section as they scroll.
   *
   * Off for the Site Preview beside the form, which is a picture of the
   * invitation the couple is editing rather than the invitation being received.
   */
  sealed?: boolean;
  /**
   * Who this invitation was sent to, drawn on the closed envelope.
   *
   * A guest's name rather than the couple's, so it is not part of the content
   * the Create Flow collects: one wedding is sent to many guests. It comes from
   * the token on the guest's own link, which the Invitation Viewer resolves
   * against the Guest List; the Showcase passes its Example Content's.
   */
  addressee?: string;
  /**
   * Who is replying, and where their reply goes: the guest their own link
   * resolved to, and the address the invitation is published at.
   *
   * Left out everywhere the invitation was sent to nobody - the Showcase, the
   * Create Flow's two panels and Play Preview - where a reply has nowhere to go
   * and stays in the page instead. The addressee beside it is the same guest's
   * name where both are given; it is a separate prop because the Showcase has a
   * name to write on the envelope and no guest to send anything as.
   */
  guest?: ReplyingGuest;
  /**
   * What this invitation is scrolling inside, so that a sealed one begins at
   * the top of its envelope: `'page'` where it has the window to itself, and a
   * ref to the scroller where something else does the scrolling - `Scroller`
   * says which is which.
   *
   * Left out by the panels inside the Create Flow, which draw an invitation as
   * a picture beside a form and are never scrolled through.
   */
  scrollsInside?: Scroller;
  /**
   * Play the Background Track behind the invitation, and draw its control over
   * it, where the page showing it has room for one.
   *
   * The couple's own answers are the other half of this: a wedding whose
   * Background Track is switched off, or whose couple never picked a song, has
   * no track to play, so nothing is played and no record is drawn on it
   * whatever the page asked for.
   *
   * Off for the Create Flow's panels, which draw the invitation as a picture
   * beside a form: a picture does not start singing while a couple types.
   */
  showVinylWidget?: boolean;
}

/**
 * Wedding Template 1 ("BNW") - the whole invitation, in the order a guest
 * meets it. Figma node 312:1631 (375px mobile design).
 *
 * There is one of these. The Showcase renders it with Example Content, the
 * Create Flow's Site Preview renders it with what the couple has typed, and
 * Play Preview renders it sealed the way a guest gets it. What separates those
 * is what is passed in, so a fix to a section reaches all of them at once.
 */
export default function WeddingTemplate1({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  written,
  sealed = false,
  addressee,
  guest,
  scrollsInside,
  showVinylWidget = false,
}: WeddingTemplate1Props) {
  /**
   * Every reply this page is holding: the ones it took and could not send, which
   * is as far as one gets on an invitation nobody was sent, and the one a guest
   * has just sent, until the couple's own list is read back holding it.
   *
   * The wall is connected now. A guest replying from their own link is answered
   * by the backend, and their message comes back from it on the invitation's
   * public Guest Messages, so showing their card is telling them the truth
   * rather than flattering them. Attendance and a plus one are still held and
   * drawn nowhere, because those are the couple's to read and no screen shows
   * them to anybody but the couple.
   *
   * Every invitation can be replied to, including the two drawn as panels
   * inside the Create Flow, where pressing RSVP Now puts the card over the
   * whole window rather than over the panel. That is deliberate, and it is not
   * the thing the Sealed lock must not do to a preview: a lock a couple cannot
   * see and did not ask for would strand them in a form, and a modal they
   * opened and can close is neither. The alternative was a control that looks
   * pressable in a panel and does nothing, which is worse. It is also how the
   * panel's other live controls already behave - the copy button, the polaroid
   * that turns over - because there is one template rather than two.
   */
  // What this guest has added while they are here. What everybody else wrote
  // arrives as `written` and stays there rather than being copied into state,
  // so that reading the wall again after a reply lands puts the couple's own
  // list on the screen instead of the one this page opened with.
  const [kept, setKept] = useState<Rsvp[]>([]);
  const [replying, setReplying] = useState(false);
  const reduce = useReducedMotion();
  const router = useRouter();

  /**
   * The wall: everything the invitation was opened with, and this guest's own
   * reply until the invitation is read back holding it.
   *
   * A reply is shown at once rather than waiting for the read-back, because a
   * guest who has just been thanked and sees no card of their own has been told
   * two different things. It is dropped again the moment the same words come
   * back from the couple's own list, so the card a guest keeps looking at is the
   * one the couple actually has.
   *
   * The words are what it is matched on, because a reply that has not been read
   * back yet has no identifier to match on and the name is not dependable: a
   * guest whose Guest List row carries no name types their own, while the
   * couple's list answers with the row's, so the same reply can come back
   * signed differently from how it was sent. The words are the same either way.
   *
   * Two guests writing exactly the same thing would hide the second card until
   * the next open, which is the price and a small one - and a reply with no
   * words is not a Guest Message at all, so it is never on this wall to double.
   */
  const rsvps = useMemo(() => {
    const theirs = written ?? [];
    const readBack = new Set(theirs.map((rsvp) => rsvp.message));
    return [...theirs, ...kept.filter((rsvp) => !readBack.has(rsvp.message))];
  }, [written, kept]);

  // What the invitation's public Guest Messages came back with, in the browser
  // console: once when it opens, and again every time they are read back after
  // a reply lands. That second line is how the read-back is checked from
  // outside - a message that is on the wall and not in the list is this page's
  // own copy, and one that is in both arrived from the couple's backend.
  //
  // Never in production: a guest's invitation is not a place to leave working
  // notes. Staging still prints it, which is where a read-back is checked
  // against a real wedding, so the flip is on the app's own environment rather
  // than on the build's.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'production' || !written) return;
    // Deliberate rather than left behind, which is what the rule is guarding
    // against: this line is the read-back's only outward sign, and it prints
    // nowhere a guest can reach.
    // eslint-disable-next-line no-console
    console.log(
      `[wedding-1] public RSVP messages: ${written.length}`,
      written.map((rsvp) => ({
        name: rsvp.name || '(unnamed)',
        message: rsvp.message,
        repliedAt: rsvp.repliedAt,
      }))
    );
  }, [written]);

  /** A reply with nowhere to go, which is all a preview can take. */
  const keepReply = useCallback((rsvp: Rsvp) => {
    setKept((taken) => [...taken, rsvp]);
    setReplying(false);
  }, []);

  /**
   * A reply the couple has: put the card away and ask the invitation for its
   * Guest Messages again, so the wall a guest is returned to is the wall their
   * own words are now on. `router.refresh` re-runs the viewer's own read, which
   * is uncached, and keeps this page's state - the envelope stays open and the
   * invitation stays where it was scrolled to.
   */
  const readReplyBack = useCallback(
    (rsvp: Rsvp) => {
      setKept((taken) => [...taken, rsvp]);
      setReplying(false);
      router.refresh();
    },
    [router]
  );

  /**
   * Whether the envelope is still closed over the rest of the invitation.
   *
   * The Hero runs the opening and says when it is over, because the choreography
   * is the Hero's; what to do with the rest of the invitation until then is not,
   * so it is decided here, where the rest of the invitation is.
   */
  const [revealed, setRevealed] = useState(!sealed);
  const reveal = useCallback(() => setRevealed(true), []);
  const unopened = sealed && !revealed;

  /**
   * The Background Track, played by this page's own audio element and reported
   * by it: the vinyl spins on what the audio says it is doing, never on what
   * was asked of it, so a track that fails to start leaves a resting record
   * rather than a spinning lie.
   *
   * It starts inside the Open Invitation press - the envelope open is the
   * guest's gesture, and the one a browser will let audio start on - so a
   * sealed invitation is silent and an opened one begins the way the design
   * means the experience to begin. `catch` because a refused `play()` is a
   * browser's answer, not an error: the record simply rests, and the guest has
   * it to press. On an unsealed page there is no envelope to open, so the
   * record rests until the guest spins it themselves.
   */
  const offersTrack =
    showVinylWidget &&
    content.songRequestEnabled &&
    (content.backgroundTrack?.url ?? '') !== '';
  const audio = useRef<HTMLAudioElement>(null);
  const [trackPlaying, setTrackPlaying] = useState(false);
  const startTrack = useCallback(() => {
    audio.current?.play().catch(() => {});
  }, []);
  const toggleTrack = useCallback(() => {
    if (!audio.current) return;
    if (audio.current.paused) startTrack();
    else audio.current.pause();
  }, [startTrack]);

  useBeginAtTheTop(sealed, scrollsInside);

  // Scaled, whole, into a box narrower than the phone the design draws:
  // see `use-fit-to-phone.ts`. At 375px and above this writes no style.
  const fit = useFitToPhone<HTMLElement>();

  /**
   * Put everything below the envelope out of reach until it is opened.
   *
   * The attribute is written on the element rather than passed as a prop
   * because the two Reacts spell that prop differently: React 18 does not know
   * `inert` at all, warns at a boolean and drops it, while React 19 takes a
   * boolean and would drop the empty string React 18 needs. Written here it
   * means one thing to both, and to anything else looking for it - the dialog
   * Play Preview draws finds this region by `[inert]` so that its own focus
   * trap does not count controls a guest can never reach.
   */
  const belowTheEnvelope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    belowTheEnvelope.current?.toggleAttribute('inert', unopened);
  }, [unopened]);

  return (
    <SealedProvider sealed={sealed}>
      <main
        ref={fit.frame}
        style={fit.style}
        className="relative mx-auto w-full max-w-[375px] overflow-x-hidden bg-[#090909] text-[#fafafa]">
        <Hero
          content={content}
          addressee={addressee}
          onOpen={offersTrack ? startTrack : undefined}
          onOpened={reveal}
        />
        {/* Everything below the envelope, out of the invitation until it is
            opened. Two marks, because "not yet" has two halves.

            `inert` takes the whole region out of the focus order and out of the
            accessibility tree at once, which is what stops a guest pressing Tab
            and walking straight down to View Location and RSVP Now, reading the
            ending before the beginning and replying to an invitation they have
            not opened.

            `contain: size` takes it out of the page's layout, so a sealed
            invitation is exactly as long as the envelope is drawn and there is
            nothing past it to scroll to. Holding the scroller still would do
            that too, and used to: what it also did was strand anybody whose
            window is shorter than the envelope, because the Open Invitation
            control is 527px down an 812px Hero and a held page cannot be
            scrolled to it. Contained rather than held, a short window - a phone
            turned on its side, most of all - scrolls down the envelope to the
            control and no further. `overflow-hidden` is the other half of that:
            a contained region is no longer tall enough to hold what is inside
            it, so what is inside it has to be clipped rather than drawn over
            the page below.

            Contained rather than unmounted, so the sections are laid out and
            their photographs fetched while a guest is still looking at the
            envelope: opening it should reveal an invitation that is ready, not
            one that starts loading.

            A browser too old for `contain` would let a guest wheel past the
            envelope. That is the same era of browser as one too old for
            `inert`, which is what the line above already rests on, so the seal
            is no more fragile than it was: both arrived in Safari 15, and
            neither leaves a guest unable to read the invitation. */}
        <div
          ref={belowTheEnvelope}
          className={unopened ? 'overflow-hidden [contain:size]' : undefined}>
          <HolyVerse content={content} />
          <BrideGroom content={content} />
          <LoveStory content={content} />
          <EventDetails content={content} onReply={() => setReplying(true)} />
          <Messages rsvps={rsvps} />
          {content.digitalGiftEnabled && <TokenOfLove content={content} />}
          {content.memoRollEnabled && <PhotoShare />}
          <Gallery content={content} />
          <Footer />
        </div>
      </main>

      {/* AnimatePresence keeps the card mounted through its exit, so closing
          is the entrance played back rather than a disappearance. The dialog's
          focus return and scroll unlock run on the real unmount, 200ms later,
          which holds the page still until the card has actually gone. */}
      <AnimatePresence>
        {replying && (
          <RsvpCard
            guest={guest}
            onClose={() => setReplying(false)}
            onKeep={keepReply}
            onSent={readReplyBack}
          />
        )}
      </AnimatePresence>

      {offersTrack && (
        <>
          {/* Mounted while the envelope is still closed, so the track is
              fetchable the moment the open press asks for it; what waits for
              the opening is the sound, not the element. */}
          <audio
            ref={audio}
            src={content.backgroundTrack.url}
            preload="metadata"
            onPlay={() => setTrackPlaying(true)}
            onPause={() => setTrackPlaying(false)}
          />
          {/* The record only once the envelope is open: Sealed means silent,
              and a control drawn on the envelope would be a way to start the
              music without opening the invitation. */}
          {!unopened && (
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[375px] justify-end p-4">
              {/* On a sealed invitation the record arrives mid-opening, timed
                  off the envelope cross-fade's own start so it is settled in
                  the corner by the time the cards have risen - appearing
                  rather than popping. Anywhere else it is part of the page and
                  is drawn at rest, like every other reveal. */}
              <motion.div
                className="pointer-events-auto"
                initial={
                  sealed && !reduce ? { opacity: 0, y: 12, scale: 0.9 } : false
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: EASE,
                  delay: OPENING.envelope.delay,
                }}>
                <VinylWidget playing={trackPlaying} onToggle={toggleTrack} />
              </motion.div>
            </div>
          )}
        </>
      )}
    </SealedProvider>
  );
}
