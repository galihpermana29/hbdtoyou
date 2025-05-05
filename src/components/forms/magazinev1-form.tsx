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
import { fetchSearch, OptionSpotifyTrack } from './spotify-form';
import { useDebounce } from 'use-debounce';
import Typewriter from '../fancy/typewriter';
import { IDetailContentResponse } from '@/action/interfaces';
import { parsingImageFromJSON } from '@/lib/utils';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const MagazineV1Form = ({
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
      data: string;
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
  const selectedSongs = useWatch('song', form);

  const [searchedSong, setSearchedSong] = useState('');
  const [searchedOptions, setSearchedOptions] = useState<OptionSpotifyTrack[]>(
    []
  );

  const [value] = useDebounce(searchedSong, 1000);

  const [collectionOfImages, setCollectionOfImages] = useState<
    { uid: string; uri: string }[]
  >([]);

  const handleSetCollectionImagesURI = (
    payload: { uri: string; uid: string },
    formName: string
  ) => {
    const newImages = [...collectionOfImages, { ...payload, url: payload.uri }];

    form.setFieldValue(formName, newImages); // ✅ Set the full array
    setCollectionOfImages(newImages);
  };

  const handleRemoveCollectionImage = (uid: string) => {
    const images = collectionOfImages.filter((item) => item.uid !== uid);
    form.setFieldValue('momentOfYou', images?.length > 0 ? images : undefined);
    setCollectionOfImages(images?.length > 0 ? images : []);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSubmit = async (val: any) => {
    const { desc, isPublic } = val;

    const json_text = {
      momentOfYou:
        collectionOfImages.length > 0
          ? collectionOfImages.map((dx) => dx.uri)
          : null,
      desc,
      id: selectedSongs ?? '0W5o1Kxw1VlohSajPqeBMF',
      isPublic,
    };

    const payload = {
      template_id: selectedTemplate.id,
      detail_content_json_text: JSON.stringify(json_text),
      title: val?.title2 ? val?.title2 : '',
      caption: val?.caption ? val?.caption : '',
    };

    const res = editData
      ? await editContent(payload, editData.id)
      : await createContent(payload);

    if (res.success) {
      const userLink = selectedTemplate.route + '/' + res.data;
      message.success(
        editData ? 'Successfully posted!' : 'Successfully created!'
      );
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

  useEffect(() => {
    if (value && value !== '') {
      fetchSearch(value, setSearchedOptions);
    }
  }, [value]);

  useEffect(() => {
    if (editData) {
      const jsonContent = JSON.parse(editData.detail_content_json_text);

      const jumbotronImage = parsingImageFromJSON(jsonContent, 'jumbotron');
      const images = parsingImageFromJSON(
        jsonContent,
        'collection-images',
        'momentOfYou'
      );

      setImageUrl(jsonContent.jumbotronImage);
      setCollectionOfImages(images);

      form.setFieldsValue({
        ...jsonContent,
        jumbotronImage,
        momentOfYou: images,
        title2: editData.title,
        caption: editData.caption,
      });
    }
  }, [editData]);
  return (
    <div>
      <Form
        disabled={loading}
        form={form}
        layout="vertical"
        onFinish={(val) => handleSubmit(val)}>
        {selectedSongs && (
          <div className="max-w-[400px] my-[12px]">
            <iframe
              src={`https://open.spotify.com/embed/track/${selectedSongs}`}
              height={80}
              className="w-full"></iframe>
          </div>
        )}
        <Form.Item
          name={'song'}
          label="Search a song"
          className=" w-full flex-1 !my-[10px]"
          rules={[{ required: true, message: 'Please input a song name!' }]}>
          <Select
            notFoundContent={null}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            size="large"
            showSearch
            placeholder="Natural - Dmassive"
            onSearch={(value) => setSearchedSong(value)}
            options={
              searchedOptions.length > 0
                ? searchedOptions.map((item: any) => ({
                    label: item.artistName + ' - ' + item.songName,
                    value: item.id,
                  }))
                : []
            }
          />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input description',
            },
          ]}
          name={'desc'}
          label={
            <div className="mt-[10px] mb-[5px]" suppressHydrationWarning>
              <h3 className="text-[15px] font-semibold">A letter or a story</h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                For the animation, please separate a sentence with a dot (.)
              </p>
              <p
                className="whitespace-pre-wrap max-w-[500px]"
                suppressHydrationWarning>
                <Typewriter
                  text={[
                    'All of this photo is our moments.',
                    'I want to say a Happy Birthday to you.',
                    'I never knew that i will always be with you for a long time period of time.',
                    'I wish you all the best in your life.',
                    'Remember that you have me, and you can share anything with me.',
                  ]}
                  speed={70}
                  className="text-black"
                  waitTime={1500}
                  deleteSpeed={60}
                  cursorChar={'_'}
                />
              </p>
            </div>
          }
          initialValue={
            'All of this photo is our moments. I want to say a Happy Birthday to you. I never knew that i will always be with you for a long time period of time. I wish you all the best in your life. Remember that you have me, and you can share anything with me.'
          }>
          <TextArea
            className="!h-[350px]"
            size="large"
            placeholder="You can write anything in here"
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
          name={'momentOfYou'}
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">Moments</h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Upload a moment that you want to share with your partner, image
                of memorable moment or anything
              </p>
            </div>
          }>
          <Upload
            accept=".jpg, .jpeg, .png"
            multiple={true}
            maxCount={profile?.type === 'free' ? 1 : 20}
            listType="picture-card"
            fileList={
              collectionOfImages.length > 0 ? (collectionOfImages as any) : []
            }
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
                openNotification,
                handleSetCollectionImagesURI,
                'momentOfYou'
              );
              setUploadLoading(false);
            }}>
            {collectionOfImages.length >= 1 && profile?.type === 'free'
              ? null
              : collectionOfImages.length >= 20 && profile?.type !== 'free'
              ? null
              : uploadButton}
          </Upload>
        </Form.Item>
        <p className="text-[13px] text-gray-600 max-w-[400px]">
          Account with <span className="font-bold">free</span> plan can only add
          1 images. To add up to 20 images, upgrade to{' '}
          <span className="font-bold">premium</span> plan.
        </p>

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
            {editData ? 'Edit & Publish' : 'Create'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MagazineV1Form;
