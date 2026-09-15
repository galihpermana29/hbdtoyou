'use client';

import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  Row,
  Segmented,
  Statistic,
  Typography,
} from 'antd';
import { useState } from 'react';

import { ArrowRight, Gift } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NavigationBar from '../ui/navbar';
import Reveal from '@/components/ui/reveal';
import PricingSection from './PricingSection';
import HeroGiftPreview from './HeroGiftPreview';

import fictional1 from '@/assets/fictional-1.png';
import fictional3 from '@/assets/fictional-3.png';
import fictional4 from '@/assets/fictional-4.png';
import fictional5 from '@/assets/fictional-5.png';
import fictional2 from '@/assets/fictional2.png';

import { faqDataEnglish, faqDataIndonesian } from '@/lib/faqData';

import c1 from '@/assets/c1.png';
import c2 from '@/assets/c2.png';
import c3 from '@/assets/c3.png';
import c4 from '@/assets/c4.png';

const { Text } = Typography;

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
        <section className="overflow-hidden bg-[#fffdf9] px-5 pb-16 pt-16 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto flex w-max items-center gap-2 rounded-full border border-[#e8ddd3] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#6b4b3e] shadow-sm md:text-[13px]">
                <Gift className="h-4 w-4 text-[#E34013]" aria-hidden="true" />
                Digital gifts made personal
              </div>
              <h1 className="mx-auto mt-6 max-w-4xl text-[39px] font-extrabold leading-[1.08] tracking-[-0.04em] text-[#1B1B1B] sm:text-[54px] md:text-[68px]">
                Turn your memories into a gift they can open
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-7 text-[#6f6f6f] md:text-[19px] md:leading-8">
                Pick a playful template, add your photos and notes, then share
                one unforgettable link for their birthday or anniversary.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  prefetch={true}
                  href="/create"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#E34013] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(227,64,19,0.22)] transition hover:bg-[#c9340e]">
                  Create a gift
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  prefetch={true}
                  href="/templates"
                  className="inline-flex items-center justify-center rounded-lg border border-[#d7d2cd] bg-white px-6 py-3.5 text-[15px] font-bold text-[#292929] transition hover:border-[#aaa39c] hover:bg-[#faf8f5]">
                  Browse templates
                </Link>
              </div>
            </div>

            <div className="mt-12 md:mt-16">
              <HeroGiftPreview />
              <p className="mt-4 text-center text-[12px] font-medium text-[#8b8179] md:text-[13px]">
                Click around inside the gift — this is the real product, not a
                mock
              </p>
            </div>
          </div>
        </section>

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
