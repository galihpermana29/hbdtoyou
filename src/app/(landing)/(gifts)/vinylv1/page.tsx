'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import VinylLanding from './VinylLanding';
import VinylPlayer from './VinylPlayer';

const PREVIEW_DATA = {
  letter: `My Dearest,

From the moment our paths crossed, everything changed. The world became softer, warmer, painted in colors I never knew existed.

Every moment with you feels like a song I want to replay forever — the quiet mornings, the late-night whispers, the way you laugh when you think nobody's watching.

You are my favorite chapter, my most beautiful melody, my home.

I carry you with me in every heartbeat.

Forever yours,`,
  voiceNoteUrl:
    'https://res.cloudinary.com/dztygf08a/video/upload/v1775312959/Sal_Priadi_-_Mencintaimu_Official_Audio_afbgj8.mp3',
  voiceNoteQuote:
    '"You feel like home to me, in a way I can\'t explain."',
  videoUrl:
    'https://res.cloudinary.com/dztygf08a/video/upload/v1775396289/cutted_vgnc3x.mp4',
  memories: [
    {
      imageUrl:
        'https://res.cloudinary.com/dztygf08a/image/upload/v1766212740/main-sample.png',
      caption: 'Our candlelit night',
      date: '12 December',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/dztygf08a/image/upload/v1766212740/main-sample.png',
      caption: 'Walk on the beach',
      date: '24 January',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/dztygf08a/image/upload/v1766212740/main-sample.png',
      caption: 'Coffee date',
      date: '8 March',
    },
  ],
};

export default function VinylPreviewPage() {
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
            letter={PREVIEW_DATA.letter}
            voiceNoteUrl={PREVIEW_DATA.voiceNoteUrl}
            voiceNoteQuote={PREVIEW_DATA.voiceNoteQuote}
            videoUrl={PREVIEW_DATA.videoUrl}
            memories={PREVIEW_DATA.memories}
          />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}>
          <VinylLanding
            recipientName="Widya"
            onComplete={() => setIsOpened(true)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
