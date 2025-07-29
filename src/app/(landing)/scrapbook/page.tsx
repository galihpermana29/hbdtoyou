"use client"

import NavigationBar from '@/components/ui/navbar';
import { Button, Input, Typography } from 'antd';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const ButtonGroup = ({ next, previous, goToSlide, ...rest }) => {
  const {
    carouselState: { currentSlide },
  } = rest;
  return (
    <div className="carousel-button-group absolute gap-x-4 sm:gap-x-8 flex mt-4 sm:mt-8">
      <Button
        shape="circle"
        className={currentSlide === 0 ? 'disable !w-10 !h-10 sm:!w-14 sm:!h-14' : '!w-10 !h-10 sm:!w-14 sm:!h-14'}
        onClick={() => previous()}>
        <ArrowLeft className="text-[#667085]" size={20} />
      </Button>
      <Button shape="circle" className="!w-10 !h-10 sm:!w-14 sm:!h-14" onClick={() => next()}>
        <ArrowRight size={20} className="text-[#667085]" />
      </Button>
    </div>
  );
};

const ScrapbookPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Design every page your way",
      description: "Add your personal flair with custom layouts, handwritten messages, and photo collages that bring your moments to life."
    },
    {
      title: "Preserve memories with meaningful style",
      description: "Choose from a variety of scrapbook themes and page designs that match your story's vibe — from vintage and dreamy to fun and bold."
    },
    {
      title: "Decorate with stickers, cutouts & more",
      description: "Have fun adding playful or heartfelt stickers, icons, and design elements that give your scrapbook an extra dose of personality."
    }
  ];

  return (
    <div className="w-screen">
      <div className="sticky top-0 left-0 w-full z-40">
        <NavigationBar />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center pt-24 pb-16 bg-[#FFF6F5] relative">
          <div className="flex flex-col items-center justify-center px-4 sm:px-8 mx-auto w-full">
            <div className="flex flex-col items-center justify-center gap-y-12 max-w-5xl">
              <div className="mx-auto flex flex-col items-center justify-center gap-y-6">
                <h1 className="text-center text-[#1B1B1B] font-semibold text-4xl md:text-5xl lg:text-6xl inter-font leading-tight md:leading-[72px] tracking-[-2%]">
                  Bring Your Memories to Life with Personalized Scrapbooks
                </h1>
                <p className="text-[#7B7B7B] text-lg md:text-xl font-normal inter-font max-w-3xl text-center">
                  Easily create heartfelt scrapbooks filled with photos, notes,
                  and designs that celebrate your special moments.
                </p>
              </div>
              <Button
                type="primary"
                className="!px-[18px] sm:!px-[22px] !py-4 !bg-[#E34013] !text-white !h-[50px] sm:!h-[60px] !rounded-lg !font-semibold !text-base sm:!text-lg relative z-30 w-[80%] sm:w-auto">
                Create your own!
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full pb-[50px]">
          <div className="relative w-full h-fit z-20 pb-24">
            <Image
              src="/scrapbook-hero.svg"
              alt="Memoify Live Scrapboox Hero"
              className="max-w-7xl w-full h-auto mx-auto px-4 sm:px-0"
              width={0}
              height={0}
              quality={100}
              loading="eager"
              priority
            />
            <Image
              src="/scrapbook-background-pattern.svg"
              alt=""
              className="w-full h-full absolute max-md:-top-1/3 -top-1/4 -z-10"
              width={0}
              height={0}
              quality={100}
              loading="eager"
              priority
            />
          </div>
        </div>

        {/* Scrapbook Templates Section */}
        <div className="flex w-full pb-24">
          <div className="flex flex-col w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start gap-x-8 gap-y-6 mx-auto px-4 sm:px-8 max-w-7xl">
              <div className="flex flex-col items-start justify-start gap-y-5">
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#1B1B1B] mb-4">
                  We've have hundreds of scrapbook template
                </h2>
                <p className="text-[#7B7B7B] text-base sm:text-lg md:text-xl font-normal">
                  We update our templates every month so you can create better
                  gifts for every celebration.
                </p>
              </div>
              <div className="flex max-md:flex-col gap-3 md:ml-8 mt-4 md:mt-0">
                <Button
                  className="!px-7 !py-3 !h-12 !border-[#E34013] !text-[#E34013] !rounded-lg !font-semibold !text-base !inter-font"
                  ghost>
                  See Inspiration
                </Button>
                <Button
                  type="primary"
                  className="!px-7 !py-3 !h-12 !bg-[#E34013] !border-[#E34013] !rounded-lg !font-semibold !text-base !inter-font">
                  Create your own!
                </Button>
              </div>
            </div>

            {/* Templates Carousel */}
            <div className="w-full pl-4 sm:pl-8 xl:pl-28 pt-10 sm:pt-16">
              <Carousel
                // additionalTransfrom={0}
                arrows={false}
                autoPlaySpeed={3000}
                centerMode={false}
                className=""
                containerClass="container-padding-bottom"
                customButtonGroup={
                  <ButtonGroup
                    next={undefined}
                    previous={undefined}
                    goToSlide={undefined}
                  />
                }
                dotListClass=""
                draggable
                focusOnSelect={false}
                infinite={true}
                keyBoardControl
                minimumTouchDrag={80}
                // pauseOnHover
                renderArrowsWhenDisabled={false}
                renderButtonGroupOutside
                renderDotsOutside={false}
                responsive={{
                  desktop: {
                    breakpoint: {
                      max: 3000,
                      min: 1024,
                    },
                    items: 3,
                    // partialVisibilityGutter: 10,
                  },
                  mobile: {
                    breakpoint: {
                      max: 768,
                      min: 0,
                    },
                    items: 1,
                  },
                  tablet: {
                    breakpoint: {
                      max: 1024,
                      min: 768,
                    },
                    items: 2,
                    // partialVisibilityGutter: 30,
                  },
                }}
                rewind={false}
                rewindWithAnimation={false}
                rtl={false}
                shouldResetAutoplay
                showDots={false}
                sliderClass="gap-0"
                slidesToSlide={1}
                swipeable>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex-shrink-0">
                    <Image
                      className="rounded-lg"
                      src={`/Cover${idx + 1}.png`}
                      alt={`Cover ${idx + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full py-12 sm:py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex flex-col">
              <Typography.Text className="!text-[#E55A3B] !font-semibold !text-base !mb-3">
                Features
              </Typography.Text>

              <Typography.Title
                level={2}
                className="!text-3xl sm:!text-4xl !font-semibold !text-[#1B1B1B] !mb-5 !leading-tight !mt-0 !max-w-[624px]"
              >
                Creative tools to turn your stories into unforgettable scrapbooks
              </Typography.Title>
              <Typography.Paragraph className="!text-[#7B7B7B] !text-base sm:!text-lg md:!text-xl !leading-relaxed !max-w-[869px] !font-normal">
                From layering heartfelt notes and artistic touches to decorating with themed stickers and
                beautiful layouts, you can customize every page to create a scrapbook that's uniquely yours.
              </Typography.Paragraph>

              <div className='flex flex-col lg:flex-row gap-x-8 xl:gap-x-16 gap-y-10 pt-8 sm:pt-12 lg:pt-16'>
                <div className='flex flex-col gap-y-10 items-start'>
                  <div className='flex flex-col items-start w-full max-w-full lg:max-w-[560px]'>
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className={`w-full pl-6 py-4 border-[4px] border-y-0 border-r-0 cursor-pointer transition-all duration-300 ${activeFeature === index
                          ? 'border-l-[#E34013]'
                          : 'border-l-[#F2F4F7] hover:border-l-[#E34013]/50'
                          }`}
                        onClick={() => setActiveFeature(index)}
                      >
                        <div className='flex flex-col gap-y-2 items-start'>
                          <Typography.Title level={4} className="!text-xl !font-semibold !text-[#1B1B1B] !mb-0">
                            {feature.title}
                          </Typography.Title>
                          <Typography.Paragraph className="!text-[#7B7B7B] !leading-relaxed !text-base !mb-0 !font-normal">
                            {feature.description}
                          </Typography.Paragraph>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    className="!bg-[#E55A3B] !border-[#E55A3B] !rounded-lg !h-12 !px-7 !py-3 !w-fit !text-base !font-semibold"
                  >
                    Create your own!
                  </Button>
                </div>
                <div className='w-full max-md:hidden lg:w-[592px] h-auto lg:h-[512px] flex justify-center'>
                  <div className="flex-shrink-0">
                    <Image
                      className="rounded-lg transition-opacity duration-300"
                      src={`/Feature${activeFeature + 1}.png`}
                      alt={`Feature ${activeFeature + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="w-full py-12 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
            <Typography.Title
              level={2}
              className="!text-3xl sm:!text-4xl !font-semibold !text-[#1B1B1B] !mb-5 !leading-tight !mt-0 !inter-font"
            >
              We'll send you a new template update
            </Typography.Title>

            <Typography.Paragraph className="!text-[#7B7B7B] !text-base sm:!text-lg md:!text-xl !leading-relaxed !mb-8 sm:!mb-12 !font-normal max-w-2xl mx-auto">
              No spam. Just the latest releases and new template, interesting inspiration, and
              exclusive interviews with great people.
            </Typography.Paragraph>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto px-4 sm:px-0">
              <Input
                placeholder="Enter your email"
                size="large"
                className="!h-12 !rounded-lg !border-[#D0D5DD] !text-base flex-1"
                style={{
                  fontSize: '16px',
                  fontWeight: 'normal'
                }}
              />
              <Button
                type="primary"
                size="large"
                className="!bg-[#E55A3B] !border-[#E55A3B] hover:!bg-[#d14d30] !rounded-lg !h-12 !px-8 !font-semibold !text-base whitespace-nowrap"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapbookPage;
