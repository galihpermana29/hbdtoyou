import { getAllTemplates } from '@/action/user-api';
import NewTemplates from '@/components/newlanding/NewTemplates';
import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/templates',
  title: 'Digital Gift Templates: Netflix, Spotify & More | Memoify',
  description:
    'Every Memoify template: Netflix, Spotify, Disney+, newspaper, magazine, vinyl, scrapbooks. Semua template kado digital, tinggal pilih dan isi.',
  keywords: {
    en: [
      'digital gift templates',
      'Netflix gift template',
      'Spotify gift template',
      'newspaper birthday template',
    ],
    id: [
      'template kado digital',
      'template ucapan ulang tahun',
      'template Netflix ulang tahun',
      'template Spotify untuk pacar',
    ],
  },
  image: {
    url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300212/e47b9e53-9631-4638-9393-ec8ed7b3bdb5.png',
    alt: 'Memoify templates collection',
  },
});

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
