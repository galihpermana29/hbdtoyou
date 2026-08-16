import type { Metadata } from 'next';
import { memorollFonts } from '../fonts';
import CreatorDemo from './creator-demo';

/**
 * The MemoRoll creator demo: the config UI the designer hasn't drawn yet,
 * explored in her own style as a working reference. Sits beside the guest
 * demo so both halves share one vocabulary, and outside the (gifts) route
 * group for the same ADR 0003 reason the guest demo does.
 */
export const metadata: Metadata = {
  title: 'MemoRoll · creator demo | Memoify',
  description:
    'Set up a shared disposable camera for a wedding: the event window, the reveal, the venue fence, the film, and the QR for the tables. Clickable demo.',
  robots: { index: false },
};

export default function MemorollCreatorDemoPage() {
  return (
    <main className={memorollFonts}>
      <CreatorDemo />
    </main>
  );
}
