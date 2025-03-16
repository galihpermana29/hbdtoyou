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
    premium: false,
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

export const base =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAADSCAYAAADjYOp1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAO7SURBVHgB7dnNURxXGEDR7l4BK8gAZyBFYGcgZWA7AssRCDIgAysEKwMpApSByQBW/GwYv0agsiikpcXcOqeqq7tnHrvLq4/HPH3HZrPZv76+/mM8/jKuw/sL/lejw4t5nj+N+/tx/3t3d/fsW2vnpz68uro6HLe/ps8hw3PzblzHT4W9PP5g3ZHHb8LpJGaer9/GTn16eXn55vEXX+3QNzc3b29vb48m2B5HY6c+fnj5EvT9znwywZYZ3f65t7d31+5d0OvMvI4ZYxvfn2DLjG4vRr8v15n6YYZ+K2a21XoaN30+xJjm+xONfybYcjs7OwfLqPv1BAHrqccyRo1XEwQsy/LzukO/mKDhcJ2hNxNELBOECJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZOyBn02QcA8zxeCJmOz2Xxag/44QcAI+v18fn6+v7Ozcz7B9vtpOTg4uBgPHybYYsuyvNvd3T2b15erq6vDsV2fjqF6f4ItM9q9GO2+XIO+O7a7e1iW4wm20/Ha8Prw5Rx6zNEn6xcTbJHb29vjvb29k4f3+fGC6+vrN2PRW+MHz9k6ZozbVzGv5qcWrzP1iPpojCG/TvD8fBjX7w9jxn/N3/up+z8WX4/d+tW4v7Br84Oc3V8f19F4/Y/gtxb+C1dco/qqMhiPAAAAAElFTkSuQmCC';

export const initPhotos = [
  { x: 47, y: 120, width: 390, height: 516, src: base },
  { x: 518, y: 120, width: 390, height: 516, src: base },
  { x: 47, y: 732, width: 390, height: 516, src: base },
  { x: 518, y: 732, width: 390, height: 516, src: base },
];
