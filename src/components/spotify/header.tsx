'use client';

import { Search, Bell, Users } from 'lucide-react';
import { Input } from './ui/input';

export default function Header({ imageUri }: { imageUri?: string }) {
  return (
    <header className="sticky top-0 bg-[#070707] z-10 p-4">
      <div className="flex items-center justify-between max-w-full gap-4">
        <div className="flex-1 max-w-xl ml-14 lg:ml-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              className="w-full pl-10 bg-[#242424] border-none placeholder:text-neutral-400 focus-visible:ring-0"
              placeholder="What do you want to play?"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button className="hidden sm:block text-white px-4 py-2 rounded-full bg-[#242424] hover:scale-105 transition">
            Explore Premium
          </button>
          <button className="p-2 hover:bg-[#242424] rounded-full">
            <Bell className="h-5 w-5 text-neutral-400" />
          </button>
          <button className="p-2 hover:bg-[#242424] rounded-full">
            <Users className="h-5 w-5 text-neutral-400" />
          </button>
          <button className="p-1 hover:bg-[#242424] rounded-full">
            <img
              src={
                imageUri ??
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&q=80'
              }
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
