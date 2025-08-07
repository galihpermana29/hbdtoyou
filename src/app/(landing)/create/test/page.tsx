'use client';

import { MultiImageUploader } from '@/components/ui/multi-uploader';
import { Button, Form } from 'antd';

const TestPage = () => {
  const [form] = Form.useForm();
  return (
    <div className="h-screen p-[40px]">
      <Form
        form={form}
        layout="vertical"
        onFinish={async (val) => {
          console.log(val);
        }}>
        <Form.Item
          name="images"
          rules={[{ required: true, message: 'Please upload atleast 1 image' }]}
          label="Images">
          <MultiImageUploader maxCount={5} form={form} formName="images" />
        </Form.Item>

        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default TestPage;
