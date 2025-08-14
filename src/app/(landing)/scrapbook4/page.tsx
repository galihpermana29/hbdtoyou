'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook4 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/dduonada5/image/upload/v1755192594/images-scrapbook/987a57ee-8b26-47f8-bca5-9e6270a2bcae_page_0.jpg';
  const backCoverImage =
    'https://res.cloudinary.com/dduonada5/image/upload/v1755192595/images-scrapbook/987a57ee-8b26-47f8-bca5-9e6270a2bcae_page_4.jpg';

  const pages = [
    'https://res.cloudinary.com/dduonada5/image/upload/v1755192594/images-scrapbook/987a57ee-8b26-47f8-bca5-9e6270a2bcae_page_1.jpg',
    'https://res.cloudinary.com/dduonada5/image/upload/v1755192595/images-scrapbook/987a57ee-8b26-47f8-bca5-9e6270a2bcae_page_3.jpg',
    'https://res.cloudinary.com/dduonada5/image/upload/v1755192595/images-scrapbook/987a57ee-8b26-47f8-bca5-9e6270a2bcae_page_2.jpg',
  ];

  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className={pathname === '/scrapbook4' ? 'mt-[100px]' : ''} />
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

export default Scrapbook4;
