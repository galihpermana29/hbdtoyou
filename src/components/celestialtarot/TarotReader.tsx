'use client';

import { useMemo, useState } from 'react';
import { TarotData } from './types';
import { INITIAL_CARDS } from './constants';
import { AnimatePresence, motion } from 'framer-motion';
import TarotCard from './TarotCard';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface TarotReaderProps {
  data: TarotData;
}

export default function TarotReader({ data }: TarotReaderProps) {
  const [phase, setPhase] = useState<'selection' | 'carousel'>('selection');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const cards = useMemo(() => {
    return [...INITIAL_CARDS].sort(() => Math.random() - 0.5);
  }, []);

  const handleCardClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
      return;
    }

    if (selectedIndices.length >= 3) return;

    setSelectedIndices([...selectedIndices, index]);
  };

  const startReveal = () => {
    if (selectedIndices.length === 3) {
      setPhase('carousel');
    }
  };

  const selectedCards = selectedIndices.map((idx, order) => ({
    ...cards[idx],
    saying: data.sayings[order],
  }));

  const nextCard = () => {
    if (currentIndex < 2) setCurrentIndex((v) => v + 1);
  };

  const prevCard = () => {
    if (currentIndex > 0) setCurrentIndex((v) => v - 1);
  };

  const Constellation = ({
    top,
    left,
    glow,
  }: {
    top: string;
    left: string;
    glow?: boolean;
  }) => (
    <div
      className={`absolute w-[1px] h-[1px] bg-white rounded-full ${
        glow
          ? 'shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]'
          : 'shadow-[0_0_4px_1px_rgba(255,255,255,0.4)]'
      }`}
      style={{ top, left }}
    />
  );

  return (
    <div className="tarot-theme min-h-screen mystical-bg text-[#E5DCD3] overflow-hidden relative flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Constellation top="15%" left="10%" />
        <Constellation top="25%" left="85%" />
        <Constellation top="65%" left="5%" />
        <Constellation top="82%" left="92%" />
        <Constellation top="40%" left="18%" glow />
        <Constellation top="10%" left="50%" glow />
      </div>

      <header className="relative z-20 w-full max-w-6xl px-6 md:px-12 py-10 flex flex-col md:flex-row gap-6 md:gap-0 justify-between md:items-end">
        <div className="text-left">
          <p className="text-[#C5A059] text-[10px] tracking-[0.4em] uppercase mb-1 font-semibold">
            Memories of the Cosmos
          </p>
          <h1 className="tarot-font-display text-3xl font-bold tracking-[0.15em] text-[#E5DCD3]">
            The Celestial Oracle
          </h1>
        </div>
        <div className="text-left md:text-right md:border-l border-white/10 md:pl-8 transition-opacity duration-700">
          <p className="text-[10px] opacity-40 uppercase tracking-widest mb-1">
            Recipient Profile
          </p>
          <p className="tarot-font-serif text-xl italic text-[#E5DCD3]/90">
            {data.recipient.name}, {data.recipient.age}
          </p>
        </div>
      </header>

      <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 px-6">
        <AnimatePresence mode="wait">
          {phase === 'selection' ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl flex flex-col items-center">
              <div className="text-center mb-12">
                <p className="tarot-font-serif text-lg italic mb-4 text-[#E5DCD3]/80">
                  &ldquo;Choose 3 cards to unveil the path {data.recipient.name}{' '}
                  has laid for you.&rdquo;
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-px w-16 bg-[#C5A059]/30" />
                  <div className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold">
                    Selected: {selectedIndices.length} / 3
                  </div>
                  <div className="h-px w-16 bg-[#C5A059]/30" />
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 w-full mb-12">
                {cards.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}>
                    <TarotCard
                      id={card.id}
                      backImage={card.backImage}
                      frontImage={card.revealedImage}
                      isFlipped={false}
                      isSelected={selectedIndices.includes(idx)}
                      onFlip={() => handleCardClick(idx)}
                      className="aspect-[2/3.5] w-full"
                    />
                  </motion.div>
                ))}
              </div>

              {selectedIndices.length === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}>
                  <button
                    onClick={startReveal}
                    className="px-12 py-4 bg-[#C5A059] text-black font-bold uppercase text-xs tracking-[0.34em] rounded-full shadow-2xl shadow-[#C5A059]/20 hover:bg-[#D4B170] transition-all">
                    Begin the Reveal
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex-1 flex flex-col items-center justify-center pb-20 md:pb-0">
              <div className="text-center mb-8">
                <h2 className="tarot-font-display text-[#C5A059] uppercase tracking-[0.3em] text-xl mb-2">
                  The Revelation
                </h2>
                <div className="flex items-center justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1 transition-all duration-500 rounded-full ${
                        currentIndex === i
                          ? 'w-12 bg-[#C5A059]'
                          : 'w-3 bg-[#C5A059]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center md:gap-16 lg:gap-24 w-full max-w-6xl px-8">
                <div className="flex-1 text-center md:text-left space-y-8 mb-12 md:mb-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059]/60 font-bold mb-2">
                          The Oracle Speaks
                        </p>
                        <p className="tarot-font-serif text-3xl md:text-4xl lg:text-5xl italic text-[#E5DCD3] leading-tight">
                          &ldquo;{selectedCards[currentIndex].saying}&rdquo;
                        </p>
                      </div>

                      <div className="h-px w-24 bg-[#C5A059]/30 mx-auto md:mx-0" />

                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059]/60 font-bold">
                          Arcana Insight
                        </p>
                        <p className="tarot-font-serif text-xl opacity-70 italic text-[#E5DCD3]">
                          {selectedCards[currentIndex].meaning}
                        </p>
                      </div>

                      {currentIndex === 2 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="pt-8">
                          <button
                            onClick={() => setShowSummary(true)}
                            className="inline-flex items-center gap-3 px-8 py-4 border border-[#C5A059]/40 text-[#C5A059] uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-[#C5A059]/10 transition-colors rounded-full">
                            Read Cosmic Summary{' '}
                            <RefreshCw
                              size={14}
                              className={showSummary ? 'animate-spin' : ''}
                            />
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="relative w-64 md:w-80 lg:w-96 aspect-[2/3.5] group flex-shrink-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -100 && currentIndex < 2) {
                          nextCard();
                        } else if (info.offset.x > 100 && currentIndex > 0) {
                          prevCard();
                        }
                      }}
                      initial={{ opacity: 0, scale: 0.8, x: 50 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -50 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                      className="w-full h-full cursor-grab active:cursor-grabbing">
                      <TarotCard
                        id={selectedCards[currentIndex].id}
                        backImage={selectedCards[currentIndex].backImage}
                        frontImage={selectedCards[currentIndex].revealedImage}
                        isFlipped={true}
                        hideText={true}
                        className="w-full h-full pointer-events-none"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <button
                    onClick={prevCard}
                    disabled={currentIndex === 0}
                    className={`absolute left-2 md:left-[-70px] top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full border border-[#C5A059]/20 text-[#C5A059] transition-all z-20 bg-[#050505]/40 backdrop-blur-sm
                      ${
                        currentIndex === 0
                          ? 'opacity-0 scale-50 pointer-events-none'
                          : 'hover:bg-[#C5A059]/10 opacity-100 scale-100'
                      }`}>
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={nextCard}
                    disabled={currentIndex === 2}
                    className={`absolute right-2 md:right-[-70px] top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full border border-[#C5A059]/20 text-[#C5A059] transition-all z-20 bg-[#050505]/40 backdrop-blur-sm
                      ${
                        currentIndex === 2
                          ? 'opacity-0 scale-50 pointer-events-none'
                          : 'hover:bg-[#C5A059]/10 opacity-100 scale-100'
                      }`}>
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showSummary && (
                  <motion.footer
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 md:px-12 py-8 md:py-10 gold-border rounded-t-[2rem] md:rounded-t-[3rem] bg-black/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between border-b-0 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-50">
                    <div className="max-w-md text-center md:text-left mb-8 md:mb-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]/60 font-semibold mb-3">
                        A message from your sender
                      </p>
                      <p className="tarot-font-serif text-xl leading-relaxed italic text-[#E5DCD3]">
                        &ldquo;{data.specialSaying}&rdquo;
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[#C5A059] text-[10px] uppercase font-bold tracking-widest">
                          The Celestial Wish
                        </p>
                        <p className="text-[#E5DCD3]/70 italic">
                          &ldquo;{data.recipient.wish}&rdquo;
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-4 pl-0 md:pl-8">
                      <button
                        onClick={() => setShowSummary(false)}
                        className="text-[10px] text-[#E5DCD3]/60 hover:text-[#E5DCD3] uppercase tracking-widest transition-colors">
                        Close Summary
                      </button>
                      <p className="text-[9px] uppercase opacity-30 tracking-[0.3em]">
                        Powered by Memoify.live
                      </p>
                    </div>
                  </motion.footer>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
