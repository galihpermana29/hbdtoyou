'use client';

import { IDetailContentResponse } from '@/action/interfaces';
import { createContent, editContent, submitFeedback } from '@/action/user-api';
import { UseCreateContentReturn } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import { useMemoifyProfile } from '@/app/session-provider';
import DraggerUpload, {
  AccountType,
} from '@/components/ui/uploader/uploader';
import { reset } from '@/lib/uploadSlice';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import FinalModal from '../final-modal';

interface NewBoardOfUsFormProps extends Partial<UseCreateContentReturn> {
  editData?: IDetailContentResponse;
}

interface BoardOfUsFormValues {
  title: string;
  recipientName?: string;
  occasion: 'birthday' | 'anniversary' | 'both';
  tokenNickname?: string;
  tokenColor?: string;
  memories: Array<{
    imageUrl: string;
    label: string;
    caption?: string;
  }>;
  chanceTexts: string[];
  finishMessage?: string;
  title2?: string;
  caption?: string;
  date_scheduled?: Parameters<typeof dayjs>[0];
  dest_email?: string;
  is_scheduled?: boolean;
  isPublic?: boolean;
  message?: string;
}

const EMPTY_MEMORY = { imageUrl: '', label: '', caption: '' };
const DEFAULT_CHANCE_TEXTS = [
  'Name the song that always makes you think of us.',
  'Pick our next tiny adventure.',
  'Say one thing you hope we still do together in ten years.',
];

