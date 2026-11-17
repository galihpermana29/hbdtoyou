'use client';

import { IDetailContentResponse } from '@/action/interfaces';
import { createContent, editContent, submitFeedback } from '@/action/user-api';
import { UseCreateContentReturn } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import {
  CAMERA_COLORS,
  type CameraColor,
  type RollFrame,
  type RollOfUsData,
} from '@/app/(landing)/(gifts)/rollofusv1/roll-of-us-data';
import { useMemoifyProfile } from '@/app/session-provider';
import {
  PlanCount,
  reportCreateFailure,
  roomForMore,
  usePlan,
} from '@/components/forms/plan-count';
import { usePremiumGate } from '@/components/forms/premium-gate';
import DraggerUpload, { AccountType } from '@/components/ui/uploader/uploader';
import { reset } from '@/lib/uploadSlice';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import FinalModal from '../final-modal';

interface NewRollOfUsFormProps extends Partial<UseCreateContentReturn> {
  editData?: IDetailContentResponse;
}

/**
 * A frame as the form holds it. `date` stays the saved `YYYY-MM-DD` string
 * the whole time (the picker converts on the way in and out, see
 * DATE_FIELD), and "a good one" is '' because a Select cannot show an
 * option whose value is undefined.
 */
interface FrameValues {
  imageUrl: string;
  date?: string;
  caption: string;
  blooper: '' | 'blurry' | 'overexposed';
}

interface RollOfUsFormValues {
  title: string;
  recipientName: string;
  senderName?: string;
  cameraColor: CameraColor;
  frames: FrameValues[];
  letter: string;
  envelopeNote?: string;
  title2?: string;
  caption?: string;
  date_scheduled?: Parameters<typeof dayjs>[0];
  dest_email?: string;
  is_scheduled?: boolean;
  isPublic?: boolean;
  message?: string;
}

/** The fewest frames that still make a roll; the viewer refuses fewer. */
const MIN_FRAMES = 3;
const DATE_FORMAT = 'YYYY-MM-DD';

const EMPTY_FRAME: FrameValues = {
  imageUrl: '',
  date: undefined,
  caption: '',
  blooper: '',
};

const COLOR_NAMES: Record<CameraColor, string> = {
  lime: 'Lime',
  pink: 'Pink',
  blue: 'Blue',
  black: 'Black',
};

/**
 * The picker works in Dayjs but the field holds the string that is saved.
 * Keeping the string in the form, not a Dayjs, means everything that puts
 * values back - edit mode, and the premium gate restoring what was kept in
 * localStorage as JSON - hands the picker something it can read, instead of
 * a serialised Dayjs it would crash on.
 */
const DATE_FIELD = {
  getValueProps: (value?: string) => ({
    value: value ? dayjs(value, DATE_FORMAT) : undefined,
  }),
  normalize: (value?: Dayjs | null) =>
    value ? value.format(DATE_FORMAT) : undefined,
};

function toFrameValues(frame: Partial<RollFrame>): FrameValues {
  return {
    imageUrl: frame?.imageUrl ?? '',
    date: frame?.date || undefined,
    caption: frame?.caption ?? '',
    blooper:
      frame?.blooper === 'blurry' || frame?.blooper === 'overexposed'
        ? frame.blooper
        : '',
  };
}

