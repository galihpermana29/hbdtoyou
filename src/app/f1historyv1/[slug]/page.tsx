import { getDetailContent } from '@/action/user-api';
import f1Teams from '@/lib/f1Data';
import { Carousel } from 'antd';
import { ArrowDownRight, MoveDownRight } from 'lucide-react';
import Image from 'next/image';

const getDetailDataNew = async (id: string) => {
  const res = await getDetailContent(id);
  return res;
};

const F1Historyv1Page = async ({ params }: { params: any }) => {
  const { slug } = params;

  const data = await getDetailDataNew(slug);
  if (!data.data) {
    return <div>No data</div>;
  }

  const parsedData = JSON.parse(data.data.detail_content_json_text);

  return (
    <div className="bg-[#F6F4F0] pb-[50px]">
      <nav className="h-[58px]  flex justify-between px-[5%] md:px-[10%]  bg-white items-center">
        <div>
          <Image
            src={
              'https://res.cloudinary.com/dxuumohme/image/upload/v1739376662/images-api/imjbgbgkrsn4alo4kz6q.png'
            }
            alt="fia logo"
            width={35}
            height={24}
          />
        </div>

        <div className="flex items-center gap-[10px] md:gap-[18px]">
          <h1 className="f1-font text-[12px] text-black">AUTHENTICS</h1>
          <h1 className="f1-font text-[12px] text-black">STORE</h1>
          <h1 className="f1-font text-[12px] text-black hidden lg:block">
            TICKETS
          </h1>
          <h1 className="f1-font text-[12px] text-black hidden lg:block">
            HOSPITALITY
          </h1>
          <h1 className="f1-font text-[12px] text-black hidden lg:block">
            EXPERIENCES
          </h1>
          <Image
            width={62}
            height={10}
            src={
              'https://res.cloudinary.com/dxuumohme/image/upload/v1739376662/images-api/as8fc1qogw10je6ltlar.png'
            }
            alt="f1 tv logo"
          />
        </div>
      </nav>
      <nav className="h-[64px] flex justify-between px-[5%] md:px-[10%]  bg-[#E10500] items-center">
        <Image
          src={
            'https://res.cloudinary.com/dxuumohme/image/upload/v1739376662/images-api/lhz76kombrcwesosn2p8.png'
          }
          alt="f1-logo"
          width={124}
          height={32}
          className="max-w-[70px] md:max-w-[124px]"
        />

        <h1 className="f1-font text-[14px] text-white uppercase hidden lg:block">
          Latest
        </h1>
        <h1 className="f1-font text-[14px] text-white uppercase hidden lg:block">
          Video
        </h1>
        <h1 className="f1-font text-[14px] text-white uppercase hidden lg:block">
          F1 Unlocked
        </h1>
        <h1 className="f1-font text-[14px] text-white uppercase hidden lg:block">
          Schedule
        </h1>
        <h1 className="f1-font text-[14px] text-white uppercase">Result</h1>
        <h1 className="f1-font text-[14px] text-white uppercase">Driver</h1>
        <h1 className="f1-font text-[14px] text-white uppercase">Teams</h1>
      </nav>
      <h1 className="mt-[50px] mb-[12px] f1-font text-[18px] md:text-[30px] text-black px-[5%] md:px-[10%]">
        {parsedData?.title ?? 'Our Valentine Gift'}
      </h1>
      <div className="bg-white mx-[5%] md:mx-[10%] px-[20px] pb-[20px]">
        <div className="min-h-screen flex flex-col-reverse md:flex-row justify-between gap-[30px]">
          <div>
            <div className="flex gap-[10px] justify-center items-center mt-[30px] md:p-[20px]">
              <Image
                src={
                  f1Teams.find((dx) => dx.teamName === parsedData?.teamName)
                    ?.logo ??
                  'https://res.cloudinary.com/dxuumohme/image/upload/v1739376662/images-api/pct0bkdcsx0yvgyewksl.png'
                }
                alt="f1-logo"
                width={252}
                height={67}
              />
              <div className="hidden md:block">
                <div className="flex gap-[8px]">
                  <ArrowDownRight className="text-red-500" size={22} />
                  <h1 className="f1-font-bold text-[14px] text-black">
                    Instagram
                  </h1>
                </div>
                <div className="flex gap-[8px]">
                  <ArrowDownRight className="text-red-500" size={22} />
                  <h1 className="f1-font-bold text-[14px] text-black">
                    Tiktok
                  </h1>
                </div>
                <div className="flex gap-[8px]">
                  <ArrowDownRight className="text-red-500" size={22} />
                  <h1 className="f1-font-bold text-[14px] text-black">X</h1>
                </div>
              </div>
            </div>
            <div className="mt-[20px] mb-[20px]">
              <h1 className="f1-font-bold text-[14px] text-black">
                Team Description
              </h1>
              <p className=" f1-font text-[12px] mt-[10px] max-w-[600px]">
                {parsedData?.teamDescription ??
                  `Since our journey began in 2019, our love story has been an
                incredible ride. Through ups and downs, laughter and tears, we
                ve built something truly special. Every moment together is a
                podium finish, and every challenge we face makes us stronger.
                From silly jokes to heartfelt conversations, we continue to race
                forward, hand in hand, towards a lifetime of happiness.`}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Team Name', value: parsedData?.teamName ?? '-' },
                { label: 'Base', value: parsedData?.teamBase ?? '-' },
                {
                  label: 'Who is Falling in Love First',
                  value: parsedData?.fallingFirst ?? '-',
                },
                {
                  label: 'Who is The Most Jealous',
                  value: parsedData?.mostJealous ?? '-',
                },
                {
                  label: 'Who is The Most Funny',
                  value: parsedData?.mostFunny ?? '-',
                },
                {
                  label: 'Who is The Most Romantic',
                  value: parsedData?.mostRomantic ?? '-',
                },
                {
                  label: 'Team First Date',
                  value: parsedData?.teamFirstDate ?? '-',
                },
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-5">
                  <h1 className="f1-font-bold text-[14px] text-black">
                    {item.label}
                  </h1>
                  <h1 className="f1-font text-[14px] text-black">
                    {item.value}
                  </h1>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col  items-center lg:items-start lg:flex-row gap-[12px] mt-[20px] lg:mt-0">
            <div>
              <div className="aspect-square overflow-hidden">
                <img
                  src={parsedData?.driver1 ?? f1Teams[0].drivers[0].image}
                  alt="driver-1"
                  className="object-cover aspect-square max-w-[300px]"
                />
              </div>
              <div>
                <h1 className="f1-font-bold text-[36px] text-black">
                  {parsedData?.firstDriverNumber ?? '0'}
                </h1>
                <h1 className="f1-font text-[16px] text-black mt-[12px]">
                  {parsedData?.firstDriverName ?? 'First Driver'}
                </h1>
                <h1 className="f1-font-bold text-[12px] text-[#68686F]">
                  {parsedData?.teamName ?? 'Team Name'}
                </h1>
              </div>
            </div>
            <div>
              <div className="aspect-square  overflow-hidden">
                <img
                  src={parsedData?.driver2 ?? f1Teams[0].drivers[1].image}
                  alt="driver-2"
                  className="object-cover aspect-square max-w-[300px]"
                />
              </div>
              <div>
                <h1 className="f1-font-bold text-[36px] text-black">
                  {parsedData?.secondDriverNumber ?? '0'}
                </h1>
                <h1 className="f1-font text-[16px] text-black mt-[12px]">
                  {parsedData?.secondDriverName ?? 'Second Driver'}
                </h1>
                <h1 className="f1-font-bold text-[12px] text-[#68686F]">
                  {parsedData?.teamName ?? 'Team Name'}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[20px]">
          <Carousel autoplay>
            {parsedData?.images?.map((dx: any) => (
              <div
                className="aspect-video overflow-hidden flex justify-center items-center"
                key={dx}>
                <img
                  className="object-cover object-center w-full aspect-video"
                  src={dx}
                  alt="lando"
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="bg-[#E10500] h-[20px] w-full"></div>
        <div className="my-[50px] px-[20px] md:px-[40px]">
          <div>
            <h1 className="mt-[12px] f1-font text-[28px] text-black">
              In Profile
            </h1>
            <p className="mt-[12px] f1-font text-[14px] text-black">
              {parsedData?.teamDescription ??
                `Since our journey began in 2019, our love story has been an
                incredible ride. Through ups and downs, laughter and tears, we
                ve built something truly special. Every moment together is a
                podium finish, and every challenge we face makes us stronger.
                From silly jokes to heartfelt conversations, we continue to race
                forward, hand in hand, towards a lifetime of happiness.`}
            </p>
          </div>
          <div>
            {parsedData?.episodes?.map((dx: any) => (
              <div key={dx}>
                <h1 className="mt-[12px] f1-font text-[28px] text-black">
                  {dx.year}
                </h1>
                <p className="mt-[12px] f1-font text-[14px] text-black">
                  {dx.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default F1Historyv1Page;
