'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface JournalLayoutProps {
  children: ReactNode;
}

const JournalLayout: React.FC<JournalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}>
        {children}
      </motion.main>
    </div>
  );
};

export default JournalLayout;
