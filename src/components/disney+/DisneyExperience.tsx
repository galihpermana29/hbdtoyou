'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Play, Plus } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';

import EpisodeList from './EpisodeList';
import SimilarShows from './SimilarShows';
import TrailerSection from './TrailerSection';

const FALLBACK_HERO =
  'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_16:9,g_auto/v1789284325/placeholder/Casual_Blazer_Outfits_for_Women___Chic_Everyday_Street_Style_Looks_bg1q3s.jpg';

interface DisneyExperienceProps {
  children?: ReactNode;
  jumbotronImage?: string;
  title?: string;
  subTitle?: string;
  episodes?: any[];
  images?: string[];
  modalTrigger?: ReactNode;
}

export default function DisneyExperience({
  children,
  jumbotronImage,
  title,
  subTitle,
  episodes,
  images,
  modalTrigger,
}: DisneyExperienceProps) {
  const heroImage = jumbotronImage || images?.find(Boolean) || FALLBACK_HERO;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#040714] text-white">
      {children}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-gradient-to-b from-[#040714]/95 to-transparent px-5 md:px-10">
        <span className="text-2xl font-bold italic tracking-tight">
          Memoify<span className="text-[#00b9ff]">+</span>
        </span>
        <nav className="hidden gap-7 text-xs font-bold uppercase tracking-[0.16em] md:flex">
          <a href="#episodes" className="border-b-2 border-white pb-1">
            Home
          </a>
          <a href="#memories" className="opacity-70 transition hover:opacity-100">
            Memories
          </a>
          <a href="#trailer" className="opacity-70 transition hover:opacity-100">
            Featured
          </a>
        </nav>
        <span className="h-8 w-8 rounded-full border border-white/25 bg-white/10" />
      </header>

      <section className="relative h-[88svh] min-h-[600px] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7, ease: 'easeOut' }}
          className="absolute inset-0">
          <Image
            src={heroImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#040714] via-[#040714]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-transparent to-[#040714]/20" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75 }}
          className="absolute bottom-20 left-0 max-w-3xl space-y-5 px-5 md:bottom-28 md:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#d4f1ff]">
            A Memoify+ Original
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-[0.96] tracking-tight drop-shadow-2xl md:text-7xl">
            {title || 'Tunggu Aku di Bandung'}
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80 md:text-sm">
            <span>2026</span>
            <span>•</span>
            <span>1 Season</span>
            <span className="rounded border border-white/40 px-1.5 py-0.5">HD</span>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-white/80 drop-shadow md:text-lg">
            {subTitle ||
              'Dan bila akupun rindu, pada nyamannya pelukmu, pada hangatnya tawamu.'}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {modalTrigger || (
              <a
                href="#episodes"
                className="flex h-11 items-center gap-2 rounded px-6 font-bold text-black transition hover:bg-white/80 bg-white">
                <Play className="h-5 w-5 fill-black" />
                Start Watching
              </a>
            )}
            <button
              type="button"
              aria-label="Add to watchlist"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-black/30 transition hover:bg-white/15">
              <Plus />
            </button>
          </div>
        </motion.div>
        <a
          href="#episodes"
          aria-label="View episodes"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 motion-safe:animate-bounce">
          <ChevronDown />
        </a>
      </section>

      <div className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 pb-20 md:px-8">
        <div className="mb-8 flex gap-7 overflow-x-auto border-b border-white/10 text-sm font-semibold uppercase tracking-[0.12em]">
          <a href="#episodes" className="whitespace-nowrap border-b-2 border-white pb-4">
            Episodes
          </a>
          <a href="#memories" className="whitespace-nowrap pb-4 text-white/55 hover:text-white">
            More Like This
          </a>
          <a href="#trailer" className="whitespace-nowrap pb-4 text-white/55 hover:text-white">
            Trailers & More
          </a>
        </div>
        <motion.div
          id="episodes"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <EpisodeList data={episodes} />
        </motion.div>
        <motion.div
          id="memories"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <SimilarShows data={images} />
        </motion.div>
        <motion.div
          id="trailer"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <TrailerSection data={heroImage} />
        </motion.div>
      </div>
    </main>
  );
}
