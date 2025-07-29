import { getContentByUserId } from '@/action/user-api';
import { getSession } from '@/store/get-set-session';
import { Metadata } from 'next';
import EJournal from './pageClient';

export const metadata: Metadata = {
  title: 'Personal Journal Digital Gift | Memoify',
  description:
    "Create and publish your personal journal as a digital gift, digital scrapbook, or digital album with academic formatting. Document life's moments with the structure and formality of scholarly articles.",
  keywords:
    'digital gift, digital scrapbook, digital album, virtual present, online gift, electronic memory book, digital photo collection, memory collection, virtual album, online scrapbook, e-gift, hadiah ulang tahun digital, kado digital, scrapbook digital, album foto digital, kenangan digital, kado online, jurnal digital, buku harian digital, personal journal, digital journal, academic journal, life moments, document memories, Memoify',
  openGraph: {
    title: 'Personal Journal Digital Gift | Memoify',
    description:
      "Create and publish your personal journal as a digital gift, digital scrapbook, or digital album with academic formatting. Document life's moments with the structure and formality of scholarly articles.",
    url: 'https://memoify.live/journal',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300293/6ad37e37-d0f6-497c-b81f-56d68869b7a3.png',
        width: 1200,
        height: 630,
        alt: 'Memoify Personal Journal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Journal Digital Gift | Memoify',
    description:
      "Create and publish your personal journal as a digital gift, digital scrapbook, or digital album with academic formatting. Document life's moments with the structure and formality of scholarly articles.",
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300293/6ad37e37-d0f6-497c-b81f-56d68869b7a3.png',
    ],
  },
};

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

  return (
    <EJournal journalsData={journalsData} />
  );
};

export default JournaServer;
