'use client';

import Image from 'next/image';
import { useState } from 'react';
import NetflixButton from './NetflixButton';

interface GalleryGridProps {
  images: string[];
  initialLimit?: number;
}

/**
 * A reusable component for displaying a grid of images in a Netflix-styled UI
 * @param images - Array of image objects with src and alt properties
 * @param initialLimit - Initial number of images to display before "Show More"
 */
const GalleryGrid = ({ images, initialLimit = 6 }: GalleryGridProps) => {
  const [showAll, setShowAll] = useState(false);

  // Determine which images to display based on showAll state
  const displayImages = showAll ? images : images.slice(0, initialLimit);

  // Show More button icon
  const showMoreIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="flex flex-col gap-y-2 items-start w-full">
      {/* Image grid */}
      <div className="grid grid-cols-3 grid-rows-2 gap-5 w-full">
        {displayImages.map((image, index) => (
          <div
            key={index}
            className="bg-yellow-300 rounded-md h-[191.18px] relative overflow-hidden"
          >
            {image ? (
              <Image
                src={image}
                alt='Netflix Graduation'
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black font-bold">
                {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show More button (only if there are more images) */}
      {images.length > initialLimit && (
        <NetflixButton
          variant="text"
          icon={showMoreIcon}
          iconPosition="end"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : 'Show More'}
        </NetflixButton>
      )}
    </div>
  );
};

export default GalleryGrid;