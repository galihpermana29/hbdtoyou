import type { Metadata } from 'next';

import MemorollHero from '@/components/memoroll/landing/hero';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';

export const metadata: Metadata = {
  title: 'MemoRoll | Memoify',
  description:
    'Give every guest a disposable camera and collect the moments you could not be there to see.',
};

/**
 * The MemoRoll landing. The guest viewer lives at `/memoroll/{code}` and the
 * demo at `/memoroll/demo`; this is the page that introduces the product.
 */
export default function MemorollLandingPage() {
  return (
    <div className={memorollFonts}>
      <NavigationBar />
      <main>
        <MemorollHero />
      </main>
    </div>
  );
}
