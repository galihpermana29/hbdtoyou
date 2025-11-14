'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const ScrapbookResult1 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139474/t1c1_xqmu5m.png';
  const backCoverImage =
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139483/t1c5_wkitrm.png';

  const pages = [
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139477/t1c3_astq95.png',
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139479/t1c4_uhbwl3.png',
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139476/t1c2_bav7fp.png',
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
