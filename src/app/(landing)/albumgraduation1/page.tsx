'use client';

// import { UserProfileGreen, UserProfileRed, UserProfileYellow } from '@/components/icons/UserProfileIcons';
import {
  EpisodeCard,
  GalleryGrid,
  NetflixButton,
  SectionHeader,
  WishCard,
  WishForm,
} from '@/components/netflix';
import { GraduationData } from '@/services/gemini';
import { Form, Spin } from 'antd';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
dayjs.extend(advancedFormat);

// Default graduation data as fallback
const defaultGraduationData = {
  name: 'Galih: Graduation Day',
  subtitle: 'A 4 Years of Journey to A Degree',
  graduationDate: 'Jumat, 30 Mei 2025',
  graduationTime: '16:00 WIB',
  graduationPlace: 'Universitas Brawijaya',
  graduationCity: 'Surabaya',
  graduationMapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.49131625626!2d106.66470603628709!3d-6.2297209292163895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1752330835231!5m2!1sid!2sid',
  storyDescription:
    'In a world where potential is the most valuable currency, a young and determined individual, armed with only a high school diploma and a flicker of ambition, embarks on the treacherous and transformative quest for a Bachelors Degree. This epic journey, fraught with sleepless nights, insurmountable debt, and the ever-present specter of self-doubt, will test their intellectual and emotional limits.',
  synopsis:
    'Along the way, they must forge alliances with wise mentors and loyal companions, battle the formidable beasts of procrastination and academic rigor, and navigate the labyrinthine corridors of university bureaucracy. As they venture deeper into the unknown, they will discover that the true reward is not merely the coveted degree, but the profound and lasting transformation of becoming a scholar, a critical thinker, and a hero in their own right.',
  episodes: [
    {
      number: 1,
      title: 'Episode 1: The Call to Admissions',
      duration: '26m 10s',
      description:
        'The story begins in the seemingly ordinary world of post-high school life. Our hero, feeling the pull of a greater purpose, receives their "call to adventure" in the form of a university acceptance letter.',
      image:
        'https://res.cloudinary.com/dqipjpy1w/image/upload/v1752511968/DSC00322_wqazoc.jpg',
    },
    {
      number: 2,
      title: 'Episode 2: The Midterm Marathon',
      duration: '26m 10s',
      description:
        'Months into their journey, the initial excitement has waned, replaced by the grueling reality of mid-term examinations. Our hero, now part of a fellowship of equally stressed-out classmates, faces a series of relentless tests that push them to their breaking point.',
      image:
        'https://res.cloudinary.com/dqipjpy1w/image/upload/v1752512189/DSC00418_kam90v.jpg',
    },
    {
      number: 3,
      title: 'Episode 3: The Thesis Defense',
      duration: '26m 10s',
      description:
        'Years have passed, and our hero is now a seasoned upperclassman, bearing the scars and wisdom of their long and arduous journey. The final trial awaits: the senior thesis, a monumental undertaking that requires them to synthesize everything they have learned into a single, original work of scholarship',
      image:
        'https://res.cloudinary.com/dqipjpy1w/image/upload/v1752511974/DSC00350_ba15tz.jpg',
    },
    {
      number: 4,
      title: 'Episode 4: The Corporate Gauntlet',
      duration: '26m 10s',
      description:
        'The hero, having conquered the academic realm and armed with the "elixir" of knowledge, believes the final battle is won. However, the journey is far from over. Stepping out of the hallowed halls of the university, they find themselves in a new, bewildering world: the job market.',
      image:
        'https://res.cloudinary.com/dqipjpy1w/image/upload/v1752511968/DSC00322_wqazoc.jpg',
    },
  ],
  galleryImages: Array(6)
    .fill(null)
    .map((_, index) => ({
      src: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1752512189/DSC00418_kam90v.jpg', // Placeholder for real images
      alt: `Wedding gallery image ${index + 1}`,
    })),
  wishes: [
    {
      name: 'Veronica Erlinda Kristyowati',
      message: 'happy wedding salsa! Cheers to the happy couple! 🤍',
      profileType: 'green' as const,
    },
    {
      name: 'Andhika Shafian',
      message:
        'Selamatt couple mia1!! Semoga sakinah mawaddah warahmah aamiinnnnn',
      profileType: 'yellow' as const,
    },
    {
      name: 'Anita Dwi Ristanti',
      message: 'Happy wedding slaa dan suami semoga bahagia selalu 🥰🙏🏻🙏',
      profileType: 'red' as const,
    },
  ],
};

