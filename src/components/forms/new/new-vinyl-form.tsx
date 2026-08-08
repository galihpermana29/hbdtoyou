'use client';
import { Button, Form, Input, message, Modal, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent, editContent, submitFeedback } from '@/action/user-api';
import { IDetailContentResponse } from '@/action/interfaces';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { reset } from '@/lib/uploadSlice';
import FinalModal from '../final-modal';
import DraggerUpload, { AccountType } from '@/components/ui/uploader/uploader';
import { UseCreateContentReturn } from '@/app/(landing)/(core)/create/usecase/useCreateContent';

interface NewVinylFormProps extends Partial<UseCreateContentReturn> {
  editData?: IDetailContentResponse;
}

const NewVinylForm = ({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
  editData,
}: NewVinylFormProps) => {
  const profile = useMemoifyProfile();
  const isFreeAccount = profile?.quota < 1;
  const router = useRouter();
  const [form] = useForm();
  const dispatch = useDispatch();

  const songUrl = useWatch('songUrl', form);
  const voiceNoteUrl = useWatch('voiceNoteUrl', form);
  const videoUrl = useWatch('videoUrl', form);

  const handleSubmit = async (
    val: any,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);
    const {
      recipientName,
      songUrl,
      songTitle,
      songArtist,
      letter,
      voiceNoteUrl,
      voiceNoteQuote,
      videoUrl,
      memories,
      isPublic,
    } = val;

    const json_text = {
      recipientName,
      songUrl,
      songTitle,
      songArtist,
      letter,
      voiceNoteUrl,
      voiceNoteQuote,
      videoUrl,
      memories: memories || [],
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
      dispatch(reset());

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
      setLoading(false);
      message.error(res.message);
    }
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
      <Form disabled={loading} form={form} layout="vertical">
        {/* Recipient Name */}
        <Form.Item
          rules={[{ required: true, message: 'Please input recipient name!' }]}
          name={'recipientName'}
          label="Recipient Name">
          <Input size="large" placeholder="e.g., Widya" />
        </Form.Item>

        {/* Song Upload (MP3) */}
        <Form.Item
          rules={[{ required: true, message: 'Please upload a song!' }]}
          name={'songUrl'}
          label={
            <div>
              <h3 className="text-[15px] font-semibold">Song (MP3)</h3>
              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Upload the song that will play on the vinyl player
              </p>
            </div>
          }>
          <DraggerUpload
            profileImageURL={songUrl}
            form={form}
            formItemName={'songUrl'}
            type={isFreeAccount ? AccountType.free : AccountType.premium}
            multiple={false}
            limit={1}
            openNotification={openNotification}
            acceptTypes=".mp3"
            allowedMimeTypes={['audio/mpeg']}
          />
        </Form.Item>

        {/* Song Title */}
        <Form.Item
          rules={[{ required: true, message: 'Please input song title!' }]}
          name={'songTitle'}
          label="Song Title">
          <Input size="large" placeholder="e.g., Mencintaimu" />
        </Form.Item>

        {/* Song Artist */}
        <Form.Item
          rules={[{ required: true, message: 'Please input song artist!' }]}
          name={'songArtist'}
          label="Song Artist">
          <Input size="large" placeholder="e.g., Sal Priadi" />
        </Form.Item>

        {/* Letter */}
        <Form.Item
          rules={[{ required: true, message: 'Please write a letter!' }]}
          name={'letter'}
          label={
            <div>
              <h3 className="text-[15px] font-semibold">Letter</h3>
              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Write a heartfelt letter that will be shown when the recipient
                clicks the letter icon
              </p>
            </div>
          }>
          <TextArea
            size="large"
            rows={6}
            placeholder="Write a letter for your loved one..."
          />
        </Form.Item>

        {/* Voice Note Upload (MP3) */}
        <Form.Item
          name={'voiceNoteUrl'}
          label={
            <div>
              <h3 className="text-[15px] font-semibold">
                Voice Note (MP3) — Optional
              </h3>
              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Upload a voice note that plays when the recipient clicks the
                cassette tape
              </p>
            </div>
          }>
          <DraggerUpload
            profileImageURL={voiceNoteUrl}
            form={form}
            formItemName={'voiceNoteUrl'}
            type={isFreeAccount ? AccountType.free : AccountType.premium}
            multiple={false}
            limit={1}
            openNotification={openNotification}
            acceptTypes=".mp3"
            allowedMimeTypes={['audio/mpeg']}
          />
        </Form.Item>

        {/* Voice Note Quote */}
        <Form.Item name={'voiceNoteQuote'} label="Voice Note Quote — Optional">
          <Input
            size="large"
            placeholder={`e.g., "You feel like home to me, in a way I can't explain."`}
          />
        </Form.Item>

        {/* Video Upload (MP4) */}
        <Form.Item
          name={'videoUrl'}
          label={
            <div>
              <h3 className="text-[15px] font-semibold">
                Video (MP4) — Optional
              </h3>
              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Upload a video that plays when the recipient clicks the
                camcorder
              </p>
            </div>
          }>
          <DraggerUpload
            profileImageURL={videoUrl}
            form={form}
            formItemName={'videoUrl'}
            type={isFreeAccount ? AccountType.free : AccountType.premium}
            multiple={false}
            limit={1}
            openNotification={openNotification}
            acceptTypes=".mp4"
            allowedMimeTypes={['video/mp4']}
          />
        </Form.Item>

        {/* Memories (Form.List) */}
        <Form.List name="memories">
          {(fields, { add, remove }) => (
            <>
              <div className="mt-[10px] mb-[5px]">
                <h3 className="text-[15px] font-semibold">Memories</h3>
                <p className="text-[13px] text-gray-600 max-w-[400px]">
                  Add photos with captions that appear when the recipient clicks
                  the polaroid stack
                </p>
              </div>
              <div className="flex flex-wrap gap-[10px]">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-[8px] items-start w-full">
                    <div className="max-w-[200px] w-full">
                      <Form.Item
                        {...restField}
                        className="!my-0 w-full"
                        rules={[
                          {
                            required: true,
                            message: 'Please upload a photo',
                          },
                        ]}
                        name={[name, 'imageUrl']}>
                        <DraggerUpload
                          profileImageURL={form.getFieldValue([
                            'memories',
                            name,
                            'imageUrl',
                          ])}
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
                        rules={[
                          {
                            required: true,
                            message: 'Please input the caption!',
                          },
                        ]}>
                        <Input placeholder="e.g., Our candlelit night" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'date']}
                        rules={[
                          {
                            required: true,
                            message: 'Please input the date!',
                          },
                        ]}>
                        <Input placeholder="e.g., 12 December" />
                      </Form.Item>
                      <Button
                        danger
                        type="default"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="large"
                type="primary"
                onClick={() => {
                  if (isFreeAccount) {
                    if (fields.length <= 1) {
                      add({ imageUrl: '', caption: '', date: '' });
                    } else {
                      message.error('You can only add 2 memories');
                    }
                  } else {
                    if (fields.length <= 14) {
                      add({ imageUrl: '', caption: '', date: '' });
                    } else {
                      message.error('Limit reached');
                    }
                  }
                }}
                icon={<PlusOutlined />}
                className="!rounded-[50px] !bg-black !text-white my-[12px] !text-[13px]">
                Add Memory
              </Button>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Account with <span className="font-bold">free</span> plan can
                only add 2 memories. To add up to 15 memories, upgrade to{' '}
                <span className="font-bold">premium</span> plan.
              </p>
            </>
          )}
        </Form.List>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Tooltip
            title={
              isFreeAccount
                ? 'To save as draft and see preview, please join premium plan'
                : ''
            }
            placement="top">
            <Button
              disabled={isFreeAccount}
              onClick={() => {
                form
                  .validateFields()
                  .then(() => {
                    handleSubmit(form.getFieldsValue(), 'draft');
                  })
                  .catch((info) => {
                    form.scrollToField(Object.keys(info?.values)[0], {
                      behavior: 'smooth',
                    });
                  });
              }}
              className="!bg-white !text-black !border-[1px] !border-black !rounded-full"
              loading={loading}
              type="primary"
              htmlType="submit"
              size="large">
              {'Save Draft & See Preview'}
            </Button>
          </Tooltip>
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

export default NewVinylForm;
