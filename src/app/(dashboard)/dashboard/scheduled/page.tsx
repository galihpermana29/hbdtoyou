import { getDashboardScheduled } from '@/action/user-api';
import { getSession } from '@/store/get-set-session';
import { redirect } from 'next/navigation';
import { Table } from 'antd';

const ScheduledPage = async () => {
  const session = await getSession();
  const isAdmin = session?.email === 'memoify.live@gmail.com';
  if (!isAdmin) redirect('/dashboard');

  const res = await getDashboardScheduled();

  if (!res.success || !res.data) {
    return (
      <div className="py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
        <h1 className="text-[#1B1B1B] font-[600] text-[30px]">
          Scheduled Content
        </h1>
        <p className="text-[#475467] font-[400] text-[16px] mt-2">
          Failed to load data.
        </p>
      </div>
    );
  }

  const d = res.data;

  const breakdownColumns = [
    { title: 'Key', dataIndex: 'key', key: 'key' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  const breakdownData = d.breakdown.map((item, idx) => ({
    key: idx,
    ...item,
  }));

  return (
    <div className="py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
      <h1 className="text-[#1B1B1B] font-[600] text-[30px]">
        Scheduled Content
      </h1>
      <p className="text-[#475467] font-[400] text-[16px]">
        View all scheduled content deliveries.
      </p>

      <div className="mt-[30px]">
        <div className="p-[20px] border-[1px] border-[#EAECF0] rounded-[12px] max-w-[300px]">
          <h3 className="text-[#475467] font-[400] text-[14px] mb-[8px]">
            Total Scheduled
          </h3>
          <p className="text-[#1B1B1B] font-[600] text-[28px]">
            {d.total_scheduled}
          </p>
        </div>
      </div>

      <div className="mt-[25px]">
        <h2 className="text-[#1B1B1B] font-[600] text-[18px] mb-[12px]">
          Breakdown
        </h2>
        {breakdownData.length > 0 ? (
          <Table columns={breakdownColumns} dataSource={breakdownData} />
        ) : (
          <p className="text-[#475467] font-[400] text-[14px]">
            No scheduled content at this time.
          </p>
        )}
      </div>
    </div>
  );
};

export default ScheduledPage;
