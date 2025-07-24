import { IAllTemplateResponse } from '@/action/interfaces';
import { getAllTemplates } from '@/action/user-api';
import NewInspirationPage from '@/components/newlanding/NewInspiration';
import NavigationBar from '@/components/ui/navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Gift, Scrapbook & Album Inspiration Gallery | Memoify',
  description:
    'Explore our inspiration gallery showcasing digital gifts, digital scrapbooks, and digital albums created with Memoify templates. Get ideas for your own personalized creations inspired by Netflix, Spotify, YouTube and more.',
  keywords:
    'digital gift, digital scrapbook, digital album, virtual present, online gift, electronic memory book, digital photo collection, memory collection, virtual album, online scrapbook, e-gift, hadiah ulang tahun digital, kado digital, scrapbook digital, album foto digital, kenangan digital, kado online, inspiration gallery, website examples, custom websites, Netflix templates, Spotify templates, YouTube templates, Memoify',
  openGraph: {
    title: 'Digital Gift, Scrapbook & Album Inspiration Gallery | Memoify',
    description:
      'Explore our inspiration gallery showcasing digital gifts, digital scrapbooks, and digital albums created with Memoify templates. Get ideas for your own personalized creations inspired by Netflix, Spotify, YouTube and more.',
    url: 'https://memoify.live/inspiration',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751299237/2fd7834c-6ddf-4d78-b625-028c40a32a34.png',
        width: 1200,
        height: 630,
        alt: 'Memoify Inspiration Gallery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Gift, Scrapbook & Album Inspiration Gallery | Memoify',
    description:
      'Explore our inspiration gallery showcasing digital gifts, digital scrapbooks, and digital albums created with Memoify templates. Get ideas for your own personalized creations inspired by Netflix, Spotify, YouTube and more.',
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751299237/2fd7834c-6ddf-4d78-b625-028c40a32a34.png',
    ],
  },
};

const getData = async () => {
  const data = await getAllTemplates();
  return data.success ? data.data : [];
};

const InspirationPage = async () => {
  const data: null | IAllTemplateResponse[] =
    (await getData()) as IAllTemplateResponse[];

  return (
    <div>
      <NavigationBar />
      <NewInspirationPage templates={data} />
    </div>
  );
};

export default InspirationPage;
