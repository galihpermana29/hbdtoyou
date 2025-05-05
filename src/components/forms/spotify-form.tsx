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
  const [form] = Form.useForm();
  const [searchedSong, setSearchedSong] = useState('');
  const [searchedOptions, setSearchedOptions] = useState<OptionSpotifyTrack[]>(
    []
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [collectionOfImages, setCollectionOfImages] = useState<
    { uid: string; uri: string }[]
  >([]);
  const [value] = useDebounce(searchedSong, 1000);

  const profile = useMemoifyProfile();
  const router = useRouter();

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

  const onFinish = async (values: any) => {
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

      const images = parsingImageFromJSON(
        jsonContent,
        'collection-images',
        'momentOfYou'
      );
      console.log(jsonContent, '?', images);
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
        onFinish={onFinish}
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
            maxCount={profile?.type === 'free' ? 5 : 20}
            listType="picture-card"
            onRemove={(file) => handleRemoveCollectionImage(file.uid)}
            fileList={
              collectionOfImages?.length > 0 ? (collectionOfImages as any) : []
            }
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
            {collectionOfImages.length >= 5 && profile?.type === 'free'
              ? null
              : collectionOfImages.length >= 20 && profile?.type !== 'free'
              ? null
              : uploadButton}
          </Upload>
        </Form.Item>
        <p className="text-[13px] text-gray-600 max-w-[400px]">
          Account with <span className="font-bold">free</span> plan can only add
          5 images. To add up to 20 images, upgrade to{' '}
          <span className="font-bold">premium</span> plan.
        </p>
        {/* <Form.List name="momentOfYou">
          {(fields, { add, remove }) => (
            <>
              <div className="mt-[10px] mb-[5px]">
                <h3 className="text-[15px] font-semibold">Moments</h3>

                <p className="text-[13px] text-gray-600 max-w-[400px]">
                  Upload a moment that you want to share with your partner,
                  image of memorable moment or anything
                </p>
              </div>
              <div className="flex flex-wrap gap-[10px] ">
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <div
                    key={key}
                    className="flex flex-col gap-[8px] items-start  w-[200px]">
                    <Form.Item
                      {...restField}
                      className="!my-0  w-full"
                      rules={[
                        {
                          required: true,
                          message: 'Please upload a moment',
                        },
                      ]}
                      name={[name]}>
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
                        {form.getFieldValue('momentOfYou')?.[index]
                          ?.imageUrl ? (
                          <img
                            src={
                              form.getFieldValue('momentOfYou')?.[index]
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

                    <Button
                      danger
                      type="default"
                      onClick={() => remove(name)}
                      icon={<MinusCircleOutlined />}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                size="large"
                type="primary"
                onClick={() => {
                  if (profile?.quota === 0) {
                    if (fields.length <= 4) {
                      add();
                    } else {
                      message.error('You can only add 5 moments');
                    }
                  } else {
                    if (fields.length <= 19) {
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
                only add 5 images. To add up to 20 images, upgrade to{' '}
                <span className="font-bold">premium</span> plan.
              </p>
            </>
          )}
        </Form.List> */}
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

        {/* Submit Button */}
        <div className="flex justify-end ">
          <Button
            className="!bg-black"
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
