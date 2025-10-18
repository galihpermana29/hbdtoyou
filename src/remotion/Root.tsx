import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { ScrapbookComposition } from './ScrapbookComposition';

interface ScrapbookProps {
  pages: string[];
  coverImage: string;
  backCoverImage: string;
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ScrapbookVideo"
        component={ScrapbookComposition as any}
        durationInFrames={300}
        fps={3}
        // 1200 x 800 4fps
        width={800}
        height={600}
        defaultProps={{
          pages: [],
          coverImage: '',
          backCoverImage: '',
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
