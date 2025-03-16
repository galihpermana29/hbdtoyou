// import axios from 'axios';

// export async function uploadImageClientSide(
//   file: File,
//   type: 'free' | 'premium'
// ) {
//   const timestamp = Math.floor(Date.now() / 1000);
//   const uploadPreset = type === 'free' ? 'free_preset' : 'premium_preset';

//   // Get a signature from the server
//   const { data } = await axios.post('/api/generateSignature', {
//     paramsToSign: {
//       timestamp,
//       // upload_preset: uploadPreset,
//     },
//   });

//   const formData = new FormData();
//   formData.append('file', file);
//   // formData.append('upload_preset', uploadPreset);
//   formData.append('timestamp', timestamp.toString());
//   formData.append('signature', data.signature);
//   formData.append('api_key', '221841315742512'); // Public API key is safe to expose

//   // Add transformation options to formData
//   if (type === 'free') {
//     formData.append('aspect_ratio', '1.5');
//     formData.append('width', '500');
//     formData.append('crop', 'crop');
//   }

//   const response = await fetch(
//     `https://api.cloudinary.com/v1_1/ddlus5qur/image/upload`,
//     {
//       method: 'POST',
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     throw new Error('Failed to upload image');
//   }

//   const result = await response.json();
//   return {
//     message: 'success',
//     data: result.secure_url,
//     success: true,
//   };
// }

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
