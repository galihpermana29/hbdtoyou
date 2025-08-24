'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook5 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/dduonada5/image/upload/v1756027445/images-scrapbook/template_5_page_0.jpg';
  const backCoverImage =
    'https://res.cloudinary.com/dduonada5/image/upload/v1756027448/images-scrapbook/template_5_page_4.jpg';

  const pages = [
    'https://res.cloudinary.com/dduonada5/image/upload/v1756027448/images-scrapbook/template_5_page_2.jpg',
    'https://res.cloudinary.com/dduonada5/image/upload/v1756027448/images-scrapbook/template_5_page_1.jpg',
    'https://res.cloudinary.com/dduonada5/image/upload/v1756027449/images-scrapbook/template_5_page_3.jpg',
  ];

  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className={pathname === '/scrapbook5' ? 'mt-[100px]' : ''} />
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

export default Scrapbook5;
