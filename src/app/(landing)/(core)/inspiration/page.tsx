import { getInspirationPage } from '@/action/inspiration-api';
import { getAllTemplates } from '@/action/user-api';
import InspirationPage from '@/components/inspiration/inspiration-page';
import { filtersFor } from '@/lib/inspiration';
import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/inspiration',
  title: 'Digital Gift Ideas & Examples (Inspirasi Kado Digital) | Memoify',
  description:
    'Real digital gifts, scrapbooks and albums made with Memoify, for ideas. Lihat contoh dan inspirasi kado digital buatan pengguna lain.',
  keywords: {
    en: ['digital gift ideas', 'birthday gift ideas', 'gift examples'],
    id: [
      'inspirasi kado digital',
      'ide kado ulang tahun',
      'contoh kado digital',
      'ide kado anniversary',
    ],
  },
  image: {
    url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751299237/2fd7834c-6ddf-4d78-b625-028c40a32a34.png',
    alt: 'Memoify inspiration gallery',
  },
});

const InspirationRoute = async () => {
  // The first page of the wall comes with the page: it is also what the
  // hero's drifting wall is made of.
  const [templates, first] = await Promise.all([
    getAllTemplates(),
    getInspirationPage({ page: 1 }),
  ]);

  return (
    <InspirationPage
      first={first}
      filters={filtersFor(templates.success ? templates.data : [])}
    />
  );
};

export default InspirationRoute;
