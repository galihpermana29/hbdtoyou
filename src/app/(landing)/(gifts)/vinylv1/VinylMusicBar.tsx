'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ListMusic,
  MessageCircle,
  Volume2,
} from 'lucide-react';

interface VinylMusicBarProps {
  songUrl: string;
  title: string;
  artist: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function VinylMusicBar({
  songUrl,
  title,
  artist,
  onPlayStateChange,
}: VinylMusicBarProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      await audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a1a1a]/90 backdrop-blur-md border-t border-white/10">
      <div
        className="h-1 cursor-pointer group"
        onClick={handleSeek}
      >
        <div className="h-full bg-white/20 relative">
          <div
            className="absolute inset-y-0 left-0 bg-amber-600 transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-amber-900/60 flex-shrink-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-amber-200/40" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{title}</p>
            <p className="text-white/50 text-xs truncate">{artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white/60 hover:text-white transition-colors">
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={18} className="text-[#1a1a1a]" />
            ) : (
              <Play size={18} className="text-[#1a1a1a] ml-0.5" />
            )}
          </button>
          <button className="text-white/60 hover:text-white transition-colors">
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <span className="text-white/40 text-xs hidden sm:block">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button className="text-white/40 hover:text-white transition-colors hidden sm:block">
            <ListMusic size={18} />
          </button>
          <button className="text-white/40 hover:text-white transition-colors hidden sm:block">
            <MessageCircle size={18} />
          </button>
          <button className="text-white/40 hover:text-white transition-colors hidden sm:block">
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={songUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}
