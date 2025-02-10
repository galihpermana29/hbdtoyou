'use client';

import { InfoOutlined, PlayArrow } from '@mui/icons-material';
import Image from 'next/image';
import widya from '@/assets/widya/after/2.jpg';
import { useRef, useState } from 'react';
import Modal from './modal';
import { Tour, TourProps } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Featured({
  title,
  subTitle,
  modalContent,
  jumbotronImage,
  ref1,
  ref2,
  ref3,
  ref4,
  ref5,
}: {
  title?: string;
  subTitle?: string;
  modalContent?: string;
  jumbotronImage?: string;
  ref1?: any;
  ref2?: any;
  ref3?: any;
  ref4?: any;
  ref5?: any;
}) {
  const [showModal, setShowModal] = useState(false);

  const queryURL = useSearchParams();
  const isTutorial = queryURL.get('isTutorial');

  const router = useRouter();
  const pathname = usePathname();
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const steps: TourProps['steps'] = [
    {
      title: 'The Title',
      description: (
        <div className="max-w-[250px]">
          Write the title of the website about. Birthday, Anniversary, Wedding,
          etc.
        </div>
      ),
      target: () => ref2?.current,
    },
    {
      title: 'The Sub Title',
      description: (
        <div className="max-w-[250px]">
          Write the subtitle of the website about. Your feelings, etc.
        </div>
      ),
      target: () => ref3?.current,
    },
    {
      title: 'Click play, and see the Modal',
      description: (
        <div className="max-w-[250px]">
          You can write a letter in here, says how you feel about.
        </div>
      ),
      target: () => ref4?.current,
    },
    {
      title: 'Jumbotron Image',
      description: (
        <div className="max-w-[250px]">
          Put your highlight image, something that describe the website is about
        </div>
      ),
      target: () => ref1?.current,
    },
    {
      title: 'Collection of Images',
      description: (
        <div className="max-w-[250px]">
          Put all of your memories in here, let it be your story.
        </div>
      ),
      target: () => ref5?.current,
    },
  ];

  return (
    <div className="relative h-screen">
      {/* Modal */}
      <Tour
        open={isTutorial === 'true'}
        steps={steps}
        onClose={() => {
          router.replace(pathname);
        }}
        onFinish={() => {
          router.replace(pathname);
        }}
      />
      <Modal show={showModal} onClose={handleCloseModal}>
        <div className="w-full max-w-3xl h-[80vh] overflow-y-auto bg-black rounded-lg p-4 ">
          <div className="w-full h-[400px] relative">
            <Image
              src={jumbotronImage ?? widya}
              alt="Widya"
              layout="fill"
              objectFit="cover"
              ref={ref1}
            />
          </div>
          <div className="mt-5">
            <div className="text-base space-y-4">
              <p>
                {modalContent ??
                  'Hi Widya, I`ve been thinking about what to write for your birthday, and there are a few things I want to share with you. Even though we`ve only known each other for a couple of weeks, it feels like much longer because we talk so much—every night, every day. The more we talk, the more I find myself getting deeply interested in you.'}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Image
        src={jumbotronImage ?? widya}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="object-center"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute top-[50%] translate-y-[-50%] text-white p-[20px] space-y-6 md:max-w-[60%] lg:max-w-[50%] md:left-[40px] mt-[50px]">
        <h1 className="md:text-5xl text-[30px] font-bold" ref={ref2}>
          {title ?? 'Happy Birthday!'}
        </h1>
        <p className="md:text-lg text-[15px]" ref={ref3}>
          {subTitle ??
            'This is how Galih express love. In the meantime you will understand how my brain works. As you see this, Galih wants to say Happy Birthday to his Girlfriend.'}
          <br />
          <br />
          Click Play to see the details.
        </p>
        <div className="flex space-x-4">
          <button
            ref={ref4}
            className="bg-white text-gray-900 px-4 py-2 rounded flex items-center space-x-2"
            onClick={handleOpenModal}>
            <PlayArrow />
            <span>Play</span>
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded flex items-center space-x-2">
            <InfoOutlined />
            <span>Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}
