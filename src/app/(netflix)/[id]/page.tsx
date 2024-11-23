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

const RootUserPage = async ({ params }: any) => {
  const { id } = params;

  const data = await getDetailData(id);
  if (!data.data) {
    return <div>No data</div>;
  }
  return (
    <div className="bg-black overflow-x-hidden">
      <Navbar jumbotronImage={data.data.jumbotronImage} />
      <Featured
        jumbotronImage={data.data.jumbotronImage}
        title={data.data.title}
        subTitle={data.data.subTitle}
        modalContent={data.data.modalContent}
      />
      <List title={'Upcoming Movies'} tData={data.data.images.slice(0, 5)} />
      <List
        title={'Box Office Top Movies'}
        tData={data.data.images.slice(5, 10)}
      />
    </div>
  );
};

export default RootUserPage;
