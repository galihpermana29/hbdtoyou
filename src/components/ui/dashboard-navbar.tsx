'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * The dashboard's tabs as MemoRoll's selection pills (owner, 2026-11-17): the
 * page you are on is the flame pill, the rest sit on the paper and warm to
 * the unchosen shade under the pointer.
 */
const DashboardNavbar = ({ isAdmin }: { isAdmin: boolean }) => {
  // Trailing slashes are not redirected away (skipTrailingSlashRedirect).
  const pathname = (usePathname() ?? '').replace(/\/+$/, '') || '/';
  const tab = (href: string) => {
    const here =
      href === '/dashboard'
        ? pathname === '/dashboard'
        : pathname === href || pathname.startsWith(`${href}/`);
    return `rounded-full px-[14px] py-[7px] text-[14px] font-[600] tracking-[-0.011em] transition-colors ${
      here
        ? 'bg-[#ff3e09] text-white'
        : 'text-[#232323] hover:bg-[#efeae9]'
    }`;
  };
  return (
    <div className="border-b-[1px] border-[#dadada] bg-[#f7f5f3]">
      <div className="py-[12px] px-[32px] flex gap-[6px] max-w-6xl 2xl:max-w-7xl mx-auto overflow-x-auto whitespace-nowrap">
        <Link
          href={'/dashboard'}
          className={tab('/dashboard')}>
          Dashboard
        </Link>
        {/* Outside the admin guard, unlike every tab below it. A couple's own
            wedding invitations are the one thing here that belongs to the person
            signed in rather than to whoever runs the product, and inside the
            guard this tab would be invisible to every couple it exists for. The
            screen behind it scopes itself the way the Dashboard tab does: the
            person's own invitations, or everybody's for an administrator. */}
        <Link
          href={'/dashboard/wedding'}
          className={tab('/dashboard/wedding')}>
          Wedding
        </Link>
        {/* Like Wedding: the person's own events, outside the admin guard. */}
        <Link
          href={'/dashboard/memoroll'}
          className={tab('/dashboard/memoroll')}>
          MemoRoll
        </Link>
        {isAdmin && (
          <>
            <Link
              href={'/dashboard/feedbacks'}
              className={tab('/dashboard/feedbacks')}>
              Feedback
            </Link>
            <Link
              href={'/dashboard/cloudinary-usage'}
              className={tab('/dashboard/cloudinary-usage')}>
              Cloudinary
            </Link>
            <Link
              href={'/dashboard/brevo-usage'}
              className={tab('/dashboard/brevo-usage')}>
              Brevo
            </Link>
            <Link
              href={'/dashboard/scheduled'}
              className={tab('/dashboard/scheduled')}>
              Scheduled
            </Link>
            <Link
              href={'/dashboard/transactions'}
              className={tab('/dashboard/transactions')}>
              Transactions
            </Link>
            <Link
              href={'/dashboard/coupons'}
              className={tab('/dashboard/coupons')}>
              Coupons
            </Link>
            <Link
              href={'/dashboard/plans'}
              className={tab('/dashboard/plans')}>
              Plans
            </Link>
            <Link
              href={'/dashboard/templates'}
              className={tab('/dashboard/templates')}>
              Templates
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardNavbar;
