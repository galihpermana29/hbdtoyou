'use client';
import { Button, Form, message, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent, editContent, submitFeedback } from '@/action/user-api';
import { useDebounce } from 'use-debounce';
import { IDetailContentResponse } from '@/action/interfaces';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { reset } from '@/lib/uploadSlice';
import FinalModal from '../final-modal';
import Typewriter from '@/components/fancy/typewriter';
import { fetchSearch, OptionSpotifyTrack } from './new-spotify-form';
import DraggerUpload, { AccountType } from '@/components/ui/uploader/uploader';
import { UseCreateContentReturn } from '@/app/(landing)/(core)/create/usecase/useCreateContent';

interface NewMagazine1FormProps extends Partial<UseCreateContentReturn> {
  editData?: IDetailContentResponse;
}
const NewMagazineV1Form = ({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
  editData,
}: NewMagazine1FormProps) => {
  const profile = useMemoifyProfile();
  const isFreeAccount = profile?.quota < 1;
  const [form] = useForm();
  const selectedSongs = useWatch('song', form);

  const [searchedSong, setSearchedSong] = useState('');
  const [searchedOptions, setSearchedOptions] = useState<OptionSpotifyTrack[]>(
    []
  );

  const momentOfYou = useWatch('momentOfYou', form);

  const [value] = useDebounce(searchedSong, 1000);

  const router = useRouter();

  const dispatch = useDispatch();

  const handleSubmit = async (
    val: any,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);
    const { desc, isPublic } = val;

    const json_text = {
      momentOfYou: val?.momentOfYou || null,
      desc,
      id: selectedSongs ?? '0W5o1Kxw1VlohSajPqeBMF',
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

      // Clear form fields
      form.resetFields();

      // Reset Redux state for collection of images
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
      message.error('Something went wrong!');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (value && value !== '') {
      fetchSearch(value, setSearchedOptions);
    }
  }, [value]);

  useEffect(() => {
    if (editData) {
      const jsonContent = JSON.parse(editData.detail_content_json_text);

      form.setFieldsValue({
        ...jsonContent,
        momentOfYou: jsonContent?.momentOfYou || null,
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
      // onFinish={(val) => handleSubmit(val)}
      >
        {selectedSongs && (
          <div className="max-w-[400px] my-[12px]">
            <iframe
              src={`https://open.spotify.com/embed/track/${selectedSongs}`}
              height={80}
              className="w-full"></iframe>
          </div>
        )}
        <Form.Item
          name={'song'}
          label="Search a song"
          className=" w-full flex-1 !my-[10px]"
          rules={[{ required: true, message: 'Please input a song name!' }]}>
          <Select
            popupClassName="inspiration-select-dropdown"
            listHeight={256}
            virtual={false}
            notFoundContent={null}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            size="large"
            showSearch
            placeholder="Natural - Dmassive"
            onSearch={(value) => setSearchedSong(value)}
            options={
              searchedOptions.length > 0
                ? searchedOptions.map((item: any) => ({
                  label: item.artistName + ' - ' + item.songName,
                  value: item.id,
                }))
                : []
            }
          />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input description',
            },
          ]}
          name={'desc'}
          label={
            <div className="mt-[10px] mb-[5px]" suppressHydrationWarning>
              <h3 className="text-[15px] font-semibold">A letter or a story</h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                For the animation, please separate a sentence with a dot (.)
              </p>
              <p
                className="whitespace-pre-wrap max-w-[500px]"
                suppressHydrationWarning>
                <Typewriter
                  text={[
                    'All of this photo is our moments.',
                    'I want to say a Happy Birthday to you.',
                    'I never knew that i will always be with you for a long time period of time.',
                    'I wish you all the best in your life.',
                    'Remember that you have me, and you can share anything with me.',
                  ]}
                  speed={70}
                  className="text-black"
                  waitTime={1500}
                  deleteSpeed={60}
                  cursorChar={'_'}
                />
              </p>
            </div>
          }
          initialValue={
            'All of this photo is our moments. I want to say a Happy Birthday to you. I never knew that i will always be with you for a long time period of time. I wish you all the best in your life. Remember that you have me, and you can share anything with me.'
          }>
          <TextArea
            className="!h-[350px]"
            size="large"
            placeholder="You can write anything in here"
          />
        </Form.Item>
        <Form.Item
          rules={[
            { required: true, message: 'Please upload atleast 1 content' },
          ]}
          name={'momentOfYou'}
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">Moments</h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Upload a moment that you want to share with your partner, image
                of memorable moment or anything
              </p>
            </div>
          }>
          <DraggerUpload
            profileImageURL={momentOfYou}
            form={form}
            formItemName={'momentOfYou'}
            type={isFreeAccount ? AccountType.free : AccountType.premium}
            multiple={true}
            limit={isFreeAccount ? 5 : 20}
            openNotification={openNotification}
          />
        </Form.Item>
        <p className="text-[13px] text-gray-600 max-w-[400px]">
          Account with <span className="font-bold">free</span> plan can only add
          1 images. To add up to 20 images, upgrade to{' '}
          <span className="font-bold">premium</span> plan.
        </p>

        <div className="flex justify-end gap-2">
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

export default NewMagazineV1Form;
