// dynamic version

import { getDetailContent } from '@/action/user-api';
import NetflixGraduation from './NetflixGraduation';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

const GraduationNetflixPage = async ({ params }: any) => {
  const { id } = params;

  const data = await getDetailDataNew(id);
  console.log(data);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);

  return (
    <NetflixGraduation parsedData={parsedData} />
  );
};

export default GraduationNetflixPage;
