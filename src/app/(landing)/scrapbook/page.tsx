'use client';
import { useRef } from 'react';
import CoverBook from '@/components/ui/scrapbook/Cover';
import PageFour from '@/components/ui/scrapbook/PageFour';
import PageOne from '@/components/ui/scrapbook/PageOne';
import PageThree from '@/components/ui/scrapbook/PageThree';
import PageTwo from '@/components/ui/scrapbook/PagetTwo';
import { downloadCanvasAsImage } from '@/components/ui/scrapbook/utils/scrapbookUtils';

const ScrapbookPage = () => {
  // Create refs for each canvas
  const coverCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageOneCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageTwoCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageThreeCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageFourCanvasRef = useRef<HTMLCanvasElement>(null);

  // Function to download all canvases
  const downloadAllCanvases = () => {
    // Small delay between downloads to prevent browser issues
    const downloadWithDelay = (index: number) => {
      setTimeout(() => {
        switch (index) {
          case 0:
            if (coverCanvasRef.current) {
              downloadCanvasAsImage(coverCanvasRef.current, 'scrapbook-cover');
            }
            break;
          case 1:
            if (pageOneCanvasRef.current) {
              downloadCanvasAsImage(
                pageOneCanvasRef.current,
                'scrapbook-page-one'
              );
            }
            break;
          case 2:
            if (pageTwoCanvasRef.current) {
              downloadCanvasAsImage(
                pageTwoCanvasRef.current,
                'scrapbook-page-two'
              );
            }
            break;
          case 3:
            if (pageThreeCanvasRef.current) {
              downloadCanvasAsImage(
                pageThreeCanvasRef.current,
                'scrapbook-page-three'
              );
            }
            break;
          case 4:
            if (pageFourCanvasRef.current) {
              downloadCanvasAsImage(
                pageFourCanvasRef.current,
                'scrapbook-page-four'
              );
            }
            break;
        }
      }, index * 500); // 500ms delay between downloads
    };

    // Trigger downloads with delay
    for (let i = 0; i < 5; i++) {
      downloadWithDelay(i);
    }
  };

  return (
    <div className="container mx-auto py-8 relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Scrapbook</h1>
      <p className="text-center mb-4">
        Upload your photo to place it in the frames
      </p>
      <div className="px-[18px]">
        <CoverBook canvasRef={coverCanvasRef} />
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
