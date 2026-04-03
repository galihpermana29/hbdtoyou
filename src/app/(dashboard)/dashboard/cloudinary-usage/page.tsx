import { getDashboardCloudinary } from '@/action/user-api';
import { getSession } from '@/store/get-set-session';
import { redirect } from 'next/navigation';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

const StatCard = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) => (
  <div className="p-[20px] border-[1px] border-[#EAECF0] rounded-[12px]">
    <h3 className="text-[#475467] font-[400] text-[14px] mb-[8px]">{label}</h3>
    <p className="text-[#1B1B1B] font-[600] text-[28px]">{value}</p>
    {sub && (
      <p className="text-[#475467] font-[400] text-[13px] mt-[4px]">{sub}</p>
    )}
  </div>
);

const CloudinaryUsagePage = async () => {
  const session = await getSession();
  const isAdmin = session?.email === 'memoify.live@gmail.com';
  if (!isAdmin) redirect('/dashboard');

  const res = await getDashboardCloudinary();
  if (!res.success || !res.data) {
    return (
      <div className="py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
        <h1 className="text-[#1B1B1B] font-[600] text-[30px]">
          Cloudinary Usage
        </h1>
        <p className="text-[#475467] font-[400] text-[16px] mt-2">
          Failed to load data.
        </p>
      </div>
    );
  }

  const d = res.data;

  return (
    <div className="py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
      <h1 className="text-[#1B1B1B] font-[600] text-[30px]">
        Cloudinary Usage
      </h1>
      <p className="text-[#475467] font-[400] text-[16px]">
        Monitor your Cloudinary storage, bandwidth, and resource usage.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] mt-[30px]">
        <StatCard label="Plan" value={d.plan} />
        <StatCard label="Last Updated" value={d.last_updated} />
        <StatCard
          label="Storage"
          value={formatBytes(d.storage_usage)}
          sub={`Limit: ${formatBytes(d.storage_limit)}`}
        />
        <StatCard
          label="Bandwidth"
          value={formatBytes(d.bandwidth_usage)}
          sub={`Limit: ${formatBytes(d.bandwidth_limit)}`}
        />
        <StatCard
          label="Transforms"
          value={d.transform_usage.toLocaleString()}
          sub={`Limit: ${d.transform_limit.toLocaleString()}`}
        />
        <StatCard
          label="Requests"
          value={d.requests.toLocaleString()}
        />
        <StatCard
          label="Resources"
          value={d.resources.toLocaleString()}
        />
        <StatCard
          label="Derived Resources"
          value={d.derived_resources.toLocaleString()}
        />
      </div>
    </div>
  );
};

export default CloudinaryUsagePage;
