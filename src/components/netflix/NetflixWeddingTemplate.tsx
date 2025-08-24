'use client';

// import { UserProfileGreen, UserProfileRed, UserProfileYellow } from "@/components/icons/UserProfileIcons";
import Image from 'next/image';
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
} from './index';

interface NetflixWeddingTemplateProps {
  coupleNames: string;
  subtitle: string;
  weddingDate: string;
  weddingTime: string;
  weddingPlace: string;
  weddingCity: string;
  weddingAddress: string;
  mapEmbedUrl: string;
  brideInfo: {
    name: string;
    parents: string;
    imageSrc?: string;
  };
  groomInfo: {
    name: string;
    parents: string;
    imageSrc?: string;
  };
  storyDescription: string;
  quoteText: string;
  quoteSource: string;
  episodes: Array<{
    number: number;
    title: string;
    duration: string;
    description: string;
    imageSrc?: string;
  }>;
  galleryImages: Array<{
    src: string;
    alt: string;
  }>;
  wishes: Array<{
    name: string;
    message: string;
    profileType: 'green' | 'yellow' | 'red';
  }>;
  onWishSubmit?: (values: { name: string; message: string }) => Promise<void>;
}

/**
 * A reusable Netflix-styled wedding invitation template component
 * This component uses all the other Netflix-styled components to create a complete wedding page
 */
const NetflixWeddingTemplate = ({
  coupleNames,
  subtitle,
  weddingDate,
  weddingTime,
  weddingPlace,
  weddingCity,
  weddingAddress,
  mapEmbedUrl,
  brideInfo,
  groomInfo,
  storyDescription,
  quoteText,
  quoteSource,
  episodes,
  galleryImages,
  wishes,
  onWishSubmit,
}: NetflixWeddingTemplateProps) => {
  // Helper function to get the appropriate profile icon based on type
  // const getProfileIcon = (type: 'green' | 'yellow' | 'red') => {
  //   switch (type) {
  //     case 'green': return <UserProfileGreen />;
  //     case 'yellow': return <UserProfileYellow />;
  //     case 'red': return <UserProfileRed />;
  //     default: return <UserProfileGreen />;
  //   }
  // };

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
              {coupleNames}
            </h1>
            <p className="text-base text-white geist-font">{subtitle}</p>
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
            <span className="text-base geist-font">
              {weddingDate.split(',')[1]?.trim() || '2025'}
            </span>
            <span className="text-base geist-font">{weddingTime} - Drop</span>
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
            icon={
              <Image
                src="CalendarIcon.svg"
                width={20}
                height={20}
                alt="Calendar Icon"
              />
            }>
            Coming Soon, {weddingDate.split(',')[0]}
          </NetflixButton>

          <NetflixButton
            variant="secondary"
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
          <p className="text-lg geist-font">{storyDescription}</p>
          <blockquote className="border-l-4 border-[#4B5563] pl-5 geist-font text-[#9CA3AF] text-base geist-font">
            <p className="geist-font">
              {quoteText}
              <span className="font-bold block geist-font">{quoteSource}</span>
            </p>
          </blockquote>
        </div>

        {/* Synopsis */}
        <div className="flex flex-col items-start gap-y-3 text-white mb-3">
          <SectionHeader title="Synopsis" />
          <div className="w-full h-[228px] bg-yellow-200" />
          <p className="text-lg geist-font">{storyDescription}</p>
          <NetflixButton variant="text" icon={showMoreIcon} iconPosition="end">
            Show More
          </NetflixButton>
        </div>

        {/* Bride and Groom */}
        <div className="flex flex-col items-start gap-y-3 text-white mb-3">
          <SectionHeader title="Bride and Groom" />
          <div className="flex items-center justify-between w-full">
            <PersonCard
              name={brideInfo.name}
              description={brideInfo.parents}
              imageSrc={brideInfo.imageSrc}
              imageAlt={`Photo of ${brideInfo.name}`}
            />

            <PersonCard
              name={groomInfo.name}
              description={groomInfo.parents}
              imageSrc={groomInfo.imageSrc}
              imageAlt={`Photo of ${groomInfo.name}`}
            />
          </div>
        </div>

        {/* Our Forever Date */}
        <div className="flex flex-col items-start gap-y-3 text-white geist-font mb-3">
          <SectionHeader title="Our Forever Date" />
          <LocationInfo
            place={weddingPlace}
            city={weddingCity}
            date={weddingDate}
            mapEmbedUrl={mapEmbedUrl}
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

          {episodes.map((episode, index) => (
            <EpisodeCard
              key={index}
              number={episode.number}
              title={episode.title}
              duration={episode.duration}
              description={episode.description}
              imageSrc={episode.imageSrc}
              isComingSoon={episode.number === episodes.length}
            />
          ))}
        </div>

        {/* Our Gallery */}
        <div className="flex flex-col items-start gap-y-3 w-full mb-3">
          <SectionHeader title="Our Gallery" />
          <GalleryGrid images={galleryImages} initialLimit={6} />
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

          {/* <div className="flex flex-col gap-y-2 items-start w-full">
            {wishes.map((wish, index) => (
              <WishCard 
                key={index}
                name={wish.name}
                message={wish.message}
                profileIcon={getProfileIcon(wish.profileType)}
              />
            ))}
          </div> */}
        </div>

        {/* Form Submit */}
        <WishForm onSubmit={onWishSubmit} />
      </div>
    </div>
  );
};

export default NetflixWeddingTemplate;
