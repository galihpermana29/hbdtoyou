import MusicPlayer from '@/components/ui/music-player/music-player';
import ClientResult from './client-result';

const ResultWrapper = ({
  children,
  isNew,
}: {
  children: React.ReactNode;
  isNew: boolean;
}) => {
  if (!isNew) {
    return (
      <div>
        <MusicPlayer />
        {children}
      </div>
    );
  }
  return (
    <div className="bg-[#F8FAFB] p-[24px] rounded-[16px] border-[#EDEDED] border-[1px] flex flex-col items-center justify-center text-center">
      <MusicPlayer />
      <div className="mb-[20px]">
        <h1 className="text-[#1B1B1B] font-[600] text-[18px] lg:text-[24px]">
          All Done! Your Scrapbook is Ready to Share
        </h1>
        <p className="text-[#666D80] text-[16px] font-[400] ">
          We have saved your scrapbook — you can revisit it anytime using the
          link above.
        </p>
      </div>
      <div className="max-w-[500px]">{children}</div>

      <div className="mt-[20px] flex justify-center items-center w-full">
        <ClientResult />
      </div>
    </div>
  );
};

export default ResultWrapper;
