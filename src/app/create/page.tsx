'use client';
import NavigationBar from '@/components/ui/navbar';
import { Button, Form, Image, Input, message, Modal, Spin, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'antd/es/form/Form';
import Link from 'next/link';
import { revalidateRandom } from '@/lib/revalidate';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = async (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const getBase64Multiple = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('Image must smaller than 1MB!');
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

const CreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [modalState, setModalState] = useState({
    visible: false,
    data: '',
  });
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
    if (beforeUpload(newFileList[0].originFileObj as FileType)) {
      setFileList(newFileList);
    }
  };

  const validateSlug = (x: any, value: any) => {
    // Allows letters, numbers, and hyphens (no spaces or other special characters)
    const regex = /^[a-zA-Z0-9-]+$/;
    if (!value || regex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error('Slug can only contain letters, numbers, and hyphens.')
    );
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

            const id = forName + '-' + uuidv4();
            const payload = {
              jumbotronImage: jumbotronURL,
              title,
              subTitle,
              modalContent,
              forName: id,
              images: imagesURL,
            };

            fetch('/api/userData', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            })
              .then((res) => {
                if (res.ok) {
                  message.success('Successfully created!');
                  form.resetFields();
                  setModalState({
                    visible: true,
                    data: id,
                  });
                }
              })
              .catch((err) => {
                console.error(err);
                message.error('Something went wrong!');
              })
              .finally(() => {
                revalidateRandom();
                setLoading(false);
              });
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
      <NavigationBar />
      <Modal
        onCancel={() =>
          setModalState({
            visible: false,
            data: '',
          })
        }
        title="Successfully created"
        open={modalState.visible}
        footer={null}>
        <div>
          <h1 className="text-[20px] font-bold">
            Your own Netflix clone is ready!
          </h1>
          <p>
            You can share your own version of Netflix with your friends or
            someone you love.
          </p>
          <br />
          <p>
            Support the creator by follow instagram{' '}
            <Link
              href={'https://www.instagram.com/galjhpermana/'}
              target="_blank">
              @galjhpermana
            </Link>{' '}
            or buy me a coffee on saweria
          </p>
          <div className="flex items-center gap-[12px] mt-[12px]">
            <Link href={`/${modalState.data}`} className="cursor-pointer">
              <Button
                size="large"
                type="primary"
                className="!bg-black !text-[14px]">
                Open now
              </Button>
            </Link>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  window.location.origin + '/' + modalState.data
                );
                message.success('Copied!');
              }}
              size="large"
              type="primary"
              className="!bg-black !text-[14px]">
              Copy Link
            </Button>
          </div>
        </div>
      </Modal>

      <Spin
        spinning={loading}
        fullscreen
        indicator={<LoadingOutlined spin />}
      />

      <div className="flex flex-col items-center justify-center min-h-screen py-[30px]">
        <div className="w-full max-w-[90%] md:max-w-[60%] lg:max-w-[50%]">
          <h1 className="text-[35px] font-bold mb-[20px]">
            Fill the form and create yours
          </h1>
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
                beforeUpload={beforeUpload}
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
              rules={[
                { required: true, message: 'Please input modal content!' },
              ]}
              name={'modalContent'}
              label="Modal Content">
              <TextArea
                size="large"
                placeholder="This is how me express love. In the meantime you will understand how my brain works. lorem ipsum"
              />
            </Form.Item>
            <Form.Item
              name={'images'}
              label="Collection of Images (up to 10 photos)">
              <Upload
                accept=".jpg, .jpeg, .png"
                multiple={true}
                maxCount={10}
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
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
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>

            <Form.Item
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
            </Form.Item>
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
      </div>
    </div>
  );
};

export default CreatePage;
