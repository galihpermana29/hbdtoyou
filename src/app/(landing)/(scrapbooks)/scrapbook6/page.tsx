'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook6 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139984/t6c1_ieyasv.png';
  const backCoverImage =
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139948/t6c5_h7kh0x.png';

  const pages = [
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139947/t6c2_ykcold.png',
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139946/t6c3_usuxu4.png',
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139950/t6c4_blldz2.png',
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
