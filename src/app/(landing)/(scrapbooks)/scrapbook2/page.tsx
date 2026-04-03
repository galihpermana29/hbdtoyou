'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const ScrapbookResult2 = () => {
  const coverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216716/t3c1_rj4byp.png';
  const backCoverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216716/t3c5_wuw6op.png';
  const pages = [
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216716/t3c2_juyjfr.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216717/t3c3_gyjkvc.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216716/t3c4_c5ybrj.png',
  ];

  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className={pathname === '/scrapbook2' ? 'mt-[100px]' : ''} />
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

export default ScrapbookResult2;
