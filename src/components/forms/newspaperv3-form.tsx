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
  Modal,
  Row,
  Select,
  Switch,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
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
import { createContent, editContent } from '@/action/user-api';
import { beforeUpload, getBase64, getBase64Multiple } from './netflix-form';
import { v3Songs } from '@/lib/songs';
import { IDetailContentResponse } from '@/action/interfaces';
import { parsingImageFromJSON } from '@/lib/utils';
import FinalModal from './final-modal';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const Newspaperv3Form = ({
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

  const profile = useMemoifyProfile();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form] = useForm();
  const router = useRouter();

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

  const handleSubmit = async (
    val: any,
    status: 'draft' | 'published' = 'published'
  ) => {
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

      date_scheduled: val?.date_scheduled
        ? dayjs(val?.date_scheduled).format('DD/MM/YYYY h:mm A Z')
        : null,
      dest_email: val?.dest_email,
      is_scheduled: val?.is_scheduled,
      status,
    };

    const res = editData
      ? await editContent(payload, editData?.id)
      : await createContent(payload);
    if (res.success) {
      const userLink = selectedTemplate.route + '/' + res.data;
      form.resetFields();
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
      message.error('Something went wrong!');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (editData) {
      const jsonContent = JSON.parse(editData.detail_content_json_text);
      const jumbotronImage = parsingImageFromJSON(jsonContent, 'jumbotron');
      setImageUrl(jsonContent.jumbotronImage);

      form.setFieldsValue({
        ...jsonContent,
        jumbotronImage,
        song: jsonContent?.id,
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

        <div className="flex justify-end gap-2">
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

export default Newspaperv3Form;
