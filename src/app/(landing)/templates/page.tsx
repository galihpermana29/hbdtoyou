import { getAllTemplates } from '@/action/user-api';
import NewTemplates from '@/components/newlanding/NewTemplates';

const templates = [
  {
    id: 1,
    name: 'Netflix v1',
    label: 'free',
    thumbnail_uri:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735569040/db4lflw3rz2oou05a6gx.png',
  },
  {
    id: 2,
    name: 'Spotify v1',
    label: 'premium',
    thumbnail_uri:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735569034/iqfshzifagwsyggwgizh.png',
  },
  {
    id: 2,
    name: 'Disney+ v1',
    label: 'premium',
    thumbnail_uri:
      'https://res.cloudinary.com/dxuumohme/image/upload/v1735569034/yljqxtimvwbdasyp7ljn.png',
  },
];

const MoreTemplatesPage = async () => {
  const data = await getAllTemplates();
  return (
    <div className="">
      <NewTemplates data={data.success ? data.data : []} />
    </div>
  );
};

export default MoreTemplatesPage;
