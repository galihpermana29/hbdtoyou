'use client';

import { IDashboardTransactions } from '@/action/interfaces';
import { getDashboardTransactions } from '@/action/user-api';
import { Button, DatePicker, Select } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="p-[20px] border-[1px] border-[#EAECF0] rounded-[12px]">
    <h3 className="text-[#475467] font-[400] text-[14px] mb-[8px]">{label}</h3>
    <p className="text-[#1B1B1B] font-[600] text-[28px]">{value}</p>
  </div>
);

const TransactionsClient = ({
  initialData,
}: {
  initialData: IDashboardTransactions | null;
}) => {
  const [data, setData] = useState<IDashboardTransactions | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[string, string]>([
    '2024-01-01',
    '2026-12-31',
  ]);

  const handleFilter = async () => {
    setLoading(true);
    const res = await getDashboardTransactions({
      method: method || undefined,
      status: status || undefined,
      date_from: dateRange[0],
      date_to: dateRange[1],
      page: '1',
      limit: '10',
    });
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
      <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Transactions</h1>
      <p className="text-[#475467] font-[400] text-[16px]">
        View transaction summaries with filters.
      </p>

      <div className="flex flex-wrap items-end gap-[12px] mt-[24px]">
        <div>
          <p className="text-[13px] text-[#475467] mb-[4px]">Method</p>
          <Select
            allowClear
            placeholder="All methods"
            className="!w-[150px]"
            value={method}
            onChange={(val) => setMethod(val)}
            options={[
              { label: 'QRIS', value: 'qris' },
              { label: 'PayPal', value: 'paypal' },
            ]}
          />
        </div>
        <div>
          <p className="text-[13px] text-[#475467] mb-[4px]">Status</p>
          <Select
            allowClear
            placeholder="All statuses"
            className="!w-[150px]"
            value={status}
            onChange={(val) => setStatus(val)}
            options={[
              { label: 'Pending', value: 'pending' },
              { label: 'Done', value: 'done' },
              { label: 'Rejected', value: 'rejected' },
            ]}
          />
        </div>
        <div>
          <p className="text-[13px] text-[#475467] mb-[4px]">Date Range</p>
          <RangePicker
            defaultValue={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
            onChange={(_, dateStrings) => {
              if (dateStrings[0] && dateStrings[1]) {
                setDateRange([dateStrings[0], dateStrings[1]]);
              }
            }}
          />
        </div>
        <Button
          type="primary"
          loading={loading}
          onClick={handleFilter}
          className="!bg-[#E34013] !text-white !rounded-[8px] !font-[600] !h-[38px]">
          Apply Filters
        </Button>
      </div>

      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mt-[30px]">
          <StatCard
            label="Total Transactions"
            value={data.total_transactions.toLocaleString()}
          />
          <StatCard
            label="Total Amount"
            value={`Rp ${data.total_amount.toLocaleString()}`}
          />
          <StatCard
            label="Total Discount"
            value={`Rp ${data.total_discount.toLocaleString()}`}
          />
        </div>
      ) : (
        <p className="text-[#475467] font-[400] text-[14px] mt-[30px]">
          No transaction data available.
        </p>
      )}
    </div>
  );
};

export default TransactionsClient;
