'use client';
import { Button, Form, Input, message, Switch, Upload } from 'antd';
import { useState } from 'react';
import type { GetProp, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent } from '@/action/user-api';
import { beforeUpload } from './netflix-form';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const GraduationV1Form = ({
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

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSubmit = async (val: any) => {
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
            {collectionOfImages.length >= 4 && profile?.type === 'free'
              ? null
              : collectionOfImages.length >= 15 && profile?.type !== 'free'
              ? null
              : uploadButton}
          </Upload>
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

export default GraduationV1Form;
