'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook6 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217272/t6c1_yzjaom.png';
  const backCoverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217273/t6c5_okcnsw.png';

  const pages = [
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217273/t6c2_upykav.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217273/t6c3_wzihyl.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217273/t6c4_ldc0pw.png',
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
