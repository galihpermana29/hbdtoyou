'use client';
import NavigationBar from '@/components/ui/navbar';
import CoverVintageBook from '@/components/ui/scrapbook-vintage/Cover';
import PageFourVintageBook from '@/components/ui/scrapbook-vintage/PageFour';
import PageOneVintageBook from '@/components/ui/scrapbook-vintage/PageOne';
import PageThreeVintageBook from '@/components/ui/scrapbook-vintage/PageThree';
import PageTwoVintageBook from '@/components/ui/scrapbook-vintage/PageTwo';
import { uploadAllCanvasesAndCreateScrapbook } from '@/utils/canvasUtils';
import { message } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

const ScrapbookVintage = () => {
  const coverCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageOneCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageTwoCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageThreeCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageFourCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId') || '';
  return (
    <div className="container mx-auto py-8 relative">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Scrapbook</h1>
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Cover</h2>
          <CoverVintageBook canvasRef={coverCanvasRef} />
        </div>
        <PageOneVintageBook canvasRef={pageOneCanvasRef} />
        <PageTwoVintageBook canvasRef={pageTwoCanvasRef} />
        <PageThreeVintageBook canvasRef={pageThreeCanvasRef} />
        <PageFourVintageBook canvasRef={pageFourCanvasRef} />
      </div>

      {/* Floating download button */}
      <div className="fixed bottom-8 right-8">
        <button 
          onClick={() => {
            if (isUploading) return;
            uploadAllCanvasesAndCreateScrapbook(
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
              'scrapbookvintage'
            );
          }}
          disabled={isUploading}
          className={`${isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center space-x-2`}>
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Create Scrapbook</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ScrapbookVintage;
