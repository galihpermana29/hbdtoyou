import { StaticImageData } from 'next/image';
import frame1 from '../assets/frame1.png';
import frame2 from '../assets/frame2.png';
import frame3 from '../assets/frame3.png';
import frame4 from '../assets/frame4.png';
import frame5 from '../assets/frame5.png';
import frame6 from '../assets/frame6.png';
import frame7 from '../assets/frame7.png';
import frame8 from '../assets/frame8.png';

export interface FrameData {
  id: number;
  assets: string | StaticImageData;
  premium: boolean;
}

export const frameData = [
  {
    id: 5,
    assets: frame5,
    premium: true,
  },
  {
    id: 6,
    assets: frame6,
    premium: true,
  },
  {
    id: 7,
    assets: frame7,
    premium: true,
  },
  {
    id: 8,
    assets: frame8,
    premium: true,
  },
  {
    id: 1,
    assets: frame1,
    premium: false,
  },
  {
    id: 2,
    assets: frame2,
    premium: false,
  },
  {
    id: 3,
    assets: frame3,
    premium: false,
  },
  {
    id: 4,
    assets: frame4,
    premium: false,
  },
];
