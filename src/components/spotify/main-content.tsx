'use client';

import { ChevronRight } from 'lucide-react';
import PlaylistCard from './playlist-card';
import PlaylistSection from './playlist-section';

const playlists = [
  {
    title: 'Daily Mix 1',
    description: "Peterpan, Sheila On 7, D'MASIV and more",
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'Daily Mix 2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'Daily Mix 2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'Daily Mix 2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'Daily Mix 2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'Daily Mix 2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'Daily Mix 2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'Daily Mix 2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
];

export default function MainContent() {
  return (
    <div>
      <PlaylistSection />
      <div className="p-4 md:p-6 bg-gradient-to-b from-[#1e1e1e] to-[#121212] rounded-[8px]">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Made For You
            </h2>
            <button className="text-sm font-semibold text-neutral-400 hover:text-white transition flex items-center gap-1">
              Show all
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {playlists.map((playlist, index) => (
              <PlaylistCard key={index} playlist={playlist} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
