'use client';

import {
  Button,
  Card,
  Carousel,
  Col,
  Collapse,
  Form,
  Input,
  Row,
  Segmented,
  Space,
  Statistic,
  Typography
} from 'antd';
import { useState } from 'react';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NavigationBar from '../ui/navbar';
import Reveal from '@/components/ui/reveal';
import PricingSection from './PricingSection';

import fictional1 from '@/assets/fictional-1.png';
import fictional3 from '@/assets/fictional-3.png';
import fictional4 from '@/assets/fictional-4.png';
import fictional5 from '@/assets/fictional-5.png';
import fictional2 from '@/assets/fictional2.png';

import mockup1 from '@/assets/mockup1.png';
import mockup2 from '@/assets/mockup2.png';
import mockup3 from '@/assets/mockup3.png';
import { faqDataEnglish, faqDataIndonesian } from '@/lib/faqData';

import c1 from '@/assets/c1.png';
import c2 from '@/assets/c2.png';
import c3 from '@/assets/c3.png';
import c4 from '@/assets/c4.png';

import sampleBobo from '@/assets/sample-bobo.jpeg';
import sampleBroadsheet from '@/assets/sample-broadsheet.jpeg';
import sampleClassic from '@/assets/sample-classic.jpeg';
const { Text } = Typography;

// Real exported sample front pages shown in the Newspaper Photobox marquee, so
// visitors see the full range of templates (bright Bobo edition + sweet
// broadsheet + viral political satire).
const SAMPLE_EDITIONS = [
  { src: sampleBobo, alt: 'Belajar Memaafkan — Bobo edition' },
  { src: sampleBroadsheet, alt: 'Love of The Week — broadsheet edition' },
  { src: sampleClassic, alt: 'Suara Rakyat — political edition' },
];

const CLIP_ROTATIONS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];

/** A real exported front page used as a marquee clipping. */
function NewspaperClipping({ edition, index }: { edition: any; index: number }) {
  return (
    <div
      className={`shrink-0 ${
        CLIP_ROTATIONS[index % CLIP_ROTATIONS.length]
      } transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]`}>
      <Image
        src={edition.src}
        alt={edition.alt}
        className="h-[420px] w-auto border border-black/10 rounded-[6px] shadow-[0_14px_34px_rgba(0,0,0,0.18)]"
      />
    </div>
  );
}

