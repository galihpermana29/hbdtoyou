import type { Metadata } from 'next';

import { isAdminEmail } from '@/lib/admin';
import { getSession } from '@/store/get-set-session';
import { linkedMemorolls } from './linked-memorolls';
import { ownedWeddingInvitations } from './owned-invitations';
import WeddingListing from './wedding-listing';

export const metadata: Metadata = {
  title: 'Wedding | Memoify',
};

/**
 * A couple's own wedding invitations, draft and published.
 *
 * The one screen in the dashboard that belongs to the person signed in rather
 * than to whoever runs the product, which is why its tab sits outside the admin
 * guard. Scoped the way the Dashboard tab is scoped: an administrator is shown
 * everything, and everybody else is shown their own.
 *
 * Nothing is created here. This is where an invitation is found again - opened
 * into the flow that made it, sent to its guest list, or published - and every
 * one of those is addressed by the invitation's own identifier, so there is
 * nothing on this screen that can reach a wedding without naming it.
 */
export default async function WeddingDashboardPage() {
  const session = await getSession();

  // Not a redirect. Somebody who is not signed in has no invitations rather
  // than no permission, and being bounced to another screen says neither.
  if (!session?.accessToken) {
    return (
      <div className="mx-auto max-w-6xl px-[32px] py-[32px] 2xl:max-w-7xl">
        <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
          Wedding invitations
        </h1>
        <p className="mt-[8px] text-[16px] font-[400] leading-[24px] text-[#667085]">
          Sign in to see the invitations you have made.
        </p>
      </div>
    );
  }

  const isAdmin = isAdminEmail(session.email);
  const [{ invitations, problem, moreThanShown }, memorolls] =
    await Promise.all([
      ownedWeddingInvitations(isAdmin ? null : (session.userId as string)),
      linkedMemorolls(),
    ]);
  return (
    <WeddingListing
      invitations={invitations}
      problem={problem}
      moreThanShown={moreThanShown}
      isAdmin={isAdmin}
      memorolls={memorolls}
    />
  );
}
