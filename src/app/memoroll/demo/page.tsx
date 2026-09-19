import type { Metadata } from 'next';
import { memorollFonts as designFonts } from '@/components/memoroll/ui/fonts';
import { memorollFonts as legacyFonts } from './fonts';
import MemorollDemo from './memoroll-demo';

/**
 * The MemoRoll guest demo: a clickable walkthrough of the designer's screens,
 * local state only. It renders the same components the real product will
 * (ADR 0007); only the data behind them differs.
 *
 * Deliberately outside the (gifts) route group - ADR 0003 gives that group
 * runtime meaning this demo must not inherit.
 */
export const metadata: Metadata = {
  title: 'MemoRoll · guest demo | Memoify',
  description:
    'A shared disposable camera for a wedding: ten shots each, one collective gallery, blurred until the reveal. Clickable demo.',
  robots: { index: false },
};

export default function MemorollDemoPage() {
  return (
    // Two font sets still: the four families of the 2026-08-24 design, and
    // the legacy pair that outlived the screens drawn in it - the camera
    // bakes its date stamp and watermark in them (hbd-3i5 owns retiring
    // that), and the mock sign-in and the demo dock still speak them.
    <main className={`${designFonts} ${legacyFonts}`}>
      <MemorollDemo />
    </main>
  );
}
