'use client';

import React from 'react';
import Image from 'next/image';

import DragElements from '@/components/fancy/drag-elements';
import { useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';
const Typewriter = dynamic(() => import('@/components/fancy/typewriter'), {
  ssr: false,
});

const urls = [
  'https://res.cloudinary.com/dxuumohme/image/upload/v1737116192/fsludxptpdvunuz6p4fz.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1737117148/syivskbgwy9pbf1tn458.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736870046/jubvja6nrjdzwqwwcmaf.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1737117237/a5cdiddufsnw7hdwqxma.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1737117387/d8wjvos0u7bjedkbdye9.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1737117573/h8biwglwfxi0woctxfk2.jpg',
  'https://res.cloudinary.com/dxuumohme/image/upload/v1736873773/zkfbpr2d5yr4c3r4oq6q.jpg',
];

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const DragElementsDemo: React.FC = () => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  return (
    <div className="w-full flex  justify-between h-screen relative bg-[#000] overflow-hidden">
      <div className="w-full h-full md:text-4xl lg:text-5xl xl:text-6xl sm:text-3xl text-3xl flex flex-col items-start justify-start bg-black text-foreground dark:text-muted font-normal overflow-hidden p-8 md:p-16 md:pt-48 absolute">
        <iframe
          src={`https://open.spotify.com/embed/track/${'4s5B70nF4StXSaCwP6C0AU'}`}
          height={80}
          className="max-w-[370px] mb-[20px] relative z-[999999]"></iframe>
        <p
          className="whitespace-pre-wrap max-w-[500px]"
          suppressHydrationWarning>
          {/* <span>{"We're born 🌞 to "}</span> */}
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
      {/* <h1 className="absolute text-xl md:text-4xl md:ml-36 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground uppercase w-full">
        all of our
        <span className="font-bold text-foreground dark:text-muted">
          {' '}
          memories.{' '}
        </span>
      </h1> */}
      <DragElements
        dragMomentum={true}
        className=" flex justify-end items-end pr-8 pb-8">
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
              className={`flex items-start justify-center bg-white shadow-2xl p-2`}
              style={{
                transform: `rotate(${rotation}deg)`,
                width: `${width}px`,
                height: `${height}px`,
              }}>
              <div
                className={`relative overflow-hidden`}
                style={{
                  width: `${width - 4}px`,
                  height: `${height - 30}px`,
                }}>
                <Image
                  src={url}
                  fill
                  alt={`Analog photo ${index + 1}`}
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </DragElements>
    </div>
  );
};

export default DragElementsDemo;
