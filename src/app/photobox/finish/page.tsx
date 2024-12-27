'use client';
import NavigationBar from '@/components/ui/navbar';
import { Button } from 'antd';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const FinishPage = () => {
  const query = useSearchParams();
  const url = query.get('url');

  if (!url) {
    return <div>No data</div>;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url as string;
    link.download = 'memoify.png'; // File name for the downloaded image
    link.click();
  };

  return (
    <div>
      <NavigationBar />

      <div className="bg-slate-100 min-h-[80vh] m-[30px] rounded-[20px] p-[30px] flex items-center justify-center gap-[50px]">
        <div className="max-w-[400px]">
          <Image src={url as string} alt="" width={864} height={1296} />
        </div>
        <div className="max-w-[400px]">
          <h1 className="font-bold text-[40px]">
            Woa, your photobox is ready!
          </h1>
          <br />
          <p>
            You can share your own version of Photobox with your friends or
            someone you love.
          </p>
          <br />
          <p>
            Thank you for using Memoify. If you have any questions or feedback,
            please reach out to us
          </p>
          <br />
          <div className="flex gap-[12px]">
            <Button
              onClick={handleDownload}
              type="primary"
              className="!bg-black !text-[14px]"
              size="large">
              Download
            </Button>
            <Button
              type="primary"
              className="!bg-red-800 !text-[14px]"
              size="large">
              Download for instagram story
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishPage;
