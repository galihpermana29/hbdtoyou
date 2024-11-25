import NavigationBar from '@/components/ui/navbar';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

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

const TopTenPage = async () => {
  const dx = await getTop10();
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
