'use client';

import { useState } from 'react';

/**
 * The inspiration hero's signature: a wall of real gifts, drifting.
 *
 * Three columns of thumbnails pass by, the middle one the other way, each
 * at its own steady speed, fading out at the top and bottom edge. They are
 * the page's own first cards - what is on the wall is what is below it.
 *
 * Constant motion, so it is linear (emilkowalski/skills: animate), and it
 * is `transform` only: each column is its list twice, moved by half its
 * height, so the loop has no seam. Reduced motion holds the wall still.
 * Decoration: it is hidden from assistive tech and nothing on it is a link.
 */

function Tile({ src }: { src: string }) {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <img
      src={src}
      alt=""
      loading="eager"
      decoding="async"
      draggable={false}
      onError={() => setGone(true)}
      className="aspect-[4/5] w-full rounded-[16px] object-cover"
    />
  );
}

function Column({
  images,
  seconds,
  down = false,
  className = '',
}: {
  images: string[];
  seconds: number;
  down?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex-1 ${className}`}>
      <div
        className="flex flex-col motion-reduce:!animate-none"
        style={{
          animation: `${down ? 'insp-down' : 'insp-up'} ${seconds}s linear infinite`,
        }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex flex-col gap-3 pb-3 md:gap-4 md:pb-4">
            {images.map((src, index) => (
              <Tile key={`${src}-${index}`} src={src} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InspirationWall({ images }: { images: string[] }) {
  // Too few to fill three columns: no wall rather than a thin one.
  if (images.length < 6) return null;
  const columns: string[][] = [[], [], []];
  images.slice(0, 15).forEach((src, index) => columns[index % 3].push(src));
  // A column shorter than the window would show its own end: repeat it
  // until one copy is taller than what can be seen.
  for (const column of columns) {
    const own = [...column];
    while (column.length < 4) column.push(...own);
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none relative h-[340px] overflow-hidden md:h-[520px]"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)',
      }}>
      <div className="flex -rotate-[5deg] scale-[1.08] gap-3 md:gap-4">
        <Column images={columns[0]} seconds={44} />
        <Column images={columns[1]} seconds={56} down />
        <Column images={columns[2]} seconds={48} />
      </div>
    </div>
  );
}
