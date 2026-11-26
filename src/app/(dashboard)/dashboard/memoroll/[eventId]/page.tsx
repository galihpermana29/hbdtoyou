import { isAdminEmail } from '@/lib/admin';
import { memorollOwnerOf } from '@/lib/memoroll-owner';
import type { Metadata } from 'next';

import {
  getMemorollDashboard,
  getOwnedMemorollEvent,
  listMemorollParticipants,
  listMemorollPhotos,
} from '@/action/memoroll-api';
import { getSession } from '@/store/get-set-session';
import MemorollConsole from './memoroll-console';

export const metadata: Metadata = {
  title: 'MemoRoll console | Memoify',
};

/**
 * One page each of guests and photos. Ceilings, not page sizes - the console
 * says so when an event outgrows them rather than paging silently.
 */
const PARTICIPANTS_SHOWN = 100;
const PHOTOS_SHOWN = 100;

const note = 'text-[14px] font-[400] leading-[20px] text-[#667085]';

/**
 * The owner's console for one event: who joined, every Shot they took - the
 * Reveal never gates the person answerable for the event - and the settings
 * that can still change. Dashboard chrome for the same reason the listing is.
 */
export default async function MemorollConsolePage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await getSession();
  if (!session?.accessToken) {
    return (
      <div className="mx-auto max-w-6xl px-[32px] py-[32px] 2xl:max-w-7xl">
        <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
          MemoRoll console
        </h1>
        <p className={`mt-[8px] ${note}`}>Sign in to open your roll.</p>
      </div>
    );
  }

  const eventId = params.eventId;
  const [event, dashboard, participants, photos] = await Promise.all([
    getOwnedMemorollEvent(eventId),
    getMemorollDashboard(eventId),
    listMemorollParticipants(eventId, String(PARTICIPANTS_SHOWN), '1'),
    listMemorollPhotos(eventId, String(PHOTOS_SHOWN), '1'),
  ]);

  if (!event.success || !event.data) {
    return (
      <div className="mx-auto max-w-6xl px-[32px] py-[32px] 2xl:max-w-7xl">
        <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
          MemoRoll console
        </h1>
        <p role="alert" className={`mt-[8px] ${note}`}>
          This roll could not be read: {event.message}.
        </p>
      </div>
    );
  }

  /**
   * An administrator inside somebody else's roll. The event names its owner
   * (`user_id`, admin guide of 2026-11-26), and the backend only ever shows
   * an account a roll that is not its own when that account is an
   * administrator - so a different owner is the whole test, and this app
   * does not need the backend's list of who they are. Where a row carries no
   * owner, the one address known here and the old sign (the owner-only
   * reads refusing) still stand in.
   */
  const owner = memorollOwnerOf(event.data);
  const foreign =
    owner.id !== null && session.userId
      ? owner.id !== session.userId
      : isAdminEmail(session.email) &&
        !dashboard.success &&
        !participants.success;

  return (
    <MemorollConsole
      event={event.data}
      adminView={foreign ? { ownerEmail: owner.email } : null}
      participantsProblem={participants.success ? null : participants.message}
      dashboard={dashboard.data}
      participants={participants.data ?? []}
      moreParticipants={
        (participants.meta?.totalData ?? 0) > PARTICIPANTS_SHOWN
      }
      photos={photos.data ?? []}
      morePhotos={(photos.meta?.totalData ?? 0) > PHOTOS_SHOWN}
    />
  );
}
