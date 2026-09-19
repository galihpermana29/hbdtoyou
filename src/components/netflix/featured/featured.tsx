'use client';

import { InfoOutlined, PlayArrow } from '@mui/icons-material';
import Image from 'next/image';
import widya from '@/assets/widya/after/2.jpg';
import { useState } from 'react';
import Modal from './modal';
import { Tour, TourProps } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TruncateText from '@/components/newlanding/TruncateText';
import { addLineBreaksEveryThreeSentences } from '@/lib/utils';
import { WIDYA_FALLBACK_PARAGRAPH } from '@/lib/widya-fallback';
import { motion } from 'framer-motion';
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
    <section className="relative h-[82svh] min-h-[560px] overflow-hidden">
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
        <div
          className="h-[70vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-[#141414]"
          id="style-1">
          <div className="relative h-[42%] min-h-[220px] w-full">
            <Image
              src={jumbotronImage ?? widya}
              alt=""
              fill
              sizes="(max-width: 768px) 90vw, 768px"
              className="object-cover"
              ref={ref1}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
          </div>
          <div className="px-5 pb-8 md:px-8">
            <div className="text-base space-y-4">
              <p
                dangerouslySetInnerHTML={{
                  __html: modalContent
                    ? addLineBreaksEveryThreeSentences(modalContent)
                    : WIDYA_FALLBACK_PARAGRAPH,
                }}></p>
            </div>
          </div>
        </div>
      </Modal>

      <Image
        src={jumbotronImage ?? widya}
        alt="Background"
        fill
        sizes="100vw"
        className="scale-[1.04] object-cover object-center motion-safe:animate-[netflix-ken-burns_16s_ease-out_forwards]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.65 }}
        className="absolute bottom-28 left-0 space-y-5 p-5 text-white md:bottom-36 md:left-8 md:max-w-[58%] md:p-8 lg:max-w-[48%]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e50914]">
          A Memoify Original
        </p>
        <h1 className="text-4xl font-black leading-[0.95] tracking-tight drop-shadow-2xl md:text-6xl" ref={ref2}>
          {title ?? 'Happy Birthday!'}
        </h1>
        <div className="max-w-[600px] text-sm leading-relaxed text-neutral-200 drop-shadow md:text-lg" ref={ref3}>
          {subTitle ? (
            <TruncateText showSeeMore={true} text={subTitle} maxLength={130} />
          ) : (
            <TruncateText
              showSeeMore={true}
              text={
                'This is how Galih express love. In the meantime you will understand how my brain works. As you see this, Galih wants to say Happy Birthday to his Girlfriend.'
              }
              maxLength={130}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            ref={ref4}
            className="flex items-center gap-2 rounded bg-white px-6 py-2.5 font-semibold text-gray-900 transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            onClick={handleOpenModal}>
            <PlayArrow />
            <span>Play</span>
          </button>
          <button
            className="flex items-center gap-2 rounded bg-neutral-500/70 px-5 py-2.5 font-semibold text-white backdrop-blur transition hover:bg-neutral-500/50"
            onClick={handleOpenModal}>
            <InfoOutlined />
            <span>More Info</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
