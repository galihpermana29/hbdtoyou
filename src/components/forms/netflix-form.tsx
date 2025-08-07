'use client';
import { Button, Form, Input, message, Modal, Tooltip, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { GetProp, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'antd/es/form/Form';
import { createContent, editContent } from '@/action/user-api';
import { uploadImageClientSide, uploadImageWithApi } from '@/lib/upload';
import { useRouter } from 'next/navigation';
import { IDetailContentResponse } from '@/action/interfaces';
import { parsingImageFromJSON } from '@/lib/utils';
import FinalModal from './final-modal';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  removeCollectionOfImages,
  reset,
  setCollectionOfImages,
} from '@/lib/uploadSlice';
import { useMemoifyProfile } from '@/app/session-provider';
export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const validateSlug = (x: any, value: any) => {
  // Allows letters, numbers, and hyphens (no spaces or other special characters)
  const regex = /^[a-zA-Z0-9-]+$/;
  if (!value || regex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(
    new Error('Slug can only contain letters, numbers, and hyphens.')
  );
};

export const getBase64 = async (
  img: FileType,
  callback: (url: string) => void
) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const getBase64Multiple = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const beforeUpload = async (
  file: FileType,
  type: 'premium' | 'free' = 'free',
  openNotification: (progress: number, key: any) => void,
  setFormValues?: (
    { uri, uid }: { uri: string; uid: string },
    formName: string,
    index?: number
  ) => void,
  formName?: string,
  index?: number
) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const sizing = type === 'free' ? 1 : 10;
  const isLt2M = file.size / 1024 / 1024 < sizing;
  if (!isLt2M) {
    if (type === 'free') {
      message.error('Free account can only upload image below 1MB!');
    } else {
      message.error('Maximum image size is 10MB!');
    }
  } else {
    const reader = new FileReader();
    reader.onload = async () => {
      const formData = new FormData();
      formData.append('file', file);
      const key = uuidv4();

      const dx = await uploadImageWithApi(formData, openNotification, key);

      if (setFormValues) {
        {
          setFormValues(
            {
              uri: dx.data.data,
              uid: file.uid,
            },
            formName!,
            index
          );
        }
      }

      message.success('Image uploaded!');
    };
    reader.readAsDataURL(file as FileType);
  }

  return isJpgOrPng && isLt2M;
};

export const uploadImage = async (
  base64: File,
  type: 'free' | 'premium',
  openNotification: (progress: number, key: any) => void
) => {
  const key = uuidv4();

  const data = await uploadImageClientSide(base64, type, openNotification, key);
  if (data.success) {
    return data.data;
  } else {
    message.error(data.message);
    throw new Error('Error');
  }
};

const NetflixForm = ({
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
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploadLoading, setUploadLoading] = useState(false);

  const collectionOfImages = useSelector(
    (state: RootState) => state.uploadSlice.collectionOfImages
  );

  const dispatch = useDispatch();

  const profile = useMemoifyProfile();

  const [form] = useForm();

  const router = useRouter();

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

  const handleSetJumbotronImageURI = (
    payload: { uri: string; uid: string },
    formName: string
  ) => {
    form.setFieldValue(formName, payload);
    setImageUrl(payload.uri);
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
    const { jumbotronImage, title, subTitle, modalContent, isPublic } = val;

    const json_text = {
      jumbotronImage: jumbotronImage?.uri,
      title,
      subTitle,
      modalContent,
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
        // window.open(userLink as string, '_blank');
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
      message.error(`Something went wrong!, ${res.message}`);
    }

    return;
  };

  useEffect(() => {
    if (editData) {
      const jsonContent = JSON.parse(editData.detail_content_json_text);

      const jumbotronImage = parsingImageFromJSON(jsonContent, 'jumbotron');
      const images = parsingImageFromJSON(
        jsonContent,
        'collection-images',
        'images'
      );

      setImageUrl(jsonContent.jumbotronImage);
      dispatch(setCollectionOfImages(images));

      form.setFieldsValue({
        ...jsonContent,
        jumbotronImage,
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
      <Button
        className="!bg-black !rounded-full mb-[20px]"
        type="primary"
        onClick={() => {
          router.replace('/netflixv1?isTutorial=true');
        }}
        size="large">
        See tutorial
      </Button>
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
          <Upload
            accept=".jpg, .jpeg, .png"
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={async (file) => {
              setUploadLoading(true);
              await beforeUpload(
                file,
                profile
                  ? ['premium', 'pending'].includes(profile.type as any)
                    ? 'premium'
                    : 'free'
                  : 'free',
                openNotification,
                handleSetJumbotronImageURI,
                'jumbotronImage'
              );
              setUploadLoading(false);
            }}>
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
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
          getValueFromEvent={(e) => {
            // return just the fileList (or your custom format if needed)
            if (Array.isArray(e)) return e;
            return e?.fileList;
          }}
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
          <Upload
            accept=".jpg, .jpeg, .png"
            multiple={true}
            maxCount={profile?.type === 'free' ? 5 : 20}
            listType="picture-card"
            fileList={
              collectionOfImages.length > 0 ? (collectionOfImages as any) : []
            }
            onRemove={(file) => handleRemoveCollectionImage(file.uid)}
            beforeUpload={async (file, fileList) => {
              const isBatchTooLarge = fileList.length > 5;
              if (isBatchTooLarge) {
                // Find the index of the current file in the list
                const fileIndex = fileList.findIndex((f) => f.uid === file.uid);
                // Only show the message once for the first file in a large batch
                if (fileIndex === 0) {
                  message.error(
                    'You can only upload a maximum of 5 files at a time.'
                  );
                }
                // Prevent upload for all files in a batch larger than 5
                return Upload.LIST_IGNORE;
              }
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
            {collectionOfImages.length >= 10 && profile?.type === 'free'
              ? null
              : collectionOfImages.length >= 20 && profile?.type !== 'free'
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

export default NetflixForm;
