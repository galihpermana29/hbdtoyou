'use client';
import { Button, Form, Input, message, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
import { useForm } from 'antd/es/form/Form';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent, editContent, submitFeedback } from '@/action/user-api';
import { IDetailContentResponse } from '@/action/interfaces';
import dayjs from 'dayjs';
import FinalModal from '../final-modal';
import { UseCreateContentReturn } from '@/app/(landing)/(core)/create/usecase/useCreateContent';

interface NewTarotFormProps extends Partial<UseCreateContentReturn> {
  editData?: IDetailContentResponse;
}

const NewTarotForm = ({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  handleCompleteCreation,
  editData,
}: NewTarotFormProps) => {
  const [form] = useForm();
  const profile = useMemoifyProfile();

  const handleSubmit = async (
    val: any,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);

    const {
      recipientName,
      recipientAge,
      recipientWish,
      sayings,
      specialSaying,
      isPublic,
    } = val;

    const json_text = {
      recipientName,
      recipientAge,
      recipientWish,
      sayings: sayings || ['', '', ''],
      specialSaying,
      isPublic,
    };

    const payload = {
      template_id: selectedTemplate.id,
      detail_content_json_text: JSON.stringify(json_text),
      title: val?.title2 ? val?.title2 : '',
      caption: val?.caption ? val?.caption : '',
      date_scheduled: val?.date_scheduled
        ? dayjs(val?.date_scheduled).format('DD/MM/YYYY h:mm A Z')
        : null,
      dest_email: val?.dest_email,
      is_scheduled: val?.is_scheduled,
      status,
    };

    const res = editData
      ? await editContent(payload, editData.id)
      : await createContent(payload);

    if (res.success) {
      const data = await submitFeedback({
        message: val?.message,
        type: 'feedback',
        email: profile?.email,
      });

      if (!data.success) {
        message.error(data.message);
      }

      const userLink = selectedTemplate.route + '/' + res.data;
      form.resetFields();

      if (status === 'draft') {
        setLoading(false);
        window.location.href = `/preview?link=${userLink}`;
      } else {
        setLoading(false);
        setModalState({
          visible: true,
          data: userLink as string,
        });
        message.success(
          editData ? 'Successfully posted!' : 'Successfully created!'
        );
        handleCompleteCreation();
      }
    } else {
      message.error(res.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (editData) {
      const jsonContent = JSON.parse(editData.detail_content_json_text);
      form.setFieldsValue({
        ...jsonContent,
        title2: editData.title,
        caption: editData.caption,
      });
    }
  }, [editData]);

  return (
    <div>
      <Modal
        centered={true}
        title="Add-Ons"
        footer={null}
        open={modalState.visible}
        onCancel={() => setModalState({ visible: false, data: '' })}>
        <FinalModal
          loading={loading}
          profile={profile}
          onSubmit={handleSubmit}
          preFormValue={modalState?.data}
        />
      </Modal>
      <Form
        disabled={loading}
        form={form}
        layout="vertical"
        initialValues={{ sayings: ['', '', ''] }}>
        <Form.Item
          rules={[{ required: true, message: 'Please enter their name' }]}
          name={'recipientName'}
          label="Who is this reading for?">
          <Input size="large" placeholder="e.g., Sarah" />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: 'Please enter their age' }]}
          name={'recipientAge'}
          label="Their age">
          <Input size="large" type="number" placeholder="e.g., 26" />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: 'Please write a wish for them' }]}
          name={'recipientWish'}
          label={
            <div>
              <h3 className="text-[15px] font-semibold">Your wish for them</h3>
              <p className="text-[13px] text-gray-600 max-w-[400px]">
                A short wish shown when they finish the reading
              </p>
            </div>
          }>
          <Input
            size="large"
            placeholder="e.g., May all your dreams come true"
          />
        </Form.Item>

        <div className="mt-[10px] mb-[5px]">
          <h3 className="text-[15px] font-semibold">Three short messages</h3>
          <p className="text-[13px] text-gray-600 max-w-[400px]">
            They&apos;ll pick 3 tarot cards. One message is revealed with each
            card, in the order they pick.
          </p>
        </div>
        {[0, 1, 2].map((i) => (
          <Form.Item
            key={i}
            rules={[
              { required: true, message: `Please write message ${i + 1}` },
            ]}
            name={['sayings', i]}
            label={`Message ${i + 1}`}>
            <Input
              size="large"
              placeholder={
                [
                  'e.g., The day we met changed everything',
                  'e.g., Thank you for always being there',
                  'e.g., Our best days are still ahead',
                ][i]
              }
            />
          </Form.Item>
        ))}

        <Form.Item
          rules={[
            { required: true, message: 'Please write your special message' },
          ]}
          name={'specialSaying'}
          label={
            <div>
              <h3 className="text-[15px] font-semibold">Your special message</h3>
              <p className="text-[13px] text-gray-600 max-w-[400px]">
                A longer note shown at the end, after all 3 cards are revealed
              </p>
            </div>
          }>
          <TextArea
            size="large"
            rows={5}
            placeholder="Write a heartfelt note they'll read after the reading..."
          />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              form
                .validateFields()
                .then(() => {
                  setModalState({
                    visible: true,
                    data: form.getFieldsValue(),
                    type: 'finish',
                  });
                })
                .catch((info) => {
                  form.scrollToField(Object.keys(info?.values)[0], {
                    behavior: 'smooth',
                  });
                });
            }}
            className="!bg-black !rounded-full"
            loading={loading}
            type="primary"
            htmlType="submit"
            size="large">
            {editData ? 'Edit & Publish' : 'Create'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewTarotForm;
