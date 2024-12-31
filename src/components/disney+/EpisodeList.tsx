'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';

const episodes = [
  {
    id: 1,
    title: 'Episode 1: Jadi mahasiswa baru',
    episode: 'S1 E1',
    date: '14 Aug 2024',
    duration: '41m',
    description:
      'lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, quia.',
    thumbnail:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735327153/fe7jd3ngffjhkrkrb90e.jpg',
  },
  {
    id: 2,
    title: 'Episode 2: MBKM moment',
    episode: 'S1 E2',
    date: '14 Aug 2024',
    duration: '36m',
    description:
      'Lim Sang receives an order to eliminate Miyong and his men who were involved in the assault.',
    thumbnail:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735327153/l5yvcs5gd1kwvxfnnhzs.jpg',
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
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Season 1</h2>
      {dx.map((episode) => (
        <div
          key={episode.id}
          className="flex flex-col md:flex-row gap-4 bg-[#232631] rounded-lg overflow-hidden hover:bg-[#2A2E3A] transition-colors">
          <div className="relative w-full md:w-64 h-40">
            <Image
              src={episode.thumbnail}
              alt={episode.title}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <Play className="h-12 w-12" />
            </div>
          </div>
          <div className="p-4 flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{episode.title}</h3>
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
  );
}
