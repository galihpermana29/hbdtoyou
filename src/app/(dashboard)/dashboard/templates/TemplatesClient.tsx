'use client';

import {
  IAllTemplateResponse,
  ITemplatePayload,
} from '@/action/interfaces';
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
  updateTemplate,
} from '@/action/user-api';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const labelOptions = [
  { label: 'Free', value: 'free' },
  { label: 'Premium', value: 'premium' },
];

const typeOptions = [
  { label: 'Gift', value: 'gift' },
  { label: 'Scrapbook', value: 'scrapbook' },
  { label: 'Photobox', value: 'photobox' },
];

const categoryOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Original', value: 'original' },
  { label: 'Graduation', value: 'graduation' },
];

const labelColorMap: Record<string, string> = {
  free: 'green',
  premium: 'gold',
};

const TemplatesClient = ({
  initialData,
}: {
  initialData: IAllTemplateResponse[];
}) => {
  const [templates, setTemplates] =
    useState<IAllTemplateResponse[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IAllTemplateResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [form] = Form.useForm();

  const refresh = async () => {
    setLoading(true);
    const res = await getAllTemplates();
    if (res.success && res.data) setTemplates(res.data);
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setTags(['']);
    form.resetFields();
    form.setFieldsValue({
      label: 'free',
      type: 'gift',
      category: 'popular',
    });
    setModalOpen(true);
  };

  const openEdit = (record: IAllTemplateResponse) => {
    setEditing(record);
    setTags(record.tag?.length ? record.tag : ['']);
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      label: record.label,
      type: record.type,
      category: record.category,
      thumbnail_uri: record.thumbnail_uri,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const cleanTags = tags.filter((t) => t.trim() !== '');

      const payload: ITemplatePayload = {
        name: values.name,
        slug: values.slug,
        label: values.label,
        type: values.type,
        category: values.category,
        thumbnail_uri: values.thumbnail_uri,
        tag: cleanTags.length > 0 ? cleanTags : undefined,
        frame_data: values.frame_data
          ? JSON.parse(values.frame_data)
          : undefined,
      };

      if (editing) {
        const res = await updateTemplate(editing.id, payload);
        if (res.success) {
          message.success('Template updated');
        } else {
          message.error(res.message);
          setSubmitting(false);
          return;
        }
      } else {
        const res = await createTemplate(payload);
        if (res.success) {
          message.success('Template created');
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

  const handleDelete = (record: IAllTemplateResponse) => {
    Modal.confirm({
      title: 'Delete Template',
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await deleteTemplate(record.id);
        if (res.success) {
          message.success('Template deleted');
          refresh();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const columns: ColumnsType<IAllTemplateResponse> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span className="font-semibold">{name}</span>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => (
        <span className="font-mono text-xs">{slug}</span>
      ),
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: (label: string) => (
        <Tag color={labelColorMap[label] || 'default'}>{label}</Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color="purple">{cat}</Tag>,
    },
    {
      title: 'Tags',
      dataIndex: 'tag',
      key: 'tag',
      render: (tagList: string[]) => (
        <span className="text-gray-500 text-xs">
          {tagList?.length || 0} tags
        </span>
      ),
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail_uri',
      key: 'thumbnail_uri',
      render: (uri: string) =>
        uri && uri.startsWith('http') ? (
          <img
            src={uri}
            alt="thumb"
            className="w-[40px] h-[40px] object-cover rounded-[4px]"
          />
        ) : (
          <span className="text-gray-400 text-xs truncate max-w-[100px] inline-block">
            {uri || '—'}
          </span>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: IAllTemplateResponse) => (
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
          <h1 className="text-[#1B1B1B] font-[600] text-[30px]">Templates</h1>
          <p className="text-[#475467] font-[400] text-[16px]">
            Manage gift templates available on the platform.
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={openCreate}
          className="!bg-[#E34013] !text-white !rounded-[8px] !font-[600] !h-[38px] !flex !items-center !gap-[6px]">
          Create Template
        </Button>
      </div>

      <div className="mt-[20px]">
        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </div>

      <Modal
        title={editing ? 'Edit Template' : 'Create Template'}
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
            <Input placeholder="e.g. Vinyl v1 - vinylv1" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g. vinylv1" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-[12px]">
            <Form.Item
              name="label"
              label="Label"
              rules={[{ required: true, message: 'Required' }]}>
              <Select options={labelOptions} />
            </Form.Item>

            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Required' }]}>
              <Select options={typeOptions} />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Required' }]}>
              <Select options={categoryOptions} />
            </Form.Item>
          </div>

          <Form.Item
            name="thumbnail_uri"
            label="Thumbnail URL"
            rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="https://res.cloudinary.com/..." />
          </Form.Item>

          <div>
            <label className="font-medium text-sm">Tags</label>
            <div className="flex flex-col gap-[8px] mt-[8px]">
              {tags.map((tag, idx) => (
                <div key={idx} className="flex gap-[8px]">
                  <Input
                    value={tag}
                    placeholder={`Tag ${idx + 1}`}
                    onChange={(e) => {
                      const updated = [...tags];
                      updated[idx] = e.target.value;
                      setTags(updated);
                    }}
                  />
                  {tags.length > 1 && (
                    <Button
                      icon={<Minus size={14} />}
                      onClick={() =>
                        setTags(tags.filter((_, i) => i !== idx))
                      }
                    />
                  )}
                </div>
              ))}
              <Button
                type="dashed"
                icon={<Plus size={14} />}
                onClick={() => setTags([...tags, ''])}
                className="!w-full">
                Add Tag
              </Button>
            </div>
          </div>

          <Form.Item
            name="frame_data"
            label="Frame Data (JSON)"
            className="mt-[16px]"
            extra="Optional. Only needed for scrapbook-type templates.">
            <Input.TextArea
              rows={4}
              placeholder='{"0": {"frame_image_path": "...", ...}}'
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplatesClient;
