'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';

export default function TrailerSection() {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">Trailers & More</h2>
      <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
        <Image
          src="https://res.cloudinary.com/dxuumohme/image/upload/v1735327153/ovks2ojj7kksl8k9mdrx.jpg"
          alt="The Tyrant Trailer"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Play className="h-12 w-12" />
            <span className="text-lg font-bold">The Tyrant - Trailer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
