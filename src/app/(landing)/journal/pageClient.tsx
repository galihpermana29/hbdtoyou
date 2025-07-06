'use client';

import NavigationBar from '@/components/ui/navbar';
// dynamic
import dynamic from 'next/dynamic';
const JournalCard = dynamic(() => import('./view/JournalCard'), { ssr: false });
import { Button, Input } from 'antd';
import { IContent } from '@/action/interfaces';
import { IronSession } from 'iron-session';
import { SessionData } from '@/store/iron-session';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useMemoifySession } from '@/app/session-provider';

const EJournal = ({ journalsData }: { journalsData: IContent[] }) => {
  const router = useRouter();

  const { accessToken } = useMemoifySession();
  return (
    <div>
      <div className="min-h-screen overflow-hidden">
        <div className="fixed top-0 left-0 w-full z-10 ">
          <NavigationBar />
        </div>
        <div className="mt-[81px]">
          <div className="py-[30px] md:py-[90px] flex flex-col text-center items-center mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] min-h-screen">
            <div>
              <p className="mt-[16px] font-[700] text-[35px] max-w-[1000px] mx-auto md:text-[50px] lg:text-[60px] leading-[1.2]">
                Confess your feelings, apologize or write a birthday letter like
                a scholar journal
              </p>
              <p className="text-[16px] md:text-[20px] max-w-[768px] mx-auto font-[400] leading-[30px] text-[#7B7B7B] mt-[24px] mb-[48px]">
                Search, create and publish your own letter
              </p>

              <div className="max-w-[600px] flex-1 mt-[20px] md:mt-0 mx-auto">
                <div className="flex flex-col gap-[20px] md:flex-row justify-center items-center">
                  <Button
                    onClick={() => {
                      if (accessToken) {
                        router.push('/journal/create');
                      } else {
                        signIn('google');
                      }
                    }}
                    className="!bg-[#fff] !text-[#E34013] !border-[1px] 
                    !border-[#E34013] !rounded-[8px] !text-[16px] !font-[600] !h-[48px] md:!h-[60px] !w-[250px]"
                    type="default"
                    size="large">
                    Publish a Journal
                  </Button>
                </div>
              </div>

              <div className="my-[60px]">
                <Input
                  placeholder="Search a name"
                  size="large"
                  className="!w-[400px] md:!w-[500px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
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
