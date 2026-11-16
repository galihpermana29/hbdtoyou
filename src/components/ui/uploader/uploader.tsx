'use client';
import './style.css';
import type { FormInstance, UploadProps } from 'antd';
import { Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import LoadingHandler from '../custom-loading';
import { newUploadImageWithAPI } from '@/lib/upload';
import { RcFile } from 'antd/es/upload';
import { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import { PLAN_LIMITS } from '@/lib/plan-limits';
import Link from 'next/link';

// enum free or profile
export enum AccountType {
  free = 'free',
  premium = 'premium',
}

interface DraggerUploadI {
  profileImageURL?: string | string[];
  // Injected by the wrapping Form.Item, so it always holds the live field value
  // even when the parent has not re-rendered since the upload finished.
  value?: string | string[];
  formItemName: string | (string | number)[];
  form: FormInstance<any>;
  type: AccountType;
  limit?: number;
  multiple?: boolean;
  openNotification?: OpenNotificationFunction;
  disabled?: boolean;
  acceptTypes?: string;
  allowedMimeTypes?: string[];
}

const DraggerUpload = ({
  profileImageURL,
  value,
  form,
  formItemName,
  limit = 1,
  multiple = false,
  type = AccountType.free,
  openNotification,
  disabled = false,
  acceptTypes = '.jpg, .jpeg, .png',
  allowedMimeTypes = ['image/jpeg', 'image/png'],
}: DraggerUploadI) => {
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleChange: UploadProps['onChange'] = () => {
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

  const beforeUpload = async (file: RcFile) => {
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
    const isAllowedType = allowedMimeTypes.includes(file.type);
    if (!isAllowedType) {
      message.error(`Unsupported file type. Allowed: ${acceptTypes}`);
      return false;
    }

    // Validate file size against the plan (src/lib/plan-limits.ts).
    const maxSizeMB = PLAN_LIMITS[type].fileMB;
    const fileSizeMB = file.size / 1024 / 1024;

    if (fileSizeMB > maxSizeMB) {
      message.error(
        type === AccountType.free
          ? `The free plan takes photos up to ${maxSizeMB}MB. Premium takes up to ${PLAN_LIMITS.premium.fileMB}MB.`
          : `Photos can be up to ${maxSizeMB}MB.`
      );
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
        message.error(
          'Your internet connection is poor, try upload one by one photo'
        );
        return false;
      }
    } catch {
      setLoadingUpload(false);
      message.error(
        'Your internet connection is poor, try upload one by one photo'
      );
      return false;
    }
  };

  const uploadButton = (
    <button
      type="button"
      className="flex flex-col justify-center items-center px-[20px] gap-[10px] text-caption-2 text-ny-gray-300">
      {/* A span, not a heading: this is the label on a button, and an h1 here
          gave every page carrying an uploader a second top-level heading. */}
      <span>Drop file here or click to upload</span>
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

  const previewSource = value !== undefined ? value : profileImageURL;

  useEffect(() => {
    setFileList(updateFileList(previewSource!));
  }, [previewSource]);

  return (
    <div className="flex flex-col items-start">
      <LoadingHandler isLoading={loadingUpload} classname="h-[169px]">
        <Upload
          disabled={disabled}
          maxCount={limit}
          multiple={multiple}
          accept={acceptTypes}
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
            // The cap counts what is already in the field, not only this
            // pick: five now and five more later was ten on a five-photo
            // plan. A single photo is replaced, never capped.
            if (limit > 1) {
              const current = form.getFieldValue(formItemName);
              const already = Array.isArray(current) ? current.length : 0;
              const room = Math.max(0, limit - already);
              const fileIndex = fileList.findIndex((f) => f.uid === file.uid);
              if (fileIndex >= room) {
                if (fileIndex === room)
                  message.info(
                    type === AccountType.free &&
                      PLAN_LIMITS.premium.galleryPhotos > limit
                      ? `The free plan holds ${limit} photos here. Premium holds ${PLAN_LIMITS.premium.galleryPhotos}.`
                      : `${limit} photos is the most this can hold.`
                  );
                return false;
              }
            }

            const data = await beforeUpload(file);
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
        {limit > 1 ? (
          <>
            <span className="font-semibold text-gray-700">
              {fileList.length} / {limit}
            </span>{' '}
            photos ·{' '}
          </>
        ) : null}
        {acceptTypes.replace(/\./g, '').toUpperCase()}, up to{' '}
        {PLAN_LIMITS[type].fileMB}MB
        {type === AccountType.free ? (
          <>
            {' '}
            ·{' '}
            <Link
              href="/payment?type=premium"
              className="font-semibold !text-[#E34013] underline">
              more with Premium
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DraggerUpload;