export default function NewBoardOfUsForm({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
  editData,
}: NewBoardOfUsFormProps) {
  const [form] = useForm<BoardOfUsFormValues>();
  const profile = useMemoifyProfile();
  const dispatch = useDispatch();
  const isFreeAccount = profile?.quota < 1;

  const handleSubmit = async (
    values: BoardOfUsFormValues,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);

    const detailContent = {
      title: values.title.trim(),
      recipientName: values.recipientName?.trim() || 'Someone special',
      occasion: values.occasion,
      token: {
        nickname: values.tokenNickname?.trim() || 'Lovebug',
        color: values.tokenColor || '#f05f78',
      },
      memories: (values.memories || []).map((memory) => ({
        imageUrl: memory.imageUrl,
        label: memory.label.trim(),
        caption: memory.caption?.trim() || '',
      })),
      chanceTexts: (values.chanceTexts || []).map((text) => text.trim()),
      finishMessage:
        values.finishMessage?.trim() ||
        'Every stop with you is my favorite place to be. Here is to another lap together.',
      isPublic: values.isPublic,
    };
    const payload = {
      template_id: selectedTemplate.id,
      detail_content_json_text: JSON.stringify(detailContent),
      title: values.title2 || values.title,
      caption: values.caption || '',
      date_scheduled: values.date_scheduled
        ? dayjs(values.date_scheduled).format('DD/MM/YYYY h:mm A Z')
        : null,
      dest_email: values.dest_email,
      is_scheduled: values.is_scheduled,
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
      message: values.message,
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
    setModalState({ visible: true, data: userLink });
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
      tokenNickname: detailContent.token?.nickname,
      tokenColor: detailContent.token?.color,
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
          title: 'Board of Us',
          occasion: 'birthday',
          tokenNickname: 'Lovebug',
          tokenColor: '#f05f78',
          memories: Array.from({ length: 8 }, () => ({ ...EMPTY_MEMORY })),
          chanceTexts: DEFAULT_CHANCE_TEXTS,
        }}
      >
        <Form.Item
          name="title"
          label="Gift title"
          rules={[
            { required: true, message: 'Please enter a title' },
            { max: 40, message: 'Keep the title under 40 characters' },
          ]}
        >
          <Input size="large" placeholder="e.g., Board of Us" />
        </Form.Item>

        <Form.Item
          name="recipientName"
          label="Recipient name (optional)"
          rules={[
            { max: 30, message: 'Keep the name under 30 characters' },
          ]}
        >
          <Input size="large" placeholder="e.g., Jamie" />
        </Form.Item>

        <Form.Item
          name="occasion"
          label="Occasion"
          rules={[{ required: true, message: 'Please choose an occasion' }]}
        >
          <Select
            size="large"
            options={[
              { label: 'Birthday', value: 'birthday' },
              { label: 'Anniversary', value: 'anniversary' },
              { label: 'Birthday & anniversary', value: 'both' },
            ]}
          />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_130px] gap-[12px]">
          <Form.Item
            name="tokenNickname"
            label="Playing piece nickname (optional)"
            extra="This name follows the recipient around the board."
            rules={[
              { max: 18, message: 'Keep the nickname under 18 characters' },
            ]}
          >
            <Input size="large" placeholder="e.g., Lovebug" />
          </Form.Item>
          <Form.Item
            name="tokenColor"
            label="Piece color"
            extra="Pick their color."
          >
            <Input type="color" size="large" className="!p-[5px]" />
          </Form.Item>
        </div>

        <Form.List
          name="memories"
          rules={[
            {
              validator: async (_, memories) => {
                if (!memories || memories.length < 8) {
                  throw new Error('Add at least 8 memory squares');
                }
                if (memories.length > 12) {
                  throw new Error('You can add up to 12 memory squares');
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div className="mb-[12px]">
                <h3 className="text-[15px] font-semibold">
                  Memory squares (8–12)
                </h3>
                <p className="text-[13px] text-gray-600 max-w-[560px]">
                  Each photo becomes a stop on the board. Landing on one reveals
                  the memory and collects a love token for the finish.
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
                        Memory {index + 1}
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
                        name={[name, 'label']}
                        label="Square label"
                        rules={[
                          { required: true, message: 'Add a short label' },
                          {
                            max: 32,
                            message: 'Keep the label under 32 characters',
                          },
                        ]}
                      >
                        <Input size="large" placeholder="e.g., First coffee" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'caption']}
                        label="Reveal caption (optional)"
                        rules={[
                          {
                            max: 160,
                            message: 'Keep the caption under 160 characters',
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="e.g., The day we talked until closing"
                        />
                      </Form.Item>
                      <Button
                        danger
                        disabled={fields.length <= 8}
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Remove memory
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="large"
                type="primary"
                disabled={fields.length >= 12}
                onClick={() => add({ ...EMPTY_MEMORY })}
                icon={<PlusOutlined />}
                className="!rounded-[50px] !bg-black !text-white my-[12px] !text-[13px]"
              >
                Add memory
              </Button>
              <Form.ErrorList errors={errors} />
            </>
          )}
        </Form.List>

        <Form.List
          name="chanceTexts"
          rules={[
            {
              validator: async (_, chanceTexts) => {
                if (!chanceTexts || chanceTexts.length < 3) {
                  throw new Error('Add at least 3 Chance prompts');
                }
                if (chanceTexts.length > 5) {
                  throw new Error('You can add up to 5 Chance prompts');
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <div className="mt-[20px]">
              <h3 className="text-[15px] font-semibold">
                Chance prompts (3–5)
              </h3>
              <p className="mb-[12px] text-[13px] text-gray-600 max-w-[560px]">
                Add sweet questions, tiny dares, or ideas for your next
                adventure.
              </p>
              <div className="flex flex-col gap-[10px]">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} className="flex items-start gap-[8px]">
                    <Form.Item
                      {...restField}
                      className="!mb-0 flex-1"
                      name={name}
                      rules={[
                        { required: true, message: 'Add a Chance prompt' },
                        {
                          max: 180,
                          message: 'Keep the prompt under 180 characters',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder={`Chance prompt ${index + 1}`}
                      />
                    </Form.Item>
                    <Button
                      danger
                      size="large"
                      disabled={fields.length <= 3}
                      onClick={() => remove(name)}
                      icon={<MinusCircleOutlined />}
                      aria-label={`Remove Chance prompt ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <Button
                size="large"
                disabled={fields.length >= 5}
                onClick={() => add('')}
                icon={<PlusOutlined />}
                className="!rounded-[50px] mt-[10px] !text-[13px]"
              >
                Add Chance prompt
              </Button>
              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>

        <Form.Item
          name="finishMessage"
          label={
            <div className="mt-[24px]">
              <h3 className="text-[15px] font-semibold">
                Finish message (optional)
              </h3>
              <p className="text-[13px] text-gray-600 max-w-[560px]">
                The birthday or anniversary payoff shown after the short lap.
              </p>
            </div>
          }
          rules={[
            { max: 800, message: 'Keep the message under 800 characters' },
          ]}
        >
          <TextArea
            size="large"
            rows={6}
            placeholder="Happy birthday! Every stop with you is my favorite place to be..."
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
