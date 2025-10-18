'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img } from 'remotion';

interface ScrapbookPage {
  image: string;
  isFlipping?: boolean;
}

interface ScrapbookCompositionProps {
  pages: string[];
  coverImage: string;
  backCoverImage: string;
}

export const ScrapbookComposition: React.FC<ScrapbookCompositionProps> = ({
  pages,
  coverImage,
  backCoverImage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Duration for each page (1.5 seconds for smaller GIF)
  const pageDuration = fps * 1.5;
  // Flip animation duration (0.3 seconds for faster, smaller GIF)
  const flipDuration = fps * 0.3;

  // Calculate total pages including covers
  const allPages = [coverImage, ...pages, backCoverImage];
  const totalPages = allPages.length;

  // Calculate current page index
  const currentPageIndex = Math.floor(frame / pageDuration);
  const frameInPage = frame % pageDuration;

  // Determine if we're in a flip animation
  const isFlipping = frameInPage < flipDuration && currentPageIndex < totalPages - 1;
  const flipProgress = isFlipping ? frameInPage / flipDuration : 0;

  // Get current and next page
  const currentPage = allPages[Math.min(currentPageIndex, totalPages - 1)];
  const nextPage = allPages[Math.min(currentPageIndex + 1, totalPages - 1)];

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          perspective: '2000px',
        }}>
        {/* Current Page */}
        <div
          style={{
            position: 'absolute',
            width: '550px',
            height: '733px',
            transformStyle: 'preserve-3d',
            transform: isFlipping
              ? `rotateY(${-flipProgress * 180}deg)`
              : 'rotateY(0deg)',
            transition: 'none',
          }}>
          {/* Front of current page */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}>
            <Img
              src={currentPage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Back of current page (shows next page) */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}>
            <Img
              src={nextPage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>

        {/* Page counter */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          }}>
          Page {currentPageIndex + 1} of {totalPages}
        </div>
      </div>
    </AbsoluteFill>
  );
};
