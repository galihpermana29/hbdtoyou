'use client';

import TarotReader from '@/components/celestialtarot/TarotReader';
import { TarotData } from '@/components/celestialtarot/types';

const sampleData: TarotData = {
  sayings: [
    'The stars aligned the day our paths crossed.',
    'Let patience be your compass in every season.',
    'A new dawn waits for you beyond the veil.',
  ],
  specialSaying:
    'Across the vast expanse of time, my thoughts find their way to you. No matter how far the constellations drift, you remain my north star.',
  recipient: {
    name: 'Luna',
    age: '26',
    wish: 'May your path find the light',
  },
};

const RootExamplePage = () => {
  return <TarotReader data={sampleData} />;
};

export default RootExamplePage;
