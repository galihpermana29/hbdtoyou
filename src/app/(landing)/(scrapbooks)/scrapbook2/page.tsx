'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';
import { usePathname } from 'next/navigation';

const ScrapbookResult2 = () => {
  // Cover images
  // const coverImage =
  //   'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139610/t2c1_ly6lpa.jpg';
  // const backCoverImage =
  //   'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139618/t2c5_zmfvgr.png';
  // const pages = [
  //   'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139614/t2c3_w7mqdd.png',
  //   'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139617/t2c4_uoee44.png',
  //   'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763139612/t2c2_vg7nlo.png',
  const coverImage =
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763193118/t3c1_dhwqn9.png';
  const backCoverImage =
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763193105/t3c5_fshtz7.png';
  const pages = [
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763193109/t3c2_yzo5xp.png',
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763193108/t3c3_zr2yj2.png',
    'https://res.cloudinary.com/braiwjaya-university/image/upload/v1763193111/t3c4_olbfo0.png',
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
