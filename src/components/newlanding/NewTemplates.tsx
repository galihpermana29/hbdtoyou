'use client';

import {
  Button,
  Card,
  Form,
  Input,
  List,
  Space,
  Steps,
  Typography,
} from 'antd';
import NavigationBar from '../ui/navbar';
import { ArrowLeft, ArrowRight, CircleCheck, CirclePlay } from 'lucide-react';
import laptopMock from '@/assets/mock-laptop.png';
import Image from 'next/image';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { IAllTemplateResponse } from '@/action/interfaces';
import CardTemplate from './card-template/CardTemplate';

import './style.css';
import { useEffect, useState } from 'react';

const StepsCustom = [
  {
    title: (
      <h1 className="text-[#101828] font-[600] text-[20px] max-w-[530px]">
        Make your message meaningful
      </h1>
    ),
    description: (
      <p className="text-[#475467] font-[400] text-[16px] max-w-[530px]">
        Whether it is a birthday, anniversary, or special event, create a
        heartfelt digital memory page to celebrate moments that matter.
      </p>
    ),
  },
  {
    title: (
      <h1 className="text-[#101828] font-[600] text-[20px] max-w-[530px]">
        Upload your special picture
      </h1>
    ),
    description: (
      <p className="text-[#475467] font-[400] text-[16px] max-w-[530px]">
        Easily add your favorite photos and turn them into a personalized
        showcase, making every memory timeless.
      </p>
    ),
  },
  {
    title: (
      <h1 className="text-[#101828] font-[600] text-[20px] max-w-[530px]">
        Add music for a more special impression
      </h1>
    ),
    description: (
      <p className="text-[#475467] font-[400] text-[16px] max-w-[530px]">
        Enhance your page with music that sets the perfect mood, making your
        memories even more immersive and meaningful.
      </p>
    ),
  },
];

