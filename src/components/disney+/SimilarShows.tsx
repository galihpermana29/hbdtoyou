'use client';

import Image from 'next/image';

const similarShows = [
  {
    id: 1,
    title: 'The Fiery Fist II',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735327153/fe7jd3ngffjhkrkrb90e.jpg',
  },
  {
    id: 2,
    title: 'Shop for Killers',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735327153/ovks2ojj7kksl8k9mdrx.jpg',
  },
  // Add more shows as needed
];

export default function SimilarShows() {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">More Like This</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {similarShows.map((show) => (
          <div
            key={show.id}
            className="relative aspect-[2/3] rounded-lg overflow-hidden group">
            <Image
              src={show.image}
              alt={show.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <h3 className="text-sm font-bold">{show.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
