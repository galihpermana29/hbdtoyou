'use client';

import Image from 'next/image';

const similarShows = [
  {
    id: 1,
    title: 'The Fiery Fist II',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736524133/jqvhwsg2jeztjznxwbph.jpg',
  },
  {
    id: 2,
    title: 'Shop for Killers',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736524123/nzdbzleig7ssk6sf7ch5.jpg',
  },
  {
    id: 3,
    title: 'Shop for Killers',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736524116/wexe6mglvlsfzyji0fq4.jpg',
  },
  {
    id: 21,
    title: 'Shop for Killers',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736524119/lji4u4epdrf0nr1vbq4x.jpg',
  },
  {
    id: 22,
    title: 'Shop for Killers',
    image:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1736524120/xvpfzciuktzzjcpnicjt.jpg',
  },
  // Add more shows as needed
];

export default function SimilarShows({ data }: { data?: string[] }) {
  const dx = data
    ? data.map((dy, idx) => ({
        id: idx,
        image: dy,
        title: 'Show ' + (idx + 1),
      }))
    : similarShows;
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">More Like This</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {dx.map((show) => (
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
