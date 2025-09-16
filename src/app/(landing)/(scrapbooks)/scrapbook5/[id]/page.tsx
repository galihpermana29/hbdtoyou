import { getDetailContent } from '@/action/user-api';
import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import { ErrorBoundaryCustom } from '@/components/ui/error-boundary';
import NavigationBar from '@/components/ui/navbar';
import ResultWrapper from '../../result-wrapper';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

const Scrapbook5Result = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const data = await getDetailDataNew(id);
  if (!data.data) {
    return <div>No data</div>;
  }

  let parsedData;
  try {
    parsedData = JSON.parse(data.data.detail_content_json_text);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    parsedData = null;
  }

  if (!parsedData) {
    return <ErrorBoundaryCustom />;
  }
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
      <ResultWrapper>
        <PageFlipScrapbook
          pages={structuredPages}
          coverImage={coverImage}
          backCoverImage={backCoverImage}
          coverTitle=""
          backCoverTitle=""
        />
      </ResultWrapper>
    </div>
  );
};

export default Scrapbook5Result;
