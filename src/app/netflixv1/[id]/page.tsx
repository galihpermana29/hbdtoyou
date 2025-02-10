import { getDetailContent } from '@/action/user-api';
import Featured from '@/components/netflix/featured/featured';
import List from '@/components/netflix/list/list';
import Navbar from '@/components/netflix/navbar/navbar';
import { headers } from 'next/headers';

const getDetailData = async (id: string) => {
  const headersList = headers();
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const host =
    headersList.get('x-forwarded-host') ||
    headersList.get('host') ||
    'beta.popstarz.ai';

  const domain = `${protocol}://${host}`;

  const res = await fetch(`${domain}/api/userData?query=${id}`, {
    next: { revalidate: 240 },
  });
  const data = await res.json();

  return data;
};

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
  );
};

export default RootUserPage;
