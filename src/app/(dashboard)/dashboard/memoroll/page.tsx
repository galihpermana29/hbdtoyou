import type { Metadata } from 'next';
import Link from 'next/link';

import { listOwnedMemorollEvents } from '@/action/memoroll-api';
import { getSession } from '@/store/get-set-session';
import MemorollListing from './memoroll-listing';

export const metadata: Metadata = {
  title: 'MemoRoll | Memoify',
};

/**
 * How many events one page of this listing covers. A ceiling rather than a
 * page size, the way the wedding listing's is: there is no second page, so
 * the screen says so when it would be hiding something.
 */
const EVENTS_PER_PAGE = 100;

const card =
  'rounded-[12px] border border-[#EAECF0] bg-white p-[20px] flex flex-col gap-[12px]';
const action =
  'rounded-[8px] border border-[#D0D5DD] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-[#344054] hover:bg-[#F9FAFB]';
const note = 'text-[14px] font-[400] leading-[20px] text-[#667085]';
const alert = 'text-[14px] font-[400] leading-[20px] text-[#B42318]';

/**
 * A person's own MemoRoll events - the owner's side of the product.
 *
 * Dashboard chrome on purpose: the designed MemoRoll brand covers the
 * creator and the guest, and no frame draws an owner console, so this lives
 * where `/dashboard/wedding` set the precedent - plain cards, plain words,
 * outside the admin guard because these are the signed-in person's own.
 */
export default async function MemorollDashboardPage() {
  const session = await getSession();

  if (!session?.accessToken) {
    return (
      <div className="mx-auto max-w-6xl px-[32px] py-[32px] 2xl:max-w-7xl">
        <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
          MemoRoll
        </h1>
        <p className={`mt-[8px] ${note}`}>
          Sign in to see the rolls you have made.
        </p>
      </div>
    );
  }

  const events = await listOwnedMemorollEvents(String(EVENTS_PER_PAGE), '1');
  const rows = events.data ?? [];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-[24px] px-[32px] py-[32px] 2xl:max-w-7xl">
      <div>
        <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
          MemoRoll
        </h1>
        <p className={`mt-[8px] ${note}`}>
          The rolls you have made. Open one to see who joined and every shot
          they took - the reveal never hides anything from you.
        </p>
      </div>

      {!events.success ? (
        <p role="alert" className={alert}>
          Your rolls could not be read: {events.message}.
        </p>
      ) : null}

      {events.success && rows.length === 0 ? (
        <div className={card}>
          <p className="text-[16px] font-[400] leading-[24px] text-[#182230]">
            You have not made a roll yet.
          </p>
          <Link href="/memoroll/create" className={`${action} w-fit`}>
            Make one
          </Link>
        </div>
      ) : null}

      <MemorollListing events={rows} />

      {rows.length >= EVENTS_PER_PAGE ? (
        <p className={note}>
          This screen shows the first {EVENTS_PER_PAGE} rolls and there are
          more. Older ones are not listed here yet.
        </p>
      ) : null}
    </div>
  );
}
