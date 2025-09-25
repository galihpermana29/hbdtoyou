import { getDetailContent } from '@/action/user-api';
import Featured from '@/components/netflix/featured/featured';
import List from '@/components/netflix/list/list';
import Navbar from '@/components/netflix/navbar/navbar';
import MusicPlayer from '@/components/ui/music-player/music-player';
import { Watermark } from 'antd';
import { headers } from 'next/headers';
import 'react-photo-view/dist/react-photo-view.css';
const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

const RootUserPage = async ({ params }: any) => {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);
  const totalItems = parsedData?.images?.length || 0; // Get the total number of items
  const midIndex = Math.ceil(totalItems / 2); // Calculate the middle index

  if (!totalItems) return <div className="min-h-screen">No data</div>;

  return (
    <Watermark
      zIndex={99}
      font={{ color: 'rgba(227, 64, 19, 0.19)', fontSize: 50 }}
      content={data.data.user_type === 'free' ? 'memoify.live' : ''}>
      <div className="bg-black overflow-x-hidden">
        <MusicPlayer />
        <Navbar jumbotronImage={parsedData?.jumbotronImage} />
        <Featured
          jumbotronImage={
            parsedData?.jumbotronImage ||
            parsedData?.images?.slice(0, midIndex)[0]
          }
          title={parsedData?.title}
          subTitle={parsedData?.subTitle}
          modalContent={parsedData?.modalContent}
        />
        <List
          title={'You Before Meet Me'}
          tData={parsedData?.images?.slice(0, midIndex)} // First half
        />
        <List
          title={'You After Meet Me'}
          tData={parsedData?.images?.slice(midIndex)} // Second half
        />
        <List
          title={'Top Searches'}
          tData={parsedData?.images?.slice(0, midIndex)} // First half
        />
        <List
          title={'Series & Shows'}
          tData={parsedData?.images?.slice(midIndex)} // Second half
        />
      </div>
    </Watermark>
  );
};

export default RootUserPage;