export default function NewRollOfUsForm({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
  editData,
}: NewRollOfUsFormProps) {
  const [form] = useForm<RollOfUsFormValues>();
  const gate = usePremiumGate({
    form,
    template: selectedTemplate,
    editing: Boolean(editData),
  });
  const profile = useMemoifyProfile();
  const dispatch = useDispatch();
  const { isFree: isFreeAccount, limits, tier } = usePlan('gift');

  const handleSubmit = async (
    values: RollOfUsFormValues,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);

    // Exactly what normalizeRollOfUsData reads, so a saved gift opens as
    // it was written. Optional answers left blank stay out of the JSON.
    const detailContent: RollOfUsData = {
      title: values.title.trim(),
      recipientName: values.recipientName.trim(),
      senderName: values.senderName?.trim() || undefined,
      cameraColor: values.cameraColor,
      frames: (values.frames || []).map((frame) => ({
        imageUrl: frame.imageUrl,
        date: frame.date,
        caption: frame.caption.trim(),
        blooper: frame.blooper || undefined,
      })),
      letter: values.letter.trim(),
      envelopeNote: values.envelopeNote?.trim() || undefined,
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
      reportCreateFailure(response.message, profile, 'gift');
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
      frames: Array.isArray(detailContent.frames)
        ? detailContent.frames.map(toFrameValues)
        : [],
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
        onCancel={() => setModalState({ visible: false, data: '' })}>
        <FinalModal
          loading={loading}
          profile={profile}
          onSubmit={handleSubmit}
          preFormValue={modalState?.data}
        />
      </Modal>

      {gate.ui}

      <Form
        disabled={loading}
        form={form}
        layout="vertical"
        initialValues={{
          title: 'Roll of Us',
          cameraColor: 'lime',
          frames: Array.from({ length: MIN_FRAMES }, () => ({
            ...EMPTY_FRAME,
          })),
        }}>
        <Form.Item
          name="title"
          label="Gift title"
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please enter a title',
            },
            { max: 40, message: 'Keep the title under 40 characters' },
          ]}>
          <Input size="large" placeholder="e.g., Roll of Us" />
        </Form.Item>

        <Form.Item
          name="recipientName"
          label="Recipient name"
          extra="Printed on the roll and on the contact sheet."
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please enter who the roll is for',
            },
            { max: 30, message: 'Keep the name under 30 characters' },
          ]}>
          <Input size="large" placeholder="e.g., Jamie" />
        </Form.Item>

        <Form.Item
          name="senderName"
          label="Your name (optional)"
          extra="Signs the letter."
          rules={[{ max: 30, message: 'Keep the name under 30 characters' }]}>
          <Input size="large" placeholder="e.g., Sam" />
        </Form.Item>

        <Form.Item
          name="cameraColor"
          label="Camera color"
          rules={[{ required: true, message: 'Please choose a camera color' }]}>
          <Select
            size="large"
            options={(Object.keys(CAMERA_COLORS) as CameraColor[]).map(
              (color) => ({
                value: color,
                label: (
                  <span className="flex items-center gap-[8px]">
                    <span
                      aria-hidden
                      className="inline-block h-[14px] w-[14px] rounded-full border-[3px]"
                      style={{
                        background: CAMERA_COLORS[color].body,
                        borderColor: CAMERA_COLORS[color].plate,
                      }}
                    />
                    {COLOR_NAMES[color]}
                  </span>
                ),
              })
            )}
          />
        </Form.Item>

        <Form.List
          name="frames"
          rules={[
            {
              validator: async (_, frames) => {
                if (!frames || frames.length < MIN_FRAMES) {
                  throw new Error(`Add at least ${MIN_FRAMES} frames`);
                }
              },
            },
          ]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              <div className="mb-[12px]">
                <h3 className="text-[15px] font-semibold">The roll</h3>
                <p className="text-[13px] text-gray-600 max-w-[560px]">
                  One photo per frame, in the order they should come out of the
                  camera. Each print gets its date stamp and your handwritten
                  caption. At least {MIN_FRAMES}.
                </p>
              </div>

              <div className="flex flex-col gap-[16px]">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row gap-[12px] rounded-[12px] border border-[#dadada] p-[12px]">
                    <div className="w-full sm:max-w-[210px]">
                      <p className="mb-[8px] text-[13px] font-semibold">
                        Frame {index + 1}
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
                        ]}>
                        <DraggerUpload
                          form={form}
                          formItemName={['frames', name, 'imageUrl']}
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
                        {...DATE_FIELD}
                        name={[name, 'date']}
                        label="Date taken"
                        extra="Stamped on the print in orange."
                        rules={[{ required: true, message: 'Pick the date' }]}>
                        <DatePicker
                          size="large"
                          className="w-full"
                          format="D MMM YYYY"
                          placeholder="Pick a date"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'caption']}
                        label="Caption"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Add a short caption',
                          },
                          {
                            // The print shows one handwritten line.
                            max: 40,
                            message: 'Keep the caption under 40 characters',
                          },
                        ]}>
                        <Input
                          size="large"
                          placeholder="e.g., first coffee. you talked, i stared"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'blooper']}
                        label="Came out wrong? (optional)"
                        extra="For a laugh: the print comes out blurry or washed out.">
                        <Select
                          size="large"
                          options={[
                            { label: 'No, a good one', value: '' },
                            { label: 'Blurry', value: 'blurry' },
                            { label: 'Overexposed', value: 'overexposed' },
                          ]}
                        />
                      </Form.Item>
                      <Button
                        danger
                        disabled={fields.length <= MIN_FRAMES}
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}>
                        Remove frame
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="large"
                type="primary"
                onClick={() => {
                  if (roomForMore(fields.length, limits, tier, 'frames')) {
                    add({ ...EMPTY_FRAME });
                  }
                }}
                icon={<PlusOutlined />}
                className="mr-add my-[12px]">
                Add frame
              </Button>
              <PlanCount
                used={fields.length}
                limit="repeatItems"
                tier={tier}
                noun="frames"
              />
              <Form.ErrorList errors={errors} />
            </>
          )}
        </Form.List>

        <Form.Item
          name="letter"
          label={
            <div className="mt-[24px]">
              <h3 className="text-[15px] font-semibold">The letter</h3>
              <p className="text-[13px] text-gray-600 max-w-[560px]">
                In the envelope that comes back from the lab with the contact
                sheet.
              </p>
            </div>
          }
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please write the letter',
            },
            { max: 1200, message: 'Keep the letter under 1200 characters' },
          ]}>
          <TextArea
            size="large"
            rows={7}
            placeholder="Happy birthday. I used up a whole roll and still ran out of film before I ran out of reasons..."
          />
        </Form.Item>

        <Form.Item
          name="envelopeNote"
          label="Written on the envelope (optional)"
          rules={[{ max: 40, message: 'Keep the note under 40 characters' }]}>
          <Input size="large" placeholder="e.g., open after the last photo" />
        </Form.Item>

        <div className="flex justify-end mt-4">
          <Button
            onClick={() => {
              form
                .validateFields()
                .then(async () => {
                  if (!(await gate.allow(form.getFieldsValue()))) return;
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
            className="mr-cta"
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
}
