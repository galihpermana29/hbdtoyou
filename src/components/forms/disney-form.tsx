'use client';
import { Button, Form, Image, Input, message, Switch, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent } from '@/action/user-api';
import { beforeUpload, getBase64, getBase64Multiple } from './netflix-form';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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

  const handleSetStoryImageURI = (
    payload: { uri: string; uid: string },
    formName: string,
    fieldIndex?: number
  ) => {
    const currentValues = form.getFieldValue(formName) || [];
    currentValues[fieldIndex!] = {
      ...currentValues[fieldIndex!],
      imageUrl: payload.uri,
    };
    form.setFieldsValue({ [formName]: currentValues });
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
    const {
      jumbotronImage,
      title,
      subTitle,
      modalContent,
      episodes,
      isPublic,
    } = val;

    const json_text = {
      jumbotronImage: jumbotronImage?.uri,
      title,
      subTitle,
      modalContent,
      images:
        collectionOfImages.length > 0
          ? collectionOfImages.map((dx) => dx.uri)
          : null,
      episodes: episodes,
      isPublic,
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
      message.error(res.message);
    }
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
              setUploadLoading(true);
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
                          beforeUpload={async (file) => {
                            setUploadLoading(true);
                            await beforeUpload(
                              file,
                              profile
                                ? ['premium', 'pending'].includes(
                                    profile.type as any
                                  )
                                  ? 'premium'
                                  : 'free'
                                : 'free',
                              handleSetStoryImageURI,
                              'episodes',
                              index
                            );
                            setUploadLoading(false);
                          }}>
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
            {collectionOfImages.length >= 5 && profile?.type === 'free'
              ? null
              : collectionOfImages.length >= 15 && profile?.type !== 'free'
              ? null
              : uploadButton}
          </Upload>

          {/* <Upload
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
          )} */}
        </Form.Item>

        <Form.Item
          name={'isPublic'}
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">
                Show on Inspiration Page
              </h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                By default your website will be shown on the Inspiration page.
                You can change this option to hide it.
              </p>
            </div>
          }
          initialValue={true}>
          <Switch />
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

export default DisneyForm;
