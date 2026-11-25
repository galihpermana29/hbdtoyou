import type { Metadata } from 'next';
import Link from 'next/link';

import { listOwnedMemorollEvents } from '@/action/memoroll-api';
import { isAdminEmail } from '@/lib/admin';
import { getSession } from '@/store/get-set-session';
import MemorollListing from './memoroll-listing';

export const metadata: Metadata = {
  title: 'MemoRoll | Memoify',
};

/**
 * How many events one page of this listing covers. For an owner it is a
 * ceiling nobody reaches. For the administrator, who since 2026-11-25 is
 * answered with every user's rolls, it is a real page size: each card mounts
 * the roll's own Cover, and a hundred of those is a slow screen.
 */
const EVENTS_PER_PAGE = 100;
const EVENTS_PER_ADMIN_PAGE = 24;

const card =
  'rounded-[20px] border border-[#dadada] bg-white p-[20px] flex flex-col gap-[12px]';
const action =
  'rounded-full border border-[rgba(33,33,33,0.2)] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-[#344054] hover:bg-[#F9FAFB]';
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
export default async function MemorollDashboardPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
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

  /**
   * The administrator's listing is everybody's (owner, 2026-11-25: "default
   * ke semua roll"). The backend decides that from the signed-in account;
   * this only says so on the screen, and pages through it.
   */
  const admin = isAdminEmail(session.email);
  const perPage = admin ? EVENTS_PER_ADMIN_PAGE : EVENTS_PER_PAGE;
  const page = Math.max(1, Math.floor(Number(searchParams?.page)) || 1);

  const events = await listOwnedMemorollEvents(String(perPage), String(page));
  const rows = events.data ?? [];
  const pages = Math.max(1, events.meta?.totalPage ?? 1);
  const total = events.meta?.totalData ?? rows.length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-[24px] px-[32px] py-[32px] 2xl:max-w-7xl">
      <div className="flex flex-col gap-[16px] sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
            MemoRoll
          </h1>
          <p className={`mt-[8px] ${note}`}>
            {admin
              ? `Every roll on Memoify, newest first: ${total} in all, yours among them. Each card says whose it is.`
              : 'The rolls you have made. Open one to see who joined and every shot they took - the reveal never hides anything from you.'}
          </p>
        </div>
        {/* Standalone creation (ADR 0007), always on hand - not only when
            the listing is empty. A roll for a wedding starts from its card on
            the Wedding tab instead, which prefills it. */}
        {rows.length > 0 ? (
          <Link
            href="/memoroll/create"
            className="w-fit shrink-0 rounded-full border border-[#E34013] bg-[#E34013] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-white hover:opacity-90">
            Create MemoRoll
          </Link>
        ) : null}
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

      <MemorollListing
        events={rows}
        admin={admin}
        me={session.userId ?? null}
      />

      {pages > 1 ? (
        <nav
          aria-label="Pages of rolls"
          className="flex items-center justify-between gap-[12px]">
          {page > 1 ? (
            <Link
              href={`/dashboard/memoroll?page=${page - 1}`}
              className={action}>
              Newer
            </Link>
          ) : (
            <span />
          )}
          <p className={note}>
            Page {page} of {pages}
          </p>
          {page < pages ? (
            <Link
              href={`/dashboard/memoroll?page=${page + 1}`}
              className={action}>
              Older
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
