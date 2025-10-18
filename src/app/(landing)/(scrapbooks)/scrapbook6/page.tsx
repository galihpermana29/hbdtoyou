'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook6 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781300/5cover_ip2ha4.png';
  const backCoverImage =
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781299/page4-5_hhi6zk.png';

  const pages = [
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781302/page1-g_kv09hz.png',
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781301/page2-5_o7qcwb.png',
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781302/page3-5_zmqj96.png',
  ];

  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className={pathname === '/scrapbook6' ? 'mt-[100px]' : ''} />
      <PageFlipScrapbook
        pages={pages}
        coverImage={coverImage}
        backCoverImage={backCoverImage}
        coverTitle="Scrapbook by Memoify"
        backCoverTitle="The End"
      />
    </div>
  );
};

export default Scrapbook6;
