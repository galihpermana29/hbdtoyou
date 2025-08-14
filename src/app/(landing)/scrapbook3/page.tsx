'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook3 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/dduonada5/image/upload/v1755101943/images-scrapbook/e198b645-3703-477d-965b-18ecd390b328_page_0.jpg';
  const backCoverImage =
    'https://res.cloudinary.com/dduonada5/image/upload/v1755102248/images-scrapbook/5996fef6-1a62-46fa-b3ee-d4ee98464f5c_page_4.jpg';

  const pages = [
    'https://res.cloudinary.com/dduonada5/image/upload/v1755102247/images-scrapbook/5996fef6-1a62-46fa-b3ee-d4ee98464f5c_page_1.jpg',
    'https://res.cloudinary.com/dduonada5/image/upload/v1755102246/images-scrapbook/5996fef6-1a62-46fa-b3ee-d4ee98464f5c_page_3.jpg',
    'https://res.cloudinary.com/dduonada5/image/upload/v1755102247/images-scrapbook/5996fef6-1a62-46fa-b3ee-d4ee98464f5c_page_2.jpg',
  ];

  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className={pathname === '/scrapbook3' ? 'mt-[100px]' : ''} />
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

export default Scrapbook3;
