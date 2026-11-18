'use client';

import React, { useEffect, useState } from 'react';
import MemorollFormTheme from '@/components/forms/memoroll-form-theme';
import { motion } from 'framer-motion';
import JournalLayout from '../view/JournalLayout';
import NavigationBar from '@/components/ui/navbar';
import dynamic from 'next/dynamic';

/**
 * What the editor's length module asks the page, set by the page while it
 * is mounted. The module is registered once for every editor, before the
 * page exists, so it cannot close over the page's state; and it cannot be
 * handed functions through `modules`, because react-quill rebuilds an
 * editor whenever that prop is not deeply equal to the last one.
 */
const editorPage: {
  onCount: (fieldName: string, length: number) => void;
  isLimited: () => boolean;
} = { onCount: () => {}, isLimited: () => true };

/**
 * The editor, with its length module registered before any editor can
 * mount. It used to be registered from an effect after an import of its
 * own: arriving from a link, the editor chunk was already there and the
 * editors mounted first, found no `modules/maxlength`, and the free-plan
 * limit and the counters did nothing.
 */
const ReactQuill = dynamic(
  async () => {
    const { default: Editor } = await import('react-quill');
    Editor.Quill.register(
      'modules/maxlength',
      function (quill, options) {
        quill.on('text-change', function () {
          const text = quill.getText() || '';
          const textLength = text.length - 1;

          editorPage.onCount(options.fieldName, Math.max(0, textLength));

          if (editorPage.isLimited() && textLength > options.maxLength) {
            quill.deleteText(options.maxLength, textLength - options.maxLength);
          }
        });
      },
      true
    );
    return Editor;
  },
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

const MAXLENGTH = 200;

import 'react-quill/dist/quill.snow.css';
import { createContent } from '@/action/user-api';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select, Switch } from 'antd';
import { useMemoifyProfile } from '@/app/session-provider';

