'use client';

import { Clock3, Heart, MoreHorizontal, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import PlaylistCard from './playlist-card';
import PlaylistSection from './playlist-section';
import { PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.
const playlists = [
  {
    title: '#1',
    description: 'At Jokopi, Malang, Indonesia',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284277/placeholder/__1_z5hfhd.jpg',
  },
  {
    title: '#2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284277/placeholder/__2_km7zqq.jpg',
  },
  {
    title: '#3',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284307/placeholder/__3_h2qoju.jpg',
  },
  {
    title: '#4',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284277/placeholder/__db1ief.jpg',
  },
  {
    title: '#5',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/museum_Date_Outfit_Ideas___Academic_Chic_Poetcore_Style_n5nvg7.jpg',
  },
  {
    title: '#6',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/Butter_Color_Dress__Elegant_Spring_Formal_Look_luzpa3.jpg',
  },
  {
    title: '#7',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/City_tram_window_daydate_outfit_cwrxma.jpg',
  },
  {
    title: '#8',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284279/placeholder/Minimalist_Black_Tee_Wide-Leg_Trousers_Outfit___Chic_Quiet_Luxury_Women_s_Fashion_2026_kiyext.jpg',
  },
];

export default function MainContent({
  momentOfYou,
  songsForYou,
  title,
  ref2,
  ref3,
}: {
  momentOfYou?: any[];
  songsForYou?: any[];
  title?: string;
  ref2?: any;
  ref3?: any;
}) {
  const moments = momentOfYou
    ? typeof momentOfYou === 'string'
      ? [momentOfYou]
      : momentOfYou
    : playlists;
  const data = moments.map((dx: any, idx) => ({
    title: `Memory #${idx + 1}`,
    description:
      typeof dx === 'object'
        ? dx.caption || dx.location || dx.description || ''
        : '',
    image: typeof dx === 'object' ? dx.imageUrl || dx.image : dx,
  }));
  const cover = data.find((item) => item.image)?.image || playlists[0].image;

  return (
    <div className="min-h-full bg-[#121212] pb-28 text-white">
      <section className="relative overflow-hidden px-5 pb-7 pt-14 md:px-8 md:pb-8 md:pt-20">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-35 blur-3xl"
          style={{ backgroundImage: `url("${cover}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-[#18251f]/70 to-[#121212]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative flex flex-col items-center gap-6 md:flex-row md:items-end">
          <motion.img
            initial={{ scale: 0.92, rotate: -2 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.65 }}
            src={cover}
            alt=""
            className="aspect-square w-[min(68vw,260px)] rounded-md object-cover shadow-[0_24px_70px_rgba(0,0,0,0.55)] md:w-56"
          />
          <div className="w-full min-w-0 text-center md:text-left">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em]">
              Playlist
            </p>
            <h1 className="truncate text-4xl font-black leading-none tracking-[-0.04em] drop-shadow md:text-6xl lg:text-7xl">
              {title?.trim() || 'Moments of You'}
            </h1>
            <p className="mt-4 text-sm text-white/70">
              A collection of moments, songs, and everything worth replaying.
            </p>
            <p className="mt-2 text-sm">
              <strong>Memoify</strong>
              <span className="text-white/65"> • {data.length} memories</span>
            </p>
          </div>
        </motion.div>
      </section>

      <div className="px-4 md:px-8">
        <div className="flex items-center gap-5 py-6">
          <button
            type="button"
            aria-label="Play memories"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition hover:scale-105 hover:bg-[#3be477] before:absolute before:inset-0 before:rounded-full before:animate-ping before:bg-[#1ed760]/20">
            <Play className="relative ml-1 h-6 w-6 fill-black" />
          </button>
          <Heart className="h-7 w-7 text-[#1ed760]" fill="currentColor" />
          <MoreHorizontal className="h-7 w-7 text-white/60" />
        </div>

        <section ref={ref3}>
          <div className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 px-2 pb-2 text-xs uppercase tracking-[0.14em] text-white/45 md:grid-cols-[36px_minmax(0,1fr)_minmax(120px,0.6fr)_50px]">
            <span>#</span>
            <span>Title</span>
            <span className="hidden md:block">Album</span>
            <Clock3 className="h-4 w-4" />
          </div>
          <PhotoProvider>
            {data.map((memory, index) => (
              <motion.div
                key={`${memory.image}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className="group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-2 transition hover:bg-white/10 md:grid-cols-[36px_minmax(0,1fr)_minmax(120px,0.6fr)_50px]">
                <span className="text-center text-sm text-white/50 group-hover:hidden">
                  {index + 1}
                </span>
                <Play className="hidden h-4 w-4 fill-white group-hover:block" />
                <div className="flex min-w-0 items-center gap-3">
                  <PlaylistCard playlist={memory} compact />
                </div>
                <span className="hidden truncate text-sm text-white/45 md:block">
                  Moments of You
                </span>
                <span className="text-xs text-white/45">3:{String(12 + index).padStart(2, '0')}</span>
              </motion.div>
            ))}
          </PhotoProvider>
        </section>

        <div ref={ref2} className="mt-8 border-t border-white/10 pt-2">
          <h2 className="px-3 pt-5 text-2xl font-bold">Songs for You</h2>
          <PlaylistSection songsForYou={songsForYou} />
        </div>

        <section className="mt-4">
          <h2 className="mb-4 text-2xl font-bold">Album art</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <PhotoProvider>
              {data.map((playlist, index) => (
                <PlaylistCard key={index} playlist={playlist} />
              ))}
            </PhotoProvider>
          </div>
        </section>
      </div>
    </div>
  );
}
