import { getAllTemplates } from '@/action/user-api';
import NewTemplates from '@/components/newlanding/NewTemplates';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Templates Collection | Memoify',
  description:
    'Explore our full collection of website templates inspired by Netflix, Spotify, YouTube and more. Find the perfect design to showcase your memories in style.',
  keywords:
    'templates, Netflix templates, Spotify templates, YouTube templates, custom websites, digital memories, Memoify',
  openGraph: {
    title: 'Templates Collection | Memoify',
    description:
      'Explore our full collection of website templates inspired by Netflix, Spotify, YouTube and more. Find the perfect design to showcase your memories in style.',
    url: 'https://memoify.live/templates',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300212/e47b9e53-9631-4638-9393-ec8ed7b3bdb5.png',
        width: 1200,
        height: 630,
        alt: 'Memoify Templates Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Templates Collection | Memoify',
    description:
      'Explore our full collection of website templates inspired by Netflix, Spotify, YouTube and more. Find the perfect design to showcase your memories in style.',
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300212/e47b9e53-9631-4638-9393-ec8ed7b3bdb5.png',
    ],
  },
};

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
