'use client';

import React from 'react';
import Image from 'next/image';

import DragElements from '@/components/fancy/drag-elements';
import { useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';
import unoLogo from '@/assets/uno-logo.png';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.
const Typewriter = dynamic(() => import('@/components/fancy/typewriter'), {
  ssr: false,
});

const urls = [
  'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:5,g_auto/v1789284277/placeholder/Classy_Spring_Workwear_2026_Light_Aesthetic_Business_Casual_Outfits_Women_wefqc5.jpg',
  'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:5,g_auto/v1789284279/placeholder/Minimalist_Black_Tee_Wide-Leg_Trousers_Outfit___Chic_Quiet_Luxury_Women_s_Fashion_2026_kiyext.jpg',
  'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:5,g_auto/v1789284278/placeholder/Monday_to_Friday_Business_Casual_Outfits__Your_Weekly_Wardrobe_hrpkgr.jpg',
  'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:5,g_auto/v1789284278/placeholder/Polished_Spring_Workwear_2026_-_Light_Capsule_Wardrobe_Ideas_for_Modern_Women_ydbdxk.jpg',
  'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:5,g_auto/v1789284277/placeholder/__1_z5hfhd.jpg',
  'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:5,g_auto/v1789284277/placeholder/__2_km7zqq.jpg',
  'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_4:5,g_auto/v1789284307/placeholder/__3_h2qoju.jpg',
];

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const DragElementsDemo: React.FC = () => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  return (
    <div className="w-full flex  justify-between h-screen relative bg-[#181818] overflow-hidden">
      <div className="w-full h-full md:text-4xl lg:text-5xl xl:text-6xl sm:text-3xl text-3xl flex flex-col items-start justify-start text-foreground dark:text-muted font-normal overflow-hidden p-8 md:p-24 md:pt-48 absolute">
        <iframe
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          src={`https://open.spotify.com/embed/track/${'1CVUWAC845LKEDHH0l8XG2'}`}
          height={80}
          className="max-w-[370px] mb-[20px] relative z-[999999]"></iframe>
        <p
          className="whitespace-pre-wrap max-w-[500px]"
          suppressHydrationWarning>
          <Typewriter
            text={[
              'All of this photo is our moments.',
              'I want to say a Happy Birthday to you.',
              'I never knew that i will always be with you for a long time period of time',
              'I wish you all the best in your life.',
              'Remember that you have me, and you can share anything with me.',
            ]}
            speed={70}
            className="text-white"
            waitTime={1500}
            deleteSpeed={60}
            cursorChar={'_'}
          />
        </p>
      </div>

      <DragElements
        dragMomentum={true}
        className="flex justify-end items-end pr-16 pb-24">
        {urls.map((url, index) => {
          const rotation = randomInt(-12, 12);
          const width = isSmallDevice
            ? randomInt(90 * 1.7, 120 * 1.7)
            : randomInt(120 * 2.5, 150 * 2.5);
          const height = isSmallDevice
            ? randomInt(120 * 1.7, 140 * 1.4)
            : randomInt(150 * 2.5, 180 * 2.5);

          return (
            <div
              key={index}
              className={`flex items-start justify-center bg-[#fff] shadow-2xl p-2 relative`}
              style={{
                transform: `rotate(${rotation}deg)`,

                width: `${width}px`,
                height: `${height}px`,
              }}>
              <div
                className={`relative overflow-hidden`}
                style={{
                  width: `${width - 4}px`,
                  height: `${height - 60}px`,
                }}>
                <Image
                  src={url}
                  fill
                  alt={`Analog photo ${index + 1}`}
                  className="object-cover"
                  draggable={false}
                />
              </div>
              <Image
                src={unoLogo}
                width={2560}
                height={1795}
                alt={`Analog photo ${index + 1}`}
                className="max-w-[30%] absolute bottom-0"
              />
            </div>
          );
        })}
      </DragElements>
    </div>
  );
};

export default DragElementsDemo;
