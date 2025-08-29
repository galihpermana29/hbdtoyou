'use client';

import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

const JournalHeader = () => {
  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 print:hidden">
      <Link
        href="/journal"
        className="text-sm flex items-center text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Link>
      <button
        onClick={handlePrint}
        className="text-sm flex items-center text-gray-600 hover:text-gray-900 transition-colors">
        <Printer className="h-4 w-4 mr-1" />
        Print
      </button>
    </div>
  );
};

export default JournalHeader;
