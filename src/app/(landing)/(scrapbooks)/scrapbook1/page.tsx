'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const ScrapbookResult1 = () => {
  // https://res.cloudinary.com/daxoobtu4/image/upload/v1766216877/t2c1_fczhgo.jpg

  // https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c2_uf4uwd.png
  // https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c3_delood.png
  // https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c2_uf4uwd.png

  // https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c5_v9iex0.png

  const coverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216877/t2c1_fczhgo.jpg';
  const backCoverImage =
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c5_v9iex0.png';
  const pages = [
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c2_uf4uwd.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c3_delood.png',
    'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c2_uf4uwd.png',
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
