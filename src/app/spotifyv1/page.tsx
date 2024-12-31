'use client';

import Header from '@/components/spotify/header';
import MainContent from '@/components/spotify/main-content';
import Player from '@/components/spotify/player';
import Sidebar from '@/components/spotify/sidebar';

export default function HomePage() {
  return (
    <div className="h-screen bg-black">
      <div className="flex h-[calc(100%-96px)] gap-[20px]">
        <div className="hidden lg:block w-[320px]" />
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Header />
          <MainContent />
        </main>
      </div>
      <Player />
    </div>
  );
}
