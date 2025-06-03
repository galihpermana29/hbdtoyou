import React from 'react';

import dynamic from 'next/dynamic';
import { getDetailContent } from '@/action/user-api';
import ImagesComponent from '../ImagesComponent/ImagesComponent';
import { Watermark } from 'antd';
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

const splitLongSentence = (sentence: string): string[] => {
  const words = sentence.split(' ');
  if (words.length > 18) {
    const firstPart = words.slice(0, 10).join(' ');
    const remainingPart = words.slice(10).join(' ');

    return [firstPart, remainingPart];
  }
  return [sentence];
};

// Split the input string into sentences, handle long sentences, and keep the order

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

export default async function MagazineDetailV1({ params }: { params: any }) {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);

  const sentences = parsedData?.desc
    .split('.')
    .map((sentence: any) => sentence.trim())
    .filter((sentence: any) => sentence !== '')
    .flatMap(splitLongSentence); // Use flatMap to include split sentences in sequence

  return (
    <Watermark
      zIndex={9999999}
      font={{ color: 'rgba(227, 64, 19, 0.08)', fontSize: 50 }}
      content={data.data.user_type === 'free' ? 'memoify.live' : ''}>
      <div className="w-full flex  justify-between h-screen relative bg-[#181818] overflow-hidden">
        <div className="w-full h-full md:text-4xl lg:text-5xl xl:text-6xl sm:text-3xl text-3xl flex flex-col items-start justify-start text-foreground dark:text-muted font-normal overflow-hidden p-8 md:p-24 md:pt-48 absolute">
          <iframe
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            src={`https://open.spotify.com/embed/track/${
              parsedData ? parsedData.id : '1CVUWAC845LKEDHH0l8XG2'
            }`}
            height={80}
            className="max-w-[370px] mb-[20px] relative z-[999999]"></iframe>
          <p
            className="whitespace-pre-wrap max-w-[500px]"
            suppressHydrationWarning>
            <Typewriter
              text={
                sentences.length > 0
                  ? sentences
                  : [
                      'All of this photo is our moments.',
                      'I want to say a Happy Birthday to you.',
                      'I never knew that i will always be with you for a long time period of time',
                      'I wish you all the best in your life.',
                      'Remember that you have me, and you can share anything with me.',
                    ]
              }
              speed={70}
              className="text-white"
              waitTime={1500}
              deleteSpeed={60}
              cursorChar={'_'}
            />
          </p>
        </div>

        <ImagesComponent urls={parsedData ? parsedData.momentOfYou : urls} />
        {/* <DragElements
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
      </DragElements> */}
      </div>
    </Watermark>
  );
}
