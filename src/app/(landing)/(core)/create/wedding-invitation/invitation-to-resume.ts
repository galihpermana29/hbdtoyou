/**
 * The unpublished invitation a couple left behind, found again on entry.
 *
 * Opening the Create Flow used to start a blank invitation whatever a couple
 * had already saved, and their first save would quietly make a second one. So
 * before the flow renders, this looks for an unpublished invitation the couple
 * already owns and hands it back for the flow to resume: the same identifier,
 * the same values, and no second create. A couple with nothing saved starts
 * fresh, exactly as before.
 *
 * The search is the dashboard listing's, because there is nothing better: no
 * endpoint lists a couple's invitations, so the content table is enumerated,
 * filtered to the wedding template, and each record's own identifier is read
 * out of it - see
 * `docs/adr/0004-a-saved-invitation-carries-its-own-identifier.md`. The reads
 * are fresh when it matters: every save drops the listing's cache, so an
 * invitation saved a moment ago is an invitation this finds.
 *
 * A published invitation is never resumed. Publishing is a couple saying an
 * invitation is finished, so entering the flow after publishing is starting
 * the next one - and changing a published invitation has its own door, on the
 * dashboard. Among unpublished ones the newest wins, because a couple midway
 * through building an invitation is overwhelmingly a couple with exactly one.
 *
 * Null on any refused read, deliberately. Resuming is a courtesy on the way
 * into a flow whose whole point is creating, and refusing everybody entry
 * because a listing could not be read would cost far more than the duplicate
 * it fails to prevent. What null costs is exactly what entering this flow
 * always did.
 */

import { getAllTemplates, getContentByUserId } from '@/action/user-api';
import { getOwnedWeddingInvitation } from '@/action/wedding-api';
import {
  WEDDING_TEMPLATE_SLUG,
  weddingContentFrom,
  weddingIdFrom,
} from '@/components/forms/wedding/wedding-invitation-types';

import type { OpenedWeddingInvitation } from './wedding-invitation-create-clientside';

/**
 * How many content rows the search reads: one page, the same ceiling the
 * dashboard listing has. A couple beyond it has invitations this search
 * cannot see, and what they get is the flow as it always was.
 */
const INVITATIONS_READ = 100;

/** What the couple's own status word is, as the backend spells it. */
const PUBLISHED = 'published';

export async function invitationToResume(
  userId: string
): Promise<OpenedWeddingInvitation | null> {
  const templates = await getAllTemplates();
  const template = templates.data?.find(
    (candidate) => candidate.slug === WEDDING_TEMPLATE_SLUG
  );
  if (!template) return null;

  const contents = await getContentByUserId(
    userId,
    String(INVITATIONS_READ),
    '1',
    template.id
  );
  if (!contents.success || !contents.data) return null;

  // Newest first, so the invitation resumed is the one the couple started
  // last. A date the backend spelled unreadably sorts to the end rather than
  // throwing, which loses nothing: a record without a readable date is not the
  // one somebody was building a moment ago.
  const candidates = contents.data
    .map((row) => ({
      weddingId: weddingIdFrom(row.detail_content_json_text),
      madeOn: Date.parse(row.create_date ?? '') || 0,
    }))
    .filter(
      (candidate): candidate is { weddingId: string; madeOn: number } =>
        candidate.weddingId !== null
    )
    .sort((first, second) => second.madeOn - first.madeOn);

  // Read together rather than in turn, the same way the listing reads them: a
  // couple with a dozen invitations should not wait a dozen round trips for a
  // door to open.
  const readings = await Promise.all(
    candidates.map(async (candidate) => ({
      candidate,
      reading: await getOwnedWeddingInvitation(candidate.weddingId),
    }))
  );

  for (const { candidate, reading } of readings) {
    if (!reading.success || !reading.data) continue;
    if (reading.data.status === PUBLISHED) continue;

    // Nothing is invented for a record that cannot be read back: resuming a
    // blank form over it would overwrite what it holds, which is the same
    // reason the dashboard's edit door refuses one. Skipped rather than
    // refused, because nobody asked this door for that invitation in
    // particular.
    const content = weddingContentFrom(reading.data.detail_content_json_text);
    if (!content) continue;

    return {
      weddingId: reading.data.id || candidate.weddingId,
      slug: reading.data.invitation_slug ?? '',
      isPublished: false,
      content,
      greetingMessage: content.greetingMessage ?? null,
    };
  }

  return null;
}
