import {
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownOutlined,
} from '@mui/icons-material';
import Image from 'next/image';
import { useState } from 'react';
import widya from '@/assets/widya/after/2.jpg';

interface ListItemProps {
  index: number;
  data: string;
}

export default function ListItem({ index, data }: ListItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`w-[225px] h-[120px] bg-gray-800 mr-1 overflow-hidden cursor-pointer text-white`}>
      <Image
        width={200}
        height={300}
        src={data ?? widya}
        alt=""
        className="w-full h-full object-cover"
        onClick={() => setIsHovered(!isHovered)}
      />
      <div className="border-2">
        {/* <video
          src={trailer}
          autoPlay
          loop
          className="absolute w-full h-[140px] top-0 left-0 object-cover"
        /> */}
        <div className="p-2 ">
          <div className="flex mb-2">
            <PlayArrow className="icon border-2 border-white p-1 rounded-full mr-2 text-lg" />
            <Add className="icon border-2 border-white p-1 rounded-full mr-2 text-lg" />
            <ThumbUpAltOutlined className="icon border-2 border-white p-1 rounded-full mr-2 text-lg" />
            <ThumbDownOutlined className="icon border-2 border-white p-1 rounded-full text-lg" />
          </div>
          <div className="flex items-center mb-2 text-gray-400 text-sm font-semibold">
            <span>1 hour 14 mins</span>
            <span className="border border-gray-400 p-1 mx-2">+16</span>
            <span>1999</span>
          </div>
          <p className="text-sm text-gray-300">Comedy, Romance</p>
        </div>
      </div>
    </div>
  );
}
