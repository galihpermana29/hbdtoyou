'use client';
import './style.css';
import type { FormInstance, UploadProps } from 'antd';
import { Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import LoadingHandler from '../custom-loading';
import { newUploadImageWithAPI } from '@/lib/upload';
import { RcFile } from 'antd/es/upload';
import { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';

// enum free or profile
export enum AccountType {
  free = 'free',
  premium = 'premium',
}

interface DraggerUploadI {
  profileImageURL?: string | string[];
  formItemName: string | (string | number)[];
  form: FormInstance<any>;
  type: AccountType;
  limit?: number;
  multiple?: boolean;
  openNotification?: OpenNotificationFunction;
  disabled?: boolean;
}

const DraggerUpload = ({
  profileImageURL,
  form,
  formItemName,
  limit = 1,
  multiple = false,
  type = AccountType.free,
  openNotification,
  disabled = false,
}: DraggerUploadI) => {
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleChange: UploadProps['onChange'] = ({
    fileList: newFileList,
    file,
  }) => {
    // if (file.size! > (type === AccountType.free ? 1 : 9) * 1024 * 1024) {
    //   return message.error(
    //     `${
    //       type === AccountType.free ? 1 : 9
    //     }MB is the maximum file size allowed`
    //   );
    // }
    // if (newFileList.length > limit) {
    //   message.error(`You can only upload ${limit} photos at a time!`);
    //   return;
    // }
    // console.log(newFileList, 'filelist?', fileList);
    // setFileList(
    //   fileList?.length > 0 ? [...fileList, ...newFileList] : newFileList
    // );
  };

  const beforeUpload = async (file: RcFile, fileList: RcFile[]) => {
    // only allow upload 5 photos at a time
    // if (fileList.length > 5) {
    //   // Find the index of the current file in the list
    //   const fileIndex = fileList.findIndex((f) => f.uid === file.uid);

    //   // Only process the first 5 files, ignore the rest
    //   if (fileIndex >= 5) {
    //     return false;
    //   }
    // }

    // Validate file type
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }

    // Validate file size based on account type
    const maxSizeMB = type === 'free' ? 1 : 9;
    const fileSizeMB = file.size / 1024 / 1024;

    if (fileSizeMB >= maxSizeMB) {
      const errorMessage =
        type === 'free'
          ? 'Free account can only upload image below 1MB!'
          : 'Maximum image size is 10MB!';
      message.error(errorMessage);
      return false;
    }

    // Proceed with upload if validation passes
    try {
      const formData = new FormData();
      formData.append('file', file);
      setLoadingUpload(true);

      const result = await newUploadImageWithAPI(
        formData,
        openNotification,
        file.uid
      );
      setLoadingUpload(false);

      if (result.success) {
        return result.data?.data;
      } else {
        message.error(result.message || 'Upload failed');
        return false;
      }
    } catch (error) {
      setLoadingUpload(false);
      message.error('Upload failed due to network error');
      return false;
    }
  };

  const uploadButton = (
    <button
      type="button"
      className="flex flex-col justify-center items-center px-[20px] gap-[10px] text-caption-2 text-ny-gray-300">
      <h1>Drop image here or click to upload</h1>
    </button>
  );

  const updateFileList = (profileImageURL: string | string[] | undefined) => {
    // 1. Handle the case where the prop is empty or undefined
    if (!profileImageURL || profileImageURL.length === 0) {
      return [];
    }

    // 2. Check if it's a string (single image for free account)
    if (typeof profileImageURL === 'string') {
      return [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: profileImageURL,
        },
      ];
    }

    // 3. If it's an array, map over it (for premium account)
    if (Array.isArray(profileImageURL)) {
      return profileImageURL.map((url, idx) => ({
        uid: `${idx}-${url}`, // Make UID more unique
        name: `image ${idx}.png`,
        status: 'done',
        url: url,
      }));
    }

    // Fallback for any other case
    return [];
  };

  useEffect(() => {
    setFileList(updateFileList(profileImageURL!));
  }, [profileImageURL]);

  return (
    <div className="flex flex-col items-start">
      <LoadingHandler isLoading={loadingUpload} classname="h-[169px]">
        <Upload
          disabled={disabled}
          maxCount={limit}
          multiple={multiple}
          accept=".jpg, .jpeg, .png"
          onRemove={async (file) => {
            const val = await form.getFieldsValue();
            if (limit === 1) {
              form.setFieldValue(formItemName, null);
            } else {
              const currentValue = Array.isArray(formItemName)
                ? form.getFieldValue(formItemName)
                : val[formItemName as string];

              form.setFieldValue(
                formItemName,
                currentValue?.filter((dx: string) => dx !== file.url) || []
              );
            }
          }}
          className="dragger-upload !bg-white sm:flex sm:flex-col sm:items-center"
          beforeUpload={async (file, fileList) => {
            // Validate limit, if exceed limit, cut the list and accept only limit files
            if (fileList.length > limit) {
              // Find the index of the current file in the list
              const fileIndex = fileList.findIndex((f) => f.uid === file.uid);

              // Only process the first 5 files, ignore the rest
              if (fileIndex >= limit) {
                return false;
              }
            }

            const data = await beforeUpload(file, fileList);
            if (data) {
              if (limit === 1) {
                form.setFieldValue(formItemName, data);
              } else {
                const currentValue = Array.isArray(formItemName)
                  ? form.getFieldValue(formItemName)
                  : form.getFieldValue(formItemName as string);
                form.setFieldValue(
                  formItemName,
                  currentValue ? [...currentValue, data] : [data]
                );
              }
            }
            return false;
          }}
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}>
          {fileList.length === limit ? null : uploadButton}
        </Upload>
      </LoadingHandler>
      <div className="text-caption-2 text-ny-gray-300 text-center mt-[10px] max-w-max">
        Supported: JPEG, JPG, PNG, Max size:
        {type === AccountType.free ? 1 : 10} MB
      </div>
    </div>
  );
};

export default DraggerUpload;
