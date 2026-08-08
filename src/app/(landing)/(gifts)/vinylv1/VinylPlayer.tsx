'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useState } from 'react';

import vinylBg2 from '@/assets/vinyl-bg-2.png';
import vinylCamRecorder from '@/assets/vinyl-cam-recorder.png';
import vinylDisk from '@/assets/vinyl-disk.png';
import vinylPaper from '@/assets/vinyl-paper.png';
import vinylPolaroids from '@/assets/vinyl-polaroids.png';
import vinylTape from '@/assets/vinyl-tape.png';
import vinylTurntable from '@/assets/vinyl-turntable.png';

import VinylLetterModal from './VinylLetterModal';
import VinylMemoriesModal from './VinylMemoriesModal';
import VinylMusicBar from './VinylMusicBar';
import VinylVideoModal from './VinylVideoModal';
import VinylVoiceModal from './VinylVoiceModal';

interface Memory {
  imageUrl: string;
  caption: string;
  date: string;
}

interface VinylPlayerProps {
  songUrl?: string;
  songTitle?: string;
  songArtist?: string;
  letter?: string;
  voiceNoteUrl?: string;
  voiceNoteQuote?: string;
  videoUrl?: string;
  memories?: Memory[];
}

type ModalType = 'voice' | 'memories' | 'letter' | 'video' | null;

const DEMO_SONG_URL =
  'https://res.cloudinary.com/dztygf08a/video/upload/v1775312959/Sal_Priadi_-_Mencintaimu_Official_Audio_afbgj8.mp3';

const iconHover = {
  whileHover: { scale: 1.08 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
};

export default function VinylPlayer({
  songUrl,
  songTitle,
  songArtist,
  letter,
  voiceNoteUrl,
  voiceNoteQuote,
  videoUrl,
  memories,
}: VinylPlayerProps = {}) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden select-none bg-[#3a3530]">
      <Image
        src={vinylBg2}
        alt="Desk background"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />

      <div className="absolute inset-0 z-10 pb-[72px]">
        <div className="relative h-full w-full">
          {/* Turntable - center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] max-w-[350px] aspect-square sm:w-[35vw] sm:max-w-[350px]">
            <Image
              src={vinylTurntable}
              alt="Turntable"
              fill
              className="object-contain drop-shadow-lg"
            />
            {/* Disc overlay - aligned to platter (slightly left of center due to tonearm) */}
            <div className="absolute top-[3%] left-[3%] w-[87%] aspect-square flex items-center justify-center">
              <div
                className={`relative w-full aspect-square rounded-full ${isPlaying ? 'animate-vinyl-spin' : ''
                  }`}
              >
                <Image
                  src={vinylDisk}
                  alt="Spinning vinyl"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Cassette tape - top left */}
          <motion.button
            {...iconHover}
            onClick={() => setActiveModal('voice')}
            className="absolute sm:top-[4%] sm:left-[4%] top-[15%] left-[6%] w-[30%] sm:w-[40%] max-w-[200px] cursor-pointer"
          >
            <Image
              src={vinylTape}
              alt="Cassette tape"
              width={300}
              height={195}
              className="object-contain drop-shadow-md"
            />
          </motion.button>

          {/* Polaroids - bottom left */}
          <motion.button
            {...iconHover}
            onClick={() => setActiveModal('memories')}
            className="absolute sm:bottom-[4%] sm:left-[4%] bottom-[15%] left-[6%] w-[30%] sm:w-[40%] max-w-[210px] cursor-pointer"
          >
            <Image
              src={vinylPolaroids}
              alt="Polaroid photos"
              width={300}
              height={240}
              className="object-contain drop-shadow-md"
            />
          </motion.button>

          {/* Letter - top right */}
          <motion.button
            {...iconHover}
            onClick={() => setActiveModal('letter')}
            className="absolute sm:top-[3%] sm:right-[4%] top-[15%] right-[6%] w-[30%] sm:w-[40%] max-w-[210px] cursor-pointer"
          >
            <Image
              src={vinylPaper}
              alt="Letter"
              width={300}
              height={210}
              className="object-contain drop-shadow-md"
            />
          </motion.button>

          {/* Camcorder - bottom right */}
          <motion.button
            {...iconHover}
            onClick={() => setActiveModal('video')}
            className="absolute sm:bottom-[4%] sm:right-[4%] bottom-[15%] right-[6%] w-[30%] sm:w-[40%] max-w-[190px] cursor-pointer"
          >
            <Image
              src={vinylCamRecorder}
              alt="Camcorder"
              width={300}
              height={210}
              className="object-contain drop-shadow-md"
            />
          </motion.button>
        </div>
      </div>

      <VinylMusicBar
        songUrl={songUrl || DEMO_SONG_URL}
        title={songTitle || 'Mencintaimu'}
        artist={songArtist || 'Sal Priadi'}
        onPlayStateChange={handlePlayStateChange}
      />

      <VinylVoiceModal
        open={activeModal === 'voice'}
        onClose={() => setActiveModal(null)}
        audioUrl={voiceNoteUrl}
        quote={voiceNoteQuote}
      />
      <VinylMemoriesModal
        open={activeModal === 'memories'}
        onClose={() => setActiveModal(null)}
        memories={memories}
      />
      <VinylLetterModal
        open={activeModal === 'letter'}
        onClose={() => setActiveModal(null)}
        body={letter}
      />
      <VinylVideoModal
        open={activeModal === 'video'}
        onClose={() => setActiveModal(null)}
        videoUrl={videoUrl}
      />

      <style jsx global>{`
        @keyframes vinyl-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-vinyl-spin {
          animation: vinyl-spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
