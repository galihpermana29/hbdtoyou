'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { IContent } from '@/action/interfaces';

interface JournalCardProps {
  entry: IContent;
}

const JournalCard: React.FC<JournalCardProps> = ({ entry }) => {
  const jsonEntry = entry ? JSON.parse(entry.detail_content_json_text) : null;
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
          <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800">
            {jsonEntry?.title}
          </h3>
          <p
            className="text-sm text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: jsonEntry?.abstract }}></p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 italic">{jsonEntry?.author}</p>
          <Link
            href={`/journal/${entry?.id}`}
            className="text-xs font-medium flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            Read More
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalCard;
