'use client';

import Image from 'next/image';

interface NewsImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function NewsImage({
  src,
  alt,
  className = '',
}: NewsImageProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
      />
    </div>
  );
}
