'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { JournalEntry } from '../models/data';
import JournalLayout from '../view/JournalLayout';
import NavigationBar from '@/components/ui/navbar';
import { // Select replaced with FixedSelect} from 'antd';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false, // This disables server-side rendering for this component
  loading: () => <p>Loading editor...</p>,
});

import 'react-quill/dist/quill.snow.css';
import { createContent } from '@/action/user-api';
import { useRouter } from 'next/navigation';

const NewEntryPage: React.FC = () => {
  const [form] = Form.useForm();

  const router = useRouter();
  const handleSubmit = async (values: any) => {
    // 2d4df00e-e773-4391-ad6a-1b6d688950ff

    const json_text = {
      title: values.title,
      author: values.author,
      date: new Date().toISOString().split('T')[0],
      volume: `Volume 1`,
      abstract: values.abstract,
      abstractSecondary: values.abstractSecondary || undefined,
      keywords: values.keywords,
      preamble: values.preamble,
      introduction: values.introduction,
      isPublic: true,
    };

    const payload = {
      template_id: '2d4df00e-e773-4391-ad6a-1b6d688950ff',
      detail_content_json_text: JSON.stringify(json_text),
      title: values.title,
      caption: values.abstract,

      date_scheduled: null,
      dest_email: null,
      is_scheduled: false,
      status: 'published',
    };

    const res = await createContent(payload);

    if (res.success) {
      message.success('Journal created successfully');
      router.push(`/journal`);
    } else {
      message.error(res.message);
    }
  };

  return (
    <JournalLayout>
      <div className="min-h-screen overflow-hidden">
        <div className="fixed top-0 left-0 w-full z-10 ">
          <NavigationBar />
        </div>
        <div className="container mx-auto px-4 py-8 mt-[81px]">
          <motion.div
            className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-sm shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Create New Journal
              </h1>
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please enter a title' }]}
                  className="mb-6">
                  <Input className="rounded-sm" />
                </Form.Item>

                <Form.Item
                  label="Author"
                  name="author"
                  rules={[
                    { required: true, message: 'Please enter an author' },
                  ]}
                  className="mb-6">
                  <Input className="rounded-sm" />
                </Form.Item>

                <Form.Item
                  label="Abstract"
                  name="abstract"
                  rules={[
                    { required: true, message: 'Please enter an abstract' },
                  ]}
                  className="mb-6">
                  <ReactQuill
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote'],
                        ['clean'],
                      ],
                    }}
                    theme="snow"
                    placeholder="Write your abstract text here. This section will be displayed in one columns."
                  />
                </Form.Item>

                <Form.Item
                  label={`Abstract English`}
                  name="abstractSecondary"
                  rules={[
                    { required: true, message: 'Please enter an abstract' },
                  ]}
                  className="mb-6">
                  <ReactQuill
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote'],
                        ['clean'],
                      ],
                    }}
                    theme="snow"
                    placeholder="Write your abstract text here. This section will be displayed in one columns."
                  />
                </Form.Item>

                <Form.Item
                  label="Keywords (comma-separated)"
                  name="keywords"
                  rules={[{ required: true, message: 'Please enter keywords' }]}
                  className="mb-6">
                  <FixedSelect
                    mode="tags"
                    className="rounded-sm"
                    placeholder="e.g., reflection, growth, learning"
                  />
                </Form.Item>

                <Form.Item
                  label="Preamble"
                  name="preamble"
                  rules={[
                    { required: true, message: 'Please enter a preamble' },
                  ]}
                  className="mb-6">
                  <ReactQuill
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote'],
                        ['clean'],
                      ],
                    }}
                    theme="snow"
                    placeholder="Write your preamble text here. This section will be displayed in one columns."
                  />
                </Form.Item>

                <Form.Item
                  label="Introduction"
                  name="introduction"
                  rules={[
                    { required: true, message: 'Please enter an introduction' },
                  ]}
                  className="mb-6">
                  <ReactQuill
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote'],
                        ['clean'],
                      ],
                    }}
                    theme="snow"
                    placeholder="Write your introduction text here. This section will be displayed in two columns."
                  />
                </Form.Item>

                <div className="flex justify-end">
                  <Button
                    className="!bg-black !rounded-full"
                    type="primary"
                    htmlType="submit"
                    size="large">
                    Create
                  </Button>
                </div>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </JournalLayout>
  );
};

export default NewEntryPage;
