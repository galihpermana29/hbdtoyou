'use client';
import CoverBook from '@/components/ui/scrapbook/Cover';
import PageOne from '@/components/ui/scrapbook/PageOne';
import PageTwo from '@/components/ui/scrapbook/PagetTwo';

const ScrapbookPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Scrapbook</h1>
      <p className="text-center mb-4">
        Upload your photo to place it in the frames
      </p>
      <CoverBook />
      <PageOne />
      <PageTwo />
    </div>
  );
};

export default ScrapbookPage;
