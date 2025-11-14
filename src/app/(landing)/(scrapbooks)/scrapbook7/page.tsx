'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const Scrapbook7 = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139986/t7c1_gyalj2.png';
  const backCoverImage =
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139944/t7c5_aczte2.png';

  const pages = [
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139948/t7c2_exuzxd.png',
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139946/t7c3_arr8rn.png',
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139945/t7c4_m09gyo.png',
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
