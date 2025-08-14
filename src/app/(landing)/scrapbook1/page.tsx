'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const ScrapbookResult1 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750269072/images-api/ME202506181751118631.jpg';
  const backCoverImage =
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750269079/images-api/ME202506181751195571.jpg';

  const pages = [
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750269074/images-api/ME202506181751142581.jpg',
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750269076/images-api/ME202506181751162240.jpg',
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750269078/images-api/ME202506181751180571.jpg',
  ];

  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className={pathname === '/scrapbook1' ? 'mt-[100px]' : ''} />
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

export default ScrapbookResult1;
