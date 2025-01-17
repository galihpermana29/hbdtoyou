import axios from 'axios';

export async function uploadImageClientSide(
  file: File,
  type: 'free' | 'premium'
) {
  const timestamp = Math.floor(Date.now() / 1000);
  const uploadPreset = type === 'free' ? 'free_preset' : 'premium_preset';

  // Get a signature from the server
  const { data } = await axios.post('/api/generateSignature', {
    paramsToSign: {
      timestamp,
      // upload_preset: uploadPreset,
    },
  });

  const formData = new FormData();
  formData.append('file', file);
  // formData.append('upload_preset', uploadPreset);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', data.signature);
  formData.append('api_key', '886125678413288'); // Public API key is safe to expose

  // Add transformation options to formData
  if (type === 'free') {
    formData.append('aspect_ratio', '1.5');
    formData.append('width', '500');
    formData.append('crop', 'crop');
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dxuumohme/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const result = await response.json();
  return {
    message: 'success',
    data: result.secure_url,
    success: true,
  };
}
