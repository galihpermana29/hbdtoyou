'use client';

import { motion } from 'framer-motion';

interface TarotCardProps {
  id: number;
  backImage: string;
  frontImage: string;
  isFlipped: boolean;
  isSelected?: boolean;
  onFlip?: () => void;
  className?: string;
  meaning?: string;
  saying?: string;
  hideText?: boolean;
}

export default function TarotCard({
  backImage,
  frontImage,
  isFlipped,
  isSelected = false,
  onFlip,
  className = '',
  meaning,
  saying,
  hideText = false,
}: TarotCardProps) {
  return (
    <div
      className={`relative cursor-pointer perspective-1000 group ${className}`}
      onClick={() => onFlip?.()}
      style={{ perspective: '1000px' }}>
      <motion.div
        initial={false}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isSelected && !isFlipped ? 1.05 : 1,
          y: isSelected && !isFlipped ? -10 : 0,
        }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        className={`w-full h-full relative transition-all duration-500 ${
          isSelected && !isFlipped
            ? 'shadow-[0_0_25px_rgba(197,160,89,0.4)]'
            : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}>
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-lg gold-border card-back-gradient shadow-2xl overflow-hidden transition-all duration-500 ${
            isSelected
              ? 'border-[#C5A039] border-2'
              : 'group-hover:border-[#C5A039]'
          }`}
          style={{ backfaceVisibility: 'hidden' }}>
          <div
            className={`absolute inset-[10px] border pointer-events-none rounded-sm transition-all duration-500 ${
              isSelected ? 'border-[#C5A059]/50' : 'border-[#C5A059]/20'
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C5A059"
              strokeWidth={isSelected ? '1' : '0.5'}
              className={`transition-all duration-500 ${
                isSelected ? 'opacity-100 scale-110' : 'opacity-40'
              }`}>
              <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" />
            </svg>
          </div>
        </div>

        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg border border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.15)] ring-1 ring-[#C5A059]/40 overflow-hidden bg-[#0a0a0a]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}>
          <div className="w-full h-full flex flex-col p-4">
            <div className="flex-1 overflow-hidden rounded-md mb-4 bg-black">
              <img
                src={frontImage}
                alt="Tarot Front"
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700 opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>

            {!hideText && saying && (
              <div className="text-center">
                <p className="tarot-font-serif text-[#C5A059] italic text-lg mb-1 leading-tight">
                  &ldquo;{saying}&rdquo;
                </p>
                {meaning && (
                  <p className="text-[10px] text-[#E5DCD3]/50 uppercase tracking-[0.2em]">
                    {meaning.split(':')[0]}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
