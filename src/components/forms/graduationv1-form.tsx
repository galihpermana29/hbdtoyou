'use client';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Switch,
  Tooltip,
  Upload,
} from 'antd';
import { useEffect, useState } from 'react';
import type { GetProp, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent, editContent } from '@/action/user-api';
import { beforeUpload } from './netflix-form';
import { parsingImageFromJSON } from '@/lib/utils';
import { IDetailContentResponse } from '@/action/interfaces';
import FinalModal from './final-modal';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  removeCollectionOfImages,
  reset,
  setCollectionOfImages,
} from '@/lib/uploadSlice';
import { useRouter } from 'next/navigation';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const GraduationV1Form = ({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
  editData,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  modalState: {
    visible: boolean;
    data: string;
  };
  setModalState: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      data: any;
      type?: any;
    }>
  >;
  selectedTemplate: {
    id: string;
    route: string;
  };
  openNotification: (progress: number, key: any) => void;
  handleCompleteCreation: () => void;
  editData?: IDetailContentResponse;
}) => {
  const [uploadLoading, setUploadLoading] = useState(false);

  const profile = useMemoifyProfile();

  const [form] = useForm();
  const router = useRouter();

  const collectionOfImages = useSelector(
    (state: RootState) => state.uploadSlice.collectionOfImages
  );

  const dispatch = useDispatch();

  const handleSetCollectionImagesURI = (
    payload: { uri: string; uid: string },
    formName: string
  ) => {
    dispatch(setCollectionOfImages([{ ...payload, url: payload.uri }]));
  };

  const handleRemoveCollectionImage = (uid: string) => {
    dispatch(removeCollectionOfImages(uid));
    const images = collectionOfImages.filter((item) => item.uid !== uid);
    form.setFieldValue('images', images?.length > 0 ? images : undefined);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSubmit = async (
    val: any,
    status: 'draft' | 'published' = 'published'
  ) => {
    const { university, faculty, major, yearOfGraduation, isPublic } = val;

    const json_text = {
      university,
      faculty,
      major,
      yearOfGraduation,
      images:
        collectionOfImages.length > 0
          ? collectionOfImages.map((dx) => dx.uri)
          : null,
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
        router.push('/preview?link=' + userLink);
      } else {
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
  };

  useEffect(() => {
    if (editData) {
      const jsonContent = JSON.parse(editData.detail_content_json_text);

      const images = parsingImageFromJSON(
        jsonContent,
        'collection-images',
        'images'
      );

      dispatch(setCollectionOfImages(images));

      form.setFieldsValue({
        ...jsonContent,
        images,
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
          onSubmit={handleSubmit}
          preFormValue={modalState?.data}
        />
      </Modal>
      <Form
        disabled={loading}
        form={form}
        layout="vertical"
        onFinish={(val) => handleSubmit(val)}>
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
          getValueFromEvent={(e) => {
            // return just the fileList (or your custom format if needed)
            if (Array.isArray(e)) return e;
            return e?.fileList;
          }}
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
          <Upload
            accept=".jpg, .jpeg, .png"
            multiple={true}
            maxCount={profile?.type === 'free' ? 5 : 15}
            listType="picture-card"
            onRemove={(file) => handleRemoveCollectionImage(file.uid)}
            fileList={
              editData
                ? collectionOfImages.length > 0
                  ? (collectionOfImages as any)
                  : []
                : undefined
            }
            beforeUpload={async (file) => {
              setUploadLoading(true);
              await beforeUpload(
                file as FileType,
                profile
                  ? ['premium', 'pending'].includes(profile.type as any)
                    ? 'premium'
                    : 'free'
                  : 'free',
                openNotification,
                handleSetCollectionImagesURI,
                'images'
              );
              setUploadLoading(false);
            }}>
            {collectionOfImages.length >= 4 && profile?.type === 'free'
              ? null
              : collectionOfImages.length >= 15 && profile?.type !== 'free'
              ? null
              : uploadButton}
          </Upload>
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
              loading={loading || uploadLoading}
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
            loading={loading || uploadLoading}
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

export default GraduationV1Form;
