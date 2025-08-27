import { Carousel } from 'antd';
import { ArrowDownRight, MoveDownRight } from 'lucide-react';
import Image from 'next/image';

const F1Historyv1Page = () => {
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
      <h1 className="mt-[50px] mb-[12px] f1-font text-[30px] text-black px-[5%] md:px-[10%]">
        Our Valentine Gift
      </h1>
      <div className="bg-white mx-[5%] md:mx-[10%] px-[20px] pb-[20px]">
        <div className="min-h-screen flex flex-col-reverse md:flex-row justify-between gap-[30px]">
          <div>
            <div className="flex gap-[20px] justify-center items-center mt-[30px] md:p-[20px]">
              <Image
                src={
                  'https://res.cloudinary.com/dxuumohme/image/upload/v1739463133/images-api/Ferrari/nvua0wzcrnhoi51yjvfs.avif'
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
              <p className=" f1-font text-[12px]">
                Since our journey began in 2019, our love story has been an
                incredible ride. Through ups and downs, laughter and tears, we
                ve built something truly special. Every moment together is a
                podium finish, and every challenge we face makes us stronger.
                From silly jokes to heartfelt conversations, we continue to race
                forward, hand in hand, towards a lifetime of happiness.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { label: 'Team Name', value: 'Ferrari Kuda Jingkrak' },
                { label: 'Base', value: 'Depok' },
                {
                  label: 'Who is Falling in Love First',
                  value: 'Leclerc',
                },
                {
                  label: 'Who is The Most Jealous',
                  value: 'Celine',
                },
                {
                  label: 'Who is The Most Funny',
                  value: 'Leclerc',
                },
                {
                  label: 'Who is The Most Romantic',
                  value: 'Leclerc',
                },
                {
                  label: 'Team First Date',
                  value: '29 March 2019',
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
              <div className="h-[292px] w-[292px] overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dxuumohme/image/upload/v1739463134/images-api/Ferrari/wl59cqou7gmngxebrhev.avif"
                  alt="driver-1"
                  width={292}
                  className="object-cover"
                  height={388}
                />
              </div>
              <div>
                <h1 className="f1-font-bold text-[36px] text-black">26</h1>
                <h1 className="f1-font text-[16px] text-black mt-[12px]">
                  Galih Putra
                </h1>
                <h1 className="f1-font-bold text-[12px] text-[#68686F]">
                  Galih & Caca Racing Team
                </h1>
              </div>
            </div>
            <div>
              <div className="h-[292px] w-[292px] overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dxuumohme/image/upload/v1739380083/images-api/exdybuaeubkmlwsoxqxl.png"
                  alt="driver-2"
                  width={292}
                  className="object-cover"
                  height={388}
                />
              </div>
              <div>
                <h1 className="f1-font-bold text-[36px] text-black">6</h1>
                <h1 className="f1-font text-[16px] text-black mt-[12px]">
                  Celine Salsabila
                </h1>
                <h1 className="f1-font-bold text-[12px] text-[#68686F]">
                  Galih & Caca Racing Team
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[20px]">
          <Carousel>
            <div>
              <div className="aspect-video">
                <Image
                  className="object-cover"
                  src={
                    'https://res.cloudinary.com/dxuumohme/image/upload/v1739383207/images-api/xl6ml0bm6tdgulnpjw3o.png'
                  }
                  alt="lando"
                  fill
                />
              </div>
            </div>
          </Carousel>
        </div>
        <div className="bg-[#E10500] h-[20px] w-full"></div>
        <div className="my-[50px] px-[20px] md:px-[40px]">
          <div>
            <h1 className="mt-[12px] f1-font text-[28px] text-black">
              In Profile
            </h1>
            <p className="mt-[12px] f1-font text-[14px] text-black">
              Since our journey began in 2019, our love story has been an
              incredible ride. Through ups and downs, laughter and tears, we ve
              built something truly special. Every moment together is a podium
              finish, and every challenge we face makes us stronger. From silly
              jokes to heartfelt conversations, we continue to race forward,
              hand in hand, towards a lifetime of happiness.
            </p>
          </div>
          <div className="mt-[30px]">
            <h1 className="mt-[12px] f1-font text-[28px] text-black">2024</h1>
            <p className="mt-[12px] f1-font text-[14px] text-black">
              This year marks another lap in our love story. More memories, more
              laughter, and more dreams to achieve together. The best is yet to
              come!
            </p>
          </div>
          <div>
            <h1 className="mt-[12px] f1-font text-[28px] text-black">2023</h1>
            <p className="mt-[12px] f1-font text-[14px] text-black">
              Our bond grew stronger as we explored new places, celebrated
              milestones, and supported each other through every twist and turn.
            </p>
          </div>
          <div>
            <h1 className="mt-[12px] f1-font text-[28px] text-black">2022</h1>
            <p className="mt-[12px] f1-font text-[14px] text-black">
              Another year filled with joy and adventures. We learned more about
              each other and found new ways to cherish our time together.
            </p>
          </div>
          <div>
            <h1 className="mt-[12px] f1-font text-[28px] text-black">2021</h1>
            <p className="mt-[12px] f1-font text-[14px] text-black">
              The beginning of something beautiful. From the first I love you to
              endless inside jokes, our story started with magic and excitement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default F1Historyv1Page;
