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
}

/**
 * Form-only live preview composer. Does not modify the published wedding template.
 */
export default function WeddingInvitationPreviewView({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: WeddingInvitationPreviewViewProps) {
  return (
    <WeddingTemplate1RecipientProvider recipientMode={false}>
      <main className="relative mx-auto w-full max-w-[375px] overflow-x-hidden bg-[#090909] text-[#fafafa]">
        <Hero content={content} recipientMode={false} />
        <HolyVerse content={content} />
        <BrideGroom content={content} />
        <LoveStory content={content} />
        <EventDetails content={content} />
        {content.guestMessagesEnabled && <Messages />}
        <TokenOfLove content={content} />
        <PhotoShare content={content} />
        <Gallery content={content} />
        <Footer />
      </main>
    </WeddingTemplate1RecipientProvider>
  );
}
