'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook8 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217712/t8c1_oxyvpk.png';
  const backCoverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217787/t8c5_exx3z2.png';

  const pages = [
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217712/t8c2_vrprth.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217787/t8c3_v0whl8.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766217787/t8c4_wgy2da.png',
  ];

  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className={pathname === '/scrapbook8' ? 'mt-[100px]' : ''} />
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

export default Scrapbook8;
