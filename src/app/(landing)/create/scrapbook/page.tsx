'use client';
import { useRef, useState } from 'react';
import PageOne from '@/components/ui/scrapbook/PageOne';
import PageFour from '@/components/ui/scrapbook/PageFour';
import Cover from '@/components/ui/scrapbook/Cover';
import PageThree from '@/components/ui/scrapbook/PageThree';
import PageTwo from '@/components/ui/scrapbook/PagetTwo';
import { downloadCanvasAsImage } from '@/components/ui/scrapbook/utils/scrapbookUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { createContent } from '@/action/user-api';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { uploadImageWithApi } from '@/lib/upload';
import NavigationBar from '@/components/ui/navbar';

const ScrapbookPage = () => {
  // Create refs for each canvas
  const coverCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageOneCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageTwoCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageThreeCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageFourCanvasRef = useRef<HTMLCanvasElement>(null);

  const qry = useSearchParams();
  const templateId = qry.get('templateId');
  const selectedRoute = qry.get('route');

  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  // Function to upload canvas as a file and get URL
  const uploadCanvasImage = async (
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
  const downloadAllCanvases = async () => {
    try {
      setIsUploading(true);
      message.loading('Uploading images...', 0);

      const uploadedImages: string[] = [];

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
      });

      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading images:', error);
      message.error('Failed to upload images. Please try again.');
      setIsUploading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (
    val: any,
    status: 'draft' | 'published' = 'published'
  ) => {
    const payload = {
      template_id: templateId,
      detail_content_json_text: val.detail_content_json_text,
      title: 'Scrapbook by Memoify',
      caption: 'Create your scrapbook with Memoify',
      date_scheduled: null,
      dest_email: null,
      is_scheduled: false,
      status,
    };

    const res = await createContent(payload);
    if (res.success) {
      router.push('/scrapbookv1/' + res.data);
      message.success('Successfully created!');
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className="container mx-auto py-8 relative">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Scrapbook</h1>
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Cover</h2>
          <Cover canvasRef={coverCanvasRef} />
        </div>
        <PageOne canvasRef={pageOneCanvasRef} />
        <PageTwo canvasRef={pageTwoCanvasRef} />
        <PageThree canvasRef={pageThreeCanvasRef} />
        <PageFour canvasRef={pageFourCanvasRef} />
      </div>

      {/* Floating download button */}
      <button
        onClick={downloadAllCanvases}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full shadow-lg flex items-center gap-2 z-50 transition-all hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Generate Scrapbook
      </button>
    </div>
  );
};

export default ScrapbookPage;
