import Featured from '@/components/netflix/featured/featured';
import List from '@/components/netflix/list/list';
import Navbar from '@/components/netflix/navbar/navbar';

const RootExamplePage = () => {
  return (
    <div className="bg-black overflow-x-hidden">
      <Navbar />
      <Featured />
      <List
        title={'You Before Meet Me'}
        tData={[null, null, null, null, null, null, null]}
      />
      <List
        title={'You After Meet Me'}
        tData={[null, null, null, null, null, null, null]}
      />
    </div>
  );
};

export default RootExamplePage;
