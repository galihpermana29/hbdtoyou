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

interface NewDisneyFormProps extends Partial<UseCreateContentReturn> {
  editData?: IDetailContentResponse;
}

const NewDisneyForm = ({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
  editData,
}: NewDisneyFormProps) => {
  const profile = useMemoifyProfile();
  const isFreeAccount = profile?.quota < 1;
  const router = useRouter();
  const [form] = useForm();
  const dispatch = useDispatch();

  const jumbotronImage = useWatch('jumbotronImage', form);
  const images = useWatch('images', form);

  const handleSubmit = async (
    val: any,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);
    const {
      jumbotronImage,
      images,
      title,
      subTitle,
      modalContent,
      episodes,
      isPublic,
    } = val;

    const json_text = {
      jumbotronImage,
      title,
      subTitle,
      modalContent,
      images: images,
      episodes: episodes,
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
        //window.location.href = `/preview?link=${userLink}`;
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
        jumbotronImage: jsonContent.jumbotronImage,
        images: jsonContent.images,
        title2: editData.title,
        caption: editData.caption,
        episodes: jsonContent.episodes,
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
            type={isFreeAccount ? AccountType.free : AccountType.premium}
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
        <Form.List name="episodes">
          {(fields, { add, remove }) => (
            <>
              <div className="mt-[10px] mb-[5px]">
                <h3 className="text-[15px] font-semibold">Moments Episode</h3>

                <p className="text-[13px] text-gray-600 max-w-[400px]">
                  Upload a moment that you want to share with your partner,
                  image of memorable moment or anything
                </p>
              </div>
              <div className="flex flex-wrap gap-[10px] ">
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <div key={key} className="flex gap-[8px] items-start w-full">
                    <div className="max-w-[200px] w-full">
                      <Form.Item
                        {...restField}
                        className="!my-0 w-full"
                        rules={[
                          {
                            required: true,
                            message: 'Please upload a moment',
                          },
                        ]}
                        name={[name, 'imageUrl']}>
                        <DraggerUpload
                          profileImageURL={form.getFieldValue([
                            'episodes',
                            name,
                            'imageUrl',
                          ])}
                          form={form}
                          formItemName={['episodes', name, 'imageUrl']}
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
                    <div>
                      <Form.Item
                        {...restField}
                        name={[name, 'title']}
                        rules={[
                          {
                            required: true,
                            message: 'Please input the title!',
                          },
                        ]}>
                        <Input placeholder="e.g.,Episode 1: Looking for dosbing" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'desc']}
                        rules={[
                          {
                            required: true,
                            message: 'Please input the desc!',
                          },
                        ]}>
                        <TextArea placeholder="lorem ipsum dolor sit amet" />
                      </Form.Item>
                      <Button
                        danger
                        type="default"
                        onClick={() => {
                          remove(name);
                        }}
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
                      add({
                        imageUrl: '',
                        title: '',
                        desc: '',
                      });
                    } else {
                      message.error('You can only add 2 moments');
                    }
                  } else {
                    if (fields.length <= 15) {
                      add({
                        imageUrl: '',
                        title: '',
                        desc: '',
                      });
                    } else {
                      message.error('Limit reached');
                    }
                  }
                }}
                icon={<PlusOutlined />}
                className="!rounded-[50px] !bg-black !text-white my-[12px] !text-[13px]">
                Add Moment
              </Button>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Account with <span className="font-bold">free</span> plan can
                only add 2 moment of episode. To add up to 16 moment of episode,
                upgrade to <span className="font-bold">premium</span> plan.
              </p>
            </>
          )}
        </Form.List>

        <Form.Item
          className="!mt-2"
          rules={[{ required: true, message: 'Please input modal content!' }]}
          name={'modalContent'}
          label="Modal Content">
          <TextArea
            size="large"
            placeholder="This is how me express love. In the meantime you will understand how my brain works. lorem ipsum"
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
                only add 5 images. To add up to 15 images, upgrade to{' '}
                <span className="font-bold">premium</span> plan.
              </p>
            </div>
          }>
          <DraggerUpload
            profileImageURL={images}
            form={form}
            formItemName={'images'}
            type={isFreeAccount ? AccountType.free : AccountType.premium}
            multiple={true}
            limit={isFreeAccount ? 5 : 20}
            openNotification={openNotification}
          />
        </Form.Item>
        <div className="flex justify-end gap-2">
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

export default NewDisneyForm;
