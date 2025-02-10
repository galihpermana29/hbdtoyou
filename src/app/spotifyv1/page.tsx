'use client';

import Header from '@/components/spotify/header';
import MainContent from '@/components/spotify/main-content';
import Player from '@/components/spotify/player';
import Sidebar from '@/components/spotify/sidebar';
import { Tour, TourProps } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';

export default function HomePage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Our Song',
      description: (
        <div className="max-w-[250px]">
          This is list of you and your partners songs
        </div>
      ),
      target: () => ref1?.current,
    },
    {
      title: 'Songs For You',
      description: (
        <div className="max-w-[250px]">
          This is list of dedicated or most described song about your partner
        </div>
      ),
      target: () => ref2?.current,
    },
    {
      title: 'Moments',
      description: (
        <div className="max-w-[250px]">
          Put all of your memories in here, let it be your story.
        </div>
      ),
      target: () => ref3?.current,
    },
    {
      title: 'Click play, and see the Modal',
      description: (
        <div className="max-w-[250px]">
          You can write a letter in here, says how you feel about.
        </div>
      ),
      target: () => ref4?.current,
    },
  ];
  const queryURL = useSearchParams();
  const isTutorial = queryURL.get('isTutorial');

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="h-screen bg-black">
      <Tour
        open={isTutorial === 'true'}
        steps={steps}
        onChange={(current) => {
          router.replace(pathname + '?isTutorial=true&steps=' + current);
        }}
        onClose={() => {
          router.replace(pathname);
        }}
        onFinish={() => {
          router.replace(pathname);
        }}
      />
      <div className="flex h-[calc(100%-96px)] gap-[20px]">
        <div className="hidden lg:block w-[320px]" />
        <Sidebar ref1={ref1} />
        <main className="flex-1 overflow-y-auto">
          <Header />
          <MainContent ref2={ref2} ref3={ref3} />
        </main>
      </div>
      <Player ref4={ref4} />
    </div>
  );
}
