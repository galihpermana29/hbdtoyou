'use client';

import NavigationBar from '@/components/ui/navbar';
// dynamic
import { IContent } from '@/action/interfaces';
import { useMemoifySession } from '@/app/session-provider';
import { Button, Input, Typography } from 'antd';
import { SearchIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
const JournalCard = dynamic(() => import('./view/JournalCard'), { ssr: false });

const EJournal = ({ journalsData }: { journalsData: IContent[] }) => {
  const router = useRouter();
  const { accessToken } = useMemoifySession();

  // State for search query and filtered journals
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJournals, setFilteredJournals] =
    useState<IContent[]>(journalsData);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: 'Abstract-level emotions',
      description:
        'Open your message with a scholarly abstract. Summarize your deepest feelings in 2-3 lines that sound like they belong in a peer-reviewed journal.',
    },
    {
      title: 'Structured like a thesis',
      description:
        'From Preamble to Conclusion, every part of your letter follows a research paper format.',
    },
    {
      title: 'Print, publish, or present',
      description:
        'Easily publish your journal online, or print it like it’s your final submission to the Journal of Emotional Communication.',
    },
  ];

  // Filter journals based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If search query is empty, show all journals
      setFilteredJournals(journalsData);
      return;
    }

    // Filter journals based on destinationName or author in the JSON string
    const filtered = journalsData.filter((journal) => {
      try {
        // Parse the JSON string
        const jsonData = JSON.parse(journal.detail_content_json_text);

        // Check if destinationName or author contains the search query (case insensitive)
        const destinationNameMatch =
          jsonData.destinationName &&
          jsonData.destinationName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const authorMatch =
          jsonData.author &&
          jsonData.author.toLowerCase().includes(searchQuery.toLowerCase());

        // Return true if either field matches
        return destinationNameMatch || authorMatch;
      } catch (error) {
        // If JSON parsing fails, exclude this entry
        console.error('Error parsing JSON:', error);
        return false;
      }
    });

    setFilteredJournals(filtered);
  }, [searchQuery, journalsData]);

  return (
    <div className="w-screen overflow-x-hidden">
      <div className="sticky top-0 left-0 w-full z-40 ">
        <NavigationBar />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center pt-24 pb-16 bg-[#FFF6F5] relative">
          <div className="flex flex-col items-center justify-center px-4 sm:px-8 mx-auto w-full">
            <div className="flex flex-col items-center justify-center gap-y-12 max-w-5xl">
              <div className="mx-auto flex flex-col items-center justify-center gap-y-6">
                <h1 className="text-center text-[#1B1B1B] font-semibold text-4xl md:text-5xl lg:text-6xl inter-font leading-tight md:leading-[72px] tracking-[-2%]">
                  Write a simple love, apology, or birthday letter like a
                  research paper.
                </h1>
                <p className="text-[#7B7B7B] text-lg md:text-xl font-normal inter-font max-w-3xl text-center">
                  Translating Deep Emotions into Academic Format: A Case Study
                  in Heartfelt Communication
                </p>
              </div>
              <Button
                onClick={() => {
                  if (accessToken) {
                    router.push('/journal/create');
                  } else {
                    signIn('google');
                  }
                }}
                type="primary"
                className="!px-[18px] sm:!px-[22px] !py-4 !bg-[#E34013] !text-white !h-[50px] sm:!h-[60px] !rounded-lg !font-semibold !text-base sm:!text-lg relative z-30 w-[80%] sm:w-auto">
                Publish a Journal
              </Button>
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit z-20 pb-12 sm:pb-16 md:pb-24">
          <Image
            src="/MacbookProMockup.png"
            alt="Memoify Live Scrapboox Hero"
            className="max-w-[768px] w-full h-auto mx-auto px-4 sm:px-0"
            width={0}
            height={0}
            quality={100}
            loading="eager"
            priority
          />
          <Image
            src="/scrapbook-background-pattern.svg"
            alt=""
            className="w-full h-full absolute max-md:-top-1/3 -top-1/4 -z-10"
            width={0}
            height={0}
            quality={100}
            loading="eager"
            priority
          />
        </div>
        <div className="w-full py-12 sm:py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex flex-col">
              <Typography.Text className="!text-[#E55A3B] !font-semibold !text-base !mb-3">
                Features
              </Typography.Text>

              <Typography.Title
                level={2}
                className="!text-3xl sm:!text-4xl !font-semibold !text-[#1B1B1B] !mb-5 !leading-tight !mt-0 !max-w-[624px]">
                Make your journal truly yours
              </Typography.Title>
              <Typography.Paragraph className="!text-[#7B7B7B] !text-base sm:!text-lg md:!text-xl !leading-relaxed !max-w-[869px] !font-normal">
                From writing heartfelt entries your personal journal becomes a
                deeply personal reflection of your life and memories.
              </Typography.Paragraph>

              <div className='flex flex-col lg:flex-row gap-x-8 xl:gap-x-16 gap-y-10 pt-8 sm:pt-12 lg:pt-16'>
                <div className="flex flex-col gap-y-10 items-start">
                  <div className="flex flex-col items-start w-full max-w-full lg:max-w-[560px]">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className={`w-full pl-6 py-4 border-[4px] border-y-0 border-r-0 cursor-pointer transition-all duration-300 ${activeFeature === index
                          ? 'border-l-[#E34013]'
                          : 'border-l-[#F2F4F7] hover:border-l-[#E34013]/50'
                          }`}
                        onClick={() => setActiveFeature(index)}>
                        <div className="flex flex-col gap-y-2 items-start">
                          <Typography.Title
                            level={4}
                            className="!text-xl !font-semibold !text-[#1B1B1B] !mb-0">
                            {feature.title}
                          </Typography.Title>
                          <Typography.Paragraph className="!text-[#7B7B7B] !leading-relaxed !text-base !mb-0 !font-normal">
                            {feature.description}
                          </Typography.Paragraph>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => {
                      if (accessToken) {
                        router.push('/journal/create');
                      } else {
                        signIn('google');
                      }
                    }}
                    type="primary"
                    size="large"
                    className="!bg-[#E55A3B] !border-[#E55A3B] !rounded-lg !h-12 !px-7 !py-3 !w-fit !text-base !font-semibold">
                    Publish a Journal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-[30px] md:py-24 flex flex-col text-center items-center min-h-screen bg-[#F9FAFB] w-full gap-y-24">
        <div className="max-w-7xl mx-auto w-full max-md:px-4 px-8">
          <div className="flex max-md:flex-col items-start gap-x-4 border border-solid border-b-[#EAECF0] border-x-0 border-t-0 self-stretch max-md:pb-4">
            <div className="text-start flex flex-col gap-y-1 flex-1 w-full max-md:pb-4 pb-8">
              <p className="font-semibold text-lg text-[#1B1B1B]">
                Published Journal
              </p>
              <p className="font-normal text-[#7B7B7B] text-sm">
                A Case Study in Heartfelt Communication
              </p>
            </div>
            <Input
              placeholder="Search journal"
              size="large"
              className="!w-full !max-w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SearchIcon className="text-[#667085]" />}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full px-8">
          {filteredJournals.length > 0
            ? filteredJournals.map((entry) => (
              <JournalCard key={entry.id} entry={entry} />
            ))
            : 'No Journals Available'}
        </div>
      </div>
      <div className="w-full py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <Typography.Title
            level={2}
            className="!text-3xl sm:!text-4xl !font-semibold !text-[#1B1B1B] !mb-5 !leading-tight !mt-0 !inter-font"
          >
            We'll send you a new template update
          </Typography.Title>

          <Typography.Paragraph className="!text-[#7B7B7B] !text-base sm:!text-lg md:!text-xl !leading-relaxed !mb-8 sm:!mb-12 !font-normal max-w-2xl mx-auto">
            No spam. Just the latest releases and new template, interesting inspiration, and
            exclusive interviews with great people.
          </Typography.Paragraph>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto px-4 sm:px-0">
            <Input
              placeholder="Enter your email"
              size="large"
              className="!h-12 !rounded-lg !border-[#D0D5DD] !text-base flex-1"
              style={{
                fontSize: '16px',
                fontWeight: 'normal'
              }}
            />
            <Button
              type="primary"
              size="large"
              className="!bg-[#E55A3B] !border-[#E55A3B] hover:!bg-[#d14d30] !rounded-lg !h-12 !px-8 !font-semibold !text-base whitespace-nowrap"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EJournal;
