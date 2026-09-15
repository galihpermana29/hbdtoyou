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

import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  Gift,
  Heart,
  Play,
} from 'lucide-react';
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

import { faqDataEnglish, faqDataIndonesian } from '@/lib/faqData';

import c1 from '@/assets/c1.png';
import c2 from '@/assets/c2.png';
import c3 from '@/assets/c3.png';
import c4 from '@/assets/c4.png';

import giftHero from '@/assets/widya/after/2.jpg';
import giftMoment from '@/assets/widya/after/1.jpg';
const { Text } = Typography;

const TEMPLATE_CHIPS = [
  {
    label: 'Netflix parody',
    detail: 'A binge-worthy story',
    href: '/netflixv1',
    icon: Play,
  },
  {
    label: 'AI Scrapbook',
    detail: 'Photos become pages',
    href: '/scrapbook',
    icon: BookOpen,
  },
  {
    label: 'Claw of Us',
    detail: 'A playful arcade gift',
    href: '/arcadeclawv1',
    icon: Gamepad2,
  },
];

function GiftProductSurface() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-black/15 bg-[#111] shadow-[0_30px_80px_rgba(28,18,12,0.18)] md:rounded-[22px]">
      <div className="flex h-10 items-center border-b border-white/10 bg-[#f4f4f2] px-3 md:h-12 md:px-5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff665c]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd44]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00ca4e]" />
        </div>
        <div className="mx-auto rounded-md border border-black/10 bg-white px-5 py-1 text-[9px] font-medium text-[#737373] md:px-16 md:text-[11px]">
          memoify.live/for/someone-special
        </div>
        <div className="w-10" aria-hidden="true" />
      </div>

      <div className="bg-[#0b0b0b] text-white">
        <div className="flex h-11 items-center justify-between px-4 md:h-14 md:px-8">
          <span className="text-[13px] font-extrabold tracking-[0.18em] text-[#e50914] md:text-lg">
            MEMOFLIX
          </span>
          <div className="hidden items-center gap-6 text-[10px] text-white/70 sm:flex md:text-xs">
            <span>Home</span>
            <span>Our story</span>
            <span>Favorite moments</span>
          </div>
          <Heart
            className="h-4 w-4 fill-white text-white md:h-5 md:w-5"
            aria-hidden="true"
          />
        </div>

        <div className="relative h-[260px] overflow-hidden sm:h-[360px] lg:h-[460px]">
          <Image
            src={giftHero}
            alt="A completed Netflix-inspired birthday gift with a personal photo"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b0b0b] to-transparent" />
          <div className="absolute left-5 top-1/2 max-w-[72%] -translate-y-1/2 md:left-10 lg:left-14">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.24em] text-[#ff6a61] md:text-xs">
              A Memoify original
            </p>
            <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Happy birthday, Love!
            </h2>
            <p className="mt-3 max-w-md text-[10px] leading-relaxed text-white/75 sm:text-sm md:mt-4 md:text-base">
              Our favorite memories, collected into one little corner of the
              internet—made just for you.
            </p>
            <div className="mt-4 flex items-center gap-2 md:mt-6">
              <span className="flex items-center gap-1.5 rounded bg-white px-3 py-2 text-[10px] font-bold text-black md:px-4 md:text-xs">
                <Play className="h-3 w-3 fill-black" aria-hidden="true" />
                Open your letter
              </span>
              <span className="rounded bg-white/20 px-3 py-2 text-[10px] font-semibold backdrop-blur-sm md:px-4 md:text-xs">
                12 memories
              </span>
            </div>
          </div>
        </div>

        <div className="-mt-4 px-5 pb-6 md:-mt-8 md:px-10 md:pb-10">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 md:text-[11px]">
                Season one
              </p>
              <p className="mt-1 text-xs font-bold md:text-base">
                The moments that made us
              </p>
            </div>
            <p className="text-[9px] text-white/45 md:text-[11px]">
              Birthday edition
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {[giftMoment, giftHero, giftMoment].map((image, index) => (
              <div
                className="relative aspect-[16/9] overflow-hidden rounded-sm bg-white/5 md:rounded-md"
                key={index}>
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 30vw, 360px"
                  className={`object-cover ${
                    index === 0 ? 'object-top' : 'object-center'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute bottom-1.5 left-2 text-[8px] font-semibold sm:text-[10px] md:bottom-3 md:left-3 md:text-xs">
                  {['The first hello', 'Best day ever', 'Always us'][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
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
              <GiftProductSurface />
              <p className="mt-4 text-center text-[12px] font-medium text-[#8b8179] md:text-[13px]">
                A real gift experience, personalized with your story
              </p>
            </div>

            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
              {TEMPLATE_CHIPS.map((template) => {
                const Icon = template.icon;
                return (
                  <Link
                    key={template.label}
                    href={template.href}
                    prefetch={true}
                    className="group flex items-center gap-3 rounded-xl border border-[#e5ded7] bg-white px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:border-[#c9b8aa] hover:shadow-md">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff0e9] text-[#E34013]">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-bold text-[#292929]">
                        {template.label}
                      </span>
                      <span className="block truncate text-[11px] text-[#817a74]">
                        {template.detail}
                      </span>
                    </span>
                    <ArrowRight
                      className="ml-auto h-4 w-4 shrink-0 text-[#b4aaa1] transition-transform group-hover:translate-x-0.5 group-hover:text-[#E34013]"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
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
