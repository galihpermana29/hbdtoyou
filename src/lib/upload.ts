import axios from 'axios';

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
  openNotification: (progress: number, key: any) => void,
  key: any
) {
  // using axios
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URI}/uploads`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          openNotification(percentCompleted, key);
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

export async function uploadMultipleImageWithApi(
  formData: FormData,
  openNotification?: (progress: number, key: any) => void,
  key?: any
) {
  // using axios
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URI?.replace('v1', 'v2')}/uploads`,
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
