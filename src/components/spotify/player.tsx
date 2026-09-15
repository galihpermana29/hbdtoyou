'use client';

import PlayerControls from './player/controls';
import PlayerVolume from './player/volume';
import PlayerTrackInfo from './player/track-info';

export default function Player({
  imageUri,
  modalContent,
  ref4,
}: {
  imageUri?: string;
  modalContent?: string;
  ref4?: any;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-white/10 bg-gradient-to-r from-[#0b1510] via-black to-[#120e13] px-2 py-2 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] md:px-4 md:py-3">
      <div className="flex items-center justify-between gap-2" ref={ref4}>
        <PlayerTrackInfo imageUri={imageUri} />
        <PlayerControls modalContent={modalContent} />
        <PlayerVolume />
      </div>
    </div>
  );
}
