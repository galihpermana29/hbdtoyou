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
}

const PageFlipScrapbook: React.FC<PageFlipScrapbookProps> = ({
  pages,
  coverImage = 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003560/tl7dqxuefwo2oiaxgj9s.jpg',
  backCoverImage = 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003560/tl7dqxuefwo2oiaxgj9s.jpg',
  coverTitle = 'Scrapbook by Memoify',
  backCoverTitle = 'The End',
}) => {
  const book = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );

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
    </div>
  );
};

export default PageFlipScrapbook;
