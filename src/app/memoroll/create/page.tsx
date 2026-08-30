import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getOwnedWeddingInvitation } from '@/action/wedding-api';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import { getSession } from '@/store/get-set-session';
import MemorollCreate from './memoroll-create';
import { blankMemorollDraft, draftFromWedding } from './prefill';

/**
 * The MemoRoll creator: the eight steps that set a roll up, and the one act
 * at the end that publishes it. The same components the demo walks through
 * (ADR 0007), with a record behind them.
 *
 * Deliberately outside the (gifts) route group, for the same ADR 0003 reason
 * the demo is, and gated the way the wedding's Create Flow is: creating needs
 * an account for the credit it spends and the photographs it uploads, and a
 * visitor who filled eight steps only to be bounced at publish would have
 * been treated worse than one asked at the door. They are sent to the landing
 * page, whose own control signs them in.
 *
 * `?wedding_id` is the dashboard card's doorway: the wedding it names is read
 * with the caller's own authority and prefills the flow - the couple, the
 * day, the venue, the Photo Collection into the cover. A wedding that cannot
 * be read (somebody else's, or gone) prefills nothing and the flow opens
 * blank; the link is only sent to the backend when the wedding answered, so
 * a broken doorway cannot write a broken link.
 */
export const metadata: Metadata = {
  title: 'Create a MemoRoll | Memoify',
  description:
    'Set up a shared disposable camera: the vibe, the name, the cover, when it opens, where it is, how many shots each guest gets, and when it develops.',
  robots: { index: false },
};

export default async function MemorollCreatePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getSession();
  if (!session?.accessToken) {
    redirect('/');
  }

  const weddingParam = searchParams.wedding_id;
  const weddingId =
    typeof weddingParam === 'string' && weddingParam.trim() !== ''
      ? weddingParam.trim()
      : null;

  let initialDraft = blankMemorollDraft();
  let linkedWeddingId: string | null = null;
  let existingRollId: string | null = null;

  if (weddingId) {
    const wedding = await getOwnedWeddingInvitation(weddingId);
    if (wedding.success && wedding.data) {
      initialDraft = draftFromWedding(wedding.data);
      linkedWeddingId = weddingId;
      // One wedding, one roll: when it already exists, the welcome's button
      // becomes the door to its console rather than to a wizard whose
      // publish could only be refused (owner, 2026-08-30).
      const linked = wedding.data.linked_memoroll;
      if (linked && linked.status !== 'archived') {
        existingRollId = linked.id;
      }
    }
  }

  return (
    <main className={memorollFonts}>
      <MemorollCreate
        initialDraft={initialDraft}
        weddingId={linkedWeddingId}
        existingRollId={existingRollId}
      />
    </main>
  );
}
