import CreatePage from './create-clientside';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Custom Website | Memoify',
  description:
    'Create personalized websites inspired by your favorite platforms like Netflix, Spotify, or YouTube. Choose from our templates and customize them to showcase your memories in style.',
  keywords:
    'create, custom websites, Netflix templates, Spotify templates, YouTube templates, personalized websites, digital memories, Memoify',
  openGraph: {
    title: 'Create Your Custom Website | Memoify',
    description:
      'Create personalized websites inspired by your favorite platforms like Netflix, Spotify, or YouTube. Choose from our templates and customize them to showcase your memories in style.',
    url: 'https://memoify.live/create',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300467/6f5f6395-cc85-4329-b50a-b402d7fcffe8.png',
        width: 1200,
        height: 630,
        alt: 'Create Your Custom Website',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Custom Website | Memoify',
    description:
      'Create personalized websites inspired by your favorite platforms like Netflix, Spotify, or YouTube. Choose from our templates and customize them to showcase your memories in style.',
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300467/6f5f6395-cc85-4329-b50a-b402d7fcffe8.png',
    ],
  },
};

const CreatePageServer = () => {
  return <CreatePage />;
};

export default CreatePageServer;
