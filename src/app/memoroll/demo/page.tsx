import type { Metadata } from 'next';
import { memorollFonts } from './fonts';
import MemorollDemo from './memoroll-demo';

/**
 * The MemoRoll guest demo: a clickable walkthrough of the designer's 14
 * screens, local state only. Deliberately outside the (gifts) route group -
 * ADR 0003 gives that group runtime meaning this demo must not inherit.
 */
export const metadata: Metadata = {
  title: 'MemoRoll · guest demo | Memoify',
  description:
    'A shared disposable camera for a wedding: ten shots each, one collective gallery, blurred until the reveal. Clickable demo.',
  robots: { index: false },
};

export default function MemorollDemoPage() {
  return (
    <main className={memorollFonts}>
      <MemorollDemo />
    </main>
  );
}
