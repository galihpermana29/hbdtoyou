'use client';

import { ChevronRight } from 'lucide-react';
import PlaylistCard from './playlist-card';
import PlaylistSection from './playlist-section';

const playlists = [
  {
    title: '#1',
    description: 'At Jokopi, Malang, Indonesia',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: '#2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: '#3',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: '#4',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: '#5',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: '#6',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: '#7',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: '#8',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
];

export default function MainContent({
  momentOfYou,
  songsForYou,
}: {
  momentOfYou?: any[];
  songsForYou?: any[];
}) {
  const data = momentOfYou
    ? momentOfYou.map((dx: any, idx) => ({
        title: `#${idx + 1}`,
        description: '',
        image: dx,
      }))
    : playlists;

  return (
    <div>
      <PlaylistSection songsForYou={songsForYou} />
      <div className="p-4 md:p-6 bg-gradient-to-b from-[#1e1e1e] to-[#121212] rounded-[8px]">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Moment of You
            </h2>
            <button className="text-sm font-semibold text-neutral-400 hover:text-white transition flex items-center gap-1">
              Show all
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {data.map((playlist, index) => (
              <PlaylistCard key={index} playlist={playlist} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
