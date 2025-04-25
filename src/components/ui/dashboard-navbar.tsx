import Link from 'next/link';

const DashboardNavbar = () => {
  return (
    <div className="border-b-[1px] border-[#ebebeb] bg-white">
      <div className=" py-[12px] px-[32px] flex gap-[12px] max-w-6xl 2xl:max-w-7xl mx-auto">
        <Link
          href={'/dashboard'}
          className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
          Dashboard
        </Link>
        <Link
          href={'/profile'}
          className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
          Profile Settings
        </Link>
        <Link
          href={'/profile'}
          className="text-[#182230] font-[600] text-[16px] hover:bg-[#F9FAFB] rounded-[8px] py-[8px] px-[12px]">
          Invite Friends
        </Link>
      </div>
    </div>
  );
};

export default DashboardNavbar;
