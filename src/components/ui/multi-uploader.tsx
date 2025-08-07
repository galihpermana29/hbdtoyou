// components/MultiImageUploader.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Upload, Button, message, Typography, Form } from 'antd';
import type { FormInstance, UploadFile, UploadProps } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadMultipleImageWithApi } from '@/lib/upload';

// --- This is a placeholder for your actual API call function ---
// This function must accept FormData and return an array of the uploaded URLs.
const uploadMultipleImagesAPI = async (
  formData: FormData
  // You can pass other arguments like `openNotification` if needed
): Promise<string[]> => {
  // Replace this with your actual API endpoint and logic
  console.log('Uploading files to the server...', formData);
  const response = await uploadMultipleImageWithApi(formData);
  if (!response.success) {
    throw new Error('Batch upload failed on the server.');
  }

  // Assuming your API returns a JSON object like: { urls: ["url1.jpg", "url2.jpg"] }
  const result = response.data;
  return result;
};
// --------------------------------------------------------------------

// Define the props for our reusable component
interface MultiImageUploaderProps {
  value?: UploadFile[]; // Provided by antd Form for existing files
  onChange?: (fileList: UploadFile[]) => void; // Provided by antd Form to update its state
  maxCount: number;
  form: FormInstance<any>;
  formName: string;
}

export const MultiImageUploader = ({
  value = [],
  onChange,
  maxCount,
  form,
  formName,
}: MultiImageUploaderProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>(
    form.getFieldValue(formName) || []
  );
  const [uploading, setUploading] = useState(false);
  console.log(fileList, '>filelist');
  // Sync internal state when the form's value changes (e.g., loading edit data)
  // useEffect(() => {
  //   // We check if the value is different to avoid unnecessary re-renders
  //   if (JSON.stringify(value) !== JSON.stringify(fileList)) {
  //     console.log('apaaa');
  //     setFileList(value || []);
  //   }
  // }, [value]);

  const handleLocalChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // Important: We only call the parent form's onChange when the upload is successful,
    // not during local file selection.
  };

  const handleUploadBatch = async () => {
    // 1. Filter for only new files that need uploading (they have `originFileObj`)
    console.log(fileList);
    // const filesToUpload = fileList.filter(
    //   (file) => file.originFileObj && !file.url
    // );

    // if (filesToUpload.length === 0) {
    //   message.info('No new images to upload.');
    //   return;
    // }

    const filesToUpload = fileList;
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append('files', file as any);
    });

    setUploading(true);

    try {
      // 2. Call your batch upload API function
      const newUrls = await uploadMultipleImagesAPI(formData);

      const urlMap = new Map<string, string>();
      filesToUpload.forEach((file, index) => {
        // Use UID for mapping as filenames may not be unique
        if (file.uid) {
          urlMap.set(file.uid, newUrls[index]);
        }
      });

      // 3. Create the final, updated list of all files
      const updatedFileList = fileList.map((file) => {
        if (urlMap.has(file.uid)) {
          return {
            ...file,
            url: urlMap.get(file.uid), // Add the URL from the server
            status: 'done' as 'done', // Mark as complete
            originFileObj: undefined, // Remove the raw file object
          };
        }
        return file;
      });

      setFileList(updatedFileList);
      // 4. Notify the parent antd Form with the complete list of uploaded files
      if (onChange) {
        onChange(updatedFileList);
      }

      message.success(
        `${filesToUpload.length} new image(s) uploaded successfully.`
      );
    } catch (error) {
      console.error(error);
      message.error('Upload failed. Please try again.');
      // Optionally reset status of failed files
      const failedList = fileList.map((f) =>
        filesToUpload.some((t) => t.uid === f.uid)
          ? { ...f, status: 'error' as 'error' }
          : f
      );
      setFileList(failedList);
    } finally {
      setUploading(false);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Select Images</div>
    </button>
  );

  // Check if there are any files that have been selected but not yet uploaded
  const hasPendingFiles = fileList.some((f) => f.originFileObj && !f.url);

  return (
    <>
      <Form.Item
        getValueFromEvent={(e) => {
          // return just the fileList (or your custom format if needed)
          if (Array.isArray(e)) return e;
          return e?.fileList;
        }}
        rules={[{ required: true, message: 'Please upload atleast 1 content' }]}
        name={'images'}
        label={
          <div className="mt-[10px] mb-[5px]">
            <h3 className="text-[15px] font-semibold">Collection of images</h3>

            <p className="text-[13px] text-gray-600 max-w-[400px]">
              Account with <span className="font-bold">free</span> plan can only
              add 5 images. To add up to 20 images, upgrade to{' '}
              <span className="font-bold">premium</span> plan.
            </p>
          </div>
        }>
        <Upload
          accept=".jpg, .jpeg, .png"
          multiple
          listType="picture-card"
          // fileList={fileList}
          maxCount={maxCount}
          // onChange={handleLocalChange}
          // We return false to prevent antd's default upload action, handling it ourselves.
          beforeUpload={(file, fileList) => {
            handleLocalChange({ fileList: fileList });
            return false;
          }}>
          {fileList.length >= maxCount ? null : uploadButton}
        </Upload>
      </Form.Item>
      <Button
        icon={<UploadOutlined />}
        onClick={handleUploadBatch}
        loading={uploading}
        // disabled={!hasPendingFiles} // Button is disabled if no new files are selected
        style={{ marginTop: 16 }}>
        Upload New Images
      </Button>

      {/* {hasPendingFiles && (
        <Typography.Text
          type="secondary"
          style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          You have un-saved images. Click "Upload New Images" to save them.
        </Typography.Text>
      )} */}
    </>
  );
};
