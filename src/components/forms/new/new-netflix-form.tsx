'use client';
import { Button, Form, Input, message, Modal, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
import { useForm, useWatch } from 'antd/es/form/Form';
import { createContent, editContent } from '@/action/user-api';
import { useRouter } from 'next/navigation';
import { IDetailContentResponse } from '@/action/interfaces';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { reset } from '@/lib/uploadSlice';
import { useMemoifyProfile } from '@/app/session-provider';
import FinalModal from '../final-modal';
import DraggerUpload, { AccountType } from '@/components/ui/uploader/uploader';
import { UseCreateContentReturn } from '@/app/(landing)/(core)/create/usecase/useCreateContent';

interface NewNetflixFormProps extends Partial<UseCreateContentReturn> {
  editData?: IDetailContentResponse;
}

const NewNetflixForm = ({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
  editData,
}: NewNetflixFormProps) => {
  const dispatch = useDispatch();
  const profile = useMemoifyProfile();
  const router = useRouter();
  const [form] = useForm();

  const jumbotronImage = useWatch('jumbotronImage', form);
  const images = useWatch('images', form);

  const handleSubmit = async (
    val: any,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);

    const { jumbotronImage, title, subTitle, modalContent, isPublic, images } =
      val;
    const json_text = {
      jumbotronImage: jumbotronImage,
      title,
      subTitle,
      modalContent,
      images: images,
      isPublic,
    };

    const payload = {
      template_id: selectedTemplate.id,
      detail_content_json_text: JSON.stringify(json_text),
      title: val?.title2 ? val?.title2 : '',
      caption: val?.caption,

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
      const userLink = selectedTemplate.route + '/' + res.data;

      // Clear form fields
      form.resetFields();

      // Reset Redux state for collection of images
      dispatch(reset());

      if (status === 'draft') {
        setLoading(false);
        // window.open(userLink as string, '_blank');
        router.push('/preview?link=' + userLink);
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
      message.error(`Something went wrong!, ${res.message}`);
    }
    setLoading(false);
    return;
  };

  useEffect(() => {
    if (editData) {
      const jsonContent = JSON.parse(editData.detail_content_json_text);

      form.setFieldsValue({
        ...jsonContent,
        jumbotronImage: jsonContent?.jumbotronImage || null,
        images: jsonContent?.images || [],
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
          profile={profile}
          loading={loading}
          onSubmit={handleSubmit}
          preFormValue={modalState?.data}
        />
      </Modal>
      <Button
        className="!bg-black !rounded-full mb-[20px]"
        type="primary"
        onClick={() => {
          router.replace('/netflixv1?isTutorial=true');
        }}
        size="large">
        See tutorial
      </Button>
      <Form disabled={loading} form={form} layout="vertical">
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input image!',
            },
          ]}
          name={'jumbotronImage'}
          label="Jumbotron Image">
          <DraggerUpload
            profileImageURL={jumbotronImage}
            form={form}
            formItemName={'jumbotronImage'}
            type={profile?.type as AccountType}
            multiple={false}
            limit={1}
            openNotification={openNotification}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: 'Please input title!' }]}
          name={'title'}
          label="Title">
          <Input size="large" placeholder="Happy birthday to my cats" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: 'Please input subtitle!' }]}
          name={'subTitle'}
          label="Sub Title">
          <TextArea
            size="large"
            placeholder="This is how me express love. In the meantime you will understand how my brain works. lorem ipsum"
          />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: 'Please input modal content!' }]}
          name={'modalContent'}
          label="Modal Content">
          <TextArea
            size="large"
            placeholder="This is how me express love. In the meantime you will understand how my brain works. lorem ipsum"
          />
        </Form.Item>
        <Form.Item
          rules={[
            { required: true, message: 'Please upload atleast 1 content' },
          ]}
          name={'images'}
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">
                Collection of images
              </h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Account with <span className="font-bold">free</span> plan can
                only add 5 images. To add up to 20 images, upgrade to{' '}
                <span className="font-bold">premium</span> plan.
              </p>
            </div>
          }>
          <DraggerUpload
            profileImageURL={images}
            form={form}
            formItemName={'images'}
            type={profile?.type as AccountType}
            multiple={true}
            limit={profile?.type === 'free' ? 5 : 20}
            openNotification={openNotification}
          />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Tooltip
            title={
              profile?.type === 'free'
                ? 'To save as draft and see preview, please join premium plan'
                : ''
            }
            placement="top">
            <Button
              disabled={profile?.type === 'free'}
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
                  // handleSubmit(form.getFieldsValue(), 'published');
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

export default NewNetflixForm;
