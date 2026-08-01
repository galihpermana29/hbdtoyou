'use client';

import BrideGroom from './BrideGroom';
import EventDetails from './EventDetails';
import Footer from './Footer';
import Gallery from './Gallery';
import Hero from './Hero';
import HolyVerse from './HolyVerse';
import LoveStory from './LoveStory';
import Messages from './Messages';
import PhotoShare from './PhotoShare';
import TokenOfLove from './TokenOfLove';
import VinylWidget from './VinylWidget';
import { SealedProvider } from './sealed-context';
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
   * This invitation has the page to itself, so while it is sealed the page does
   * not scroll. Off for the panels inside the Create Flow, which draw a sealed
   * invitation in a phone-sized frame with a form beside it.
   */
  locksPage?: boolean;
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
  locksPage = false,
  showVinylWidget = false,
}: WeddingTemplate1Props) {
  return (
    <SealedProvider sealed={sealed}>
      <main className="relative mx-auto w-full max-w-[375px] overflow-x-hidden bg-[#090909] text-[#fafafa]">
        <Hero content={content} locksPage={locksPage} />
        <HolyVerse content={content} />
        <BrideGroom content={content} />
        <LoveStory content={content} />
        <EventDetails content={content} />
        <Messages />
        <TokenOfLove content={content} />
        {content.memoRollEnabled && <PhotoShare />}
        <Gallery content={content} />
        <Footer />
      </main>

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
