import type { IMemorollEventResponse } from '@/action/interfaces';

/**
 * Whose roll a row is, as far as the backend has said.
 *
 * Since 2026-11-25 the admin account is answered with every user's events
 * through the same endpoints an owner uses, and the rows did not say whose
 * each one was. The owner asked for the creator's email on every card; the
 * backend was asked to send it. This reads it under the names it is likely
 * to arrive by, so the day it does the cards fill in without a release, and
 * until then they say plainly that it was not sent.
 */
export function memorollOwnerOf(event: IMemorollEventResponse): {
  id: string | null;
  email: string | null;
} {
  const row = event as IMemorollEventResponse & {
    email?: string;
    creator_email?: string;
    user?: { id?: string; email?: string };
  };
  const email =
    row.user_email ||
    row.owner_email ||
    row.creator_email ||
    row.user?.email ||
    row.email ||
    null;
  return { id: row.user_id || row.user?.id || null, email };
}

/** Where the list leaves a roll's owner email for the manage page (this tab). */
export const ownerEmailKey = (eventId: string) =>
  `memoroll-admin:owner:${eventId}`;
