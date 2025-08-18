'use client';
import { IDetailContentResponse } from '@/action/interfaces';
import { createContent, editContent } from '@/action/user-api';
import { useMemoifyProfile } from '@/app/session-provider';
import GeneratingLLMLoadingModal from '@/app/(landing)/albumgraduation1/[id]/GeneratingLLMLoadingModal';
import { RootState } from '@/lib/store';
import {
  removeCollectionOfImages,
  reset,
  setCollectionOfImages,
} from '@/lib/uploadSlice';
import { parsingImageFromJSON } from '@/lib/utils';
import { generateGraduationStory } from '@/services/gemini';
import { fetchMovieGenres, Genre } from '@/services/tmdb';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { GetProp, UploadProps } from 'antd';
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Tooltip,
  Upload,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FinalModal from './final-modal';
import { beforeUpload } from './netflix-form';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const AlbumGraduationv1 = ({
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
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showLlmModal, setShowLlmModal] = useState(false);

  const profile = useMemoifyProfile();
  const router = useRouter();
  const [form] = useForm();

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

  const handleSetStoryImageURI = (
    payload: { uri: string; uid: string },
    formName: string,
    fieldIndex?: number
  ) => {
    const currentValues = form.getFieldValue(formName) || [];
    currentValues[fieldIndex!] = {
      ...currentValues[fieldIndex!],
      imageUrl: payload.uri,
    };
    form.setFieldsValue({ [formName]: currentValues });
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
    // Close the FinalModal if it's open
    if (modalState.visible) {
      setModalState({ visible: false, data: '' });
    }

    // Generate graduation story using Gemini
    setShowLlmModal(true);
    const generatedData = await generateGraduationStory({
      name: val.clientName,
      university: val.university,
      graduationDate: val.graduationDate,
      movieGenre: val.movieGenre,
    });
    setShowLlmModal(false);

    // TODO: Read the object from the antd form
    const {
      clientName,
      movieGenre,
      university,
      graduationDate,
      isPublic,
      photographerName,
    } = val;

    const json_text = {
      clientName,
      movieGenre,
      university,
      graduationDate,
      photographerName,
      images:
        collectionOfImages.length > 0
          ? collectionOfImages.map((dx) => dx.uri)
          : null, //leave it
      isPublic, //leave it

      // LLM props
      llm_generated: generatedData,
    };

    const payload = {
      template_id: selectedTemplate.id,
      detail_content_json_text: JSON.stringify(json_text), /// part json
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
      console.log(res.data);
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
      message.error(res.message);
    }
  };

  useEffect(() => {
    if (editData) {
      const jsonContent = JSON.parse(editData.detail_content_json_text);

      const images = parsingImageFromJSON(
        jsonContent,
        'collection-images',
        'images'
      );

      dispatch(setCollectionOfImages(images));

      form.setFieldsValue({
        ...jsonContent,
        graduationDate: dayjs(jsonContent.graduationDate),
        images,
        title2: editData.title,
        caption: editData.caption,
      });
    }
  }, [editData]);

  // Use React Query to fetch movie genres
  const { data: genres = [], isLoading: genreLoading } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: async () => {
      try {
        return await fetchMovieGenres();
      } catch (error) {
        message.error('Failed to load movie genres');
        return [];
      }
    },
  });

  const genreOptions = genres.map((genre: Genre, index: number) => ({
    value: genre.id,
    label: genre.name,
  }));

  return (
    <div>
      {/* LLM Loading Modal */}
      <GeneratingLLMLoadingModal isOpen={showLlmModal} />

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

      {/* TODO - Josua:
      Change the form like the design
      */}
      <Form
        disabled={loading}
        form={form}
        layout="vertical"
      // onFinish={(val) => handleSubmit(val)}
      >
        <Form.Item
          rules={[{ required: true, message: 'Please enter full name client' }]}
          name={'clientName'}
          label="Full Name Client">
          <Input size="large" placeholder="Input full name client" />
        </Form.Item>
        <Form.Item
          rules={[
            { required: true, message: 'Please enter photographer name' },
          ]}
          name={'photographerName'}
          label="Photographer Name">
          <Input size="large" placeholder="Input photographer name" />
        </Form.Item>
        <Form.Item
          name="university"
          label="University Name"
          rules={[{ required: true, message: 'Please enter university' }]}>
          <Input placeholder="Input university name" size="large" />
        </Form.Item>
        <Form.Item
          name="graduationDate"
          label="Graduation Date"
          rules={[
            { required: true, message: 'Please select your graduation date' },
          ]}
          className="w-full">
          <DatePicker
            size="large"
            placeholder="Input graduation date"
            format="DD/MM/YYYY"
            className="w-full"
          />
        </Form.Item>
        {/* LEAVE IT */}
        <Form.Item
          getValueFromEvent={(e) => {
            // return just the fileList (or your custom format if needed)
            if (Array.isArray(e)) return e;
            return e?.fileList;
          }}
          name={'images'}
          label={
            <div className="mt-[10px] mb-[5px]">
              <h3 className="text-[15px] font-semibold">
                Collection of client images
              </h3>

              <p className="text-[13px] text-gray-600 max-w-[400px]">
                Account with <span className="font-bold">free</span> plan can
                only add 5 images. To add up to 15 images, upgrade to{' '}
                <span className="font-bold">premium</span> plan.
              </p>
            </div>
          }>
          <Upload
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess?.('ok', undefined);
              }, 0);
            }}
            accept=".jpg, .jpeg, .png"
            multiple={true}
            maxCount={profile?.type === 'free' ? 5 : 15}
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
              if (fileList.length > 5) {
                // Find the index of the current file in the list
                const fileIndex = fileList.findIndex((f) => f.uid === file.uid);

                // Only process the first 5 files, ignore the rest
                if (fileIndex >= 5) {
                  return Upload.LIST_IGNORE;
                }
              }

              // setUploadLoading(true);
              await beforeUpload(
                file as FileType,
                profile
                  ? ['premium', 'pending'].includes(profile.type as any)
                    ? 'premium'
                    : 'free'
                  : 'free',
                openNotification,
                handleSetCollectionImagesURI,
                'images'
              );
              // setUploadLoading(false);
            }}>
            {collectionOfImages.length >= 5 && profile?.type === 'free'
              ? null
              : collectionOfImages.length >= 15 && profile?.type !== 'free'
                ? null
                : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          name="movieGenre"
          label="Theme Movie"
          rules={[{ required: true, message: 'Please select a theme movie' }]}>
          <Select
            placeholder="Input theme movie"
            getPopupContainer={(trigger) => trigger}
            options={genreOptions}
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
            size="large"
            popupClassName="inspiration-select-dropdown"
            listHeight={256}
            virtual={false}
          />
        </Form.Item>
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

export default AlbumGraduationv1;
