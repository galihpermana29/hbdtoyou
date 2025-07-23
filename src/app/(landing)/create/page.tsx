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
  if (process.env.IS_MAINTENANCE === 'true') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className=" max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Under Maintenance
          </h1>
          <p className="text-gray-700 mt-4 max-w-[400px]">
            We're currently working on improving this feature. Please check back
            soon!
          </p>

          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }
  return <CreatePage />;
};

export default CreatePageServer;
