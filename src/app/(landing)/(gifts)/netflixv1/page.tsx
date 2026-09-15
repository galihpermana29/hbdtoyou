'use client';

import NetflixExperience from '@/components/netflix/netflix-experience';
import { useRef } from 'react';
import 'react-photo-view/dist/react-photo-view.css';

import widyaOne from '@/assets/widya/after/1.jpg';
import widyaTwo from '@/assets/widya/after/2.jpg';

// Same sample photos the Featured/ListItem fallbacks already ship, resolved to
// URLs so the lightbox and `next/image` both receive plain strings.
const SAMPLE_JUMBOTRON = widyaTwo.src;
const SAMPLE_IMAGES = [
  widyaOne.src,
  widyaTwo.src,
  widyaOne.src,
  widyaTwo.src,
  widyaOne.src,
  widyaTwo.src,
  widyaOne.src,
  widyaTwo.src,
];

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
      jumbotronImage={SAMPLE_JUMBOTRON}
      images={SAMPLE_IMAGES}
    />
  );
};

export default RootExamplePage;
