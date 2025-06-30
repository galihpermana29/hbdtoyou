import NavigationBar from '@/components/ui/navbar';
// dynamic
import dynamic from 'next/dynamic';
const JournalCard = dynamic(() => import('./view/JournalCard'), { ssr: false });
import { getContentByUserId } from '@/action/user-api';
import { Button } from 'antd';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Journal | Memoify',
  description:
    "Create and publish your personal journal with academic formatting. Document life's moments with the structure and formality of scholarly articles.",
  keywords:
    'personal journal, digital journal, academic journal, life moments, document memories, Memoify',
  openGraph: {
    title: 'Personal Journal | Memoify',
    description:
      "Create and publish your personal journal with academic formatting. Document life's moments with the structure and formality of scholarly articles.",
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
    title: 'Personal Journal | Memoify',
    description:
      "Create and publish your personal journal with academic formatting. Document life's moments with the structure and formality of scholarly articles.",
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751300293/6ad37e37-d0f6-497c-b81f-56d68869b7a3.png',
    ],
  },
};

const EJournal = async () => {
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
    <div>
      <div className="min-h-screen overflow-hidden">
        <div className="fixed top-0 left-0 w-full z-10 ">
          <NavigationBar />
        </div>
        <div className="mt-[81px]">
          <div className="py-[30px] md:py-[90px] flex flex-col text-center items-center mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] min-h-screen ">
            <div>
              <p className="mt-[16px] font-[700] text-[35px] max-w-[1000px] mx-auto md:text-[50px] lg:text-[60px] leading-[1.2]">
                Create your personal journal to capture your life`s moments
              </p>
              <p className="text-[16px] md:text-[20px] max-w-[768px] mx-auto font-[400] leading-[30px] text-[#7B7B7B] mt-[24px] mb-[48px]">
                A personal journal with academic formatting, designed to
                document life`s moments with the structure and formality of
                scholarly articles.
              </p>

              <div className="max-w-[600px] flex-1 mt-[20px] md:mt-0 mx-auto">
                <div className="flex flex-col gap-[20px] md:flex-row justify-center items-center">
                  <Link href="/journal/create">
                    <Button
                      className="!bg-[#fff] !text-[#E34013] !border-[1px] 
                    !border-[#E34013] !rounded-[8px] !text-[16px] !font-[600] !h-[48px] md:!h-[60px] !w-[250px]"
                      type="default"
                      size="large">
                      Publish a Journal
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-[80px]">
                {journalsData.length > 0
                  ? journalsData.map((entry) => (
                      <JournalCard key={entry.id} entry={entry} />
                    ))
                  : 'No Journals Available'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EJournal;
