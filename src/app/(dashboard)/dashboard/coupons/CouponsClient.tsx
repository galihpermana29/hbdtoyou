'use client';

import {
  ICoupon,
  ICouponCreatePayload,
  ICouponUpdatePayload,
} from '@/action/interfaces';
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from '@/action/user-api';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const CouponsClient = ({ initialData }: { initialData: ICoupon[] }) => {
  const [coupons, setCoupons] = useState<ICoupon[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICoupon | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterActive, setFilterActive] = useState<string | undefined>(
    undefined
  );
  const [form] = Form.useForm();

  const refresh = async () => {
    setLoading(true);
    const res = await getCoupons({
      page: '1',
      limit: '50',
      is_active: filterActive,
    });
    if (res.success && res.data) setCoupons(res.data);
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      discount_type: 'percent',
      discount_value: 10,
      max_uses: 100,
      expired_at: null,
    });
    setModalOpen(true);
  };

  const openEdit = (record: ICoupon) => {
    setEditing(record);
    form.setFieldsValue({
      code: record.code,
      discount_type: record.discount_type,
      discount_value: record.discount_value,
      max_uses: record.max_uses,
      is_active: record.is_active,
      expired_at: record.expired_at ? dayjs(record.expired_at) : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editing) {
        const payload: ICouponUpdatePayload = {
          code: values.code || undefined,
          discount_type: values.discount_type,
          discount_value: values.discount_value,
          max_uses: values.max_uses,
          is_active: values.is_active,
          expired_at: values.expired_at
            ? dayjs(values.expired_at).toISOString()
            : null,
        };
        const res = await updateCoupon(editing.id, payload);
        if (res.success) {
          message.success('Coupon updated');
        } else {
          message.error(res.message);
          setSubmitting(false);
          return;
        }
      } else {
        const payload: ICouponCreatePayload = {
          code: values.code || undefined,
          discount_type: values.discount_type,
          discount_value: values.discount_value,
          max_uses: values.max_uses,
          expired_at: values.expired_at
            ? dayjs(values.expired_at).toISOString()
            : null,
        };
        const res = await createCoupon(payload);
        if (res.success) {
          message.success('Coupon created');
        } else {
          message.error(res.message);
          setSubmitting(false);
          return;
        }
      }

      setSubmitting(false);
      setModalOpen(false);
      refresh();
    } catch {
      setSubmitting(false);
    }
  };

  const handleDelete = (record: ICoupon) => {
    Modal.confirm({
      title: 'Delete Coupon',
      content: `Are you sure you want to delete coupon "${record.code}"?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await deleteCoupon(record.id);
        if (res.success) {
          message.success('Coupon deleted');
          refresh();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const columns: ColumnsType<ICoupon> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <span className="font-mono font-semibold">{code}</span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'discount_type',
      key: 'discount_type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Value',
      dataIndex: 'discount_value',
      key: 'discount_value',
      render: (val: number, record: ICoupon) =>
        record.discount_type === 'percent' ? `${val}%` : `Rp ${val.toLocaleString()}`,
    },
    {
      title: 'Max Uses',
      dataIndex: 'max_uses',
      key: 'max_uses',
    },
    {
      title: 'Used',
      dataIndex: 'used_count',
      key: 'used_count',
    },
    {
      title: 'Active',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'default'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Expires',
      dataIndex: 'expired_at',
      key: 'expired_at',
      render: (val: string | null) =>
        val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '—',
    },
    {
      title: 'Created',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (val: string) => dayjs(val).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: ICoupon) => (
        <div className="flex gap-[8px]">
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="py-[30px] md:py-0 mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Coupons</h1>
          <p className="text-[#475467] font-[400] text-[16px]">
            Manage discount coupons for the platform.
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={openCreate}
          className="!bg-[#E34013] !text-white !rounded-[8px] !font-[600] !h-[38px] !flex !items-center !gap-[6px]">
          Create Coupon
        </Button>
      </div>

      <div className="flex items-end gap-[12px] mt-[20px]">
        <div>
          <p className="text-[13px] text-[#475467] mb-[4px]">Status</p>
          <Select
            allowClear
            placeholder="All"
            className="!w-[150px]"
            value={filterActive}
            onChange={(val) => setFilterActive(val)}
            options={[
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />
        </div>
        <Button
          type="primary"
          loading={loading}
          onClick={refresh}
          className="!bg-[#E34013] !text-white !rounded-[8px] !font-[600] !h-[38px]">
          Apply
        </Button>
      </div>

      <div className="mt-[20px]">
        <Table
          columns={columns}
          dataSource={coupons}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </div>

      <Modal
        title={editing ? 'Edit Coupon' : 'Create Coupon'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editing ? 'Update' : 'Create'}
        okButtonProps={{
          className: '!bg-[#E34013] !text-white !rounded-[8px] !font-[600]',
        }}>
        <Form form={form} layout="vertical" className="mt-[16px]">
          <Form.Item
            name="code"
            label="Code"
            extra="Leave empty to auto-generate">
            <Input placeholder="e.g. PROMO10" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-[12px]">
            <Form.Item
              name="discount_type"
              label="Discount Type"
              rules={[{ required: true, message: 'Required' }]}>
              <Select
                options={[
                  { label: 'Percent', value: 'percent' },
                  { label: 'Fixed', value: 'fixed' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="discount_value"
              label="Discount Value"
              rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={0} className="!w-full" />
            </Form.Item>
          </div>

          <Form.Item
            name="max_uses"
            label="Max Uses"
            rules={[{ required: true, message: 'Required' }]}>
            <InputNumber min={1} className="!w-full" />
          </Form.Item>

          <Form.Item name="expired_at" label="Expiry Date">
            <DatePicker showTime className="!w-full" />
          </Form.Item>

          {editing && (
            <Form.Item name="is_active" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CouponsClient;
