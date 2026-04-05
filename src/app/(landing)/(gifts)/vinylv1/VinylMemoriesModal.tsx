'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

interface Memory {
  imageUrl: string;
  caption: string;
  date: string;
}

interface VinylMemoriesModalProps {
  open: boolean;
  onClose: () => void;
  memories?: Memory[];
}

export default function VinylMemoriesModal({
  open,
  onClose,
  memories,
}: VinylMemoriesModalProps) {
  const [current, setCurrent] = useState(0);

  if (!memories || memories.length === 0) {
    return (
      <ModalWrapper open={open} onClose={onClose}>
        <div className="flex flex-col items-center py-8 text-[#8a7060]">
          <div className="w-14 h-14 rounded-full bg-[#f0e6dc] flex items-center justify-center mb-3">
            <ImageIcon size={24} className="text-[#8B6F5E]" />
          </div>
          <p className="font-serif text-lg">No memories added yet</p>
        </div>
      </ModalWrapper>
    );
  }

  const prev = () => setCurrent((c) => (c === 0 ? memories.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === memories.length - 1 ? 0 : c + 1));

  const memory = memories[current];
  if (!memory) return null;

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <h2 className="font-serif text-2xl text-[#2a1810] text-center mb-4">
        Our Memories
      </h2>

      <div className="rounded-xl overflow-hidden bg-white shadow-md">
        <img
          src={memory.imageUrl}
          alt={memory.caption}
          className="w-full h-64 object-cover"
        />
        <div className="p-4 text-center">
          <p className="font-serif text-lg text-[#2a1810]">{memory.caption}</p>
          <p className="text-sm text-[#8a7060] mt-1">{memory.date}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full border border-[#d4c4b4] flex items-center justify-center hover:bg-[#f0e6dc] transition-colors"
        >
          <ChevronLeft size={18} className="text-[#5a4a3a]" />
        </button>

        <div className="flex gap-1.5">
          {memories.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? 'bg-[#2a1810]' : 'bg-[#d4c4b4]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-full border border-[#d4c4b4] flex items-center justify-center hover:bg-[#f0e6dc] transition-colors"
        >
          <ChevronRight size={18} className="text-[#5a4a3a]" />
        </button>
      </div>
    </ModalWrapper>
  );
}
