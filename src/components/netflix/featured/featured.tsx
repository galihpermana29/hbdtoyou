'use client';

import { InfoOutlined, PlayArrow } from '@mui/icons-material';
import Image from 'next/image';
import widya from '@/assets/widya/after/2.jpg';
import { useState } from 'react';
import Modal from './modal';

export default function Featured({
  title,
  subTitle,
  modalContent,
  jumbotronImage,
}: {
  title?: string;
  subTitle?: string;
  modalContent?: string;
  jumbotronImage?: string;
}) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="relative h-screen">
      {/* Modal */}
      <Modal show={showModal} onClose={handleCloseModal}>
        <div className="w-full max-w-3xl h-[80vh] overflow-y-auto bg-black rounded-lg p-4">
          <div className="w-full h-[400px] relative">
            <Image
              src={jumbotronImage ?? widya}
              alt="Widya"
              layout="fill"
              objectFit="cover"
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
        <h1 className="md:text-5xl text-[30px] font-bold">
          {title ?? 'Happy Birthday!'}
        </h1>
        <p className="md:text-lg text-[15px]">
          {subTitle ??
            'This is how Galih express love. In the meantime you will understand how my brain works. As you see this, Galih wants to say Happy Birthday to his Girlfriend.'}
          <br />
          <br />
          Click Play to see the details.
        </p>
        <div className="flex space-x-4">
          <button
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