const NewTemplates = ({ data }: { data: IAllTemplateResponse[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      if (current < 4) {
        setCurrent(current + 1);
      } else {
        setCurrent(0);
      }
    }, 2000);
    return () => clearInterval(int);
  }, [current]);

  const ButtonGroup = ({ next, previous, goToSlide, ...rest }) => {
    const {
      carouselState: { currentSlide },
    } = rest;
    return (
      <div className="carousel-button-group absolute gap-[20px] flex mt-[20px]">
        <Button
          shape="circle"
          className={currentSlide === 0 ? 'disable' : ''}
          onClick={() => previous()}>
          <ArrowLeft className="text-[#667085]" size={14} />
        </Button>
        <Button shape="circle" onClick={() => next()}>
          <ArrowRight size={14} className="text-[#667085]" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>
      <div className="mt-[81px] bg-[url(/template-bg.png)] bg-no-repeat bg-cover">
        <div className="py-[30px] md:py-[90px] flex flex-col text-center items-center mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] min-h-screen ">
          <div>
            <p className="mt-[16px] font-[700] text-[35px] max-w-[1000px] mx-auto md:text-[50px] lg:text-[60px] leading-[1.2]">
              Create custom websites inspired by your favorite platforms.
            </p>
            <p className="text-[16px] md:text-[20px] max-w-[768px] mx-auto font-[400] leading-[30px] text-[#7B7B7B] mt-[24px] mb-[48px]">
              Create custom websites inspired by your favorite platforms like
              Netflix, Spotify. And celebrate happy moments with a very special
              gift.
            </p>
            <div className="max-w-[600px] flex-1 mt-[20px] md:mt-0 mx-auto">
              <div className="flex flex-col gap-[20px] md:flex-row items-center">
                <Button
                  className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[48px] md:!h-[60px] !w-[250px]"
                  type="primary"
                  size="large">
                  Create your site
                </Button>
                <Button
                  icon={<CirclePlay />}
                  size="large"
                  className="!border-[1px] !border-[#E34013] !text-[#E34013] !font-[600] !h-[48px] md:!h-[60px] !w-[250px]">
                  What demo video
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-[80px]">
            <Image
              src={laptopMock}
              alt="laptop mock"
              width={768}
              height={448}
            />
          </div>
        </div>
      </div>

      <div className="py-[30px] md:py-[90px] min-h-screen relative">
        <div className="flex-col gap-[20px] lg:gap-0 lg:flex-row flex justify-between items-start mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] mb-[64px]">
          <div className="max-w-[768px]">
            <h1 className="text-[#1B1B1B] font-[600] text-[30px] md:text-[36px]">
              We have have hundreds of website template
            </h1>
            <p className="text-[#7B7B7B] text-[16px] md:text-[20px] font-[400] mt-[20px]">
              We update our templates every month so you can create better gifts
              for every celebration.
            </p>
          </div>
          <Space size="middle">
            <Button
              className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[48px] !w-[170px]"
              type="primary"
              size="large">
              See Inspirations
            </Button>
            <Button
              size="large"
              className="!border-[1px] !border-[#E34013] !text-[#E34013] !font-[600] !h-[48px] !w-[170px]">
              Create Now
            </Button>
          </Space>
        </div>
        <div className="absolute w-full px-[20px]">
          <div
            style={{
              position: 'relative',
            }}>
            <Carousel
              additionalTransfrom={0}
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
              infinite={false}
              itemClass="max-w-max"
              keyBoardControl
              minimumTouchDrag={80}
              pauseOnHover
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
                  partialVisibilityGutter: 10,
                },
                mobile: {
                  breakpoint: {
                    max: 768,
                    min: 0,
                  },
                  items: 1,
                  partialVisibilityGutter: 30,
                },
                tablet: {
                  breakpoint: {
                    max: 1024,
                    min: 768,
                  },
                  items: 2,
                  partialVisibilityGutter: 30,
                },
              }}
              rewind={false}
              rewindWithAnimation={false}
              rtl={false}
              shouldResetAutoplay
              showDots={false}
              sliderClass="gap-[32px]"
              slidesToSlide={1}
              swipeable>
              {data.length > 0 &&
                data.map((dx) => {
                  return <CardTemplate data={dx} key={dx.id} />;
                })}
            </Carousel>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] min-h-screen">
        <div className="max-w-[768px]">
          <h1 className="text-[#1B1B1B] font-[600] text-[30px] md:text-[36px]">
            Many special features to make your gift more special
          </h1>
          <p className="text-[#7B7B7B] text-[16px] md:text-[20px] font-[400] mt-[20px]">
            From designing your special message, uploading your photos together,
            and choosing your favorite song, you can create your own special
            message gift.
          </p>
        </div>
        <div className="mt-[64px]">
          <Steps
            className="custom-steps"
            progressDot
            current={current}
            direction="vertical"
            items={StepsCustom}
          />
        </div>
      </div>

      <div className="py-[30px] md:py-[90px] relative bg-[#F9FAFB]">
        <div className="flex-col gap-[20px] lg:gap-0 lg:flex-row flex justify-between items-start mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] ">
          <div className="max-w-[440px]">
            <h1 className="text-[#1B1B1B] font-[600] text-[30px] md:text-[36px]">
              Pricing plans that scale
            </h1>
            <p className="text-[#7B7B7B] text-[16px] md:text-[20px] font-[400] mt-[20px]">
              Simple, transparent pricing that grows with you. Try any plan,
              free template lifetime for you.
            </p>
          </div>
          <div className="flex flex-col items-center mx-auto lg:flex-row lg:justify-between lg:mx-0 gap-4">
            <Card className="h-full flex flex-col justify-between">
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p className="mt-[16px] text-[20px] font-[600]">Premium Plan</p>
                <p className="text-[#7B7B7B] text-[16px] font-[400] max-w-[250px] mx-auto">
                  Unlock All the features you need create beautiful custom pages
                </p>
                <h1 className="text-[#1B1B1B] font-[700] text-[30px] mt-[12px]">
                  Rp. 11.000,-
                </h1>
              </div>
              <List
                bordered={false}
                itemLayout="horizontal"
                dataSource={[
                  'Unlimited image storage',
                  'Unlimited songs library',
                  'Unlimited upload size',
                  'Unlimited photobox frames',
                  '6 credit to use templates',
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CircleCheck color="#079455" />}
                      title={item}
                    />
                  </List.Item>
                )}
              />

              <div className="flex justify-center items-end">
                <Button
                  iconPosition="end"
                  size="large"
                  className="!border-[1px] !h-[48px] !border-[#E34013] !text-[#E34013] !font-[400] mt-[40px] !w-[90%] !text-[16px]">
                  Chat our sales
                </Button>
              </div>
            </Card>
            <Card className="h-full flex flex-col justify-between">
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p className="mt-[16px] text-[20px] font-[600]">
                  Business Plan
                </p>
                <p className="text-[#7B7B7B] text-[16px] font-[400] max-w-[250px] mx-auto">
                  Custom feature for professional photo studio
                </p>
                <h1 className="text-[#1B1B1B] font-[700] text-[30px] mt-[12px]">
                  Rp. 35.000,-
                </h1>
              </div>
              <List
                bordered={false}
                itemLayout="horizontal"
                dataSource={[
                  'Get you new custom template',
                  'Download photo',
                  'Unlimited photo storage',
                  '24 Customer support',
                  'Unlimited credit per month',
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CircleCheck color="#079455" />}
                      title={item}
                    />
                  </List.Item>
                )}
              />

              <div className="flex justify-center items-end">
                <Button
                  iconPosition="end"
                  size="large"
                  className="!border-[1px] !h-[48px] !border-[#E34013] !text-[#E34013] !font-[400] mt-[40px] !w-[90%] !text-[16px]">
                  Chat our sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px] text-center">
          <div className="max-w-[768px] mx-auto">
            <p className="text-[36px] font-[600] text-[#1B1B1B]">
              We'll send you a new template update
            </p>
            <p className="mb-[24px] text-[20px] font-[400] text-[#7B7B7B]">
              No spam. Just the latest releases and new template, interesting
              inspiration, and exclusive interviews with great people.
            </p>
          </div>
          <Form layout="inline" style={{ justifyContent: 'center' }}>
            <Form.Item style={{ flex: 1, maxWidth: '300px' }}>
              <Input
                size="large"
                placeholder="Enter your email"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[44px] !w-[150px]"
                type="primary"
                size="large">
                Subscribe
              </Button>
            </Form.Item>
          </Form>
          <Typography.Text
            type="secondary"
            style={{ fontSize: '12px', marginTop: '16px', display: 'block' }}>
            By subscribing you agree to our privacy policy
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default NewTemplates;
