'use client';

import PlaylistRow from './playlist-row';

const playlists = [
  {
    title: 'Liked Songs',
    subtitle: 'Playlist',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'Daily Mix 1',
    subtitle: 'Peterpan, Sheila On 7',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'This Is Guyon Waton',
    subtitle: 'Playlist • Guyon Waton',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
  {
    title: 'NIKI',
    subtitle: 'Artist',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735231561/gemsi8y1c20pwhdespcf.jpg',
  },
];

export default function PlaylistSection() {
  return (
    <section className="mb-6 mt-6">
      <div className="flex items-center gap-4 mb-4">
        <button className="px-3 py-1 text-sm font-medium text-white bg-[#282828] rounded-full hover:bg-[#3e3e3e] transition">
          All
        </button>
        <button className="px-3 py-1 text-sm font-medium text-white bg-[#282828] rounded-full hover:bg-[#3e3e3e] transition">
          Music
        </button>
        <button className="px-3 py-1 text-sm font-medium text-white bg-[#282828] rounded-full hover:bg-[#3e3e3e] transition">
          Podcasts
        </button>
      </div>
      <div>
        <div className="flex flex-wrap gap-4 min-w-min pb-4">
          {playlists.map((playlist, index) => (
            <PlaylistRow key={index} playlist={playlist} />
          ))}
        </div>
      </div>
    </section>
  );
}
