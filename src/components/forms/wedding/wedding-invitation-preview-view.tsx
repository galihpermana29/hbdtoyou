'use client';

import BrideGroom from './preview/BrideGroom';
import EventDetails from './preview/EventDetails';
import Footer from './preview/Footer';
import Gallery from './preview/Gallery';
import Hero from './preview/Hero';
import HolyVerse from './preview/HolyVerse';
import LoveStory from './preview/LoveStory';
import Messages from './preview/Messages';
import PhotoShare from './preview/PhotoShare';
import TokenOfLove from './preview/TokenOfLove';
import { WeddingTemplate1RecipientProvider } from './preview/preview-context';
import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  type WeddingTemplate1Content,
} from './wedding-invitation-types';

export interface WeddingInvitationPreviewViewProps {
  content?: WeddingTemplate1Content;
  showVinylWidget?: boolean;
  /**
   * Show the invitation the way a guest receives it: sealed behind the envelope
   * until it is opened, and revealed section by section as they scroll.
   *
   * Off for the panel beside the form, which is a picture of the invitation the
   * couple is editing rather than the invitation being received.
   */
  recipientMode?: boolean;
}

/**
 * Form-only live preview composer. Does not modify the published wedding template.
 */
export default function WeddingInvitationPreviewView({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  recipientMode = false,
}: WeddingInvitationPreviewViewProps) {
  return (
    <WeddingTemplate1RecipientProvider recipientMode={recipientMode}>
      <main className="relative mx-auto w-full max-w-[375px] overflow-x-hidden bg-[#090909] text-[#fafafa]">
        <Hero content={content} recipientMode={recipientMode} />
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
    </WeddingTemplate1RecipientProvider>
  );
}
