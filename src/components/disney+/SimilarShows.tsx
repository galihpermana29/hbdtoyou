'use client';

import Image from 'next/image';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.

const similarShows = [
  {
    id: 1,
    title: 'The Fiery Fist II',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_2:3,g_auto/v1789284277/placeholder/__1_z5hfhd.jpg',
  },
  {
    id: 2,
    title: 'Shop for Killers',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_2:3,g_auto/v1789284277/placeholder/__2_km7zqq.jpg',
  },
  {
    id: 3,
    title: 'Shop for Killers',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_2:3,g_auto/v1789284307/placeholder/__3_h2qoju.jpg',
  },
  {
    id: 21,
    title: 'Shop for Killers',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_2:3,g_auto/v1789284277/placeholder/__db1ief.jpg',
  },
  {
    id: 22,
    title: 'Shop for Killers',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_2:3,g_auto/v1789284278/placeholder/museum_Date_Outfit_Ideas___Academic_Chic_Poetcore_Style_n5nvg7.jpg',
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
