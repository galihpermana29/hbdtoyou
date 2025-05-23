'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { JournalEntry } from '../models/data';

interface JournalCardProps {
  entry: JournalEntry;
}

const JournalCard: React.FC<JournalCardProps> = ({ entry }) => {
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs text-gray-500 font-serif">
            {entry.volume}
          </span>
          <span className="text-xs text-gray-500 font-serif">{entry.date}</span>
        </div>
        <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800">
          {entry.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {entry.abstract}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 italic">{entry.author}</p>
          <Link
            href={`/ejournal/${entry.id}`}
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
