import { getContentByUserId } from '@/action/user-api';
import { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import JournalLanding from '@/components/journal-landing/journal-landing';

export const metadata: Metadata = pageMeta({
  path: '/journal',
  title: 'Personal Journal as a Digital Gift (Jurnal Digital) | Memoify',
  description:
    'Write your story as a journal article laid out like an academic paper, shared with one link. Tulis cerita kalian jadi jurnal digital.',
  keywords: {
    en: ['personal journal', 'digital journal', 'journal gift'],
    id: ['jurnal digital', 'buku harian digital', 'jurnal untuk pacar'],
  },
  image: {
    url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300293/6ad37e37-d0f6-497c-b81f-56d68869b7a3.png',
    alt: 'Memoify personal journal',
  },
});

const JournaServer = async () => {
  const dx = await getContentByUserId(
    null,
    '9999',
    '1',
    '2d4df00e-e773-4391-ad6a-1b6d688950ff' //journal template id
  );
  const journalsData = dx.success
    ? dx.data.filter((dx) => dx.template_name.includes('journal'))
    : [];

  return <JournalLanding journalsData={journalsData} />;
};

export default JournaServer;
