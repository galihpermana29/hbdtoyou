import { CoupleImage } from '@/components/weddingv1/CoupleImage';
import { Header } from '@/components/weddingv1/Header';
import { RSVP } from '@/components/weddingv1/RSVP';
import { WeddingDetails } from '@/components/weddingv1/WeddingDetails';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto bg-[#fffcf6] shadow-lg">
        <Header />

        {/* Main Announcement */}
        <div className="p-2 md:p-6 text-center">
          <h2
            className={`${playfair.className} text-3xl md:text-5xl font-bold mb-8`}>
            KYLIE & MASON
            <br />
            ARE GETTING MARRIED!
          </h2>

          {/* Image and Details Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <CoupleImage />
            <WeddingDetails />
          </div>

          <RSVP />
        </div>
      </div>
    </main>
  );
}
