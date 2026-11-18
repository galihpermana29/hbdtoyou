'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { JournalCardData } from '@/lib/journal-card';

interface JournalCardProps {
  /** The card the server made of the journal (lib/journal-card.ts). */
  card: JournalCardData;
}

const JournalCard: React.FC<JournalCardProps> = ({ card }) => {
  const jsonEntry = card;
  const entry = card;
  return (
    <motion.div
      className="h-full overflow-hidden rounded-[20px] border border-[#e8ded3] bg-[#fffdfa] text-left"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}>
      <div className="p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs text-gray-500 font-serif">
            {jsonEntry?.volume}
          </span>
          <span className="text-xs text-gray-500 font-serif">
            {jsonEntry?.date}
          </span>
        </div>
        <div className="">
          <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
            {jsonEntry?.title}
          </h3>
          <p
            className="text-sm text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: jsonEntry?.abstract }}></p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 italic line-clamp-1 text-left">
            {jsonEntry?.author}
          </p>
          <Link
            href={`/journal/${entry?.id}`}
            className="text-xs font-medium flex justify-end text-[#e34013] w-[80%] text-right">
            Read More
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalCard;
