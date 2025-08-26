import {
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownOutlined,
} from '@mui/icons-material';
import Image from 'next/image';
import { useState } from 'react';
import widya from '@/assets/widya/after/2.jpg';
import { PhotoProvider, PhotoView } from 'react-photo-view';

interface ListItemProps {
  index: number;
  data: string;
}

export default function ListItem({ index, data }: ListItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-[225px] h-[120px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.09) translateY(-80px)' : 'scale(1)',
        transformOrigin: 'center',
        zIndex: isHovered ? 999 : 1,
        transition: 'all 0.3s ease-in-out',
      }}>
      {/* Main container */}
      <div
        className={`
          absolute 
          bg-gray-950 
          overflow-hidden 
          cursor-pointer 
          text-white 
          shadow-lg
          ${
            isHovered
              ? 'w-[245px] h-[300px] top-[-40px] left-[-10px] shadow-2xl border-white'
              : 'w-[225px] h-[120px] top-0 left-0'
          }
        `}
        style={{
          transition: 'all 0.3s ease-in-out',
        }}>
        {/* Image container */}
        <div
          className={`${
            isHovered ? 'h-[140px]' : 'h-[120px]'
          } rounded-[8px] overflow-hidden`}>
          <PhotoView key={index} src={data ?? (widya as unknown as string)}>
            <Image
              width={isHovered ? 245 : 225}
              height={isHovered ? 140 : 120}
              src={data ?? widya}
              alt=""
              className="w-full h-full object-cover"
              priority={true}
            />
          </PhotoView>
        </div>

        {/* Content that appears on hover */}
        {isHovered && (
          <div className="p-3">
            {/* Action buttons */}
            <div className="flex mb-3">
              <PlayArrow className="icon border-2 border-white p-1 rounded-full mr-2 text-lg hover:bg-white hover:text-black transition-colors w-[25px] h-[25px]" />
              <Add className="icon border-2 border-white p-1 rounded-full mr-2 text-lg hover:bg-white hover:text-black transition-colors w-[25px] h-[25px]" />
              <ThumbUpAltOutlined className="icon border-2 border-white p-1 rounded-full mr-2 text-lg hover:bg-white hover:text-black transition-colors w-[25px] h-[25px]" />
              <ThumbDownOutlined className="icon border-2 border-white p-1 rounded-full text-lg hover:bg-white hover:text-black transition-colors w-[25px] h-[25px]" />
            </div>

            {/* Movie info */}
            <div className="flex items-center mb-2 text-gray-400 text-xs font-semibold">
              <span>1 hour 14 mins</span>
            </div>

            {/* Genre */}
            <p className="text-xs mb-[8px] text-gray-300">Comedy, Romance</p>

            {/* Description */}
            <p className="text-xs text-gray-400 line-clamp-3">
              A heartwarming story about love and friendship that transcends
              time and space. Follow the journey of two souls destined to meet
              against all odds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
