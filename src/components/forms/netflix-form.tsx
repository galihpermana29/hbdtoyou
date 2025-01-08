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
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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

export const beforeUpload = (
  file: FileType,
  type: 'premium' | 'free' = 'free'
) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  console.log(file.size / 1024 / 1024, '???', type);
  const sizing = type === 'free' ? 1 : 5;
  const isLt2M = file.size / 1024 / 1024 < sizing;
  if (!isLt2M) {
    if (type === 'free') {
      message.error('Free account can only upload image below 1MB!');
    } else {
      message.error('Maximum image size is 5MB!');
    }
  }
  return isJpgOrPng && isLt2M;
};

export const uploadImage = async (base64: string) => {
  const data = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64 }),
  });

  if (data.ok) {
    const dx = await data.json();
    return dx.data;
  } else {
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const profile = useMemoifyProfile();

  const [form] = useForm();
  const handleChangeJumbotron: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64Multiple(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (
      beforeUpload(
        newFileList[0].originFileObj as FileType,
        profile
          ? ['premium', 'pending'].includes(profile.type as any)
            ? 'premium'
            : 'free'
          : 'free'
      )
    ) {
      setFileList(newFileList);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSubmit = async (val: any) => {
    const { jumbotronImage, title, subTitle, modalContent, forName } = val;

    await getBase64(
      jumbotronImage.file.originFileObj as FileType,
      async (url) => {
        try {
          if (fileList.length === 0) {
            return message.error('Please upload at least one image!');
          }

          setLoading(true);
          const jumbotronURL = await uploadImage(url);

          const multipleImagesPromise = fileList.map((file) =>
            getBase64Multiple(file.originFileObj as FileType)
          );

          const multipleImages = await Promise.all(multipleImagesPromise);
          const imagesPromise = multipleImages.map((dx) => {
            return uploadImage(dx);
          });

          try {
            const imagesURL = await Promise.all(imagesPromise);

            const json_text = {
              jumbotronImage: jumbotronURL,
              title,
              subTitle,
              modalContent,
              images: imagesURL,
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
              message.error('Something went wrong!');
            }

            revalidateRandom();
            setLoading(false);
            // fetch('/api/userData', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify(payload),
            // })
            //   .then((res) => {
            //     if (res.ok) {
            //       message.success('Successfully created!');
            //       form.resetFields();
            //       setModalState({
            //         visible: true,
            //         data: id,
            //       });
            //     }
            //   })
            //   .catch((err) => {
            //     console.error(err);
            //     message.error('Something went wrong!');
            //   })
            //   .finally(() => {
            //     revalidateRandom();
            //     setLoading(false);
            //   });
          } catch {
            message.error('Error uploading image');
          }
        } catch {
          message.error('Error uploading image');
        }
      }
    );
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
            beforeUpload={(file) =>
              beforeUpload(
                file,
                profile
                  ? ['premium', 'pending'].includes(profile.type as any)
                    ? 'premium'
                    : 'free'
                  : 'free'
              )
            }
            onChange={handleChangeJumbotron}>
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
          name={'images'}
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">
                Collection of images
              </h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Account with <span className="font-bold">free</span> plan can
                only add 10 images. To add up to 20 images, upgrade to{' '}
                <span className="font-bold">premium</span> plan.
              </p>
            </div>
          }>
          <Upload
            accept=".jpg, .jpeg, .png"
            multiple={true}
            maxCount={profile?.type === 'free' ? 10 : 20}
            listType="picture-card"
            fileList={fileList}
            // beforeUpload={(file) =>
            //   beforeUpload(
            //     file,
            //     profile
            //       ? ['premium', 'pending'].includes(profile.type as any)
            //         ? 'premium'
            //         : 'free'
            //       : 'free'
            //   )
            // }
            onPreview={handlePreview}
            onChange={handleChange}>
            {fileList.length >= 10 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
        </Form.Item>

        {/* <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
            { validator: validateSlug },
          ]}
          name={'forName'}
          label="Name For">
          <Input
            size="large"
            placeholder="galih-permana"
            addonBefore="hbdtoyou.live/"
          />
        </Form.Item> */}
        <div className="flex justify-end ">
          <Button
            className="!bg-black"
            loading={loading}
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
