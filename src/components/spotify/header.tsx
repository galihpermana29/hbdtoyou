'use client';

import { Search, Bell, Users } from 'lucide-react';
import { Input } from './ui/input';

export default function Header({ imageUri }: { imageUri?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/70 p-3 backdrop-blur-xl md:p-4">
      <div className="flex items-center justify-between max-w-full gap-4">
        <div className="ml-12 hidden text-xl font-black tracking-tight text-white sm:block lg:ml-0">
          memoify<span className="text-[#1ed760]">fy</span>
        </div>
        <div className="ml-12 max-w-xl flex-1 sm:ml-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              className="w-full pl-10 bg-[#242424] border-none placeholder:text-neutral-400 focus-visible:ring-0"
              placeholder="What do you want to play?"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:scale-105 md:block">
            Made for you
          </button>
          <button aria-label="Notifications" className="hidden rounded-full p-2 hover:bg-[#242424] sm:block">
            <Bell className="h-5 w-5 text-neutral-400" />
          </button>
          <button aria-label="Friends" className="hidden rounded-full p-2 hover:bg-[#242424] sm:block">
            <Users className="h-5 w-5 text-neutral-400" />
          </button>
          <button aria-label="Profile" className="rounded-full bg-[#242424] p-1 shadow hover:bg-[#333]">
            <img
              src={
                imageUri ??
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&q=80'
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
