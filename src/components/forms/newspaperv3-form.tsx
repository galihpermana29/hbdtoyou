'use client';
import {
  Badge,
  Button,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  Row,
  Select,
  Switch,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useForm, useWatch } from 'antd/es/form/Form';
import { revalidateRandom } from '@/lib/revalidate';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent } from '@/action/user-api';
import { beforeUpload, getBase64, getBase64Multiple } from './netflix-form';
import { v3Songs } from '@/lib/songs';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const Newspaperv3Form = ({
  loading,
  setLoading,
  modalState,
  setModalState,
  selectedTemplate,
  openNotification,
  handleCompleteCreation,
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
  openNotification: (progress: number, key: any) => void;
  handleCompleteCreation: () => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string>();

  const profile = useMemoifyProfile();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form] = useForm();
  const selectedSongs = useWatch('song', form);

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
    const { jumbotronImage, desc1, notableLyrics, isPublic } = val;

    const json_text = {
      jumbotronImage: jumbotronImage?.uri,
      desc1,
      notableLyrics,
      id: selectedSongs ?? '0W5o1Kxw1VlohSajPqeBMF',
      isPublic,
    };

    const payload = {
      template_id: selectedTemplate.id,
      detail_content_json_text: JSON.stringify(json_text),
      title: val?.title2 ? val?.title2 : '',
      caption: val?.caption ? val?.caption : '',
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
      handleCompleteCreation();
    } else {
      message.error('Something went wrong!');
    }

    setLoading(false);
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
          name={'song'}
          label="Song"
          initialValue={'0W5o1Kxw1VlohSajPqeBMF'}
          rules={[
            {
              required: true,
              message: 'Please select a song!',
            },
          ]}>
          <Select
            onChange={(value) => {
              form.setFieldValue(
                'desc1',
                v3Songs.find((dx) => dx.id === value)?.lyrics
              );

              form.setFieldValue(
                'notableLyrics',
                v3Songs.find((dx) => dx.id === value)?.notableLyrics
              );
            }}
            options={v3Songs.map((dx) => ({
              label: (
                <div className="flex gap-[8px] items-center">
                  <p>{`${dx.singer} - ${dx.title}`} </p>
                  <Badge
                    color={dx.isPremium ? 'red' : 'blue'}
                    count={dx.isPremium ? 'Premium' : 'Free'}
                  />
                </div>
              ),
              value: dx.id,
              disabled: dx.isPremium
                ? profile
                  ? profile.quota > 0
                    ? false
                    : true
                  : false
                : false,
            }))}
            placeholder="Select a song"
            size="large"
          />
        </Form.Item>

        <div className="max-w-[400px] my-[12px]">
          <iframe
            src={`https://open.spotify.com/embed/track/${selectedSongs}`}
            height={80}
            className="w-full"></iframe>
        </div>

        <Form.Item
          initialValue={
            v3Songs.find((dx) => dx.id === '0W5o1Kxw1VlohSajPqeBMF')
              ?.notableLyrics
          }
          rules={[
            {
              required: true,
              message: 'Please input notable lyrics!',
            },
          ]}
          name={'notableLyrics'}
          label="Notable Lyrics">
          <Input
            placeholder="Lyrics or anything you want to say"
            size="large"
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input description',
            },
          ]}
          name={'desc1'}
          label="Desc 1"
          initialValue={null}>
          <TextArea
            className="!h-[500px]"
            size="large"
            placeholder="You can write anything in here"
          />
        </Form.Item>
        <Form.Item
          name={'isPublic'}
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">
                Show on Inspiration Page
              </h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                In free plan your website will be shown on the Inspiration page.
                You can change this option to hide it on premium plan.
              </p>
            </div>
          }
          initialValue={true}>
          <Switch disabled={profile?.type === 'free'} />
        </Form.Item>

        <Divider />
        <Form.Item
          rules={[{ required: true, message: 'Please input title!' }]}
          name={'title2'}
          className="!my-[10px]"
          label="Inspiration title">
          <Input size="large" placeholder="Your inspiration title" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: 'Please input caption!' }]}
          name={'caption'}
          className="!my-[10px]"
          label="Inspiration caption">
          <TextArea size="large" placeholder="Your inspiration caption" />
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

export default Newspaperv3Form;
