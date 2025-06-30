'use client';
import { submitFeedback } from '@/action/user-api';
import NavigationBar from '@/components/ui/navbar';
import { Button, Form, Input, message, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const ContactPage = () => {
  const [form] = Form.useForm();
  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>

      <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px] min-h-screen">
        <div className="max-w-[700px] mt-[20px]">
          <p className="text-[#1B1B1B] font-[700] text-[30px] md:text-[50px]">
            Get in touch with us
          </p>
          <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] mt-[10px] max-w-[500px]">
            Let us know what you would like to communicate and we will get back
            to you as soon as possible
          </p>
        </div>
        <div className="mt-[20px]">
          <Form
            form={form}
            layout="vertical"
            onFinish={async (val) => {
              form.validateFields().then(async () => {
                const data = await submitFeedback(val);
                if (data.success) {
                  message.success('Successfully sent!');
                } else {
                  message.error(data.message);
                }

                form.resetFields();
              });
            }}>
            <Form.Item
              name={'email'}
              rules={[{ required: true, message: 'Please input email!' }]}
              className="!my-[8px]"
              label="Your email">
              <Input type="email" placeholder="Your email" size="large" />
            </Form.Item>
            <Form.Item
              name={'type'}
              rules={[{ required: true, message: 'Please input subject!' }]}
              className="!my-[8px]"
              label="Subject">
              <Select
                options={[
                  { label: 'Feedback/Report', value: 'feedback' },
                  { label: 'Business', value: 'business-inquiry' },
                  { label: 'Bug', value: 'bug' },
                  { label: 'Other', value: 'other' },
                ]}
                placeholder="Feedback type"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name={'message'}
              rules={[{ required: true, message: 'Please input message!' }]}
              className="!my-[8px]"
              label="Message">
              <TextArea
                placeholder="Your message"
                size="large"
                className="!h-[200px]"
              />
            </Form.Item>
            <Button
              htmlType="submit"
              size="large"
              className="!border-[1px] mt-[20px] !border-[#E34013] !text-[#E34013] !font-[600] !h-[40px] !w-[150px]">
              Send
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
