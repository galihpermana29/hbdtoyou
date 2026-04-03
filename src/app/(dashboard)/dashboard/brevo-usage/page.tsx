import { getDashboardBrevo } from '@/action/user-api';
import { getSession } from '@/store/get-set-session';
import { redirect } from 'next/navigation';

const StatCard = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) => (
  <div className="p-[20px] border-[1px] border-[#EAECF0] rounded-[12px]">
    <h3 className="text-[#475467] font-[400] text-[14px] mb-[8px]">{label}</h3>
    <p
      className={`font-[600] text-[28px] ${
        highlight ? 'text-red-500' : 'text-[#1B1B1B]'
      }`}>
      {value}
    </p>
  </div>
);

const BrevoUsagePage = async () => {
  const session = await getSession();
  const isAdmin = session?.email === 'memoify.live@gmail.com';
  if (!isAdmin) redirect('/dashboard');

  const res = await getDashboardBrevo();

  if (!res.success || !res.data) {
    return (
      <div className="py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
        <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Brevo Usage</h1>
        <p className="text-[#475467] font-[400] text-[16px] mt-2">
          Failed to load data.
        </p>
      </div>
    );
  }

  const d = res.data;

  return (
    <div className="py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
      <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Brevo Usage</h1>
      <p className="text-[#475467] font-[400] text-[16px]">
        Monitor your email sending quota and usage.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mt-[30px]">
        <StatCard label="Provider" value={d.provider} />
        <StatCard label="Emails Sent" value={d.sent.toLocaleString()} />
        <StatCard label="Daily Limit" value={d.limit.toLocaleString()} />
        <StatCard
          label="Remaining"
          value={d.remaining.toLocaleString()}
          highlight={d.remaining < 0}
        />
      </div>
    </div>
  );
};

export default BrevoUsagePage;
