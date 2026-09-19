'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';

// TODO(placeholder-images): these are temporary stock photos served from Cloudinary
// cloud `dfwrmapr4`, standing in for the sample images lost when cloud `dxuumohme`
// hit its plan limit and started returning 401 (audited 2026-09-12). They are cropped
// per slot with `c_fill,ar_*,g_auto`. Move them into `public/` so no Cloudinary
// account can break them again, or swap in real art for this template.
const FALLBACK_TRAILER =
  'https://res.cloudinary.com/dfwrmapr4/image/upload/c_fill,ar_16:9,g_auto/v1789284278/placeholder/City_tram_window_daydate_outfit_cwrxma.jpg';

export default function TrailerSection({ data }: { data?: string }) {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">Trailers & More</h2>
      <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
        <Image
          src={data || FALLBACK_TRAILER}
          alt="The Jumbotron"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Play className="h-12 w-12" />
            <span className="text-lg font-bold">See trailer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
