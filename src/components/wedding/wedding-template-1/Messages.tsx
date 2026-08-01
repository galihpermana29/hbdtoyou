'use client';

/**
 * Wedding Template 1 — Messages. Figma node 312:1742.
 * A scrollable list of guest wishes on paper-textured cards with a fade-out
 * gradient at the bottom and a static scrollbar visual to the right.
 * Animation: the title and each wish card fade up in a gentle stagger on scroll.
 */

import { motion } from 'framer-motion';

import { fadeUp, fadeUpCenter, staggerContainer } from './variants';
import { useWeddingReveal } from './use-wedding-reveal';

const ASSET = '/templates/wedding-template-1';

type Wish = {
  name: string;
  date: string;
  message: string;
  bordered?: boolean;
};

const wishes: Wish[] = [
  {
    name: 'Anin',
    date: '05-04-2026 00:21',
    message:
      'So happy to celebrate your big day! Wishing you both a lifetime of love and laughter.',
    bordered: true,
  },
  {
    name: 'John',
    date: '05-04-2026 00:21',
    message:
      'Cheers to the new Mr. and Mrs.! May your journey together be full of joy.',
  },
  {
    name: 'Jane',
    date: '05-04-2026 00:21',
    message:
      'Cheers to the new Mr. and Mrs.! May your journey together be full of joy.',
  },
  {
    name: 'Ari',
    date: '05-04-2026 00:21',
    message:
      'Happy wedding day! Can’t wait to see what the future holds for you both.',
  },
  {
    name: 'Zidane',
    date: '05-04-2026 00:21',
    message:
      'Cheers to the new Mr. and Mrs.! May your journey together be full of joy.',
  },
];

function WishCard({ name, date, message, bordered }: Wish) {
  return (
    <motion.div
      variants={fadeUp}
      className={`relative flex w-full shrink-0 flex-col items-start gap-[8px] rounded-[2px] px-[12px] py-[10px] ${
        bordered ? 'border border-solid border-white' : ''
      }`}>
      <img
        alt=""
        className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[2px] object-cover"
        src={`${ASSET}/paper.jpg`}
      />
      <div className="relative flex w-full shrink-0 items-start gap-[12px]">
        <div className="relative size-[24px] shrink-0">
          <img
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            height="24"
            width="24"
            src={`${ASSET}/messages-avatar.png`}
          />
        </div>
        <div className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px] leading-normal text-black [word-break:break-word]">
          <p className="relative w-full shrink-0 font-[family-name:var(--font-wt1-mono)] text-[16px] font-semibold">
            {name}
          </p>
          <p className="relative w-full shrink-0 font-[family-name:var(--font-wt1-mono)] text-[10px] font-normal">
            {date}
          </p>
        </div>
      </div>
      <p className="relative w-full shrink-0 font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-normal text-black [word-break:break-word]">
        {message}
      </p>
    </motion.div>
  );
}

export default function Messages() {
  const fadeUpCenterReveal = useWeddingReveal(fadeUpCenter);
  const staggerReveal = useWeddingReveal(staggerContainer);

  return (
    <section className="relative h-[695px] w-full overflow-hidden bg-[#090909]">
      {/* section title */}
      <motion.div
        className="absolute left-[calc(50%+0.5px)] top-[60px] h-[31px] w-[142px]"
        {...fadeUpCenterReveal}>
        <p className="absolute left-[12px] top-0 w-[123px] font-[family-name:var(--font-wt1-script)] text-[48px] leading-normal text-[rgba(250,250,250,0.98)]">
          Messages
        </p>
        <div className="absolute left-0 top-[50px] h-px w-[142px] bg-[#fafafa]" />
      </motion.div>

      {/* wishes list + scrollbar */}
      <div className="absolute left-[16px] top-[131px] flex w-[343px] items-start gap-[4px]">
        <motion.div
          className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[16px]"
          {...staggerReveal}>
          {wishes.map((wish, i) => (
            <WishCard key={i} {...wish} />
          ))}
        </motion.div>

        {/* scrollbar visual */}
        <div className="relative w-[4px] shrink-0 self-stretch overflow-clip bg-[#4a4a4a]">
          <div className="absolute left-0 top-0 h-[174px] w-[4px] bg-[#7b7b7b]" />
        </div>
      </div>

      {/* bottom fade-out gradient */}
      <div
        className="pointer-events-none absolute left-[16px] top-[536px] h-[105px] w-[335px]"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.8) 6.667%, rgba(102,102,102,0) 194.29%)',
        }}
      />
    </section>
  );
}
