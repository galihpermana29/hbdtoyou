'use client';

import { ArrowBackIosOutlined, ArrowForwardIosOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import ListItem from './listitem';
import { PhotoProvider } from 'react-photo-view';

interface ListProps {
  title: string;
  tData?: any[];
  ref5?: any;
}

export default function List({ title, tData = [], ref5 }: ListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const items = tData.length ? tData : Array(7).fill(null);

  const scroll = (direction: -1 | 1) => {
    listRef.current?.scrollBy({
      left: direction * Math.min(window.innerWidth * 0.8, 900),
      behavior: 'smooth',
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group/rail w-full py-3"
      ref={ref5}>
      <div className="mb-2 flex items-center justify-between px-4 md:px-12">
        <h2 className="text-lg font-semibold tracking-tight text-white md:text-2xl">
        {title}
        </h2>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          {items.length} memories
        </span>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-label={`Scroll ${title} left`}
          className="absolute inset-y-0 left-0 z-20 hidden w-11 items-center justify-center bg-black/60 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/80 group-hover/rail:opacity-100 md:flex"
          onClick={() => scroll(-1)}>
          <ArrowBackIosOutlined />
        </button>
        <div
          ref={listRef}
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-12">
          <PhotoProvider>
            {items.map((dx: any, idx: number) => (
              <motion.div
                key={`${idx}-${dx || 'fallback'}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(idx * 0.06, 0.35) }}
                className="shrink-0 snap-start">
                <ListItem index={idx} data={dx} />
              </motion.div>
            ))}
          </PhotoProvider>
        </div>
        <button
          type="button"
          aria-label={`Scroll ${title} right`}
          className="absolute inset-y-0 right-0 z-20 hidden w-11 items-center justify-center bg-black/60 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/80 group-hover/rail:opacity-100 md:flex"
          onClick={() => scroll(1)}>
          <ArrowForwardIosOutlined />
        </button>
      </div>
    </motion.section>
  );
}
