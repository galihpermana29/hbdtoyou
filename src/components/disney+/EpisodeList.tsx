'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.

const episodes = [
  {
    id: 1,
    title: 'Episode 1:',
    episode: 'S1 E1',
    date: '14 Aug 2024',
    duration: '41m',
    description:
      'lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, quia.',
    thumbnail:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_8:5,g_auto/v1789284276/placeholder/Business_Formal_Outfit_for_Women_kl6jkx.jpg',
  },
  {
    id: 2,
    title: 'Episode 2:',
    episode: 'S1 E2',
    date: '14 Aug 2024',
    duration: '36m',
    description:
      'Lim Sang receives an order to eliminate Miyong and his men who were involved in the assault.',
    thumbnail:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_8:5,g_auto/v1789284278/placeholder/Butter_Color_Dress__Elegant_Spring_Formal_Look_luzpa3.jpg',
  },
  // Add more episodes as needed
];

export default function EpisodeList({ data }: { data?: any[] }) {
  const dx = data
    ? data.map((dy, idx) => ({
        id: idx,
        title: dy.title,
        episode: 'S1 E' + (idx + 1),
        date: '14 Aug 2024',
        duration: '41m',
        description: dy.desc,
        thumbnail: dy.imageUrl,
      }))
    : episodes;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Season 1</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/65">
          {dx.length} episodes
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
      {dx.map((episode, index) => (
        <div
          key={episode.id}
          className="group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-[#171c2c] to-[#0d1220] transition duration-300 hover:-translate-y-1 hover:border-[#00b9ff]/30 hover:shadow-[0_16px_40px_rgba(0,185,255,0.08)] sm:flex-row">
          <div className="relative h-48 w-full sm:h-auto sm:w-48">
            <Image
              src={episode.thumbnail}
              alt={episode.title}
              fill
              sizes="(max-width: 640px) 100vw, 192px"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#040714] shadow-xl">
                <Play className="h-5 w-5 fill-current" />
              </span>
            </div>
          </div>
          <div className="flex-1 p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">
                <span className="mr-2 text-[#00b9ff]">{index + 1}.</span>
                {episode.title}
              </h3>
              <span className="text-sm text-gray-400">{episode.duration}</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              {episode.episode} • {episode.date}
            </p>
            <p className="text-sm text-gray-300">{episode.description}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
