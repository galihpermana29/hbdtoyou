'use client';

import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { useRef, useState } from 'react';
import ListItem from './listitem';

interface ListProps {
  title: string;
  tData: any;
}

export default function List({ title, tData }: ListProps) {
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (listRef.current) {
      let distance = listRef.current.getBoundingClientRect().x - 50;
      if (direction === 'left' && slideNumber > 0) {
        setSlideNumber(slideNumber - 1);
        listRef.current.style.transform = `translateX(${230 + distance}px)`;
      }
      if (direction === 'right' && slideNumber < 5) {
        setSlideNumber(slideNumber + 1);
        listRef.current.style.transform = `translateX(${-230 + distance}px)`;
      }
    }
  };

  return (
    <div className="w-full py-[30px] bg-black">
      <span className="text-white text-lg font-medium ml-12 mb-12 block">
        {title}
      </span>
      <div className="relative">
        <ArrowBackIosOutlined
          className={`absolute top-0 bottom-0 left-0 z-10 m-auto text-white cursor-pointer w-12 h-full bg-black bg-opacity-50 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />
        <div
          className="flex ml-12 mt-2 w-max transition-transform duration-1000 ease-in-out"
          ref={listRef}>
          {tData.map((dx: any, idx: any) => (
            <ListItem key={idx} index={idx} data={dx} />
          ))}
        </div>
        <ArrowForwardIosOutlined
          className="absolute top-0 bottom-0 right-0 z-10 m-auto text-white cursor-pointer w-12 h-full bg-black bg-opacity-50"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
}
