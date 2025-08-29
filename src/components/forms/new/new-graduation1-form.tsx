'use client';
import { Button, Form, Input, message, Modal, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent, editContent } from '@/action/user-api';
import { IDetailContentResponse } from '@/action/interfaces';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { reset } from '@/lib/uploadSlice';
import { useRouter } from 'next/navigation';
import FinalModal from '../final-modal';
import { UseCreateContentReturn } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import DraggerUpload, { AccountType } from '@/components/ui/uploader/uploader';

interface NewGraduation1FormProps extends Partial<UseCreateContentReturn> {
  editData?: IDetailContentResponse;
}
const NewGraduation1Form = ({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
  editData,
}: NewGraduation1FormProps) => {
  const profile = useMemoifyProfile();

  const [form] = useForm();
  const router = useRouter();

  const dispatch = useDispatch();
  const images = useWatch('images', form);

  const handleSubmit = async (
    val: any,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);
    const { university, faculty, major, yearOfGraduation, isPublic, images } =
      val;

    const json_text = {
      university,
      faculty,
      major,
      yearOfGraduation,
      images: images,
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
      const userLink = selectedTemplate.route + '/' + res.data;

      // Clear form fields
      form.resetFields();

      // Reset Redux state for collection of images
      dispatch(reset());

      if (status === 'draft') {
        setLoading(false);
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
      message.error(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (editData) {
      const jsonContent = JSON.parse(editData.detail_content_json_text);

      form.setFieldsValue({
        ...jsonContent,
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
        <Form.Item
          rules={[{ required: true, message: 'Please input unversity!' }]}
          name={'university'}
          label="University (e.g: Universitas Indonesia)">
          <Input size="large" placeholder="Write your university here" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: 'Please input faculty!' }]}
          name={'faculty'}
          label="Faculty (e.g: Faculty of Computer and Science)">
          <Input size="large" placeholder="Write your faculty here" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: 'Please input major!' }]}
          name={'major'}
          label="Major (e.g: Information Technology)">
          <Input size="large" placeholder="Write your major here" />
        </Form.Item>
        <Form.Item
          rules={[
            { required: true, message: 'Please input year of graduation!' },
          ]}
          name={'yearOfGraduation'}
          label="Year of Graduation (e.g: 2024)">
          <Input
            size="large"
            placeholder="Write your year of graduation here"
          />
        </Form.Item>
        <Form.Item
          name={'images'}
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">
                Collection of images
              </h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Account with <span className="font-bold">free</span> plan can
                only add 4 images. To add up to 15 images, upgrade to{' '}
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
            limit={profile?.type === 'free' ? 4 : 20}
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

export default NewGraduation1Form;
