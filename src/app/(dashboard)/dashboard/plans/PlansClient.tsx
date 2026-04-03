'use client';

import { IListPackageResponse, IPackagePayload } from '@/action/interfaces';
import {
  createPackage,
  deletePackage,
  getListPackages,
  updatePackage,
} from '@/action/user-api';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Switch,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const PlansClient = ({
  initialData,
}: {
  initialData: IListPackageResponse[];
}) => {
  const [plans, setPlans] = useState<IListPackageResponse[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IListPackageResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [form] = Form.useForm();

  const refresh = async () => {
    setLoading(true);
    const res = await getListPackages();
    if (res.success && res.data) setPlans(res.data);
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setFeatures(['']);
    form.resetFields();
    form.setFieldsValue({
      quota_basic: 1,
      token_scrapbook: 1,
      duration_days: 30,
      is_active: true,
      is_popular: false,
    });
    setModalOpen(true);
  };

  const openEdit = (record: IListPackageResponse) => {
    setEditing(record);
    setFeatures(record.features?.length ? record.features : ['']);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      price_paypal: record.price_paypal,
      price_midtrans: record.price_midtrans,
      quota_basic: record.quota_basic,
      token_scrapbook: record.token_scrapbook,
      duration_days: record.duration_days,
      is_active: record.is_active,
      is_popular: record.is_popular,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const cleanFeatures = features.filter((f) => f.trim() !== '');

      const payload: IPackagePayload = {
        name: values.name,
        description: values.description,
        price: values.price,
        price_paypal: values.price_paypal,
        price_midtrans: values.price_midtrans,
        quota_basic: values.quota_basic,
        token_scrapbook: values.token_scrapbook,
        duration_days: values.duration_days || undefined,
        features: cleanFeatures,
        is_active: values.is_active,
        is_popular: values.is_popular,
      };

      if (editing) {
        const res = await updatePackage(editing.id, payload);
        if (res.success) {
          message.success('Plan updated');
        } else {
          message.error(res.message);
          setSubmitting(false);
          return;
        }
      } else {
        const res = await createPackage(payload);
        if (res.success) {
          message.success('Plan created');
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

  const handleDelete = (record: IListPackageResponse) => {
    Modal.confirm({
      title: 'Delete Plan',
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await deletePackage(record.id);
        if (res.success) {
          message.success('Plan deleted');
          refresh();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const columns: ColumnsType<IListPackageResponse> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div>
          <span className="font-semibold">{name}</span>
        </div>
      ),
    },
    {
      title: 'Price (IDR)',
      dataIndex: 'price_midtrans',
      key: 'price_midtrans',
      render: (val: string) => `IDR ${Number(val).toLocaleString()}`,
    },
    {
      title: 'PayPal',
      dataIndex: 'price_paypal',
      key: 'price_paypal',
      render: (val: string) => `$${val}`,
    },
    {
      title: 'Quota',
      dataIndex: 'quota_basic',
      key: 'quota_basic',
    },
    {
      title: 'Scrapbook Tokens',
      dataIndex: 'token_scrapbook',
      key: 'token_scrapbook',
    },
    {
      title: 'Duration',
      dataIndex: 'duration_days',
      key: 'duration_days',
      render: (val: number) => (val ? `${val} days` : '—'),
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
      title: 'Features',
      dataIndex: 'features',
      key: 'features',
      render: (features: string[]) => (
        <span className="text-gray-500 text-xs">
          {features?.length || 0} items
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: IListPackageResponse) => (
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
          <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Plans</h1>
          <p className="text-[#475467] font-[400] text-[16px]">
            Manage subscription packages and pricing.
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={openCreate}
          className="!bg-[#E34013] !text-white !rounded-[8px] !font-[600] !h-[38px] !flex !items-center !gap-[6px]">
          Create Plan
        </Button>
      </div>

      <div className="mt-[20px]">
        <Table
          columns={columns}
          dataSource={plans}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </div>

      <Modal
        title={editing ? 'Edit Plan' : 'Create Plan'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editing ? 'Update' : 'Create'}
        okButtonProps={{
          className: '!bg-[#E34013] !text-white !rounded-[8px] !font-[600]',
        }}
        width={600}>
        <Form form={form} layout="vertical" className="mt-[16px]">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g. Advanced Plan" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Required' }]}>
            <Input.TextArea rows={2} placeholder="Plan description" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-[12px]">
            <Form.Item
              name="price"
              label="Display Price"
              rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="$10.00" />
            </Form.Item>
            <Form.Item
              name="price_midtrans"
              label="Price IDR"
              rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="30000" />
            </Form.Item>
            <Form.Item
              name="price_paypal"
              label="Price PayPal"
              rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="3.00" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-[12px]">
            <Form.Item
              name="quota_basic"
              label="Quota"
              rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={0} className="!w-full" />
            </Form.Item>
            <Form.Item
              name="token_scrapbook"
              label="Scrapbook Tokens"
              rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={0} className="!w-full" />
            </Form.Item>
            <Form.Item name="duration_days" label="Duration (days)">
              <InputNumber min={0} className="!w-full" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-[12px]">
            <Form.Item name="is_active" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="is_popular" label="Popular" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <div>
            <label className="font-medium text-sm">Features</label>
            <div className="flex flex-col gap-[8px] mt-[8px]">
              {features.map((feat, idx) => (
                <div key={idx} className="flex gap-[8px]">
                  <Input
                    value={feat}
                    placeholder={`Feature ${idx + 1}`}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[idx] = e.target.value;
                      setFeatures(updated);
                    }}
                  />
                  {features.length > 1 && (
                    <Button
                      icon={<Minus size={14} />}
                      onClick={() =>
                        setFeatures(features.filter((_, i) => i !== idx))
                      }
                    />
                  )}
                </div>
              ))}
              <Button
                type="dashed"
                icon={<Plus size={14} />}
                onClick={() => setFeatures([...features, ''])}
                className="!w-full">
                Add Feature
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PlansClient;
