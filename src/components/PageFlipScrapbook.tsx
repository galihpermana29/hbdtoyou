'use client';

import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './PageFlipScrapbook.css';

interface PageCoverProps {
  children?: React.ReactNode;
  image: string;
}

const PageCover = React.forwardRef<HTMLDivElement, PageCoverProps>(
  ({ children, image }, ref) => {
    return (
      <div className="page page-cover" ref={ref} data-density="hard">
        <div className="page-content">
          <img
            src={image}
            alt="Cover"
            className="cover-image"
            draggable="false"
          />
          <div className="cover-title">
            <h2>{children}</h2>
          </div>
        </div>
      </div>
    );
  }
);

PageCover.displayName = 'PageCover';

interface PageProps {
  image: string;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(({ image }, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <div className="page-image">
          <img src={image} alt="Page" className="page-img" draggable="false" />
        </div>
      </div>
    </div>
  );
});

Page.displayName = 'Page';

interface PageFlipScrapbookProps {
  pages: string[];
  coverImage?: string;
  backCoverImage?: string;
  coverTitle?: string;
  backCoverTitle?: string;
  enableVideoExport?: boolean;
}

const PageFlipScrapbook: React.FC<PageFlipScrapbookProps> = ({
  pages,
  coverImage = 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003560/tl7dqxuefwo2oiaxgj9s.jpg',
  backCoverImage = 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003560/tl7dqxuefwo2oiaxgj9s.jpg',
  coverTitle = 'Scrapbook by Memoify',
  backCoverTitle = 'The End',
  enableVideoExport = true,
}) => {
  const book = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const onInit = () => {
    // Wait a moment for the component to fully initialize
    setTimeout(() => {
      if (book.current && book.current.pageFlip) {
        const pageCount = book.current.pageFlip().getPageCount();
        setTotalPage(pageCount);
      }
    }, 100);
  };

  const onChangeOrientation = (e: any) => {
    setOrientation(e.orientation);
  };

  const nextButtonClick = () => {
    if (book.current && book.current.pageFlip) {
      book.current.pageFlip().flipNext();
    }
  };

  const prevButtonClick = () => {
    if (book.current && book.current.pageFlip) {
      book.current.pageFlip().flipPrev();
    }
  };

  const onPage = (e: any) => {
    // Safely handle page number
    if (typeof e.data === 'number') {
      setPage(e.data);
    }
  };

  const handleExportVideo = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch('/api/export-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pages,
          coverImage,
          backCoverImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export video');
      }

      // Download the GIF
      const link = document.createElement('a');
      link.href = data.gifUrl;
      link.download = `scrapbook-${Date.now()}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('GIF exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      setExportError(
        error instanceof Error ? error.message : 'Failed to export video'
      );
      alert('Failed to export GIF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="scrapbook-container">
        <HTMLFlipBook
          width={550}
          height={733}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onPage}
          onInit={onInit}
          onChangeOrientation={onChangeOrientation}
          className="scrapbook"
          ref={book}
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={false}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}>
          {/* Cover Page */}
          <PageCover image={coverImage}>{coverTitle}</PageCover>

          {/* Content Pages */}
          {pages.map((image, index) => (
            <Page key={index} image={image} />
          ))}

          {/* Back Cover */}
          <PageCover image={backCoverImage}>{backCoverTitle}</PageCover>
        </HTMLFlipBook>
      </div>

      <div className="controls mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={prevButtonClick}>
          Previous
        </button>
        <span className="page-indicator mx-4">
          Page {page + 1} of {totalPage}
        </span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={nextButtonClick}>
          Next
        </button>
      </div>

      {enableVideoExport && (
        <div className="mt-4 flex flex-col items-center">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleExportVideo}
            disabled={isExporting}>
            {isExporting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating GIF...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export to GIF
              </>
            )}
          </button>
          {exportError && (
            <p className="text-red-500 mt-2 text-sm">{exportError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PageFlipScrapbook;
