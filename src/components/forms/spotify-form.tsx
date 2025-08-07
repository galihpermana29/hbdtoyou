'use client';

import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Space,
  Select,
  Switch,
  Divider,
  Modal,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { searchSpotifySong } from '@/action/spotify-api';
import { useDebounce } from 'use-debounce';
import {
  beforeUpload,
  FileType,
  uploadImage,
  validateSlug,
} from './netflix-form';
import { useMemoifyProfile } from '@/app/session-provider';
import { createContent, editContent } from '@/action/user-api';
import { revalidateRandom } from '@/lib/revalidate';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import { IDetailContentResponse } from '@/action/interfaces';
import { parsingImageFromJSON } from '@/lib/utils';
import FinalModal from './final-modal';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  removeCollectionOfImages,
  reset,
  setCollectionOfImages,
} from '@/lib/uploadSlice';

export interface OptionSpotifyTrack {
  id: string;
  songName: string;
  artistName: string;
  label: string;
  value: string;
}

export const fetchSearch = async (
  query: string,
  callback: (options: any[]) => void
) => {
  const res = await searchSpotifySong(query);
  if (res.success) {
    const options = res.data.tracks.items.map((item: any) => ({
      id: item.id,
      songName: item.name,
      artistName: item.artists[0].name,
    }));
    callback(options);
  }
};

