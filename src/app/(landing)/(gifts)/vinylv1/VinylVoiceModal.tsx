'use client';

import { useRef, useState } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

interface VinylVoiceModalProps {
  open: boolean;
  onClose: () => void;
  audioUrl?: string;
  quote?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function WaveformBars() {
  const bars = [
    3, 5, 8, 4, 7, 10, 6, 9, 5, 8, 12, 7, 4, 9, 6, 11, 5, 8, 3, 7, 10, 6,
    4, 8, 5, 9, 7, 11, 6, 3, 8, 5, 10, 7, 4, 9, 6, 8, 5, 3,
  ];

  return (
    <div className="flex items-center gap-[2px] h-10 flex-1">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-[#8B6F5E]"
          style={{ height: `${h * 3}px`, opacity: i < 20 ? 1 : 0.35 }}
        />
      ))}
    </div>
  );
}

export default function VinylVoiceModal({
  open,
  onClose,
  audioUrl,
  quote,
}: VinylVoiceModalProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      await audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!audioUrl) {
    return (
      <ModalWrapper open={open} onClose={onClose}>
        <div className="flex flex-col items-center py-8 text-[#8a7060]">
          <div className="w-14 h-14 rounded-full bg-[#f0e6dc] flex items-center justify-center mb-3">
            <Mic size={24} className="text-[#8B6F5E]" />
          </div>
          <p className="font-serif text-lg">No voice note provided</p>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-[#f0e6dc] flex items-center justify-center mb-3">
          <Mic size={24} className="text-[#8B6F5E]" />
        </div>

        <h2 className="font-serif text-xl text-[#2a1810] mb-5">
          A voice note for you
        </h2>

        <div className="w-full flex items-center gap-3 mb-2">
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-[#5a3e2e] flex items-center justify-center flex-shrink-0 hover:bg-[#4a3020] transition-colors"
          >
            {isPlaying ? (
              <Pause size={18} className="text-white" />
            ) : (
              <Play size={18} className="text-white ml-0.5" />
            )}
          </button>
          <WaveformBars />
        </div>

        <div className="w-full flex justify-between text-xs text-[#8a7060] mb-5">
          <span>{formatTime(currentTime)}</span>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {quote && (
          <p className="font-serif italic text-[#5a4a3a] text-center text-[15px]">
            {quote}
          </p>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={() =>
          setCurrentTime(audioRef.current?.currentTime ?? 0)
        }
        onLoadedMetadata={() =>
          setDuration(audioRef.current?.duration ?? 0)
        }
        onEnded={() => setIsPlaying(false)}
      />
    </ModalWrapper>
  );
}
