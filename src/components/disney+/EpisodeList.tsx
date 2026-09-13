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
