'use client';
import { Button, Form, Image, Input, message, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'antd/es/form/Form';
import { revalidateRandom } from '@/lib/revalidate';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent } from '@/action/user-api';
import { uploadImageClientSide } from '@/lib/upload';
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
      if (type === 'free') {
        message.loading('Compressing image, please wait');
      } else {
        message.loading('Uploading image, please wait');
      }

      const jumbotronURL = await uploadImage(file, type);
      if (setFormValues) {
        {
          setFormValues(
            {
              uri: jumbotronURL,
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

    // message.loading(
    //   `${type === 'free' ? 'Compressing Image' : 'Uploading Image'}`
    // );
    // const jumbotronURL = await uploadImage(file, type);
    // console.log(jumbotronURL, '?', setFormValues, '?>>> before upload');
    // if (setFormValues) {
    //   {
    //     setFormValues(
    //       {
    //         uri: jumbotronURL,
    //         uid: file.uid,
    //       },
    //       formName!,
    //       index
    //     );
    //   }
    // }

    // message.success('Image uploaded!');
  }

  return isJpgOrPng && isLt2M;
};

export const uploadImage = async (base64: File, type: 'free' | 'premium') => {
  const data = await uploadImageClientSide(base64, type);
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
      data: string;
    }>
  >;
  selectedTemplate: {
    id: string;
    route: string;
  };
}) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [collectionOfImages, setCollectionOfImages] = useState<
    { uid: string; uri: string }[]
  >([]);

  const profile = useMemoifyProfile();

  const [form] = useForm();

  const handleSetCollectionImagesURI = (
    payload: { uri: string; uid: string },
    formName: string
  ) => {
    const newImages = collectionOfImages;
    newImages.push(payload);
    setCollectionOfImages(newImages);
  };

  const handleRemoveCollectionImage = (uid: string) => {
    setCollectionOfImages(
      collectionOfImages.filter((item) => item.uid !== uid)
    );
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

  const handleSubmit = async (val: any) => {
    const { jumbotronImage, title, subTitle, modalContent } = val;

    const json_text = {
      jumbotronImage: jumbotronImage?.uri,
      title,
      subTitle,
      modalContent,
      images:
        collectionOfImages.length > 0
          ? collectionOfImages.map((dx) => dx.uri)
          : null,
    };

    const payload = {
      template_id: selectedTemplate.id,
      detail_content_json_text: JSON.stringify(json_text),
    };

    const res = await createContent(payload);
    if (res.success) {
      const userLink = selectedTemplate.route + '/' + res.data;
      message.success('Successfully created!');
      form.resetFields();
      setModalState({
        visible: true,
        data: userLink as string,
      });
    } else {
      message.error(`Something went wrong!, ${res.message}`);
    }

    return;
  };

  return (
    <div>
      <Form
        disabled={loading}
        form={form}
        layout="vertical"
        onFinish={(val) => handleSubmit(val)}>
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
            onRemove={(file) => handleRemoveCollectionImage(file.uid)}
            beforeUpload={async (file) => {
              setUploadLoading(true);
              await beforeUpload(
                file as FileType,
                profile
                  ? ['premium', 'pending'].includes(profile.type as any)
                    ? 'premium'
                    : 'free'
                  : 'free',
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

        <div className="flex justify-end ">
          <Button
            className="!bg-black"
            loading={loading || uploadLoading}
            type="primary"
            htmlType="submit"
            size="large">
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NetflixForm;
