'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const audioUrl =
    'https://res.cloudinary.com/braiwjaya-university/video/upload/v1763140918/Semo_-_The_Last_Dance_e016fm.mp3';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Start music on first user interaction
  // useEffect(() => {
  //   const startMusicOnInteraction = async () => {
  //     if (hasUserInteracted) return;

  //     const audio = audioRef.current;
  //     if (!audio) return;

  //     try {
  //       audio.volume = 0.5;
  //       await audio.play();
  //       setIsPlaying(true);
  //       setHasUserInteracted(true);
  //       console.log('🎵 Music started after user interaction!');

  //       // Remove all listeners after successful start
  //       document.removeEventListener('click', startMusicOnInteraction);
  //       document.removeEventListener('keydown', startMusicOnInteraction);
  //       document.removeEventListener('touchstart', startMusicOnInteraction);
  //       document.removeEventListener('scroll', startMusicOnInteraction);
  //     } catch (error) {
  //       console.log('Failed to start music:', error);
  //     }
  //   };

  //   if (!hasUserInteracted) {
  //     // Listen for any user interaction
  //     document.addEventListener('click', startMusicOnInteraction);
  //     document.addEventListener('keydown', startMusicOnInteraction);
  //     document.addEventListener('touchstart', startMusicOnInteraction);
  //     document.addEventListener('scroll', startMusicOnInteraction);
  //   }

  //   return () => {
  //     document.removeEventListener('click', startMusicOnInteraction);
  //     document.removeEventListener('keydown', startMusicOnInteraction);
  //     document.removeEventListener('touchstart', startMusicOnInteraction);
  //     document.removeEventListener('scroll', startMusicOnInteraction);
  //   };
  // }, [hasUserInteracted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.volume = 0.5;
        await audio.play();
        setIsPlaying(true);
        setHasUserInteracted(true);
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        loop
        crossOrigin="anonymous"
      />

      {/* Simple Floating Music Player */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
      </div>
    </>
  );
};

export default MusicPlayer;
