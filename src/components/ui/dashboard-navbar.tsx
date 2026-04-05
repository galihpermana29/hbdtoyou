import Link from 'next/link';

const DashboardNavbar = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="border-b-[1px] border-[#ebebeb] bg-white">
      <div className="py-[12px] px-[32px] flex gap-[12px] max-w-6xl 2xl:max-w-7xl mx-auto overflow-x-auto whitespace-nowrap">
        <Link
          href={'/dashboard'}
          className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
          Dashboard
        </Link>
        {isAdmin && (
          <>
            <Link
              href={'/dashboard/feedbacks'}
              className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
              Feedback
            </Link>
            <Link
              href={'/dashboard/cloudinary-usage'}
              className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
              Cloudinary
            </Link>
            <Link
              href={'/dashboard/brevo-usage'}
              className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
              Brevo
            </Link>
            <Link
              href={'/dashboard/scheduled'}
              className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
              Scheduled
            </Link>
            <Link
              href={'/dashboard/transactions'}
              className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
              Transactions
            </Link>
            <Link
              href={'/dashboard/coupons'}
              className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
              Coupons
            </Link>
            <Link
              href={'/dashboard/plans'}
              className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
              Plans
            </Link>
            <Link
              href={'/dashboard/templates'}
              className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
              Templates
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardNavbar;
