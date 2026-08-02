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
import { useBeginAtTheTop, type Scroller } from './use-begin-at-the-top';
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
   * Who this invitation was sent to, drawn on the closed envelope.
   *
   * A guest's name rather than the couple's, so it is not part of the content
   * the Create Flow collects: one wedding is sent to many guests. It comes from
   * the token on the guest's own link, which the Invitation Viewer resolves
   * against the Guest List; the Showcase passes its Example Content's.
   */
  addressee?: string;
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
   * Draw the Background Track control over the invitation, where the page
   * showing it has room for one.
   *
   * The couple's own answer is the other half of this: a wedding whose
   * Background Track is switched off has no track to offer, so the control is
   * not drawn on it whatever the page asked for.
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
  sealed = false,
  addressee,
  scrollsInside,
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

  useBeginAtTheTop(sealed, scrollsInside);

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
        <Hero content={content} addressee={addressee} onOpened={reveal} />
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

      {replying && (
        <RsvpCard
          onClose={() => setReplying(false)}
          onSubmit={(rsvp) => {
            setRsvps((taken) => [...taken, rsvp]);
            setReplying(false);
          }}
        />
      )}

      {showVinylWidget && content.songRequestEnabled && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[375px] justify-end p-4">
          <div className="pointer-events-auto">
            <VinylWidget />
          </div>
        </div>
      )}
    </SealedProvider>
  );
}
