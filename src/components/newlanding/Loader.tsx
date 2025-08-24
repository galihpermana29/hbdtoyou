'use client';

import Image from 'next/image';
const LoaderPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1>Loading Data...</h1>
      <Image
        src="/ai-loading-modal.gif"
        alt="AI Loading"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
};

export default LoaderPage;
