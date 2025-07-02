'use client';

import { useState } from 'react';
import {
  Layout,
  Typography,
  Button,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  List,
  Form,
  Input,
  Carousel,
} from 'antd';

import Image from 'next/image';
import NavigationBar from '../ui/navbar';
import { ArrowRight, ArrowUpRight, CircleCheck } from 'lucide-react';
import Link from 'next/link';
import photoboxCompilation from '@/assets/photobox-compilation.png';

import fictional1 from '@/assets/fictional-1.png';
import fictional2 from '@/assets/fictional2.png';
import fictional3 from '@/assets/fictional-3.png';
import fictional4 from '@/assets/fictional-4.png';
import fictional5 from '@/assets/fictional-5.png';

import mockup1 from '@/assets/mockup1.png';
import mockup2 from '@/assets/mockup2.png';
import mockup3 from '@/assets/mockup3.png';
import mockIlustrasi from '@/assets/mock-illustrasi.png';
import mockPhotobox from '@/assets/mock-photobox.png';
import { useRouter } from 'next/navigation';
import { useMemoifySession } from '@/app/session-provider';
import { signIn } from 'next-auth/react';

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function NewLandingPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const session = useMemoifySession();
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>

      {/* Hero Section */}
      <div className="mt-[81px]">
        <div className=" py-[30px] md:py-0 flex flex-col-reverse md:flex-row justify-between items-center mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] min-h-screen">
          <div className="max-w-[600px] mr-[20px] flex-1 mt-[20px] md:mt-0">
            <div className="flex gap-[5px] border-[1px] border-[#D0D5DD] rounded-[6px] max-w-max p-[5px] text-[14px] text-[#1B1B1B] font-[500]">
              <p className="border-[1px] border-[#D0D5DD] rounded-[6px]">
                • New template is airing now!
              </p>{' '}
              <span>Try it now!</span>
            </div>
            <p className="mt-[16px] font-[700] text-[35px] md:text-[50px] lg:text-[60px] leading-[1.2]">
              Unforgettable celebration with Memoify
            </p>
            <p className="text-[16px] md:text-[20px] font-[400] leading-[30px] text-[#7B7B7B] mt-[24px] mb-[48px]">
              Create custom websites inspired by your favorite platforms like
              Netflix, Spotify, or YouTube. Keep your memories alive with
              Memoify.
            </p>
            <Space size="middle">
              <Link
                prefetch={true}
                href={'/templates'}
                className="cursor-pointer">
                <Button
                  className="!bg-[#E34013] !text-white !rounded-[8px] !text-[16px] !font-[600] !h-[60px] !w-[150px]"
                  type="primary"
                  size="large">
                  Get Started
                </Button>
              </Link>
              <Link prefetch={true} href={'/photobox'}>
                <Button
                  size="large"
                  className="!border-[1px] !border-[#E34013] !text-[#E34013] !font-[600] !h-[60px] !w-[150px]">
                  What is new?
                </Button>
              </Link>
            </Space>
          </div>
          <div className="flex-1 min-w-[350px] flex justify-center items-center">
            <Carousel
              autoplay
              autoplaySpeed={5000}
              className="w-[350px] md:w-[500px] lg:w-[600px]">
              <Image
                src={mockup1}
                alt="jumbotron"
                width={770}
                height={650}
                priority
              />
              <Image
                src={mockup2}
                alt="jumbotron"
                width={770}
                height={650}
                priority
              />
              <Image
                src={mockup3}
                alt="jumbotron"
                width={770}
                height={650}
                priority
              />
            </Carousel>
          </div>
        </div>

        {/* Photobox Section */}
        <div style={{ background: '#F9FAFB' }}>
          <div className="flex flex-col lg:flex-row-reverse items-start lg:items-center justify-between gap-[30px] mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px]">
            <div style={{ flex: 1, minWidth: '300px' }}>
              <p className="text-[#1B1B1B] font-[700] text-[30px] md:text-[36px]">
                Capture moments in style, with our homies Photobox
              </p>
              <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] mt-[20px]">
                Make every picture a keepsake with Memoify`s Photobox! Designed
                to add a touch of nostalgia and personality to your memories.
              </p>
              <Link href={'/photobox'} prefetch={true}>
                <Button
                  iconPosition="end"
                  size="large"
                  icon={<ArrowUpRight size={17} />}
                  className="!border-[1px] !bg-[#E34013] !text-[#fff] !font-[600] mt-[40px] !h-[44px] !w-[150px]">
                  Try it now
                </Button>
              </Link>
            </div>
            <div className="flex-1 w-full">
              <Image
                src={mockPhotobox}
                alt="photobox-compilation"
                width={552}
                height={496}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px]">
          <div className="max-w-[700px]">
            <p className="text-[#1B1B1B] font-[700] text-[30px] md:text-[36px]">
              Your way to showcase your moments
            </p>
            <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] mt-[20px]">
              Personalize your memories like never before. lets you create
              stunning, interactive web inspired by your favorite
              platforms—whether it`s Netflix, Spotify, etc.
            </p>
          </div>

          <div className="flex items-center lg:items-center flex-col lg:flex-row justify-between gap-[40px] mt-[80px] lg:h-[580px]">
            <div className="flex-1 flex flex-col justify-between h-full gap-6 py-[30px]">
              <div className="">
                <h1 className="text-[#1B1B1B] font-[700] text-[20px] mb-[8px]">
                  Give the Best Memories to Your Love Ones
                </h1>
                <p className="text-[16px] font-[400] text-[#7b7b7b] mb-[20px]">
                  Make every moment unforgettable by creating a personalized
                  digital space to celebrate and cherish special memories.
                </p>
                <Link
                  href={'/templates'}
                  className="text-[#E34013] font-[700] text-[16px] flex items-center gap-2 underline">
                  Custom your Netflix site <ArrowRight size={17} />
                </Link>
              </div>
              <div>
                <h1 className="text-[#1B1B1B] font-[700] text-[20px] mb-[8px]">
                  Photobox with Your Loved Ones
                </h1>
                <p className="text-[16px] font-[400] text-[#7b7b7b] mb-[20px]">
                  Take beautiful snapshots with friends and family using our
                  interactive photobox feature to create lasting memories.
                </p>
                <Link
                  href={'/photobox'}
                  className="text-[#E34013] font-[700] text-[16px] flex items-center gap-2 underline">
                  Capture your memories now <ArrowRight size={17} />
                </Link>
              </div>
              <div>
                <h1 className="text-[#1B1B1B] font-[700] text-[20px] mb-[8px]">
                  Join Hundreds of Premium Users
                </h1>
                <p className="text-[16px] font-[400] text-[#7b7b7b] mb-[20px]">
                  Be part of a growing community that enjoys exclusive features,
                  unlimited templates, and a seamless memory-sharing experience.
                </p>
                <p
                  onClick={() => {
                    if (session?.accessToken) {
                      router.push('/payment');
                    } else {
                      signIn('google');
                    }
                  }}
                  className="text-[#E34013] font-[700] cursor-pointer text-[16px] flex items-center gap-2 underline">
                  Join premium now! <ArrowRight size={17} />
                </p>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="lg:h-[580px] w-full">
                <Image src={mockIlustrasi} alt="illustrasi" width={1000} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          style={{ padding: '60px 50px' }}
          className="bg-[url(/stat-background.jpeg)] bg-no-repeat bg-cover">
          <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
            <div className="max-w-[768px] mx-auto">
              <p className="text-center text-[30px] md:text-[36px] font-[700] text-black mb-[20px]">
                Go, take a look at how much users love us
              </p>
              <p className="text-[16px] md:text-[20px] font-[400] text-[#7B7B7B] leading-[30px] text-center mb-[60px]">
                We grow from the reviews and feedback of users like you. We are
                constantly working to improve our product and services to meet
                your needs.
              </p>
            </div>

            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} sm={8}>
                <Card
                  style={{
                    textAlign: 'center',
                    height: '100%',
                  }}>
                  <Statistic
                    className="flex flex-col-reverse"
                    title={
                      <p className="mt-[12px] text-[18px] font-[600] text-[#000000]">
                        User has Joined
                      </p>
                    }
                    value={2000}
                    suffix="+"
                  />
                  <p className="text-[16px] max-w-[200px] mx-auto font-[400] text-[#9a9a9a] mt-[8px]">
                    They love our pre-made templates
                  </p>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                  <Statistic
                    className="flex flex-col-reverse"
                    title={
                      <p className="mt-[12px] text-[18px] font-[600] text-[#000000]">
                        User Premium
                      </p>
                    }
                    value={129}
                    suffix="+"
                  />
                  <p className="text-[16px] max-w-[200px] mx-auto font-[400] text-[#9a9a9a] mt-[8px]">
                    They feel useful and want to keep
                  </p>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ textAlign: 'center', height: '100%' }}>
                  <Statistic
                    className="flex flex-col-reverse"
                    title={
                      <p className="mt-[12px] text-[18px] font-[600] text-[#000000]">
                        Useful Templates
                      </p>
                    }
                    value={7}
                    suffix="+"
                  />
                  <p className="text-[16px] max-w-[200px] mx-auto font-[400] text-[#9a9a9a] mt-[8px]">
                    You can use them and share with your friends
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="">
          <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px]">
            <h1 className="mb-[20px] text-center text-[#1B1B1B] font-[700] text-[30px] md:text-[36px]">
              Pricing plans
            </h1>
            <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] text-center mb-[35px]">
              Simple, transparent pricing that grows with you. Try any plan free
              for 30 days.
            </p>

            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} sm={8}>
                <Card className="h-full flex flex-col justify-between">
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 className="text-[#1B1B1B] font-[700] text-[36px]">
                      Free
                    </h1>
                    <p className="mt-[16px] text-[20px] font-[600]">
                      Basic Plan
                    </p>
                    <p className="text-[#7B7B7B] text-[16px] font-[400]">
                      Perfect for trying out Memoify
                    </p>
                  </div>
                  <List
                    bordered={false}
                    itemLayout="horizontal"
                    dataSource={[
                      'Limited image storage',
                      'Limited image library',
                      'Basic image resolution',
                      'Watermark',
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

                  <div className="flex justify-center items-end h-[215px]">
                    <Button
                      iconPosition="end"
                      size="large"
                      className="!border-[1px] !h-[48px] !bg-[#E34013] !text-[#fff] !font-[400] mt-[40px] !w-[90%] !text-[16px]">
                      {session?.accessToken ? 'Try now' : 'Sign in with Google'}
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="h-full flex flex-col justify-between">
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 className="text-[#1B1B1B] font-[700] text-[36px]">
                      Rp. 15.000,-
                    </h1>
                    <p className="mt-[16px] text-[20px] font-[600]">
                      Premium Plan
                    </p>
                    <p className="text-[#7B7B7B] text-[16px] font-[400]">
                      Unlock All the features you need create beautiful custom
                      pages
                    </p>
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
                      'No Watermark',
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
                      onClick={() => {
                        if (session?.accessToken) {
                          router.push('/payment');
                        } else {
                          signIn('google');
                        }
                      }}
                      iconPosition="end"
                      size="large"
                      className="!border-[1px] !h-[48px] !bg-[#E34013] !text-[#fff] !font-[400] mt-[40px] !w-[90%] !text-[16px]">
                      Get Started
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="h-full flex flex-col justify-between">
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 className="text-[#1B1B1B] font-[700] text-[36px]">
                      Rp. 100.000,-
                    </h1>
                    <p className="mt-[16px] text-[20px] font-[600]">
                      Business Plan
                    </p>
                    <p className="text-[#7B7B7B] text-[16px] font-[400] max-w-[250px] mx-auto">
                      Custom feature for professional photo studio
                    </p>
                  </div>
                  <List
                    bordered={false}
                    itemLayout="horizontal"
                    dataSource={[
                      'Creating you 1  new custom template',
                      'Download photo on your custom site',
                      'Unlimited photo storage',
                      '24 Customer support',
                      'Unlimited credit per month',
                      'No Watermark',
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
                    <Link
                      target="_blank"
                      className="w-full"
                      href={
                        'https://api.whatsapp.com/send/?phone=62895383233303&text=hello&type=phone_number&app_absent=0'
                      }>
                      <Button
                        iconPosition="end"
                        size="large"
                        className="!border-[1px] !h-[48px] !border-[#E34013] !text-[#E34013] !font-[400] mt-[40px] !w-[100%] !text-[16px]">
                        Chat our sales
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          <div
            style={{
              marginTop: '90px',
              paddingTop: '90px',
              paddingBottom: '90px',
              textAlign: 'center',
              background: '#F9FAFB ',
            }}>
            <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px]">
              <p className="text-[16px] font-[500] text-[#475467]">
                Join 50+ photo studio that already growing and joined us
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '40px',
                  marginTop: '24px',
                }}>
                {[
                  fictional1,
                  fictional2,
                  fictional3,
                  fictional4,
                  fictional5,
                ].map((company, index) => (
                  <div
                    key={index}
                    style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                      src={company}
                      alt="company"
                      width={170}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="">
          <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px] text-center">
            <div className="max-w-[768px] mx-auto">
              <p className="text-[36px] font-[600] text-[#1B1B1B]">
                We`ll send you a new template update
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            <Text
              type="secondary"
              style={{ fontSize: '12px', marginTop: '16px', display: 'block' }}>
              By subscribing you agree to our privacy policy
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
