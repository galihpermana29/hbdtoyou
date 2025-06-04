import { getDetailContent } from '@/action/user-api';
import Featured from '@/components/netflix/featured/featured';
import List from '@/components/netflix/list/list';
import Navbar from '@/components/netflix/navbar/navbar';
import { Watermark } from 'antd';
import { headers } from 'next/headers';

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
        <Navbar jumbotronImage={parsedData?.jumbotronImage} />
        <Featured
          jumbotronImage={parsedData?.jumbotronImage}
          title={parsedData?.title}
          subTitle={parsedData?.subTitle}
          modalContent={parsedData?.modalContent}
        />
        <List
          title={'Upcoming Movies'}
          tData={parsedData?.images?.slice(0, midIndex)} // First half
        />
        <List
          title={'Box Office Top Movies'}
          tData={parsedData?.images?.slice(midIndex)} // Second half
        />
      </div>
    </Watermark>
  );
};

export default RootUserPage;