const GraduationFilmV1Page = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Guest';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [graduationData, setGraduationData] = useState<GraduationData | null>(
    null
  );

  useEffect(() => {
    // Try to load graduation data from localStorage
    const storedData = localStorage.getItem('graduationData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setGraduationData(parsedData);
      } catch (error) {
        setGraduationData(defaultGraduationData as GraduationData);
      }
    } else {
      // If no data in localStorage, use default data
      setGraduationData(defaultGraduationData as GraduationData);
    }
    setLoading(false);
  }, []);

  const onClose = () => {
    setIsDrawerOpen(false);
  };

  const showMoreIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 6L8 10L12 6"
        stroke="white"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Handle wish submission
  const handleWishSubmit = async (values: {
    name: string;
    message: string;
  }) => {
    // This would typically send the data to an API
    return Promise.resolve();
  };

  if (loading || !graduationData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="mx-auto bg-black max-w-[440px] h-full px-4 b">
        {/* Video */}
        <div className="max-w-[408px] w-full h-[408px] mb-3">
          <Image
            width={408}
            height={408}
            alt="Graduation video"
            src="https://res.cloudinary.com/dqipjpy1w/image/upload/v1752511962/DSC00257_sk67bh.jpg"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-y-3 items-start mb-3">
          <div className="flex items-center gap-x-2">
            <Image
              src="/Nikahfix.svg"
              width={10}
              height={18}
              alt="netflix logo"
            />
            <span className="text-[#A3A1A1] text-xs">DOCUMENTER</span>
          </div>
          <div className="flex flex-col gap-y-1 items-start">
            <h1 className="font-bold text-2xl text-white geist-font">
              {graduationData.name}
            </h1>
            <p className="text-base text-white geist-font">
              {graduationData.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Image
              src="/Top10Icon.svg"
              width={20}
              height={21}
              alt="top 10 logo"
            />
            <h2 className="text-[#D1D5DB] text-xl geist-font">
              Best Graduate (Cumlaude)
            </h2>
          </div>
          <div className="flex items-center gap-x-2 text-white">
            <span className="text-[#22C55E] font-medium text-base geist-font">
              100% match
            </span>
            <div className="w-[39px] h-[22px] px-[11px] py-[3px] bg-[#4B5563] rounded-full flex items-center justify-center font-semibold text-xs geist-font">
              SU
            </div>
            <span className="text-base geist-font">2025</span>
            <span className="text-base geist-font">
              {graduationData.graduationTime} - Drop
            </span>
            <Image
              width={20}
              height={20}
              alt="4k full hd icon"
              src="/4KIcon.svg"
            />
            <Image
              width={20}
              height={20}
              alt="4k full hd icon"
              src="/HDIcon.svg"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-y-2 mb-3">
          <NetflixButton
            variant="primary"
            className="!px-6 !py-3 !h-fit"
            icon={
              <Image
                src="/CalendarIcon.svg"
                width={20}
                height={20}
                alt="Calendar Icon"
              />
            }>
            {dayjs(graduationData.graduationDate).format('Do MMM')}
          </NetflixButton>

          <NetflixButton
            variant="secondary"
            className="!px-6 !py-3 !h-fit"
            icon={
              <Image
                src="/LocationIcon.svg"
                width={20}
                height={20}
                alt="Location Icon"
              />
            }>
            {graduationData.graduationPlace}
          </NetflixButton>
        </div>

        {/* Quote */}
        <div className="flex flex-col gap-y-3 text-white mb-3">
          <p className="text-lg geist-font">
            {graduationData.storyDescription}
          </p>
        </div>

        {/* Synopsis */}
        <div className="flex flex-col items-start gap-y-3 text-white mb-3">
          <SectionHeader title="Synopsis" />
          <div className="w-full h-[228px]">
            <Image
              width={408}
              height={408}
              alt="Graduation video"
              src="https://res.cloudinary.com/dqipjpy1w/image/upload/v1752511962/DSC00257_sk67bh.jpg"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-lg geist-font">{graduationData.synopsis}</p>
          <NetflixButton variant="text" icon={showMoreIcon} iconPosition="end">
            Show More
          </NetflixButton>
        </div>

        {/* Episode */}
        <div className="flex flex-col items-start gap-y-3 mb-3">
          <SectionHeader
            title="Episode"
            subtitle={`The Story of ${graduationData.name}`}
          />

          {graduationData.episodes.map((episode, index) => (
            <EpisodeCard
              key={index}
              number={episode.number}
              title={episode.title}
              duration={episode.duration}
              description={episode.description}
              isComingSoon={episode.number === graduationData.episodes.length}
              imageSrc={episode.image}
              imageAlt={episode.title}
            />
          ))}
        </div>

        {/* Our Gallery */}
        <div className="flex flex-col items-start gap-y-3 w-full mb-3">
          <SectionHeader title="Our Gallery" />
          {/* <GalleryGrid images={graduationData.galleryImages} initialLimit={6} /> */}
          <NetflixButton variant="text" icon={showMoreIcon} iconPosition="end">
            Show More
          </NetflixButton>
        </div>

        {/* Wish for the couple */}
        <div className="flex flex-col items-start gap-y-3 w-full mb-3">
          <SectionHeader
            title="Graduation Wishes"
            rightElement={
              <Image
                width={30}
                height={30}
                alt="Info icon"
                src="/InfoIcon.svg"
              />
            }
          />

          <div className="flex flex-col gap-y-2 items-start w-full">
            {/* {graduationData.wishes.map((wish, index) => {
              const profileIcon = {
                green: <UserProfileGreen />,
                yellow: <UserProfileYellow />,
                red: <UserProfileRed />,
              }[wish.profileType];

              return (
                <WishCard
                  key={index}
                  name={wish.name}
                  message={wish.message}
                  profileIcon={profileIcon}
                />
              );
            })} */}
          </div>
        </div>

        {/* Form Submit */}
        <WishForm onSubmit={handleWishSubmit} />
      </div>
    </div>
  );
};

export default GraduationFilmV1Page;
