import { getDetailContent } from '@/action/user-api';
import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import NavigationBar from '@/components/ui/navbar';

const pages = [
  'https://res.cloudinary.com/dqipjpy1w/image/upload/v1750003560/tl7dqxuefwo2oiaxgj9s.jpg',
  'https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/02.jpg',
  'https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/03.jpg',
  'https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/04.jpg',
  'https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/05.jpg',
  'https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/06.jpg',
];

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

const ScrapbookVintageResult = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }
  const parsedData = JSON.parse(data.data.detail_content_json_text);

  // Cover images
  const coverImage = parsedData?.coverImage;
  const backCoverImage = parsedData?.backCoverImage;

  const structuredPages = parsedData?.pages;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className="mt-[100px]" />
      <PageFlipScrapbook
        pages={structuredPages}
        coverImage={coverImage}
        backCoverImage={backCoverImage}
        coverTitle=""
        backCoverTitle=""
      />
    </div>
  );
};

export default ScrapbookVintageResult;
