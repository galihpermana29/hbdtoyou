import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Switch,
  Tag,
} from 'antd';
import { useWatch } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';

const FinalModal = ({
  profile,
  onSubmit,
  preFormValue,
  loading,
}: {
  profile: { type: string; quota?: number };
  onSubmit: (val: any, status: 'draft' | 'published') => Promise<void>;
  preFormValue: any;
  loading?: boolean;
}) => {
  const isFreeAccount = profile?.quota < 1;
  const [form] = Form.useForm();
  const isScheduled = useWatch('is_scheduled', form);
  const isPublic = useWatch('isPublic', form);
  return (
    <Form
      form={form}
      onFinish={(val) => {
        onSubmit({ ...val, ...preFormValue }, 'published');
      }}
      layout="vertical"
      className="!max-h-[500px] overflow-y-auto overflow-x-hidden">
      <Form.Item
        className="!mb-[5px]"
        name={'isPublic'}
        label={
          <div className="mt-[10px] mb-[5px]">
            <h3 className="text-[15px] font-semibold">
              Show on Inspiration Page
            </h3>

            <p className="text-[13px] text-gray-600 max-w-[400px]">
              In free plan your website will be shown on the Inspiration page.
              You can change this option to hide it on premium plan.
            </p>
          </div>
        }
        initialValue={isFreeAccount ? true : false}>
        <Switch disabled={isFreeAccount} />
      </Form.Item>

      {isPublic && (
        <>
          <Form.Item
            rules={[{ required: true, message: 'Please input title!' }]}
            name={'title2'}
            className="!my-[10px]"
            label="Inspiration title">
            <Input size="large" placeholder="Your inspiration title" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Please input caption!' }]}
            name={'caption'}
            className="!my-[10px]"
            label="Inspiration caption">
            <TextArea size="large" placeholder="Your inspiration caption" />
          </Form.Item>
        </>
      )}
      <Form.Item
        name={'is_scheduled'}
        label={
          <div className="mt-[10px] mb-[5px]">
            <h3 className="text-[15px] font-semibold">
              Send gift automatically{' '}
              <Tag color="red" className="!ml-[6px]">
                New
              </Tag>
            </h3>

            <p className="text-[13px] text-gray-600 max-w-[400px]">
              In premium plan you can send gift automatically to your special
              one. We will send the gift to the email and time you set.
            </p>
          </div>
        }
        initialValue={isFreeAccount ? false : true}>
        <Switch disabled={isFreeAccount} />
      </Form.Item>
      {isScheduled && (
        <Row gutter={[12, 12]} justify="center">
          <Col span={12}>
            <Form.Item
              label="Date & Time"
              name={'date_scheduled'}
              rules={[{ required: true }]}>
              <DatePicker
                size="large"
                className="!w-full"
                showTime
                format={'D MMM YYYY, HH:mm a'}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email Destination"
              name={'dest_email'}
              rules={[{ required: true }]}>
              <Input type="email" size="large" placeholder="Enter an email" />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Form.Item className="!my-0">
        <div className="flex justify-end gap-2 mt-[12px]">
          <Button
            loading={loading}
            className="!bg-black !rounded-full"
            type="primary"
            htmlType="submit"
            size="large">
            Finish
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default FinalModal;
