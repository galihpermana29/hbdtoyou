import { getAllTemplates } from '@/action/user-api';
import NewTemplates from '@/components/newlanding/NewTemplates';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Gift, Scrapbook & Album Templates | Memoify',
  description:
    'Explore our full collection of digital gift, digital scrapbook, and digital album templates inspired by Netflix, Spotify, YouTube and more. Find the perfect design to showcase your memories in style.',
  keywords:
    'digital gift, digital scrapbook, digital album, virtual present, online gift, electronic memory book, digital photo collection, memory collection, virtual album, online scrapbook, e-gift, hadiah ulang tahun digital, kado digital, scrapbook digital, album foto digital, kenangan digital, kado online, templates, Netflix templates, Spotify templates, YouTube templates, custom websites, digital memories, Memoify',
  openGraph: {
    title: 'Digital Gift, Scrapbook & Album Templates | Memoify',
    description:
      'Explore our full collection of digital gift, digital scrapbook, and digital album templates inspired by Netflix, Spotify, YouTube and more. Find the perfect design to showcase your memories in style.',
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
    title: 'Digital Gift, Scrapbook & Album Templates | Memoify',
    description:
      'Explore our full collection of digital gift, digital scrapbook, and digital album templates inspired by Netflix, Spotify, YouTube and more. Find the perfect design to showcase your memories in style.',
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300212/e47b9e53-9631-4638-9393-ec8ed7b3bdb5.png',
    ],
  },
};

// The card art for this page comes from the backend as `thumbnail_uri` on each template
// row (see <NewTemplates data={...} /> below). A hardcoded `templates` array used to sit
// here pointing at Cloudinary cloud `dxuumohme`, but nothing ever rendered it, so it was
// removed on 2026-09-13 when that cloud started returning 401.
// Replacement card art is checked in at `public/thumbnails/` and, once deployed, is
// reachable at https://memoify.live/thumbnails/<template>.jpg for the backend rows to use.

const MoreTemplatesPage = async () => {
  const data = await getAllTemplates();
  return <NewTemplates data={data.success && data.data ? data.data : []} />;
};

export default MoreTemplatesPage;
