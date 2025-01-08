'use client';
import {
  Badge,
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Row,
  Select,
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

const Newspaperv3Form = ({
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

  const selectedSongs = useWatch('song', form);

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
        const currentValues = form.getFieldValue('stories') || [];
        currentValues[fieldIndex] = {
          ...currentValues[fieldIndex],
          imageUrl: reader.result as string,
        };
        form.setFieldsValue({ stories: currentValues });
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
    if (beforeUpload(newFileList[0].originFileObj as FileType)) {
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
    const { jumbotronImage, desc1, notableLyrics } = val;
    await getBase64(
      jumbotronImage.file.originFileObj as FileType,
      async (url) => {
        try {
          setLoading(true);
          const jumbotronURL = await uploadImage(url);

          try {
            const json_text = {
              jumbotronImage: jumbotronURL,
              desc1,
              notableLyrics,
              id: selectedSongs ?? '0W5o1Kxw1VlohSajPqeBMF',
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
            placeholder="If you're not putting any content, it will be default value to its song lyrics"
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
  );
};

export default Newspaperv3Form;
