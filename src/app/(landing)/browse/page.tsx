import NavigationBar from '@/components/ui/navbar';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Digital Gifts, Scrapbooks & Albums | Memoify',
  description: 'Explore our collection of digital gift, digital scrapbook, and digital album templates inspired by Netflix, Spotify, YouTube and more. Find the perfect design to showcase your memories in style.',
  keywords: 'digital gift, digital scrapbook, digital album, virtual present, online gift, electronic memory book, digital photo collection, memory collection, virtual album, online scrapbook, e-gift, hadiah ulang tahun digital, kado digital, scrapbook digital, album foto digital, kenangan digital, kado online, templates, Netflix templates, Spotify templates, YouTube templates, custom websites, digital memories, Memoify',
  openGraph: {
    title: 'Browse Digital Gifts, Scrapbooks & Albums | Memoify',
    description: 'Explore our collection of digital gift, digital scrapbook, and digital album templates inspired by Netflix, Spotify, YouTube and more. Find the perfect design to showcase your memories in style.',
    url: 'https://memoify.live/browse',
    siteName: 'Memoify',
    images: [
      {
        url: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1751298448/brave_screenshot_memoify.live_mhwzfs.png',
        width: 1200,
        height: 630,
        alt: 'Browse Memoify Templates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Digital Gifts, Scrapbooks & Albums | Memoify',
    description: 'Explore our collection of digital gift, digital scrapbook, and digital album templates inspired by Netflix, Spotify, YouTube and more. Find the perfect design to showcase your memories in style.',
    images: ['https://res.cloudinary.com/dqipjpy1w/image/upload/v1751298448/brave_screenshot_memoify.live_mhwzfs.png'],
  },
};

const getTop10 = async () => {
  const headersList = headers();
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const host =
    headersList.get('x-forwarded-host') ||
    headersList.get('host') ||
    'beta.popstarz.ai';

  const domain = `${protocol}://${host}`;

  const res = await fetch(`${domain}/api/top-10`, {
    next: { revalidate: 3600, tags: ['random'] },
  });

  if (res.ok) {
    const data = await res.json();
    return data.data;
  }

  return [];
};

const dx: any[] = [];
const TopTenPage = async () => {
  // const dx = await getTop10();
  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>

      <div className="mt-[100px]">
        <div className="flex justify-center items-center">
          <h1 className="text-center my-[50px] text-[30px] font-bold max-w-[400px]">
            We are getting randomly 12 data for you
          </h1>
        </div>
        <div className="flex justify-center items-center">
          {dx.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {dx.map((dy: any, idx: number) => (
                <Link href={`/${dy.forName}`} key={idx}>
                  <Card
                    key={idx}
                    hoverable
                    style={{ width: 300 }}
                    cover={
                      <div className="h-[200px]  object-cover overflow-hidden">
                        <Image
                          alt="example"
                          src={dy.jumbotronImage}
                          width={300}
                          height={200}
                        />
                      </div>
                    }>
                    <Meta
                      title={dy.title}
                      description={
                        dy.subTitle ? dy.subTitle.substring(0, 80) : ''
                      }
                    />
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div>No data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopTenPage;
