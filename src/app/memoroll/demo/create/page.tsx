import type { Metadata } from 'next';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import CreatorDemo from './creator-demo';

/**
 * The MemoRoll creator demo: a clickable walkthrough of the eight steps that
 * set a roll up, local state only. It renders the same components the real
 * product will (ADR 0007); only the data behind them differs.
 *
 * Deliberately outside the (gifts) route group, for the same ADR 0003 reason
 * the guest demo is.
 */
export const metadata: Metadata = {
  title: 'MemoRoll · creator demo | Memoify',
  description:
    'Set up a shared disposable camera: the vibe, the name, the cover, when it opens, where it is, how many shots each guest gets, when it develops, and the QR for the tables. Clickable demo.',
  robots: { index: false },
};

export default function MemorollCreatorDemoPage() {
  return (
    <main className={memorollFonts}>
      <CreatorDemo />
    </main>
  );
}
