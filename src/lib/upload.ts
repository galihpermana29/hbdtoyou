import axios, { AxiosProgressEvent } from 'axios';
const API_URI =
  process.env.NEXT_PUBLIC_APP_ENV === 'staging'
    ? process.env.NEXT_PUBLIC_STAGING_API
    : process.env.NEXT_PUBLIC_API_URI;

export async function uploadImageClientSide(
  file: File,
  type: 'free' | 'premium',
  openNotification?: (percentage: number, key: any) => void,
  key?: any
): Promise<{ message: string; data: string; success: boolean }> {
  return new Promise(async (resolve, reject) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const uploadPreset = type === 'free' ? 'free_preset' : 'premium_preset';

    try {
      // Get a signature from the server
      const { data } = await axios.post('/api/generateSignature', {
        paramsToSign: { timestamp },
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', data.signature);
      formData.append('api_key', '221841315742512'); // Public API key is safe to expose

      // Add transformation options
      if (type === 'free') {
        formData.append('aspect_ratio', '1.5');
        formData.append('width', '500');
        formData.append('crop', 'crop');
      }

      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/ddlus5qur/image/upload`,
        true
      );

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          openNotification(percentComplete, key);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            message: 'success',
            data: response.secure_url,
            success: true,
          });
        } else {
          reject(new Error('Failed to upload image'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));

      xhr.send(formData);
    } catch (error) {
      reject(error);
    }
  });
}

export async function uploadImageWithApi(
  formData: FormData,
  openNotification: (progress: number, key: any, isError?: boolean) => void,
  key: any
) {
  // using axios
  try {
    const response = await axios.post(`${API_URI}/uploads`, formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        openNotification(percentCompleted, key);
      },
    });
    return {
      message: 'success',
      data: response.data,
      success: true,
    };
  } catch (error) {
    openNotification(0, key, true);
    return {
      message: 'Failed to upload image',
      success: false,
    };
  }
}

export async function uploadMultipleImageWithApi(
  formData: FormData,
  openNotification?: (progress: number, key: any) => void,
  key?: any
) {
  // using axios
  try {
    const response = await axios.post(
      `${API_URI?.replace('v1', 'v2')}/uploads`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          openNotification?.(percentCompleted, key);
        },
      }
    );
    return {
      message: 'success',
      data: response.data,
      success: true,
    };
  } catch (error) {
    return {
      message: 'Failed to upload image',
      success: false,
    };
  }
}

/**
 * Uploads an image file to the API server with progress tracking and error handling.
 *
 * @param formData - FormData object containing the file to upload. Should include the file under the 'file' key.
 * @param openNotification - Optional callback function to handle upload progress notifications.
 *   - progress: Upload progress percentage (0-100)
 *   - key: Unique identifier for the upload operation
 *   - isError: Boolean flag indicating if the notification is for an error (defaults to false)
 * @param key - Optional unique identifier for the upload operation, passed to the notification callback
 *
 * @returns Promise resolving to an object with:
 *   - message: Status message ('success' or error description)
 *   - data: Response data from the server (on success)
 *   - success: Boolean indicating if the upload was successful
 *
 * @example
 * ```typescript
 * const formData = new FormData();
 * formData.append('file', selectedFile);
 *
 * const result = await newUploadImageWithAPI(
 *   formData,
 *   (progress, key, isError) => {
 *     if (isError) {
 *       console.error('Upload failed');
 *     } else {
 *       console.log(`Upload progress: ${progress}%`);
 *     }
 *   },
 *   'upload-123'
 * );
 *
 * if (result.success) {
 *   console.log('Upload successful:', result.data);
 * }
 * ```
 */
export async function newUploadImageWithAPI(
  formData: FormData,
  openNotification?: (progress: number, key: any, isError?: boolean) => void,
  key?: any
) {
  // using axios
  try {
    const response = await axios.post(`${API_URI}/uploads`, formData, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );
        openNotification?.(percentCompleted, key);
      },
    });
    return {
      message: 'success',
      data: response.data,
      success: true,
    };
  } catch (error) {
    openNotification?.(0, key, true);
    return {
      message: 'Failed to upload image',
      success: false,
    };
  }
}
