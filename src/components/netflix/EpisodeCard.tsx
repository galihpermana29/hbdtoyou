'use client';

import Image from 'next/image';
import { ReactNode, useState } from 'react';
import NetflixButton from './NetflixButton';

interface EpisodeCardProps {
  number: number;
  title: string;
  duration: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  isComingSoon?: boolean;
}

/**
 * A reusable Netflix-styled episode card component
 * @param number - Episode number
 * @param title - Episode title
 * @param duration - Episode duration (e.g., "26m 10s")
 * @param description - Episode description
 * @param imageSrc - Source URL for the episode thumbnail
 * @param imageAlt - Alt text for the episode thumbnail
 * @param isComingSoon - Whether this episode is marked as coming soon
 */
const EpisodeCard = ({
  number,
  title,
  duration,
  description,
  imageSrc,
  imageAlt = 'Episode thumbnail',
  isComingSoon = false,
}: EpisodeCardProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Show More button icon
  const showMoreIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 6L8 10L12 6"
        stroke="white"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return (
    <div className="flex flex-col gap-y-3 items-start">
      <div className="flex items-start gap-x-4">
        {/* Thumbnail image or placeholder */}
        <div className="w-[163px] h-[108.88px] shrink-0 bg-yellow-300 relative overflow-hidden rounded-sm">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={163}
              height={108.88}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black font-bold">
              {number}
            </div>
          )}
        </div>

        {/* Episode info */}
        <div className="flex flex-col gap-y-2 items-start">
          <p className="geist-font text-base text-white">
            {isComingSoon && (
              <>
                [Coming Soon] <br />
              </>
            )}
            {isComingSoon && ''}
            {title}
          </p>
          <span className="geist-font text-xs text-[#A3A1A1]">{duration}</span>
        </div>
      </div>

      {/* Episode description */}
      <div className="w-full">
        <p className={showFullDescription ? "geist-font text-sm text-[#A3A1A1]" : "geist-font text-sm text-[#A3A1A1] line-clamp-3"}>
          {description}
        </p>
        {description.length > 100 && (
          <NetflixButton
            variant="text"
            icon={showMoreIcon}
            iconPosition="end"
            className='!mt-2'
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? 'Show Less' : 'Show More'}
          </NetflixButton>
        )}
      </div>
    </div>
  );
};

export default EpisodeCard;
