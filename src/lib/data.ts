import image1 from '@/assets/widya/1.jpg';
import image2 from '@/assets/widya/2.jpg';
import image3 from '@/assets/widya/3.jpg';
import image4 from '@/assets/widya/4.jpg';
import image5 from '@/assets/widya/5.jpg';
import image6 from '@/assets/widya/6.jpg';
import image7 from '@/assets/widya/7.jpg';
import image8 from '@/assets/widya/8.jpg';
import image9 from '@/assets/widya/9.jpg';
import image10 from '@/assets/widya/10.jpg';
import image11 from '@/assets/widya/11.jpg';
import image12 from '@/assets/widya/12.jpg';
import image13 from '@/assets/widya/13.jpg';
import image14 from '@/assets/widya/14.jpg';
import image15 from '@/assets/widya/15.jpg';
import image16 from '@/assets/widya/16.jpg';
import image17 from '@/assets/widya/17.jpg';
import image18 from '@/assets/widya/18.jpg';
import image19 from '@/assets/widya/19.jpg';
import image20 from '@/assets/widya/20.jpg';

import w1 from '@/assets/widya/after/1.jpg';
import w2 from '@/assets/widya/after/2.jpg';
import w3 from '@/assets/widya/after/3.jpg';
import w4 from '@/assets/widya/after/4.jpg';
import w5 from '@/assets/widya/after/5.jpg';
import w6 from '@/assets/widya/after/6.jpg';
import w7 from '@/assets/widya/after/7.jpg';
import w8 from '@/assets/widya/after/8.jpg';
import w9 from '@/assets/widya/after/9.jpg';
import w10 from '@/assets/widya/after/10.jpg';

const imgs = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
  image13,
  image14,
  image15,
  image16,
  image17,
  image18,
  image19,
  image20,
];

const imgs2 = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];

export const tData = imgs.map((data, idx) => {
  return {
    title: `#${idx + 1}`,
    img: imgs[idx],
    id: data,
    desc: 'Before our meeting, Widya was a captivating mystery, her essence wrapped in intrigue. Little did I know, our encounter would reveal a world of laughter, friendship, and shared adventures, unveiling the vibrant colors within her captivating persona.',
  };
});

export const tData2 = imgs2.map((data, idx) => {
  return {
    title: `#${idx + 1}`,
    img: imgs2[idx],
    id: data,
    desc: 'As my girlfriend, Widya became my confidante, my joy, and my rock. Together, we embarked on a journey filled with love, laughter, and unwavering support, making every moment together a cherished memory.',
  };
});

export const songsData = [
  {
    title: 'Play this first',
    songs: null,
    isLyric: true,
    img: image5,
    id: 1,
  },
  {
    title: 'a song #1',
    songs: null,
    isLyric: false,
    img: image15,
    id: 2,
  },
  {
    title: 'a song #2',
    songs: null,
    isLyric: false,
    img: image17,
    id: 3,
  },
  {
    title: 'a song #3',
    songs: null,
    isLyric: false,
    img: image1,
    id: 4,
  },
];
