'use client';

import Featured from '@/components/netflix/featured/featured';
import List from '@/components/netflix/list/list';
import Navbar from '@/components/netflix/navbar/navbar';
import { useRef } from 'react';
import 'react-photo-view/dist/react-photo-view.css';
const RootExamplePage = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);

  return (
    <div className="bg-black overflow-x-hidden">
      <Navbar />
      <Featured ref1={ref1} ref2={ref2} ref3={ref3} ref4={ref4} ref5={ref5} />
      <List
        ref5={ref5}
        title={'You Before Meet Me'}
        tData={[null, null, null, null, null, null, null]}
      />
      <List
        title={'You After Meet Me'}
        tData={[null, null, null, null, null, null, null]}
      />
      <List
        title={'Top Searches'}
        tData={[null, null, null, null, null, null, null]}
      />
      <List
        title={'Series & Shows'}
        tData={[null, null, null, null, null, null, null]}
      />
    </div>
  );
};

export default RootExamplePage;
