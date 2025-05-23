'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer } from 'lucide-react';
import { JournalEntry, sampleEntries } from '../models/data';
import { useParams, useRouter } from 'next/navigation';

export default function EntryDetail() {
  const { id } = useParams();

  const entry = sampleEntries.find((ex) => ex.id === id);

  const handlePrint = () => {
    window.print();
  };

  const router = useRouter();

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-sm shadow-sm max-w-4xl mx-auto my-8 print:border-0 print:shadow-none min-w-[700px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200 print:hidden">
        <button
          onClick={() => router.back()}
          className="text-sm flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <button
          onClick={handlePrint}
          className="text-sm flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <Printer className="h-4 w-4 mr-1" />
          Print
        </button>
      </div>

      <div className="p-8">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-1 font-serif">{entry.date}</p>
          <h1 className="font-serif text-2xl font-bold mb-3 text-gray-900 max-w-[500px] mx-auto">
            {entry.title}
          </h1>
          <p className="text-sm text-gray-700 font-serif">{entry.author}</p>
          <p className="text-xs text-gray-500 mt-1 font-serif">
            {entry.volume}
          </p>
        </div>

        <div className="px-[60px] text-justify">
          <div className="mb-8">
            <h2 className="font-serif text-center font-semibold text-lg mb-2 text-gray-800">
              Abstract
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {entry.abstract}
            </p>

            {entry.abstractSecondary && (
              <p className="text-gray-700 text-sm leading-relaxed italic">
                {entry.abstractSecondary}
              </p>
            )}

            {entry.keywords && entry.keywords.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Keywords:{' '}
                  <span className="font-normal italic">
                    {entry.keywords.join(', ')}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-center font-semibold text-lg mb-2 text-gray-800">
              Preamble
            </h2>
            <div className="columns-2 gap-8 text-sm leading-relaxed text-gray-700">
              {entry.preamble}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-center font-semibold text-lg mb-2 text-gray-800">
              Introduction
            </h2>
            <div className="columns-2 gap-8 text-sm leading-relaxed text-gray-700">
              {entry.introduction}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