const NewEntryPage: React.FC = () => {
  const [form] = Form.useForm();

  const profile = useMemoifyProfile();
  const type = profile?.type;
  const isFreeAccount = (profile?.quota ?? 0) < 1;
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoadingSubmit(true);

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
      isPublic: values.isPublic ?? true,
      destinationName: values.destinationName,
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
      router.push('/journal');
    } else {
      message.error(res.message);
    }
    setLoadingSubmit(false);
  };

  // Track character counts for each editor
  const [charCounts, setCharCounts] = useState({
    abstract: 0,
    abstractSecondary: 0,
    preamble: 0,
    introduction: 0,
  });

  // The length module (registered with the editor, above) reports here.
  useEffect(() => {
    editorPage.onCount = (fieldName, length) =>
      setCharCounts((prev) => ({ ...prev, [fieldName]: length }));
    editorPage.isLimited = () => type !== 'premium';
    return () => {
      editorPage.onCount = () => {};
    };
  }, [type]);
  return (
    <JournalLayout>
      <MemorollFormTheme className="min-h-screen overflow-hidden">
        <div className="fixed top-0 left-0 w-full z-10 ">
          <NavigationBar />
        </div>
        <div className="container mx-auto px-4 py-8 mt-[81px]">
          <motion.div
            className="max-w-3xl mx-auto bg-white border border-[#dadada] rounded-[20px]"
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
                  <Input
                    className="rounded-[12px]"
                    placeholder="Enter journal title"
                  />
                </Form.Item>

                <Form.Item
                  label="Author"
                  name="author"
                  rules={[
                    { required: true, message: 'Please enter an author' },
                  ]}
                  className="mb-6">
                  <Input
                    className="rounded-[12px]"
                    placeholder="Enter author name"
                  />
                </Form.Item>

                <Form.Item
                  label="Destination Name"
                  name="destinationName"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter a destination name',
                    },
                  ]}
                  className="mb-6">
                  <Input
                    className="rounded-[12px]"
                    placeholder="Enter destination name"
                  />
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
                      maxlength: {
                        maxLength: MAXLENGTH,
                        fieldName: 'abstract',
                      },
                    }}
                    theme="snow"
                    placeholder="Write your abstract text here. This section will be displayed in one columns."
                  />
                </Form.Item>
                {type !== 'premium' && (
                  <div className="mt-1 flex justify-between items-center mb-6">
                    <div
                      className={`text-xs ${
                        charCounts.abstract > MAXLENGTH * 0.8
                          ? 'text-orange-500'
                          : 'text-gray-500'
                      }`}>
                      <span
                        className={
                          charCounts.abstract >= MAXLENGTH
                            ? 'text-red-500 font-bold'
                            : ''
                        }>
                        {charCounts.abstract}
                      </span>
                      /{MAXLENGTH} characters (Free user limit)
                    </div>
                    <a
                      href="/payment"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-right">
                      Upgrade for unlimited characters →
                    </a>
                  </div>
                )}

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
                      // maxlength: {
                      //   maxLength: MAXLENGTH,
                      //   fieldName: 'abstractSecondary',
                      // },
                    }}
                    theme="snow"
                    placeholder="Write your abstract text here. This section will be displayed in one columns."
                  />
                </Form.Item>
                {type !== 'premium' && (
                  <div className="mt-1 flex justify-between items-center mb-6">
                    <div
                      className={`text-xs ${
                        charCounts.abstractSecondary > MAXLENGTH * 0.8
                          ? 'text-orange-500'
                          : 'text-gray-500'
                      }`}>
                      <span
                        className={
                          charCounts.abstractSecondary >= MAXLENGTH
                            ? 'text-red-500 font-bold'
                            : ''
                        }>
                        {charCounts.abstractSecondary}
                      </span>
                      /{MAXLENGTH} characters (Free user limit)
                    </div>
                    <a
                      href="/payment"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-right">
                      Upgrade for unlimited characters →
                    </a>
                  </div>
                )}

                <Form.Item
                  label="Keywords (comma-separated)"
                  name="keywords"
                  rules={[{ required: true, message: 'Please enter keywords' }]}
                  className="mb-6">
                  <Select
                    mode="tags"
                    className="rounded-[12px]"
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
                      maxlength: {
                        maxLength: MAXLENGTH,
                        fieldName: 'preamble',
                      },
                    }}
                    theme="snow"
                    placeholder="Write your preamble text here. This section will be displayed in one columns."
                  />
                </Form.Item>
                {type !== 'premium' && (
                  <div className="mt-1 flex justify-between items-center mb-6">
                    <div
                      className={`text-xs ${
                        charCounts.preamble > MAXLENGTH * 0.8
                          ? 'text-orange-500'
                          : 'text-gray-500'
                      }`}>
                      <span
                        className={
                          charCounts.preamble >= MAXLENGTH
                            ? 'text-red-500 font-bold'
                            : ''
                        }>
                        {charCounts.preamble}
                      </span>
                      /{MAXLENGTH} characters (Free user limit)
                    </div>
                    <a
                      href="/payment"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-right">
                      Upgrade for unlimited characters →
                    </a>
                  </div>
                )}

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
                      maxlength: {
                        maxLength: MAXLENGTH,
                        fieldName: 'introduction',
                      },
                    }}
                    theme="snow"
                    placeholder="Write your introduction text here. This section will be displayed in two columns."
                  />
                </Form.Item>
                {type !== 'premium' && (
                  <div className="mt-1 flex justify-between items-center mb-6">
                    <div
                      className={`text-xs ${
                        charCounts.introduction > MAXLENGTH * 0.8
                          ? 'text-orange-500'
                          : 'text-gray-500'
                      }`}>
                      <span
                        className={
                          charCounts.introduction >= MAXLENGTH
                            ? 'text-red-500 font-bold'
                            : ''
                        }>
                        {charCounts.introduction}
                      </span>
                      /{MAXLENGTH} characters (Free user limit)
                    </div>
                    <a
                      href="/payment"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-right">
                      Upgrade for unlimited characters →
                    </a>
                  </div>
                )}

                <Form.Item
                  className="!mb-[5px]"
                  name="isPublic"
                  label={
                    <div className="mt-[10px] mb-[5px]">
                      <h3 className="text-[15px] font-semibold">
                        Show on Public Journal Page
                      </h3>
                      <p className="text-[13px] text-gray-600 max-w-[400px]">
                        {isFreeAccount
                          ? 'In free plan your journal will be shown on the public journal page.'
                          : 'Toggle to control whether your journal is visible on the public journal page.'}
                      </p>
                    </div>
                  }
                  initialValue={isFreeAccount ? true : false}
                  valuePropName="checked">
                  <Switch disabled={isFreeAccount} />
                </Form.Item>

                <div className="flex justify-end mt-6">
                  <Button
                    className="mr-cta"
                    type="primary"
                    htmlType="submit"
                    loading={loadingSubmit}
                    size="large">
                    Create
                  </Button>
                </div>
              </Form>
            </div>
          </motion.div>
        </div>
      </MemorollFormTheme>
    </JournalLayout>
  );
};

export default NewEntryPage;
