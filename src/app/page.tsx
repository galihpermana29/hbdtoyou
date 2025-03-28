import NavigationBar from '@/components/ui/navbar';
import jumbotronImage from '@/assets/homepage.png';
import jumbotronImage2 from '@/assets/jumbotron2.png';
import jumbotronImage3 from '@/assets/jumbotron3.png';
import jumbotronImage4 from '@/assets/jumbotron4.png';
import jumbotronImage5 from '@/assets/jumbotron5.png';
// import jumbotronImage6 from '@/assets/jumbotron6.png';
import jumbotronImage7 from '@/assets/jumbotron7.png';
import jumbotronImage8 from '@/assets/jumbotron8.png';
import jumbotronImage9 from '@/assets/jumbotron9.png';
import jumbotronImage10 from '@/assets/jumbotron10.png';
import photoboxImage from '@/assets/photobox-home.jpg';
import Image from 'next/image';
import { Button, Carousel } from 'antd';
import Link from 'next/link';

import Script from 'next/script';
import Counter from '@/components/ui/counter';
import PricingWrapper from '@/components/ui/pricing/pricing-wrapper';
import NewLandingPage from '@/components/newlanding/NewLandingPage';

const GA_MEASUREMENT_ID = 'G-X4G9RCBNQH'; // Your Google Analytics ID

export default function Home() {
  return <NewLandingPage />;
  // return (
  //   <div className="scroll-smooth">
  //     <Script
  //       strategy="afterInteractive"
  //       src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  //     />
  //     <Script
  //       strategy="afterInteractive"
  //       id="google-analytics"
  //       dangerouslySetInnerHTML={{
  //         __html: `
  //           window.dataLayer = window.dataLayer || [];
  //           function gtag(){dataLayer.push(arguments);}
  //           gtag('js', new Date());
  //           gtag('config', '${GA_MEASUREMENT_ID}');
  //         `,
  //       }}
  //     />
  //     <div className="fixed top-0 left-0 w-full z-10 ">
  //       <NavigationBar />
  //     </div>
  //     <div className="mt-[50px]">
  //       <div className="min-h-[50vh] flex items-center flex-col justify-center text-center">
  //         <h1 className="text-[20px] md:text-[30px] lg:text-[40px] font-[600] md:max-w-[50%] px-[20px]">
  //           Make every <span className="underline">celebration</span>{' '}
  //           unforgettable with{' '}
  //           <span className="young-serif-regular">Memoify</span>
  //         </h1>
  //         <div className="mt-[12px] text-[12px] lg:text-[16px] md:max-w-[40%] text-gray-600 px-[20px]">
  //           Create custom websites inspired by your favorite platforms like
  //           Netflix, Spotify, or YouTube. Add personal touches and let your
  //           memories shine!
  //         </div>

  //         <div className="flex flex-col md:flex-row items-center gap-[12px] mt-[12px]">
  //           <Link href={'/create'} className="cursor-pointer">
  //             <Button
  //               size="large"
  //               type="primary"
  //               className="!bg-black w-[200px] !rounded-[50px]">
  //               Get started
  //             </Button>
  //           </Link>
  //           <Link href={'#photobox'} className="cursor-pointer">
  //             <Button
  //               size="large"
  //               className="w-[200px] !rounded-[50px] !text-black !border-[1px] !border-black">
  //               What is new?
  //             </Button>
  //           </Link>
  //         </div>
  //       </div>
  //       <div className="mx-auto flex items-center justify-center px-[20px]">
  //         <div className="max-w-[900px]">
  //           <Carousel
  //             autoplay
  //             autoplaySpeed={5000}
  //             className="!w-[350px] md:!w-[800px]">
  //             <Image
  //               src={jumbotronImage10}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             />
  //             <Image
  //               src={jumbotronImage9}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             />
  //             <Image
  //               src={jumbotronImage8}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             />
  //             <Image
  //               src={jumbotronImage7}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             />
  //             <Image
  //               src={jumbotronImage3}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             />
  //             <Image
  //               src={jumbotronImage}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             />
  //             {/* <Image
  //               src={jumbotronImage6}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             /> */}

  //             <Image
  //               src={jumbotronImage2}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             />
  //             <Image
  //               src={jumbotronImage5}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             />
  //             <Image
  //               src={jumbotronImage4}
  //               alt="jumbotron"
  //               width={1000}
  //               height={1000}
  //               priority
  //             />
  //           </Carousel>
  //         </div>
  //       </div>
  //     </div>
  //     <section className="mb-[50px]">
  //       <main className="min-h-screen bg-white flex flex-col justify-center p-[20px] md:px-[40px]">
  //         <div className="w-full flex flex-col justify-center items-center text-center mb-16">
  //           <h1 className="text-3xl md:text-5xl font-semibold mb-4 max-w-2xl">
  //             Oh, take a look at how much users{' '}
  //             <span className="text-red-500 font-bold italic">love us</span>
  //           </h1>
  //           <p className="text-gray-600 text-[16px] md:text-xl max-w-3xl">
  //             We glad that we receive decent amount of user feedback. We are
  //             constantly working to improve our product and services to meet
  //             your needs.
  //           </p>
  //         </div>

  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
  //           <div className="text-center">
  //             <Counter endValue={2000} />
  //             <h2 className="text-xl font-bold mt-4 mb-2">User has joined</h2>
  //             <p className="text-gray-600">
  //               Simply they have joined our platform.
  //             </p>
  //           </div>

  //           <div className="text-center">
  //             <Counter endValue={129} />
  //             <h2 className="text-xl font-bold mt-4 mb-2">User premium</h2>
  //             <p className="text-gray-600">
  //               They feel useful and want to keep.
  //             </p>
  //           </div>

  //           <div className="text-center">
  //             <Counter endValue={7} />
  //             <h2 className="text-xl font-bold mt-4 mb-2">Templates</h2>
  //             <p className="text-gray-600">
  //               Capture and share your moment with ours.
  //             </p>
  //           </div>
  //         </div>
  //       </main>
  //     </section>
  //     <div
  //       className="mt-[50px] flex flex-col md:flex-row bg-[#dfd2c4] justify-between"
  //       id="photobox">
  //       <div className="min-h-[50vh] flex md:items-start md:text-start items-center flex-col justify-center text-center p-[20px] md:px-[40px]">
  //         <h1 className="text-[25px] md:text-[40px] font-[600] lg:max-w-[60%]">
  //           Capture moments in style with our homies{' '}
  //           <span className="italic">photobox</span>
  //         </h1>
  //         <div className="mt-[12px] text-[14px] md:text-[16px] lg:max-w-[50%] text-gray-600">
  //           Make every picture a keepsake with Memoify’s Photobox! Designed to
  //           add a touch of creativity and personality to your moments
  //         </div>

  //         <div className="flex items-center justify-center gap-[12px] mt-[20px]">
  //           <Link href={'/photobox'} className="cursor-pointer">
  //             <Button
  //               size="large"
  //               type="primary"
  //               className="!bg-black w-[200px] !rounded-[50px]">
  //               Try Now!
  //             </Button>
  //           </Link>
  //         </div>
  //       </div>
  //       <div className="mx-auto flex items-center justify-center p-[20px]">
  //         <div className="border-2 max-w-[700px]">
  //           <Image
  //             src={photoboxImage}
  //             alt="jumbotron"
  //             width={1000}
  //             height={1000}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     <PricingWrapper />
  //   </div>
  // );
}
