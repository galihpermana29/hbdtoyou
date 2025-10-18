'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook7 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781558/cover7_hlkby4.png';
  const backCoverImage =
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781548/Page_4_-_Template_7_doq9xj.png';

  const pages = [
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781548/Page_1_-_Template_7_e2hnkf.png',
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781548/Page_2_-_Template_7_djrfxa.png',
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760781549/Page_3_-_Template_7_ioh2rh.png',
  ];

  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className={pathname === '/scrapbook7' ? 'mt-[100px]' : ''} />
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

export default Scrapbook7;
