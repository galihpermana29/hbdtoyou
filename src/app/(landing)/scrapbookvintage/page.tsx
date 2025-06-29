'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';

const pages = [
  'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751193202/images-api/ME202506291033220420.jpg',
  'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751193203/images-api/ME202506291033233460.jpg',
  'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751193205/images-api/ME202506291033248701.jpg',
];

const ScrapbookResult = () => {
  // Cover images
  const coverImage =
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751193200/images-api/ME202506291033201230.jpg';
  const backCoverImage =
    'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751193206/images-api/ME202506291033263480.jpg';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className="mt-[100px]" />
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

export default ScrapbookResult;
