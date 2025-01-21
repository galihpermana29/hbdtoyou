'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Space, Select } from 'antd';
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
import { createContent } from '@/action/user-api';
import { revalidateRandom } from '@/lib/revalidate';
import TextArea from 'antd/es/input/TextArea';

export interface OptionSpotifyTrack {
  id: string;
  songName: string;
  artistName: string;
  label: string;
  value: string;
}

const fetchSearch = async (
  query: string,
  callback: (options: any[]) => void
) => {
  const res = await searchSpotifySong(query);
  if (res.success) {
    console.log(res.data, '>?');
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

        {/* <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
            { validator: validateSlug },
          ]}
          name={'forName'}
          label="Name For">
          <Input
            size="large"
            placeholder="galih-permana"
            addonBefore="hbdtoyou.live/"
          />
        </Form.Item> */}

        {/* Submit Button */}
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

export default SpotifyForm;
