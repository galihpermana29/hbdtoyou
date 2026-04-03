'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook7 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217102/t7c1_a7qfwa.png';
  const backCoverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217104/t7c5_nmiyfd.png';

  const pages = [
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217102/t7c2_nqaaqr.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217103/t7c3_gfd1gs.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217103/t7c4_q1eqn9.png',
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
