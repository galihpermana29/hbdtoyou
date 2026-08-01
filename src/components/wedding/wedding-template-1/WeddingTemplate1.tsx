'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import BrideGroom from './BrideGroom';
import EventDetails from './EventDetails';
import Footer from './Footer';
import Gallery from './Gallery';
import Hero from './Hero';
import HolyVerse from './HolyVerse';
import LoveStory from './LoveStory';
import Messages from './Messages';
import PhotoShare from './PhotoShare';
import RsvpCard, { type Rsvp } from './RsvpCard';
import TokenOfLove from './TokenOfLove';
import VinylWidget from './VinylWidget';
import { SealedProvider } from './sealed-context';
import { useScrollLock, type Scroller } from './use-scroll-lock';
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
   * Show the invitation the way a guest is sent it: sealed behind the envelope
   * until they open it, and revealed section by section as they scroll.
   *
   * Off for the Site Preview beside the form, which is a picture of the
   * invitation the couple is editing rather than the invitation being received.
   */
  sealed?: boolean;
  /**
   * What this invitation may hold still while it is sealed, which is whatever
   * it is scrolling inside: `'page'` where it has the window to itself, and a
   * ref to the scroller where something else does the scrolling - `Scroller`
   * says which is which.
   *
   * Left out by the panels inside the Create Flow, which draw a sealed
   * invitation in a phone-sized frame with a form beside it and hold nothing
   * still.
   */
  holdsStill?: Scroller;
  /** Draw the Background Track control over the invitation. */
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
  sealed = false,
  holdsStill,
  showVinylWidget = false,
}: WeddingTemplate1Props) {
  /**
   * Every reply this page has taken, which is as far as one gets.
   *
   * The invitation is what a guest replies on, so it is what holds the replies
   * until somebody has somewhere to send them: `RsvpCard.tsx` says why that is
   * not here. Attendance and a plus one are held and drawn nowhere, because
   * they are the couple's to read and no screen shows them to anybody yet.
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
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [replying, setReplying] = useState(false);

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

  useScrollLock(unopened, holdsStill);

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
      <main className="relative mx-auto w-full max-w-[375px] overflow-x-hidden bg-[#090909] text-[#fafafa]">
        <Hero content={content} onOpened={reveal} />
        {/* Everything below the envelope, out of reach until it is opened.
            Holding the scroller still stops the wheel and nothing else: without
            this a guest presses Tab and walks straight down to View Location
            and RSVP Now, reading the ending before the beginning and replying
            to an invitation they have not opened. `inert` is what takes a whole
            region out of the focus order and out of the accessibility tree at
            once, which is both halves of "not reachable yet". */}
        <div ref={belowTheEnvelope}>
          <HolyVerse content={content} />
          <BrideGroom content={content} />
          <LoveStory content={content} />
          <EventDetails content={content} onReply={() => setReplying(true)} />
          <Messages rsvps={rsvps} />
          <TokenOfLove content={content} />
          {content.memoRollEnabled && <PhotoShare />}
          <Gallery content={content} />
          <Footer />
        </div>
      </main>

      {replying && (
        <RsvpCard
          onClose={() => setReplying(false)}
          onSubmit={(rsvp) => {
            setRsvps((taken) => [...taken, rsvp]);
            setReplying(false);
          }}
        />
      )}

      {showVinylWidget && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[375px] justify-end p-4">
          <div className="pointer-events-auto">
            <VinylWidget />
          </div>
        </div>
      )}
    </SealedProvider>
  );
}
