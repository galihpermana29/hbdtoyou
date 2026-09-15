'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { ReactNode, useState } from 'react';

import noImage from '@/assets/empty.png';

import Featured from './featured/featured';
import List from './list/list';
import Navbar from './navbar/navbar';

const NETFLIX_WORDMARK =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png';

interface NetflixExperienceProps {
  children?: ReactNode;
  jumbotronImage?: string;
  title?: string;
  subTitle?: string;
  modalContent?: string;
  images?: string[];
  refs?: {
    ref1?: any;
    ref2?: any;
    ref3?: any;
    ref4?: any;
    ref5?: any;
  };
}

export default function NetflixExperience({
  children,
  jumbotronImage,
  title,
  subTitle,
  modalContent,
  images = [],
  refs = {},
}: NetflixExperienceProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const featuredImage = jumbotronImage || safeImages[0];
  const profileImage: string | StaticImageData = featuredImage || noImage;
  const profileLabel = title?.trim() || 'Memories';
  const midIndex = Math.ceil(safeImages.length / 2);
  const firstHalf = safeImages.slice(0, midIndex);
  const secondHalf = safeImages.slice(midIndex);
  const fallbackRows = Array(7).fill(null);
  const rowOne = firstHalf.length ? firstHalf : fallbackRows;
  const rowTwo = secondHalf.length ? secondHalf : rowOne;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <AnimatePresence>
        {!hasEntered ? (
          <motion.section
            key="profiles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[10000] flex min-h-[100svh] flex-col items-center justify-center bg-[#141414] px-6">
            <motion.img
              src={NETFLIX_WORDMARK}
              alt="Netflix"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute left-6 top-6 h-6 w-auto md:left-12 md:top-10 md:h-8"
            />
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-9 text-center text-3xl font-medium tracking-tight md:text-5xl">
              Who&apos;s watching?
            </motion.h1>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.45 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setHasEntered(true)}
              aria-label={`Watch ${profileLabel}`}
              className="group flex max-w-[180px] flex-col items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <span className="relative block aspect-square w-32 overflow-hidden rounded-md border-2 border-transparent bg-neutral-800 shadow-2xl transition-colors group-hover:border-white md:w-40">
                <Image
                  src={profileImage}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </span>
              <span className="max-w-full truncate text-lg text-neutral-400 transition-colors group-hover:text-white md:text-xl">
                {profileLabel}
              </span>
            </motion.button>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ opacity: hasEntered ? 1 : 0 }}
        transition={{ delay: hasEntered ? 0.15 : 0, duration: 0.55 }}
        aria-hidden={!hasEntered}>
        {hasEntered ? children : null}
        <Navbar jumbotronImage={featuredImage} />
        <Featured
          jumbotronImage={featuredImage}
          title={title}
          subTitle={subTitle}
          modalContent={modalContent}
          {...refs}
        />
        <div className="relative z-10 -mt-20 space-y-3 pb-16 md:-mt-28">
          <List ref5={refs.ref5} title="Our Story" tData={rowOne} />
          <List title="More Memories" tData={rowTwo} />
          <List title="Watch It Again" tData={rowOne} />
        </div>
      </motion.div>
    </div>
  );
}