const SpotifyForm = ({
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
  const [form] = Form.useForm();
  const [searchedSong, setSearchedSong] = useState('');
  const [searchedOptions, setSearchedOptions] = useState<OptionSpotifyTrack[]>(
    []
  );
  const [uploadLoading, setUploadLoading] = useState(false);

  const [value] = useDebounce(searchedSong, 1000);

  const profile = useMemoifyProfile();
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

  const onFinish = async (
    values: any,
    status: 'draft' | 'published' = 'published'
  ) => {
    setLoading(true);
    const json_text = {
      ourSongs: values.ourSongs || [],
      songsForYou: values.songsForYou || [],
      momentOfYou:
        collectionOfImages.length > 0
          ? collectionOfImages.map((dx) => dx.uri)
          : null,
      modalContent: values.modalContent,
      isPublic: values.isPublic,
    };

    const payload = {
      template_id: selectedTemplate.id,
      detail_content_json_text: JSON.stringify(json_text),
      title: values?.title2 ? values?.title2 : '',
      caption: values?.caption ? values?.caption : '',

      date_scheduled: values?.date_scheduled
        ? dayjs(values?.date_scheduled).format('DD/MM/YYYY h:mm A Z')
        : null,
      dest_email: values?.dest_email,
      is_scheduled: values?.is_scheduled,
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

      const images = parsingImageFromJSON(
        jsonContent,
        'collection-images',
        'momentOfYou'
      );
      setCollectionOfImages(images);

      form.setFieldsValue({
        ...jsonContent,
        ourSongs: [],
        songsForYou: [],
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
          onSubmit={onFinish}
          preFormValue={modalState?.data}
        />
      </Modal>
      <Button
        className="!bg-black !rounded-full mb-[20px]"
        type="primary"
        onClick={() => {
          router.replace('/spotifyv1?isTutorial=true');
        }}
        size="large">
        See tutorial
      </Button>
      <Form
        form={form}
        layout="vertical"
        // onFinish={onFinish}
        initialValues={{
          ourSongs: [],
          songsForYou: [],
          momentOfYou: [],
        }}>
        {/* Dynamic Form List for Our Songs */}
        <Form.List name="ourSongs">
          {(fields, { add, remove }) => (
            <>
              <div className="my-[5px]">
                <h3 className="text-[15px] font-semibold">Our Songs</h3>

                <p className="text-[13px] text-gray-600 max-w-[400px]">
                  Our song is representative of your favorite songs with your
                  partner. Search up a song from spotify
                </p>
              </div>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div
                  key={key}
                  className="flex items-center justify-center gap-2 mb-[10px]">
                  <Form.Item
                    className=" w-full flex-1 !my-0"
                    {...restField}
                    name={[name]}
                    rules={[
                      { required: true, message: 'Please input a song name!' },
                    ]}>
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
                      placeholder="Search a song"
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
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Account with <span className="font-bold">free</span> plan can
                only add 3 songs. To add up to 20 songs, upgrade to{' '}
                <span className="font-bold">premium</span> plan.
              </p>
              <Button
                size="large"
                type="primary"
                onClick={() => {
                  if (profile?.quota === 0) {
                    if (fields.length <= 2) {
                      add();
                      setSearchedOptions([]);
                      setSearchedSong('');
                    } else {
                      message.error('You can only add 3 songs');
                    }
                  } else {
                    if (fields.length <= 19) {
                      add();
                      setSearchedOptions([]);
                      setSearchedSong('');
                    } else {
                      message.error('Limit reached!');
                    }
                  }
                }}
                icon={<PlusOutlined />}
                className="!rounded-[50px] !bg-black !text-white my-[12px] !text-[13px]">
                Add Song
              </Button>
            </>
          )}
        </Form.List>

        {/* Dynamic Form List for Songs For You */}
        <Form.List name="songsForYou">
          {(fields, { add, remove }) => (
            <>
              <div className="mb-[5px]">
                <h3 className="text-[15px] font-semibold">Songs For You</h3>

                <p className="text-[13px] text-gray-600 max-w-[400px]">
                  Songs for you is list of songs that you want your partner to
                  listen to
                </p>
              </div>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div
                  key={key}
                  className="flex items-center justify-center gap-2 mb-[10px]">
                  <Form.Item
                    className=" w-full flex-1 !my-0"
                    {...restField}
                    name={[name]}
                    rules={[
                      { required: true, message: 'Please input a song name!' },
                    ]}>
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
                      placeholder="Search a song"
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
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <Button
                size="large"
                type="primary"
                onClick={() => {
                  if (profile?.quota === 0) {
                    if (fields.length <= 2) {
                      add();
                      setSearchedOptions([]);
                      setSearchedSong('');
                    } else {
                      message.error('You can only add 3 songs');
                    }
                  } else {
                    if (fields.length <= 19) {
                      add();
                      setSearchedOptions([]);
                      setSearchedSong('');
                    } else {
                      message.error('Limit reached!');
                    }
                  }
                }}
                icon={<PlusOutlined />}
                className="!rounded-[50px] !bg-black !text-white my-[12px] !text-[13px]">
                Add Song
              </Button>
              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Account with <span className="font-bold">free</span> plan can
                only add 3 songs. To add up to 20 songs, upgrade to{' '}
                <span className="font-bold">premium</span> plan.
              </p>
            </>
          )}
        </Form.List>

        {/* Dynamic Form List for Moment of You */}
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
            onRemove={(file) => handleRemoveCollectionImage(file.uid)}
            fileList={
              editData
                ? collectionOfImages.length > 0
                  ? (collectionOfImages as any)
                  : []
                : undefined
            }
            beforeUpload={async (file, fileList) => {
              // add validation
              if (fileList.length > (profile?.type === 'free' ? 1 : 20)) {
                message.error(
                  `You can only upload ${
                    profile?.type === 'free' ? 1 : 20
                  } images`
                );
                return Upload.LIST_IGNORE;
              }

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

        <Form.Item
          className="!mt-[10px]"
          rules={[{ required: true, message: 'Please input modal content!' }]}
          name={'modalContent'}
          label="Modal Content">
          <TextArea size="large" placeholder="Say something to your partner" />
        </Form.Item>

        <p className="text-[13px] text-gray-600 max-w-[400px]">
          The more photos you add, the creation process will take longer.
        </p>

        <div className="flex justify-end gap-2">
          <Tooltip
            title={
              profile?.type === 'free'
                ? 'To save as draft and see preview, please join premium plan'
                : ''
            }
            placement="top">
            <Button
              disabled={profile?.type === 'free'}
              onClick={() => {
                form
                  .validateFields()
                  .then(() => {
                    onFinish(form.getFieldsValue(), 'draft');
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
          </Tooltip>
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

export default SpotifyForm;
