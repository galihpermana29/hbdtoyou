'use client';
import DragElements from '@/components/fancy/drag-elements';
import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import unoLogo from '@/assets/uno-logo.png';

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const ImagesComponent = ({ urls }: { urls: string[] }) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  return (
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
  );
};

export default ImagesComponent;