export default function NewLandingPage() {
  const [email, setEmail] = useState('');
  const [faqLanguage, setFaqLanguage] = useState<'English' | 'Indonesia'>(
    'English'
  );

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10 ">
        <NavigationBar />
      </div>

      {/* Hero Section */}
      <div className="mt-[81px]">
        <Carousel
          autoplay
          autoplaySpeed={6000}
          pauseOnHover
          dots
          className="hero-carousel">
        {/* Slide 1 — Newspaper Photobox (inner wrapper so slick styling
            doesn't override the layout) */}
        <div>
        <div
          className="min-h-screen flex flex-col justify-center py-[60px]"
          style={{ background: '#f4f1ea' }}>
            {/* Centered intro */}
            <div className="mx-auto max-w-3xl px-[20px] text-center">
              <span className="inline-block text-[12px] font-[700] tracking-[0.2em] text-[#E34013] bg-[#FDECE5] rounded-full px-[14px] py-[6px]">
                NEW · NEWSPAPER PHOTOBOX
              </span>
              <h2 className="text-[#1B1B1B] font-[800] text-[34px] md:text-[48px] leading-tight mt-[20px]">
                You, hot off the press.
              </h2>
              <p className="text-[#5b5b5b] text-[16px] md:text-[19px] font-[400] mt-[16px]">
                Strike a pose and watch your selfie drop straight onto a vintage
                front page — sweet broadsheet or viral political satire. Capture,
                pick your edition, download. No design skills, just main-character
                energy.
              </p>
              <div className="flex items-center justify-center mt-[28px]">
                <Link href={'/photobox-newspaper'} prefetch={true}>
                  <Button
                    iconPosition="end"
                    size="large"
                    icon={<ArrowRight size={18} />}
                    className="!bg-[#E34013] !text-white !font-[600] !h-[46px]">
                    Try Newspaper Photobox
                  </Button>
                </Link>
              </div>
            </div>

            {/* Full-bleed auto-scrolling marquee of sample front pages */}
            <div className="wedding-marquee mt-[50px]">
              <div className="wedding-marquee-track wedding-marquee-track--left gap-[24px] py-[10px] px-[12px]">
                {/* One marquee "half" must be wider than the viewport or the
                    -50% loop shows a blank gap. We repeat the few editions to
                    fill a half, then render the half twice for a seamless loop. */}
                {[
                  ...SAMPLE_EDITIONS,
                  ...SAMPLE_EDITIONS,
                  ...SAMPLE_EDITIONS,
                  ...SAMPLE_EDITIONS,
                  ...SAMPLE_EDITIONS,
                  ...SAMPLE_EDITIONS,
                ].map((ed, i) => (
                  <NewspaperClipping key={i} edition={ed} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 — main hero (inner wrapper, same reason) */}
        <div>
        <div className=" py-[30px] md:py-0 flex flex-col-reverse md:flex-row justify-between items-center mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] min-h-screen">
          <div className="max-w-[600px] mr-[20px] flex-1 mt-[20px] md:mt-0">
            <div className="flex gap-[5px] border-[1px] border-[#D0D5DD] rounded-[6px] max-w-max p-[5px] text-[14px] text-[#1B1B1B] font-[500]">
              <p className="border-[1px] border-[#D0D5DD] rounded-[6px]">
                • Scrapbook AI is now available!
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
              <Link prefetch={true} href={'/vinylv1'}>
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
              autoplaySpeed={9000}
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
        </div>
        </Carousel>

        {/* Photobox Section */}
        <Reveal>
        <div style={{ background: '#F9FAFB' }}>
          <div className="flex flex-col lg:flex-row-reverse items-start lg:items-center justify-between gap-[30px] mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px]">
            <div style={{ flex: 1, minWidth: '300px' }}>
              <p className="text-[#1B1B1B] font-[700] text-[30px] md:text-[36px]">
                Your memories deserve more than just a gallery
              </p>
              <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] mt-[20px]">
                Craft beautiful scrapbooks that capture your favorite moments —
                with photos, notes, and a touch of you
              </p>
              <Link href={'/scrapbook'} prefetch={true}>
                <Button
                  iconPosition="end"
                  size="large"
                  className="!border-[1px] !bg-[#E34013] !text-[#fff] !font-[600] mt-[40px] !h-[44px]">
                  Start My Scrapbook
                </Button>
              </Link>
            </div>
            <div className="flex-1 w-full">
              <Image
                src={c1}
                alt="photobox-compilation"
                width={552}
                height={496}
              />
            </div>
          </div>
        </div>
        </Reveal>

        <Reveal>
        <div className="flex flex-col lg:flex-row-reverse items-start lg:items-center justify-between gap-[30px] mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px]">
          <div className="flex-1 w-full">
            <Image
              src={c2}
              alt="Say It with Logic and Love"
              width={552}
              height={496}
            />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <p className="text-[#1B1B1B] font-[700] text-[30px] md:text-[36px]">
              Say it with logic and love, letters in research format
            </p>
            <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] mt-[20px]">
              Transform your feelings into meaningful messages with
              academic-style letters that still hit the heart.
            </p>
            <Link href={'/journal'} prefetch={true}>
              <Button
                iconPosition="end"
                size="large"
                className="!border-[1px] !bg-[#E34013] !text-[#fff] !font-[600] mt-[40px] !h-[44px]">
                Try the Letter Generator
              </Button>
            </Link>
          </div>
        </div>
        </Reveal>

        <Reveal>
        <div style={{ background: '#F9FAFB' }}>
          <div className="flex flex-col lg:flex-row-reverse items-start lg:items-center justify-between gap-[30px] mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px]">
            <div style={{ flex: 1, minWidth: '300px' }}>
              <p className="text-[#1B1B1B] font-[700] text-[30px] md:text-[36px]">
                Capture moments in style, with our homies Photobox
              </p>
              <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] mt-[20px]">
                Make every picture a keepsake with Memoify’s Photobox! Designed
                to add a touch of creativity and personality to your moments
              </p>
              <Link href={'/photobox'} prefetch={true}>
                <Button
                  iconPosition="end"
                  size="large"
                  className="!border-[1px] !bg-[#E34013] !text-[#fff] !font-[600] mt-[40px] !h-[44px]">
                  Capture now!
                </Button>
              </Link>
            </div>
            <div className="flex-1 w-full">
              <Image
                src={c3}
                alt="Capture Moments in Style"
                width={552}
                height={496}
              />
            </div>
          </div>
        </div>
        </Reveal>

        {/* Features Section */}
        <Reveal>
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
          <div className="flex items-center lg:items-center flex-col lg:flex-row justify-between">
            <div className="flex-1 flex flex-col justify-between h-full gap-6 py-24 pl-5 pr-20 gap-y-16">
              <div className="max-w-[700px]">
                <p className="text-[#1B1B1B] font-[700] text-[30px] md:text-[36px]">
                  Your way to showcase your moments
                </p>
                <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] mt-[20px]">
                  Personalize your memories like never before. lets you create
                  stunning, interactive web inspired by your favorite
                  platforms—whether it&apos;s Netflix, Spotify, etc.
                </p>
              </div>
              <div className="flex flex-col gap-y-6">
                <div className="flex items-start gap-x-4">
                  <div className="w-12 h-12 rounded-lg border border-solid border-[#EAECF0] text-2xl font-bold shrink-0 flex items-center justify-center">
                    ❤️
                  </div>
                  <div className="flex flex-col gap-y-2">
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
                </div>
                <div className="flex items-start gap-x-4">
                  <div className="w-12 h-12 rounded-lg border border-solid border-[#EAECF0] text-2xl font-bold shrink-0 flex items-center justify-center">
                    📷
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-[#1B1B1B] font-[700] text-[20px] mb-[8px]">
                      Photobox with Your Loved Ones
                    </h1>
                    <p className="text-[16px] font-[400] text-[#7b7b7b] mb-[20px]">
                      Take beautiful snapshots with friends and family using our
                      interactive photobox feature to create lasting memories.
                    </p>
                    <Link
                      href={'/templates'}
                      className="text-[#E34013] font-[700] text-[16px] flex items-center gap-2 underline">
                      Create new memories now <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-x-4">
                  <div className="w-12 h-12 rounded-lg border border-solid border-[#EAECF0] text-2xl font-bold shrink-0 flex items-center justify-center">
                    🚀
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <h1 className="text-[#1B1B1B] font-[700] text-[20px] mb-[8px]">
                      Join Hundreds of Premium Users
                    </h1>
                    <p className="text-[16px] font-[400] text-[#7b7b7b] mb-[20px]">
                      Be part of a growing community that enjoys exclusive
                      features, unlimited templates, and a seamless
                      memory-sharing experience.
                    </p>
                    <Link
                      href={'/templates'}
                      className="text-[#E34013] font-[700] text-[16px] flex items-center gap-2 underline">
                      Join premium now! <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <Image
                src={c4}
                alt="Your way to showcase your moments"
                className="w-full h-full object-contain"
                width="0"
                height="0"
              />
            </div>
          </div>
        </div>
        </Reveal>

        {/* Pricing Section */}
        <Reveal>
        <div className="">
          <PricingSection />

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
        </Reveal>

        {/* FAQ Section */}
        <Reveal>
        <div id="faq-section" style={{ background: '#F9FAFB' }}>
          <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px]">
            <div className="max-w-[768px] mx-auto mb-[48px]">
              <h1 className="text-center text-[#1B1B1B] font-[700] text-[30px] md:text-[36px] mb-[20px]">
                {'Frequently Asked Questions'}
              </h1>
              <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] text-center">
                {
                  "Everything you need to know about Memoify. Can't find the answer you're looking for? Feel free to contact our support team."
                }
              </p>
              <div className="flex justify-center mt-[32px]">
                <Segmented
                  options={['English', 'Indonesia']}
                  value={faqLanguage}
                  onChange={(value) =>
                    setFaqLanguage(value as 'English' | 'Indonesia')
                  }
                  size="large"
                />
              </div>
            </div>
            <div className="max-w-[900px] mx-auto">
              <Collapse
                items={
                  faqLanguage === 'English' ? faqDataEnglish : faqDataIndonesian
                }
                defaultActiveKey={['1']}
                expandIconPosition="end"
                className="bg-white"
                style={{
                  borderRadius: '8px',
                  border: 'none',
                }}
                size="large"
              />
            </div>
          </div>
        </div>
        </Reveal>

        {/* Stats Section */}
        <Reveal>
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
                    value={9000}
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
                    value={1000}
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
                    value={15}
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
        </Reveal>

        {/* Newsletter Section */}
        <Reveal>
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
        </Reveal>
      </div>
    </div>
  );
}
