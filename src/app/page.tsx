import NavigationBar from '@/components/ui/navbar';
import jumbotronImage from '@/assets/homepage.png';
import jumbotronImage2 from '@/assets/jumbotron2.png';
import jumbotronImage3 from '@/assets/jumbotron3.png';
import photoboxImage from '@/assets/photobox-home.jpg';
import Image from 'next/image';
import { Button, Carousel } from 'antd';
import Link from 'next/link';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-X4G9RCBNQH'; // Your Google Analytics ID

export default function Home() {
  return (
    <div className="scroll-smooth">
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        strategy="afterInteractive"
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>

      <div className="mt-[50px]">
        <div className="min-h-[50vh] flex items-center flex-col justify-center text-center">
          <h1 className="text-[25px] md:text-[40px] font-[600] md:max-w-[50%] px-[20px]">
            Make every <span className="underline">celebration</span>{' '}
            unforgettable with{' '}
            <span className="young-serif-regular">Memoify</span>
          </h1>
          <div className="mt-[12px] text-[14px] md:text-[16px] md:max-w-[40%] text-gray-600 px-[20px]">
            Create custom websites inspired by your favorite platforms like
            Netflix, Spotify, or YouTube. Add personal touches and let your
            memories shine!
          </div>

          <div className="flex flex-col md:flex-row items-center gap-[12px] mt-[12px]">
            <Link href={'/create'} className="cursor-pointer">
              <Button
                size="large"
                type="primary"
                className="!bg-black w-[200px] !rounded-[50px]">
                Get started
              </Button>
            </Link>
            <Link href={'#photobox'} className="cursor-pointer">
              <Button
                size="large"
                className="w-[200px] !rounded-[50px] !text-black !border-[1px] !border-black">
                What's new?
              </Button>
            </Link>
          </div>
        </div>
        <div className="mx-auto flex items-center justify-center px-[20px]">
          <div className="max-w-[900px]">
            <Carousel autoplay autoplaySpeed={2000}>
              <Image
                src={jumbotronImage}
                alt="jumbotron"
                width={1000}
                height={1000}
              />
              <Image
                src={jumbotronImage3}
                alt="jumbotron"
                width={1000}
                height={1000}
              />
              <Image
                src={jumbotronImage2}
                alt="jumbotron"
                width={1000}
                height={1000}
              />
            </Carousel>
          </div>
        </div>
      </div>

      <div
        className="mt-[50px] flex flex-col md:flex-row bg-[#dfd2c4] justify-between"
        id="photobox">
        <div className="min-h-[50vh] flex md:items-start md:text-start items-center flex-col justify-center text-center p-[20px] md:px-[40px]">
          <h1 className="text-[25px] md:text-[40px] font-[600] lg:max-w-[60%]">
            Capture moments in style with our homies{' '}
            <span className="italic">photobox</span>
          </h1>
          <div className="mt-[12px] text-[14px] md:text-[16px] lg:max-w-[50%] text-gray-600">
            Make every picture a keepsake with Memoify’s Photobox! Designed to
            add a touch of creativity and personality to your moments
          </div>

          <div className="flex items-center justify-center gap-[12px] mt-[20px]">
            {/* <Link href={'/photobox'} className="cursor-pointer"> */}
            <Button
              size="large"
              type="primary"
              className="!bg-black w-[200px] !rounded-[50px]">
              Coming Very Soon
            </Button>
            {/* </Link> */}
          </div>
        </div>
        <div className="mx-auto flex items-center justify-center p-[20px]">
          <div className="border-2 max-w-[700px]">
            <Image
              src={photoboxImage}
              alt="jumbotron"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
