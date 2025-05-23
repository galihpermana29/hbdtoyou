import NavigationBar from '@/components/ui/navbar';
import { Button } from 'antd';
import { CirclePlay } from 'lucide-react';
import { sampleEntries } from './models/data';
import JournalCard from './view/JournalCard';

const EJournal = () => {
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-[80px]">
                {sampleEntries.map((entry) => (
                  <JournalCard key={entry.id} entry={entry} />
                ))}
              </div>
              {/* <div className="max-w-[600px] flex-1 mt-[20px] md:mt-0 mx-auto">
                <div className="flex flex-col gap-[20px] md:flex-row justify-center items-center">
                  <Button
                    className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[48px] md:!h-[60px] !w-[250px]"
                    type="primary"
                    size="large">
                    Create yours
                  </Button>
                </div>
              </div> */}
            </div>
            {/* <div className="mt-[100px]">
              <div className="mb-12">
                <div className="mb-6">
                  <h2 className="text-2xl text-center w-full font-semibold text-slate-800">
                    Journals & Articles
                  </h2>
                  <p className="text-slate-600 mb-4 max-w-[900px] mx-auto mt-[24px]">
                    Inspired by academic publications, this journal provides a
                    structured way to document personal thoughts, experiences,
                    and reflections. Each entry follows a scholarly format with
                    title, abstract, keywords, and formal sections.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-[80px]">
                  {sampleEntries.map((entry) => (
                    <JournalCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EJournal;
