'use client';

import { Form, Input, message } from 'antd';
import { useState } from 'react';
import NetflixButton from './NetflixButton';

interface WishFormProps {
  onSubmit?: (values: { name: string; message: string }) => Promise<void>;
}

interface FormValues {
  name: string;
  message: string;
}

/**
 * A reusable component for collecting user wishes/comments in a Netflix-styled UI
 * @param onSubmit - Optional callback function to handle form submission
 */
const WishForm = ({ onSubmit }: WishFormProps) => {
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    if (!values.name || !values.message) {
      message.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
        message.success('Your wish has been sent!');
        form.resetFields();
      } else {
        // Simulate submission if no onSubmit handler is provided
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('Your wish has been sent!');
        form.resetFields();
      }
    } catch (error) {
      message.error('Failed to send your wish. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
      <Form.Item
        name='name'
        className="!mb-3"
        label={<p className="geist-font text-base text-white">Name</p>}
        rules={[{ required: true, message: 'Please enter your name' }]}
      >
        <Input placeholder="Enter your name" className="!px-3 !py-2" />
      </Form.Item>

      <Form.Item
        name='message'
        className="!mb-3"
        label={<p className="geist-font text-base text-white">Message</p>}
        rules={[{ required: true, message: 'Please enter your message' }]}
      >
        <Input.TextArea placeholder="Write your message here" />
      </Form.Item>

      <NetflixButton
        fullWidth
        variant="secondary"
        className="!bg-[#808080] !text-[#191919] !px-6 !py-3 !h-fit"
        onClick={() => form.submit()}
      >
        {isSubmitting ? 'Sending...' : 'Send'}
      </NetflixButton>
    </Form>
  );
};

export default WishForm;