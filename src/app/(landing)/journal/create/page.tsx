'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import JournalLayout from '../view/JournalLayout';
import NavigationBar from '@/components/ui/navbar';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false, // This disables server-side rendering for this component
  loading: () => <p>Loading editor...</p>,
});

// import ReactQuill from 'react-quill';

// Character limit for free users
const MAXLENGTH = 200;

import 'react-quill/dist/quill.snow.css';
import { createContent } from '@/action/user-api';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select } from 'antd';
import { useMemoifyProfile } from '@/app/session-provider';

const NewEntryPage: React.FC = () => {
  const [form] = Form.useForm();

  const { type } = useMemoifyProfile?.() || {};
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
      router.push(`/journal`);
    } else {
      message.error(res.message);
    }
  };

  // Track character counts for each editor
  const [charCounts, setCharCounts] = useState({
    abstract: 0,
    abstractSecondary: 0,
    preamble: 0,
    introduction: 0,
  });

  // 2. Create a ref to act as a flag
  const quillModuleRegistered = useRef(false);

  useEffect(() => {
    // Check if on the client AND if our flag is false
    if (typeof window !== 'undefined' && !quillModuleRegistered.current) {
      // 1. Dynamically import the core 'quill' library, not 'react-quill'
      import('quill').then((Quill) => {
        // 2. The default export of 'quill' is the class itself
        Quill.default.register('modules/maxlength', function (quill, options) {
          const fieldName = options.fieldName;

          quill.on('text-change', function () {
            const text = quill.getText() || '';
            const textLength = text.length - 1;

            setCharCounts((prev) => ({
              ...prev,
              [fieldName]: Math.max(0, textLength),
            }));

            if (type !== 'premium' && textLength > options.maxLength) {
              quill.deleteText(
                options.maxLength,
                textLength - options.maxLength
              );
            }
          });
        });

        // Set the flag to true after registration
        quillModuleRegistered.current = true;
      });
    }
  }, [type]);
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
                  <Input
                    className="rounded-sm"
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
                    className="rounded-sm"
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
                    className="rounded-sm"
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
                  <div className="relative">
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
                    {type !== 'premium' && (
                      <div className="mt-1 flex justify-between items-center">
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
                  </div>
                </Form.Item>

                <Form.Item
                  label={`Abstract English`}
                  name="abstractSecondary"
                  rules={[
                    { required: true, message: 'Please enter an abstract' },
                  ]}
                  className="mb-6">
                  <div className="relative">
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
                    {type !== 'premium' && (
                      <div className="mt-1 flex justify-between items-center">
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
                  </div>
                </Form.Item>

                <Form.Item
                  label="Keywords (comma-separated)"
                  name="keywords"
                  rules={[{ required: true, message: 'Please enter keywords' }]}
                  className="mb-6">
                  <Select
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
                  <div className="relative">
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
                    {type !== 'premium' && (
                      <div className="mt-1 flex justify-between items-center">
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
                  </div>
                </Form.Item>

                <Form.Item
                  label="Introduction"
                  name="introduction"
                  rules={[
                    { required: true, message: 'Please enter an introduction' },
                  ]}
                  className="mb-6">
                  <div className="relative">
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
                    {type !== 'premium' && (
                      <div className="mt-1 flex justify-between items-center">
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
                  </div>
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
