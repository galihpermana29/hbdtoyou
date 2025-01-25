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
import { createContent } from '@/action/user-api';
import { beforeUpload, getBase64, getBase64Multiple } from './netflix-form';
import { v3Songs } from '@/lib/songs';
import { fetchSearch, OptionSpotifyTrack } from './spotify-form';
import { useDebounce } from 'use-debounce';
import Typewriter from '../fancy/typewriter';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const MagazineV1Form = ({
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
    const { jumbotronImage, desc, notableLyrics } = val;

    const json_text = {
      momentOfYou:
        collectionOfImages.length > 0
          ? collectionOfImages.map((dx) => dx.uri)
          : null,
      desc,
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

    setLoading(false);
  };

  useEffect(() => {
    if (value && value !== '') {
      fetchSearch(value, setSearchedOptions);
    }
  }, [value]);
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

export default MagazineV1Form;
