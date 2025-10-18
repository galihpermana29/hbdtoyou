'use client';

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img } from 'remotion';

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
  const { fps, width, height } = useVideoConfig();

  // Duration for each spread (1.3 seconds - faster)
  const spreadDuration = Math.ceil(fps * 1.3);
  // Flip animation duration (0.2 seconds - faster)
  const flipDuration = Math.ceil(fps * 0.2);

  // Build spread structure: [cover solo], [page1, page2], [page3, page4], ...
  const spreads: (string | [string, string])[] = [];
  
  // First spread: Cover alone
  spreads.push(coverImage);
  
  // All remaining pages paired (including back cover)
  const allContentPages = [...pages, backCoverImage];
  for (let i = 0; i < allContentPages.length; i += 2) {
    if (i + 1 < allContentPages.length) {
      spreads.push([allContentPages[i], allContentPages[i + 1]]);
    } else {
      spreads.push(allContentPages[i]); // Single page if odd number
    }
  }
  
  // Calculate current spread index
  const currentSpreadIndex = Math.floor(frame / spreadDuration);
  const frameInSpread = frame % spreadDuration;
  
  // Get current spread
  const currentSpread = spreads[Math.min(currentSpreadIndex, spreads.length - 1)];
  
  // Determine if single or double page
  const isSinglePage = typeof currentSpread === 'string';
  const leftPage = isSinglePage ? null : currentSpread[0];
  const rightPage = isSinglePage ? null : currentSpread[1];
  const singlePage = isSinglePage ? currentSpread : null;
  
  // Calculate if we're in flip animation
  const isFlipping = frameInSpread < flipDuration;
  const flipProgress = isFlipping ? frameInSpread / flipDuration : 0;
  
  // Page dimensions
  const pageWidth = width / 2;
  const pageHeight = height;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      {/* Single Page Layout (Cover or Back Cover) */}
      {isSinglePage && singlePage && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Img
            src={singlePage}
            style={{
              width: pageWidth,
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Double Page Layout (Regular Spreads) */}
      {!isSinglePage && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            margin: 0,
            padding: 0,
          }}>
          {/* Left Page */}
          {leftPage && (
            <Img
              src={leftPage}
              style={{
                width: pageWidth,
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                margin: 0,
                padding: 0,
              }}
            />
          )}

          {/* Right Page */}
          {rightPage && (
            <Img
              src={rightPage}
              style={{
                width: pageWidth,
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                margin: 0,
                padding: 0,
              }}
            />
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
