import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { readMemorollGallery } from '@/action/memoroll-api';
import { memorollFonts as designFonts } from '@/components/memoroll/ui/fonts';
import { memorollFonts as legacyFonts } from '../demo/fonts';
import MemorollGuest from './memoroll-guest';

/**
 * A MemoRoll, at the address its QR carries: `/memoroll/{code}`.
 *
 * This is the guest viewer - the same screens the demo walks through, with
 * the event behind them (ADR 0007). Deliberately outside the (gifts) route
 * group for the ADR 0003 reason the demo is: MemoRoll is its own brand and
 * draws its own footer.
 *
 * The read here is the unauthenticated preview, on purpose. It answers what
 * the Cover and the closed door need - the phase, the name, the cover, the
 * schedule - and it joins nobody: a signed-in person who opened a link has
 * not yet said they are coming in, and joining is what "Get me in" does.
 *
 * An event that answers `EVENT_NOT_PUBLISHED` - or does not answer at all -
 * is a stale or mistyped link. Events from this app are created published or
 * not at all, so there is no "not ready yet" to explain, and a wrong address
 * says more as a wrong address.
 */
export const metadata: Metadata = {
  title: 'MemoRoll | Memoify',
  description:
    'A shared disposable camera: a roll of shots each, one collective gallery, nothing seen until the reveal.',
  robots: { index: false },
};

export default async function MemorollGuestPage({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code;
  const preview = await readMemorollGallery(code, 'preview');
  if (!preview.success || !preview.data?.event) {
    notFound();
  }

  return (
    // Two font sets, the way the demo carries them: the four families of the
    // design, and the legacy pair the camera still bakes its date stamp and
    // watermark in (hbd-3i5 owns retiring that).
    <main className={`${designFonts} ${legacyFonts}`}>
      <MemorollGuest code={code} event={preview.data.event} />
    </main>
  );
}
