import BrideGroom from '@/components/wedding/wedding-template-1/BrideGroom';
import EventDetails from '@/components/wedding/wedding-template-1/EventDetails';
import Footer from '@/components/wedding/wedding-template-1/Footer';
import Gallery from '@/components/wedding/wedding-template-1/Gallery';
import Hero from '@/components/wedding/wedding-template-1/Hero';
import HolyVerse from '@/components/wedding/wedding-template-1/HolyVerse';
import LoveStory from '@/components/wedding/wedding-template-1/LoveStory';
import Messages from '@/components/wedding/wedding-template-1/Messages';
import PhotoShare from '@/components/wedding/wedding-template-1/PhotoShare';
import TokenOfLove from '@/components/wedding/wedding-template-1/TokenOfLove';
import VinylWidget from '@/components/wedding/wedding-template-1/VinylWidget';
import {
  instrumentSerif,
  luxuriousScript,
  publicSans,
  sometypeMono,
} from '@/components/wedding/wedding-template-1/fonts';

export const metadata = {
  title: 'Wedding Invitation',
};

/**
 * Wedding Template 1 ("BNW") — sample/preview viewer.
 * Figma: node 312:1631 (375px mobile design).
 */
export default function WeddingTemplate1Page() {
  const fontVars = `${luxuriousScript.variable} ${sometypeMono.variable} ${instrumentSerif.variable} ${publicSans.variable}`;

  return (
    <div className={`${fontVars} bg-black`}>
      <main className="relative mx-auto w-full max-w-[375px] overflow-hidden bg-[#090909]">
        <Hero />
        <HolyVerse />
        <BrideGroom />
        <LoveStory />
        <EventDetails />
        <Messages />
        <TokenOfLove />
        <PhotoShare />
        <Gallery />
        <Footer />
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[375px] justify-end p-4">
        <div className="pointer-events-auto">
          <VinylWidget />
        </div>
      </div>
    </div>
  );
}
