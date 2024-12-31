'use client';

import { Home, Search, Library, Plus, Heart, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { playlists } from './playlist-section';

export default function Sidebar({ ourSongs }: { ourSongs?: any[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 text-white p-2 hover:bg-[#282828] rounded-full">
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 bg-black w-[320px] md:w-[320px] lg:w-[320px] p-2 transition-transform duration-300 z-40',
          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        )}>
        <div className="space-y-2 mt-14 lg:mt-0">
          <div className="bg-[#121212] rounded-lg p-4">
            <div className="space-y-4">
              <button className="flex items-center gap-4 text-neutral-200 hover:text-white transition w-full">
                <Home className="h-6 w-6" />
                <span className="font-semibold">Home</span>
              </button>
              <button className="flex items-center gap-4 text-neutral-200 hover:text-white transition w-full">
                <Search className="h-6 w-6" />
                <span className="font-semibold">Search</span>
              </button>
            </div>
          </div>

          <div className="bg-[#121212] rounded-lg p-4 h-[calc(100vh-200px)]">
            <div className="flex items-center justify-between mb-4">
              <button className="flex items-center gap-2 text-neutral-200 hover:text-white transition">
                <Library className="h-6 w-6" />
                <span className="font-semibold">Your Library</span>
              </button>
              <button className="text-neutral-200 hover:text-white hover:bg-[#242424] p-2 rounded-full transition">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#242424] p-4 rounded-lg hover:bg-[#2a2a2a] transition cursor-pointer">
                <h3 className="font-bold text-white mb-1">Our Songs</h3>
                <p className="text-sm text-neutral-400">Playlist • 123 songs</p>
              </div>
              <div className="max-h-[48vh] overflow-y-auto flex flex-col gap-[8px]">
                {ourSongs
                  ? ourSongs.map((dx: any) => (
                      <iframe
                        key={dx}
                        src={`https://open.spotify.com/embed/track/${dx}`}
                        height={80}
                        className="w-full"></iframe>
                    ))
                  : playlists.map((dx: any) => (
                      <iframe
                        key={dx}
                        src={`https://open.spotify.com/embed/track/${dx}`}
                        height={80}
                        className="w-full"></iframe>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
