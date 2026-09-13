'use client';

import { ChevronRight } from 'lucide-react';
import PlaylistCard from './playlist-card';
import PlaylistSection from './playlist-section';
import { PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.
const playlists = [
  {
    title: '#1',
    description: 'At Jokopi, Malang, Indonesia',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284277/placeholder/__1_z5hfhd.jpg',
  },
  {
    title: '#2',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284277/placeholder/__2_km7zqq.jpg',
  },
  {
    title: '#3',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284307/placeholder/__3_h2qoju.jpg',
  },
  {
    title: '#4',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284277/placeholder/__db1ief.jpg',
  },
  {
    title: '#5',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/museum_Date_Outfit_Ideas___Academic_Chic_Poetcore_Style_n5nvg7.jpg',
  },
  {
    title: '#6',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/Butter_Color_Dress__Elegant_Spring_Formal_Look_luzpa3.jpg',
  },
  {
    title: '#7',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284278/placeholder/City_tram_window_daydate_outfit_cwrxma.jpg',
  },
  {
    title: '#8',
    description: 'Tinky Winky, Rebellion Rose, CREWSAKAN and more',
    image:
      'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_1:1,g_auto/v1789284279/placeholder/Minimalist_Black_Tee_Wide-Leg_Trousers_Outfit___Chic_Quiet_Luxury_Women_s_Fashion_2026_kiyext.jpg',
  },
];

export default function MainContent({
  momentOfYou,
  songsForYou,
  ref2,
  ref3,
}: {
  momentOfYou?: any[];
  songsForYou?: any[];
  ref2?: any;
  ref3?: any;
}) {
  const data = momentOfYou
    ? typeof momentOfYou === 'string'
      ? [momentOfYou].map((dx: any, idx) => ({
          title: `#${idx + 1}`,
          description: '',
          image: dx,
        }))
      : momentOfYou.map((dx: any, idx) => ({
          title: `#${idx + 1}`,
          description: '',
          image: dx,
        }))
    : playlists;

  return (
    <div>
      <div ref={ref2}>
        <PlaylistSection songsForYou={songsForYou} />
      </div>
      <div className="p-4 md:p-6 bg-gradient-to-b from-[#1e1e1e] to-[#121212] rounded-[8px]">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white" ref={ref3}>
              Moment of You
            </h2>
            <button className="text-sm font-semibold text-neutral-400 hover:text-white transition flex items-center gap-1">
              Show all
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            <PhotoProvider>
              {data.map((playlist, index) => (
                <PlaylistCard key={index} playlist={playlist} />
              ))}
            </PhotoProvider>
          </div>
        </section>
      </div>
    </div>
  );
}
