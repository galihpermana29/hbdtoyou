import { v4 as uuidv4 } from 'uuid';
import { uploadImageWithApi } from '@/lib/upload';
import { createContent } from '@/action/user-api';
import { message } from 'antd';

// Function to upload canvas as a file and get URL
export const uploadCanvasImage = async (
  canvas: HTMLCanvasElement
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            // Create file from blob
            const file = new File([blob], `scrapbook-${Date.now()}.jpg`, {
              type: 'image/jpeg',
            });

            // Create FormData and append file
            const formData = new FormData();
            formData.append('file', file);
            const key = uuidv4();

            // Upload image
            const result = await uploadImageWithApi(
              formData,
              (progress, key) => {
                // Progress notification could be implemented here
                console.log(`Upload progress: ${progress}%`);
              },
              key
            );

            if (result.success) {
              resolve(result.data.data);
            } else {
              reject(new Error('Failed to upload image'));
            }
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        'image/jpeg',
        0.9
      );
    } catch (error) {
      reject(error);
    }
  });
};

// Function to upload all canvases and create scrapbook
export const uploadAllCanvasesAndCreateScrapbook = async (
  canvasRefs: {
    coverCanvasRef: React.RefObject<HTMLCanvasElement>;
    pageOneCanvasRef: React.RefObject<HTMLCanvasElement>;
    pageTwoCanvasRef: React.RefObject<HTMLCanvasElement>;
    pageThreeCanvasRef: React.RefObject<HTMLCanvasElement>;
    pageFourCanvasRef: React.RefObject<HTMLCanvasElement>;
  },
  templateId: string,
  router: any,
  setIsUploading: (isUploading: boolean) => void,
  templateType: string = 'scrapbookv1'
) => {
  try {
    setIsUploading(true);
    message.loading('Uploading images...', 0);

    const uploadedImages: string[] = [];
    const { coverCanvasRef, pageOneCanvasRef, pageTwoCanvasRef, pageThreeCanvasRef, pageFourCanvasRef } = canvasRefs;

    // Upload cover
    if (coverCanvasRef.current) {
      const coverUrl = await uploadCanvasImage(coverCanvasRef.current);
      uploadedImages.push(coverUrl);
    }

    // Upload page 1
    if (pageOneCanvasRef.current) {
      const page1Url = await uploadCanvasImage(pageOneCanvasRef.current);
      uploadedImages.push(page1Url);
    }

    // Upload page 2
    if (pageTwoCanvasRef.current) {
      const page2Url = await uploadCanvasImage(pageTwoCanvasRef.current);
      uploadedImages.push(page2Url);
    }

    // Upload page 3
    if (pageThreeCanvasRef.current) {
      const page3Url = await uploadCanvasImage(pageThreeCanvasRef.current);
      uploadedImages.push(page3Url);
    }

    // Upload page 4
    if (pageFourCanvasRef.current) {
      const page4Url = await uploadCanvasImage(pageFourCanvasRef.current);
      uploadedImages.push(page4Url);
    }

    message.destroy();

    if (uploadedImages.length === 0) {
      message.error('No images to upload');
      setIsUploading(false);
      return;
    }

    // Extract cover, pages, and back cover
    const coverImage = uploadedImages[0];
    const contentPages = uploadedImages.slice(1, -1);
    const backCoverImage = uploadedImages[uploadedImages.length - 1];

    // Create JSON for payload
    const json_text = {
      coverImage,
      pages: contentPages,
      backCoverImage,
    };

    // Submit the content
    await handleSubmit({
      detail_content_json_text: JSON.stringify(json_text),
    }, templateId, router, templateType);

    setIsUploading(false);
  } catch (error) {
    console.error('Error uploading images:', error);
    message.error('Failed to upload images. Please try again.');
    setIsUploading(false);
  }
};

// Function to handle form submission
export const handleSubmit = async (
  val: any,
  templateId: string,
  router: any,
  templateType: string = 'scrapbookv1',
  status: 'draft' | 'published' = 'published'
) => {
  const payload = {
    template_id: templateId,
    detail_content_json_text: val.detail_content_json_text,
    title: `${templateType === 'scrapbookvintage' ? 'Vintage ' : ''}Scrapbook by Memoify`,
    caption: `Create your ${templateType === 'scrapbookvintage' ? 'vintage ' : ''}scrapbook with Memoify`,
    date_scheduled: null,
    dest_email: null,
    is_scheduled: false,
    status,
  };

  const res = await createContent(payload);
  if (res.success) {
    router.push(`/${templateType}/${res.data}`);
    message.success('Successfully created!');
  } else {
    message.error(res.message);
  }
};
