'use client';

import {
  UserProfileGreen,
  UserProfileRed,
  UserProfileYellow,
} from '@/components/icons/UserProfileIcons';
import {
  EpisodeCard,
  GalleryGrid,
  LocationInfo,
  NetflixButton,
  PersonCard,
  ScheduleItem,
  SectionHeader,
  WishCard,
  WishForm,
} from '@/components/netflix';
import Image from 'next/image';

const NetlfixWeddingPage = () => {
  // Sample data for the wedding page
  const weddingData = {
    coupleNames: 'Yohan & Alya: Sebelum Hari H',
    subtitle: 'A Journey Woven with Love, Challenges, and Destiny',
    weddingDate: 'Jumat, 30 Mei 2025',
    weddingTime: '16:00 WIB',
    weddingPlace:
      'Kediaman Mempelai Wanita, Jl. Kalilom Lor Indah Gang Matahari No.100',
    weddingCity: 'Surabaya',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.49131625626!2d106.66470603628709!3d-6.2297209292163895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1752330835231!5m2!1sid!2sid',
    storyDescription:
      'Dalam perjalanan hidup yang penuh takdir dan waktu, Salsa dan Luqman dipertemukan di saat yang tepat—ketika hati telah mantap dan langkah siap untuk berjalan bersama. Kini, keduanya bersiap melangkah menuju babak baru: sebuah ikatan suci bernama pernikahan.',
    quoteText:
      '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang…"',
    quoteSource: '(Q.S Ar-Rum: 21)',
    brideInfo: {
      name: 'Salsa Lina Agustin',
      parents: 'Putri dari Bapak Santoso & Ibu Susi Parlina',
    },
    groomInfo: {
      name: 'Luqman Hakim',
      parents: 'Putra dari Bapak Ahmad & Ibu Siti Aminah',
    },
    episodes: [
      {
        number: 1,
        title: 'How We Met Each Other that Time',
        duration: '26m 10s',
        description:
          'Yohan dan Alya pertama kali bertemu sebagai rekan kerja di kantor yang sama. Kegiatan-kegiatan kecil kantor yang sering melibatkan orang-orang didala.',
      },
      {
        number: 2,
        title: 'A Love That Grows With Time',
        duration: '26m 10s',
        description:
          'Yohan dan Alya pertama kali bertemu sebagai rekan kerja di kantor yang sama. Kegiatan-kegiatan kecil kantor yang sering melibatkan orang-orang didala.',
      },
      {
        number: 3,
        title: 'Choose to Spend Life Together',
        duration: '26m 10s',
        description:
          'Yohan dan Alya pertama kali bertemu sebagai rekan kerja di kantor yang sama. Kegiatan-kegiatan kecil kantor yang sering melibatkan orang-orang didala.',
      },
      {
        number: 4,
        title: 'Final Episode: The Beginning of Forever',
        duration: '26m 10s',
        description:
          'Yohan dan Alya pertama kali bertemu sebagai rekan kerja di kantor yang sama. Kegiatan-kegiatan kecil kantor yang sering melibatkan orang-orang didala.',
      },
    ],
    galleryImages: Array(6)
      .fill(null)
      .map((_, index) => ({
        src: '', // Placeholder for real images
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

  // Show more icon for buttons
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
    console.log('Submitted wish:', values);
    return Promise.resolve();
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="mx-auto bg-black max-w-[440px] h-full px-4">
        {/* Video */}
        <div className="w-[408px] h-[408px] bg-yellow-400 mb-3" />

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
              {weddingData.coupleNames}
            </h1>
            <p className="text-base text-white geist-font">
              {weddingData.subtitle}
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
              Best Wedding this Entire Life
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
              {weddingData.weddingTime} - Drop
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
                src="CalendarIcon.svg"
                width={20}
                height={20}
                alt="Calendar Icon"
              />
            }>
            Coming Soon, 30th May
          </NetflixButton>

          <NetflixButton
            variant="secondary"
            className="!px-6 !py-3 !h-fit"
            icon={
              <Image
                src="LocationIcon.svg"
                width={20}
                height={20}
                alt="Location Icon"
              />
            }>
            The Wedding Venue
          </NetflixButton>
        </div>

        {/* Quote */}
        <div className="flex flex-col gap-y-3 text-white mb-3">
          <p className="text-lg geist-font">{weddingData.storyDescription}</p>
          <blockquote className="border-l-4 border-[#4B5563] pl-5 geist-font text-[#9CA3AF] text-base geist-font">
            <p className="geist-font">
              {weddingData.quoteText}
              <span className="font-bold block geist-font">
                {weddingData.quoteSource}
              </span>
            </p>
          </blockquote>
        </div>

        {/* Synopsis */}
        <div className="flex flex-col items-start gap-y-3 text-white mb-3">
          <SectionHeader title="Synopsis" />
          <div className="w-full h-[228px] bg-yellow-200" />
          <p className="text-lg geist-font">{weddingData.storyDescription}</p>
          <NetflixButton variant="text" icon={showMoreIcon} iconPosition="end">
            Show More
          </NetflixButton>
        </div>

        {/* Bride and Groom */}
        <div className="flex flex-col items-start gap-y-3 text-white mb-3">
          <SectionHeader title="Bride and Groom" />
          <div className="flex items-center justify-between w-full">
            <PersonCard
              name={weddingData.brideInfo.name}
              description={weddingData.brideInfo.parents}
              imageAlt={`Photo of ${weddingData.brideInfo.name}`}
            />

            <PersonCard
              name={weddingData.groomInfo.name}
              description={weddingData.groomInfo.parents}
              imageAlt={`Photo of ${weddingData.groomInfo.name}`}
            />
          </div>
        </div>

        {/* Our Forever Date */}
        <div className="flex flex-col items-start gap-y-3 text-white geist-font mb-3">
          <SectionHeader title="Our Forever Date" />
          <LocationInfo
            place={weddingData.weddingPlace}
            city={weddingData.weddingCity}
            date={weddingData.weddingDate}
            mapEmbedUrl={weddingData.mapEmbedUrl}
            scheduleItems={
              <>
                <ScheduleItem
                  eventName="Akad Nikah"
                  eventTime="07:00 - 09:00 WIB"
                  familyOnly={true}
                />
                <ScheduleItem
                  eventName="Resepsi"
                  eventTime="16:00 WIB - Selesai"
                />
              </>
            }
          />
        </div>

        {/* Episode */}
        <div className="flex flex-col items-start gap-y-3 mb-3">
          <SectionHeader title="Episode" subtitle="The Story of Our Love" />

          {weddingData.episodes.map((episode, index) => (
            <EpisodeCard
              key={index}
              number={episode.number}
              title={episode.title}
              duration={episode.duration}
              description={episode.description}
              isComingSoon={episode.number === weddingData.episodes.length}
            />
          ))}
        </div>

        {/* Our Gallery */}
        <div className="flex flex-col items-start gap-y-3 w-full mb-3">
          <SectionHeader title="Our Gallery" />
          <GalleryGrid images={weddingData.galleryImages} initialLimit={6} />
          <NetflixButton variant="text" icon={showMoreIcon} iconPosition="end">
            Show More
          </NetflixButton>
        </div>

        {/* Wish for the couple */}
        <div className="flex flex-col items-start gap-y-3 w-full mb-3">
          <SectionHeader
            title="Wish for the couple"
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
            {weddingData.wishes.map((wish, index) => {
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
            })}
          </div>
        </div>

        {/* Form Submit */}
        <WishForm onSubmit={handleWishSubmit} />
      </div>
    </div>
  );
};

export default NetlfixWeddingPage;
