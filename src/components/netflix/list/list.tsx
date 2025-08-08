'use client';

import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import ListItem from './listitem';
import { PhotoProvider } from 'react-photo-view';
interface ListProps {
  title: string;
  tData: any;
  ref5?: any;
}

export default function List({ title, tData, ref5 }: ListProps) {
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const itemWidth = 225; // Width of each ListItem
  const itemMargin = 1; // Margin between items
  const itemFullWidth = itemWidth + itemMargin; // Total width including margin
  const visibleItems = 5; // Number of items visible at once
  const totalItems = tData.length;

  // Reset position when reaching the end or beginning
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        if (listRef.current) {
          // If we're at the "clone" items, jump to the real items without animation
          if (slideNumber >= totalItems) {
            listRef.current.style.transition = 'none';
            setSlideNumber(0);
            const distance = -50; // Reset to beginning
            listRef.current.style.transform = `translateX(${distance}px)`;

            // Force a reflow to make the transition removal take effect
            listRef.current.offsetHeight;

            // Re-enable transitions for future slides
            setTimeout(() => {
              if (listRef.current) {
                listRef.current.style.transition =
                  'transform 500ms ease-in-out';
              }
            }, 10);
          } else if (slideNumber < 0) {
            listRef.current.style.transition = 'none';
            setSlideNumber(totalItems - 1);
            const jumpDistance = -((totalItems - 1) * itemFullWidth) - 50;
            listRef.current.style.transform = `translateX(${jumpDistance}px)`;

            // Force a reflow
            listRef.current.offsetHeight;

            // Re-enable transitions
            setTimeout(() => {
              if (listRef.current) {
                listRef.current.style.transition =
                  'transform 500ms ease-in-out';
              }
            }, 10);
          }
        }
        setIsTransitioning(false);
      }, 500); // Match this with the CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, slideNumber, totalItems]);

  const handleClick = (direction: 'left' | 'right') => {
    if (isTransitioning || !listRef.current) return;

    setIsMoved(true);
    setIsTransitioning(true);

    // Calculate base position (50px offset from left edge)
    const basePosition = -50;

    if (direction === 'left') {
      setSlideNumber(slideNumber - 1);
      const newPosition = basePosition - (slideNumber - 1) * itemFullWidth;
      listRef.current.style.transform = `translateX(${newPosition}px)`;
    } else {
      setSlideNumber(slideNumber + 1);
      const newPosition = basePosition - (slideNumber + 1) * itemFullWidth;
      listRef.current.style.transform = `translateX(${newPosition}px)`;
    }
  };

  // Create array with clones for infinite effect
  const getItemsWithClones = () => {
    if (!tData || tData.length === 0) return [];

    // Add last items at the beginning and first items at the end
    return [
      ...tData.slice(-1), // Last item clone at beginning
      ...tData,
      ...tData.slice(0, 1), // First item clone at end
    ];
  };

  return (
    <div className="w-full pt-[10px] bg-black" ref={ref5}>
      <span className="text-white text-lg font-medium ml-12 mb-[20px] block">
        {title}
      </span>
      <div className="relative overflow-visible" style={{ padding: '20px 0' }}>
        <ArrowBackIosOutlined
          className="absolute top-0 bottom-0 left-0 z-[100] m-auto text-white cursor-pointer w-12 h-full bg-black bg-opacity-50"
          onClick={() => handleClick('left')}
        />
        <div
          className="flex mt-2 w-max transition-transform duration-500 ease-in-out"
          style={{ transform: 'translateX(-50px)' }} // Initial position
          ref={listRef}>
          <PhotoProvider>
            {getItemsWithClones().map((dx: any, idx: any) => (
              <div key={`${idx}-${dx}`} className="mx-[3px]">
                {' '}
                {/* Increased spacing between items */}
                <ListItem index={idx} data={dx} />
              </div>
            ))}
          </PhotoProvider>
        </div>
        <ArrowForwardIosOutlined
          className="absolute top-0 bottom-0 right-0 z-[100] m-auto text-white cursor-pointer w-12 h-full bg-black bg-opacity-50"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
}
