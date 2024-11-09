import Featured from '@/components/netflix/featured/featured';
import List from '@/components/netflix/list/list';
import Navbar from '@/components/netflix/navbar/navbar';
import { tData } from '@/lib/data';

const getDetailData = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/userData?query=${id}`);
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
      <List title={'Upcoming Movies'} tData={data.data.images.slice(0, 6)} />
      <List
        title={'Box Office Top Movies'}
        tData={data.data.images.slice(6, 12)}
      />
    </div>
  );
};

export default RootUserPage;
