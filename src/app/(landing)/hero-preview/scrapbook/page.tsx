'use client';

import PageFlipScrapbook from '@/components/PageFlipScrapbook';

const coverImage =
  'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216877/t2c1_fczhgo.jpg';
const backCoverImage =
  'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c5_v9iex0.png';
const pages = [
  'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c2_uf4uwd.png',
  'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c3_delood.png',
  'https://res.cloudinary.com/daxoobtu4/image/upload/v1766216878/t2c2_uf4uwd.png',
];

export default function HeroScrapbookPreviewPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6efe6] px-4 py-8">
      <PageFlipScrapbook
        pages={pages}
        coverImage={coverImage}
        backCoverImage={backCoverImage}
        coverTitle="Scrapbook by Memoify"
        backCoverTitle="The End"
        enableVideoExport={false}
      />
    </div>
  );
}
