'use client';

import NetflixExperience from '@/components/netflix/netflix-experience';
import { useRef } from 'react';
import 'react-photo-view/dist/react-photo-view.css';

const RootExamplePage = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);

  return (
    <NetflixExperience
      refs={{ ref1, ref2, ref3, ref4, ref5 }}
      title="Happy Birthday!"
    />
  );
};

export default RootExamplePage;
