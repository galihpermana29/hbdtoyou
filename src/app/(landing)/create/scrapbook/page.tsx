'use client';
import { useRef, useState } from 'react';
import PageOne from '@/components/ui/scrapbook/PageOne';
import PageFour from '@/components/ui/scrapbook/PageFour';
import Cover from '@/components/ui/scrapbook/Cover';
import PageThree from '@/components/ui/scrapbook/PageThree';
import PageTwo from '@/components/ui/scrapbook/PagetTwo';
import { downloadCanvasAsImage } from '@/components/ui/scrapbook/utils/scrapbookUtils';
import { uploadAllCanvasesAndCreateScrapbook } from '@/utils/canvasUtils';
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

  // Function to upload all canvases and create scrapbook
  const downloadAllCanvases = async () => {
    await uploadAllCanvasesAndCreateScrapbook(
      {
        coverCanvasRef,
        pageOneCanvasRef,
        pageTwoCanvasRef,
        pageThreeCanvasRef,
        pageFourCanvasRef
      },
      templateId,
      router,
      setIsUploading,
      'scrapbookv1'
    );
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
