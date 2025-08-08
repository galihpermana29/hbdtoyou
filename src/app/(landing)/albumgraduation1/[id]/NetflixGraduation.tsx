'use client';

import EpisodeCard from '@/components/netflix/EpisodeCard';
import GalleryGrid from '@/components/netflix/GalleryGrid';
import NetflixButton from '@/components/netflix/NetflixButton';
import SectionHeader from '@/components/netflix/SectionHeader';
import WishForm from '@/components/netflix/WishForm';
import { Button } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';

const NetflixGraduation = ({ parsedData }: { parsedData: any }) => {
  console.log(parsedData);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

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

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="mx-auto bg-black max-w-[440px] h-full relative">
        <Button
          iconPosition="start"
          icon={
            <Image
              src="/instagram-icon.svg"
              width={16}
              height={16}
              alt="Add to Your Story Icon"
            />
          }
          className="!pl-2.5 !pr-3 !py-[9px] !h-10 !text-sm !font-bold !text-white !rounded-lg !bg-[rgba(163,163,163,0.7)] !absolute right-8 top-3"
          type="text">
          Add to Your Story
        </Button>
        {/* Video */}
        <div className="w-full h-[408px] mb-[23px]">
          <Image
            width={408}
            height={408}
            alt="Graduation video"
            src={parsedData.images[0]}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between items-center p-3 rounded-md bg-[#232323] mb-3 max-md:mx-2 md:mx-0">
          <div className="flex gap-x-4 items-center">
            <div className="flex items-center gap-x-2 p-0.5 rounded-md bg-[#525252] border-solid border border-[#838383] md:h-fit self-stretch">
              <Image
                src="/memologonetflix.svg"
                width="0"
                height="0"
                className="w-5 h-5 sm:w-12 sm:h-12 md:w-10 md:h-10"
                alt="Memo Logo Netflix"
              />
              <span className="text-base font-semibold text-white">&</span>
              <CameraEnhanceIcon
                sx={{ fontSize: { xs: 25, sm: 40, md: 40 }, color: 'white' }}
              />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <span className="text-sm font-normal text-[#A4A4A4]">
                Collaboration Photographer{' '}
              </span>
              <span className="text-base font-semibold text-white">
                {parsedData.photographerName}
              </span>
            </div>
          </div>
          <Button
            icon={
              <svg
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.19229 7.4422L1.94229 13.6922C1.88422 13.7503 1.81528 13.7963 1.73941 13.8278C1.66354 13.8592 1.58223 13.8754 1.5001 13.8754C1.41798 13.8754 1.33666 13.8592 1.26079 13.8278C1.18492 13.7963 1.11598 13.7503 1.05792 13.6922C0.999847 13.6341 0.953784 13.5652 0.922357 13.4893C0.890931 13.4135 0.874756 13.3321 0.874756 13.25C0.874756 13.1679 0.890931 13.0866 0.922357 13.0107C0.953784 12.9348 0.999847 12.8659 1.05792 12.8078L6.86651 7.00001L1.05792 1.1922C0.94064 1.07492 0.874756 0.915864 0.874756 0.750012C0.874756 0.584159 0.94064 0.4251 1.05792 0.307824C1.17519 0.190549 1.33425 0.124664 1.5001 0.124664C1.66596 0.124664 1.82502 0.190549 1.94229 0.307824L8.19229 6.55782C8.2504 6.61587 8.2965 6.6848 8.32795 6.76067C8.35941 6.83655 8.37559 6.91788 8.37559 7.00001C8.37559 7.08215 8.35941 7.16348 8.32795 7.23935C8.2965 7.31522 8.2504 7.38415 8.19229 7.4422Z"
                  fill="white"
                />
              </svg>
            }
            className="!w-5 !h-5"
            type="text"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-y-3 items-start mb-3 max-md:px-2 md:px-0">
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
              {parsedData.llm_generated.name}
            </h1>
            <p className="text-base text-white geist-font">
              {parsedData.llm_generated.subtitle}
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
            <span className="text-[#22C55E] font-medium max-md:text-sm md:text-base geist-font">
              100% match
            </span>
            <div className="w-[39px] h-[22px] px-[11px] py-[3px] bg-[#4B5563] rounded-full flex items-center justify-center font-semibold text-xs geist-font">
              SU
            </div>
            <span className="text-base max-md:text-sm md:text-base geist-font">
              2025
            </span>
            <span className="text-base max-md:text-sm md:text-base geist-font">
              {parsedData.llm_generated.graduationTime} - Drop
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
        <div className="flex flex-col gap-y-2 mb-3 max-md:px-2 md:px-0">
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
            {dayjs(parsedData.llm_generated.graduationDate).format(
              'D MMMM YYYY'
            )}
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
            {parsedData.llm_generated.graduationPlace}
          </NetflixButton>
        </div>

        {/* Quote */}
        <div className="flex flex-col gap-y-3 text-white mb-3 max-md:px-2 md:px-0">
          <p className="text-lg geist-font">
            {parsedData.llm_generated.storyDescription}
          </p>
        </div>

        {/* Synopsis */}
        <div className="flex flex-col items-start gap-y-3 text-white mb-3 max-md:px-2 md:px-0">
          <SectionHeader title="Synopsis" />
          <div className="w-full h-[228px]">
            <Image
              width={408}
              height={408}
              alt="Graduation video"
              src={parsedData.images[1]}
              className="w-full h-full object-cover"
            />
          </div>
          <p
            className={
              showFullSynopsis
                ? 'text-lg geist-font'
                : 'text-lg geist-font line-clamp-3'
            }>
            {parsedData.llm_generated.synopsis}
          </p>
          <NetflixButton
            variant="text"
            icon={showMoreIcon}
            iconPosition="end"
            onClick={() => setShowFullSynopsis(!showFullSynopsis)}>
            {showFullSynopsis ? 'Show Less' : 'Show More'}
          </NetflixButton>
        </div>

        {/* Episode */}
        <div className="flex flex-col items-start gap-y-3 mb-3 max-md:px-2 md:px-0">
          <SectionHeader
            title="Episode"
            subtitle={`The Story of ${parsedData.llm_generated.name}`}
          />

          {parsedData.llm_generated.episodes.map((episode, index) => (
            <EpisodeCard
              key={index}
              number={episode.number}
              title={episode.title}
              duration={episode.duration}
              description={episode.description}
              isComingSoon={
                episode.number === parsedData.llm_generated.episodes.length
              }
              imageSrc={parsedData.images[episode.number - 1]}
              imageAlt={episode.title}
            />
          ))}
        </div>

        {/* Our Gallery */}
        <div className="flex flex-col items-start gap-y-3 w-full mb-3 max-md:px-2 md:px-0">
          <SectionHeader title="Our Gallery" />
          <GalleryGrid images={parsedData.images} initialLimit={6} />
          {/* Note: The Show More button is already included in the GalleryGrid component */}
        </div>

        {/* Wish for the couple */}
        <div className="flex flex-col items-start gap-y-3 w-full mb-3 max-md:px-2 md:px-0">
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

          {/* <div className="flex flex-col gap-y-2 items-start w-full">
              {parsedData.llm_generated.wishes.map((wish, index) => {
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
            </div> */}
        </div>

        {/* Form Submit */}
        <WishForm onSubmit={handleWishSubmit} />
        <p className="text-base font-regular text-[#D1D5DB] w-full text-center mt-4 max-md:px-2 md:px-0">
          © 2025 Graduation Memories by Memoify.live | <br /> Photography by{' '}
          <span className="text-[#D1D5DB] font-bold underline">
            {' '}
            {parsedData.photographerName}
          </span>
        </p>
      </div>
    </div>
  );
};

export default NetflixGraduation;
