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
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-[#00b9ff]">
            Curated for you
          </p>
          <h2 className="text-2xl font-bold">More Like This</h2>
        </div>
        <span className="text-sm text-white/50">{dx.length} memories</span>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {dx.map((show, index) => (
          <div
            key={show.id}
            className="group relative aspect-[2/3] w-[48vw] max-w-[230px] shrink-0 snap-start overflow-hidden rounded-lg bg-white/5 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(0,185,255,0.18)] sm:w-[32vw] md:w-[22vw] lg:w-[18vw]">
            <Image
              src={show.image}
              alt={show.title}
              fill
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 22vw, 18vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#040714] via-transparent to-transparent p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00b9ff]">
                  Memory {index + 1}
                </p>
                <h3 className="mt-1 text-sm font-bold">{show.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
