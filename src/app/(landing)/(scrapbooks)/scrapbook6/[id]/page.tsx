import { getDetailContent } from '@/action/user-api';
import PageFlipScrapbook from '@/components/PageFlipScrapbook';
import { ErrorBoundaryCustom } from '@/components/ui/error-boundary';
import NavigationBar from '@/components/ui/navbar';
import ResultWrapper from '../../result-wrapper';
import { Metadata } from 'next';
import LockScreen from '@/components/ui/lock-screen';
// metadata
export const metadata: Metadata = {
  title:
    'Memoify | AI-Powered Digital Scrapbook Generator - Create Personalized Memory Collections',
  description:
    "Transform your memories into beautiful digital scrapbooks with Memoify's AI technology. Our Memo AI analyzes your photos and stories to generate personalized, stunning scrapbook layouts automatically. Create meaningful digital gifts in minutes!",
  keywords:
    'AI scrapbook generator, AI digital scrapbook, automated scrapbook creation, AI memory book, intelligent photo album, AI-powered gift, digital scrapbook maker, AI photo collection, smart memory book, automated digital gift, AI personalized scrapbook, Memo AI, machine learning scrapbook, AI gift generator, digital memories AI, Memoify AI, hadiah digital AI, scrapbook otomatis, album foto AI',
  openGraph: {
    title:
      'Memoify | AI-Powered Digital Scrapbook Generator - Create Personalized Memory Collections',
    description:
      "Transform your memories into beautiful digital scrapbooks with Memoify's AI technology. Our Memo AI analyzes your photos and stories to generate personalized, stunning scrapbook layouts automatically.",
    url: 'https://memoify.live',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760783261/Screenshot_2025-10-18_at_17.27.34_zzdgjr.png',
        width: 1200,
        height: 630,
        alt: 'Memoify - AI-Powered Digital Scrapbook Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memoify | AI-Powered Digital Scrapbook Generator',
    description:
      "Transform your memories into beautiful digital scrapbooks with Memoify's AI technology. Our Memo AI analyzes your photos and stories to generate personalized, stunning scrapbook layouts automatically.",
    images: [
      'https://res.cloudinary.com/dqipjpy1w/image/upload/v1760783261/Screenshot_2025-10-18_at_17.27.34_zzdgjr.png',
    ],
  },
};
const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

const Scrapbook6Result = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { isNew: string };
}) => {
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
      <ResultWrapper isNew={searchParams.isNew === 'true'}>
        <LockScreen
          type="scrapbook"
          contentId={id}
          initiallyLocked={
            data.data.status === 'locked' || data.data.user_type === 'free'
          }>
          <PageFlipScrapbook
            pages={structuredPages}
            coverImage={coverImage}
            backCoverImage={backCoverImage}
            coverTitle=""
            backCoverTitle=""
          />
        </LockScreen>
      </ResultWrapper>
    </div>
  );
};

export default Scrapbook6Result;
