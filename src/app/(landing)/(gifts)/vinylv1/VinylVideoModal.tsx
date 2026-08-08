'use client';

import { Play, Video } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

interface VinylVideoModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export default function VinylVideoModal({
  open,
  onClose,
  videoUrl,
}: VinylVideoModalProps) {
  if (!videoUrl) {
    return (
      <ModalWrapper open={open} onClose={onClose}>
        <div className="flex flex-col items-center py-8 text-[#8a7060]">
          <div className="w-14 h-14 rounded-full bg-[#f0e6dc] flex items-center justify-center mb-3">
            <Video size={24} className="text-[#8B6F5E]" />
          </div>
          <p className="font-serif text-lg">No video provided</p>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <h2 className="font-serif text-2xl text-[#2a1810] text-center mb-4">
        Our Video
      </h2>

      <div className="rounded-xl overflow-hidden">
        <video
          src={videoUrl}
          controls
          className="w-full aspect-video"
        />
      </div>
    </ModalWrapper>
  );
}
