'use client';

import { IDetailContentResponse } from '@/action/interfaces';
import { createContent, editContent, submitFeedback } from '@/action/user-api';
import { useMemoifyProfile } from '@/app/session-provider';
import { UseCreateContentReturn } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import DraggerUpload, { AccountType } from '@/components/ui/uploader/uploader';
import { reset } from '@/lib/uploadSlice';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import FinalModal from '../final-modal';

interface NewArcadeClawFormProps extends Partial<UseCreateContentReturn> {
  editData?: IDetailContentResponse;
}

interface ArcadeClawFormValues {
  title: string;
  recipientName: string;
  memories: Array<{ imageUrl: string; caption?: string }>;
  finalMessage: string;
  title2?: string;
  caption?: string;
  date_scheduled?: Parameters<typeof dayjs>[0];
  dest_email?: string;
  is_scheduled?: boolean;
  message?: string;
}

const EMPTY_MEMORY = { imageUrl: '', caption: '' };

export default function NewArcadeClawForm({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
  editData,
}: NewArcadeClawFormProps) {
  const [form] = useForm<ArcadeClawFormValues>();
  const memories = useWatch('memories', form);
  const profile = useMemoifyProfile();
  const dispatch = useDispatch();
  const isFreeAccount = profile?.quota < 1;

  const handleSubmit = async (
    values: ArcadeClawFormValues,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);

    const detailContent = {
      title: values.title,
      recipientName: values.recipientName,
      memories: (values.memories || []).map((memory) => ({
        imageUrl: memory.imageUrl,
        caption: memory.caption?.trim() || '',
      })),
      finalMessage: values.finalMessage,
    };
    const payload = {
      template_id: selectedTemplate.id,
      detail_content_json_text: JSON.stringify(detailContent),
      title: values?.title2 || values.title,
      caption: values?.caption || '',
      date_scheduled: values?.date_scheduled
        ? dayjs(values.date_scheduled).format('DD/MM/YYYY h:mm A Z')
        : null,
      dest_email: values?.dest_email,
      is_scheduled: values?.is_scheduled,
      status,
    };

    const response = editData
      ? await editContent(payload, editData.id)
      : await createContent(payload);

    if (!response.success) {
      message.error(response.message);
      setLoading(false);
      return;
    }

    const feedbackResponse = await submitFeedback({
      message: values?.message,
      type: 'feedback',
      email: profile?.email,
    });
    if (!feedbackResponse.success) {
      message.error(feedbackResponse.message);
    }

    const userLink = `${selectedTemplate.route}/${response.data}`;
    form.resetFields();
    dispatch(reset());

    if (status === 'draft') {
      setLoading(false);
      window.location.href = `/preview?link=${userLink}`;
      return;
    }

    setLoading(false);
    setModalState({
      visible: true,
      data: userLink,
    });
    message.success(
      editData ? 'Successfully posted!' : 'Successfully created!'
    );
    handleCompleteCreation();
  };

  useEffect(() => {
    if (!editData) return;
    const detailContent = JSON.parse(editData.detail_content_json_text);
    form.setFieldsValue({
      ...detailContent,
      title2: editData.title,
      caption: editData.caption,
    });
  }, [editData, form]);

  return (
    <div>
      <Modal
        centered
        title="Add-Ons"
        footer={null}
        open={modalState.visible}
        onCancel={() => setModalState({ visible: false, data: '' })}
      >
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
        initialValues={{
          title: 'Claw of Us',
          memories: [
            { ...EMPTY_MEMORY },
            { ...EMPTY_MEMORY },
            { ...EMPTY_MEMORY },
          ],
        }}
      >
        <Form.Item
          name="title"
          label="Gift title"
          rules={[
            { required: true, message: 'Please enter a title' },
            { max: 32, message: 'Keep the title under 32 characters' },
          ]}
        >
          <Input size="large" placeholder="e.g., Claw of Us" />
        </Form.Item>

        <Form.Item
          name="recipientName"
          label="Recipient name"
          rules={[
            { required: true, message: 'Please enter their name' },
            { max: 30, message: 'Keep the name under 30 characters' },
          ]}
        >
          <Input size="large" placeholder="e.g., Jamie" />
        </Form.Item>

        <Form.List
          name="memories"
          rules={[
            {
              validator: async (_, memories) => {
                if (!memories || memories.length < 3) {
                  throw new Error('Add at least 3 memories');
                }
                if (memories.length > 6) {
                  throw new Error('You can add up to 6 memories');
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div className="mb-[12px]">
                <h3 className="text-[15px] font-semibold">
                  Memories (3–6 photos)
                </h3>
                <p className="text-[13px] text-gray-600 max-w-[500px]">
                  The machine displays every photo. Your recipient grabs any
                  three to unlock the final message. Captions are optional.
                </p>
              </div>

              <div className="flex flex-col gap-[16px]">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row gap-[12px] rounded-[12px] border border-[#EAECF0] p-[12px]"
                  >
                    <div className="w-full sm:max-w-[210px]">
                      <p className="mb-[8px] text-[13px] font-semibold">
                        Photo {index + 1}
                      </p>
                      <Form.Item
                        {...restField}
                        className="!mb-0"
                        name={[name, 'imageUrl']}
                        rules={[
                          {
                            required: true,
                            message: 'Please upload a photo',
                          },
                        ]}
                      >
                        <DraggerUpload
                          profileImageURL={memories?.[name]?.imageUrl}
                          form={form}
                          formItemName={['memories', name, 'imageUrl']}
                          type={
                            isFreeAccount
                              ? AccountType.free
                              : AccountType.premium
                          }
                          multiple={false}
                          limit={1}
                          openNotification={openNotification}
                        />
                      </Form.Item>
                    </div>

                    <div className="flex-1">
                      <Form.Item
                        {...restField}
                        name={[name, 'caption']}
                        label="Short caption (optional)"
                        rules={[
                          {
                            max: 80,
                            message: 'Keep the caption under 80 characters',
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="e.g., The sunset we still talk about"
                        />
                      </Form.Item>
                      <Button
                        danger
                        type="default"
                        disabled={fields.length <= 3}
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Remove photo
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="large"
                type="primary"
                disabled={fields.length >= 6}
                onClick={() => add({ ...EMPTY_MEMORY })}
                icon={<PlusOutlined />}
                className="!rounded-[50px] !bg-black !text-white my-[12px] !text-[13px]"
              >
                Add photo
              </Button>
              <Form.ErrorList errors={errors} />
            </>
          )}
        </Form.List>

        <Form.Item
          name="finalMessage"
          rules={[
            { required: true, message: 'Please write a final message' },
            { max: 700, message: 'Keep the message under 700 characters' },
          ]}
          label={
            <div className="mt-[10px]">
              <h3 className="text-[15px] font-semibold">Final message</h3>
              <p className="text-[13px] text-gray-600 max-w-[500px]">
                This is the gift climax shown after three successful grabs.
              </p>
            </div>
          }
        >
          <TextArea
            size="large"
            rows={6}
            placeholder="Write the birthday, anniversary, or just-because message they unlock..."
          />
        </Form.Item>

        <div className="flex justify-end mt-4">
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
                  form.scrollToField(Object.keys(info?.values || {})[0], {
                    behavior: 'smooth',
                  });
                });
            }}
            className="!bg-black !rounded-full"
            loading={loading}
            type="primary"
            htmlType="submit"
            size="large"
          >
            {editData ? 'Edit & Publish' : 'Create'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
