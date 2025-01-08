'use client';
import { Button, Form, Image, Input, message, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'antd/es/form/Form';
import { revalidateRandom } from '@/lib/revalidate';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent } from '@/action/user-api';
import { beforeUpload, getBase64, getBase64Multiple } from './netflix-form';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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

const DisneyForm = ({
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

  const handleImageUpload = (info: any, fieldIndex: number) => {
    if (info.file.status === 'done' || info.file.originFileObj) {
      const reader = new FileReader();
      reader.onload = () => {
        // Update the form field directly
        const currentValues = form.getFieldValue('episodes') || [];
        currentValues[fieldIndex] = {
          ...currentValues[fieldIndex],
          imageUrl: reader.result as string,
        };
        form.setFieldsValue({ episodes: currentValues });
      };
      reader.readAsDataURL(info.file.originFileObj);
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
    console.log(val, 'values', fileList);
    const { jumbotronImage, title, subTitle, modalContent, episodes } = val;

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

          const multipleEpisodePromises = episodes.map((dx: any) =>
            uploadImage(dx.imageUrl)
          );

          try {
            const imagesURL = await Promise.all(imagesPromise);
            const episodesURL = await Promise.all(multipleEpisodePromises);
            const json_text = {
              jumbotronImage: jumbotronURL,
              title,
              subTitle,
              modalContent,
              images: imagesURL,
              episodes: episodes.map((dx: any, idx: number) => ({
                imageUrl: episodesURL[idx],
                title: dx.title,
                desc: dx.desc,
              })),
            };

            const payload = {
              template_id: selectedTemplate.id,
              detail_content_json_text: JSON.stringify(json_text),
            };

            console.log(payload, 'payload', json_text);
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
                                ? ['premium', 'pending'].includes(
                                    profile.type as any
                                  )
                                  ? 'premium'
                                  : 'free'
                                : 'free'
                            )
                          }
                          onChange={(info) => handleImageUpload(info, index)}>
                          {form.getFieldValue('episodes')?.[index]?.imageUrl ? (
                            <img
                              src={
                                form.getFieldValue('episodes')?.[index]
                                  ?.imageUrl
                              }
                              alt="avatar"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div className="w-full">
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                          )}
                        </Upload>
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
                  if (profile?.quota === 0) {
                    if (fields.length <= 1) {
                      add();
                    } else {
                      message.error('You can only add 2 moments');
                    }
                  } else {
                    if (fields.length <= 15) {
                      add();
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
          <Upload
            accept=".jpg, .jpeg, .png"
            multiple={true}
            maxCount={profile?.type === 'free' ? 5 : 15}
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

export default DisneyForm;
