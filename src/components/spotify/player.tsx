'use client';

import PlayerControls from './player/controls';
import PlayerVolume from './player/volume';
import PlayerTrackInfo from './player/track-info';

export default function Player({
  imageUri,
  modalContent,
}: {
  imageUri?: string;
  modalContent?: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#282828] px-2 md:px-4 py-2 md:py-3 z-[9999]">
      <div className="flex items-center justify-between gap-2">
        <PlayerTrackInfo imageUri={imageUri} />
        <PlayerControls modalContent={modalContent} />
        <PlayerVolume />
      </div>
    </div>
  );
}
