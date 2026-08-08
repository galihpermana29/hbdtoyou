'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import VinylLanding from './VinylLanding';
import VinylPlayer from './VinylPlayer';

interface Memory {
  imageUrl: string;
  caption: string;
  date: string;
}

interface VinylDynamicProps {
  recipientName: string;
  songUrl: string;
  songTitle: string;
  songArtist: string;
  letter: string;
  voiceNoteUrl: string;
  voiceNoteQuote: string;
  videoUrl: string;
  memories: Memory[];
}

export default function VinylDynamic({
  recipientName,
  songUrl,
  songTitle,
  songArtist,
  letter,
  voiceNoteUrl,
  voiceNoteQuote,
  videoUrl,
  memories,
}: VinylDynamicProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {isOpened ? (
        <motion.div
          key="player"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}>
          <VinylPlayer
            songUrl={songUrl}
            songTitle={songTitle}
            songArtist={songArtist}
            letter={letter}
            voiceNoteUrl={voiceNoteUrl}
            voiceNoteQuote={voiceNoteQuote}
            videoUrl={videoUrl}
            memories={memories}
          />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}>
          <VinylLanding
            recipientName={recipientName}
            onComplete={() => setIsOpened(true)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
