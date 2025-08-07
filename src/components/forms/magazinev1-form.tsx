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
import { fetchSearch, OptionSpotifyTrack } from './spotify-form';
import { useDebounce } from 'use-debounce';
import Typewriter from '../fancy/typewriter';
import { IDetailContentResponse } from '@/action/interfaces';
import { parsingImageFromJSON } from '@/lib/utils';
import FinalModal from './final-modal';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  removeCollectionOfImages,
  reset,
  setCollectionOfImages,
} from '@/lib/uploadSlice';
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
  const selectedSongs = useWatch('song', form);

  const [searchedSong, setSearchedSong] = useState('');
  const [searchedOptions, setSearchedOptions] = useState<OptionSpotifyTrack[]>(
    []
  );

  const [value] = useDebounce(searchedSong, 1000);

  const router = useRouter();
  const collectionOfImages = useSelector(
    (state: RootState) => state.uploadSlice.collectionOfImages
  );

  const dispatch = useDispatch();

  const handleSetCollectionImagesURI = (
    payload: { uri: string; uid: string },
    formName: string
  ) => {
    dispatch(setCollectionOfImages([{ ...payload, url: payload.uri }]));
  };

  const handleRemoveCollectionImage = (uid: string) => {
    dispatch(removeCollectionOfImages(uid));
    const images = collectionOfImages.filter((item) => item.uid !== uid);
    form.setFieldValue('images', images?.length > 0 ? images : undefined);
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

      date_scheduled: val?.date_scheduled
        ? dayjs(val?.date_scheduled).format('DD/MM/YYYY h:mm A Z')
        : null,
      dest_email: val?.dest_email,
      is_scheduled: val?.is_scheduled,
      status,
    };

    const res = editData
      ? await editContent(payload, editData.id)
      : await createContent(payload);

    if (res.success) {
      const userLink = selectedTemplate.route + '/' + res.data;

      // Clear form fields
      form.resetFields();

      // Reset Redux state for collection of images
      dispatch(reset());

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
      dispatch(setCollectionOfImages(images));

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
      <Modal
        centered={true}
        title="Add-Ons"
        footer={null}
        open={modalState.visible}
        onCancel={() => setModalState({ visible: false, data: '' })}>
        <FinalModal
          loading={loading}
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
            popupClassName="inspiration-select-dropdown"
            listHeight={256}
            virtual={false}
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
              editData
                ? collectionOfImages.length > 0
                  ? (collectionOfImages as any)
                  : []
                : undefined
            }
            onRemove={(file) => handleRemoveCollectionImage(file.uid)}
            beforeUpload={async (file, fileList) => {
              const isBatchTooLarge = fileList.length > 5;
              if (isBatchTooLarge) {
                // Find the index of the current file in the list
                const fileIndex = fileList.findIndex((f) => f.uid === file.uid);
                // Only show the message once for the first file in a large batch
                if (fileIndex === 0) {
                  message.error(
                    'You can only upload a maximum of 5 files at a time.'
                  );
                }
                // Prevent upload for all files in a batch larger than 5
                return Upload.LIST_IGNORE;
              }
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

export default MagazineV1Form;
