'use client';

import PlaylistRow from './playlist-row';

export const playlists = [
  '5Y35SjAfXjjG0sFQ3KOxmm',
  '3JeDm203MFpRlzSFaoNEv2',
  '7qiZfU4dY1lWllzX7mPBI3',
  // '2CFpkbOfYe23ZoMfufNKVB',
  // '7qiZfU4dY1lWllzX7mPBI3',
  // '2CFpkbOfYe23ZoMfufNKVB',
];

export default function PlaylistSection({
  songsForYou,
}: {
  songsForYou?: any[];
}) {
  const data = songsForYou ? songsForYou : playlists;
  return (
    <section className="mb-6 mt-6 mx-3">
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
          {data.map((playlist, index) => (
            <PlaylistRow key={index} playlist={playlist} />
          ))}
        </div>
      </div>
    </section>
  );
}
