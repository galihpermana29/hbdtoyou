'use client';

import { useState } from 'react';

import Eyebrow from './eyebrow';
import { useLandingCopy } from './language-provider';
import { RevealHeading } from './reveal-words';

const EMAIL = 'memoify@memoify.live';

export default function MemorollFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const copy = useLandingCopy().faq;

  return (
    <section
      id="faq"
      aria-label="FAQ"
      className="bg-[#fffdfa] px-4 py-16 md:px-10 md:py-[120px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 lg:flex-row lg:gap-24">
        <div className="flex w-full shrink-0 flex-col items-start gap-6 lg:w-[420px]">
          <Eyebrow>FAQ</Eyebrow>
          <RevealHeading className="text-[28px] font-semibold leading-[1.2] tracking-[-0.72px] text-[#1b1b1b] md:text-[36px] md:leading-[44px]">
            {copy.heading}
          </RevealHeading>
          <p className="text-[18px] leading-[30px] text-[#4a4642]">
            {copy.body}
          </p>
          <div className="flex w-full flex-col items-start gap-[18px] rounded-[20px] bg-[#fbf4ec] p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#1b1b1b]">
                <img
                  loading="lazy"
                  decoding="async"
                  src="/memoroll-landing/faq-chat.svg"
                  alt=""
                  width={18}
                  height={18}
                />
              </span>
              <p className="text-[18px] font-bold text-[#1b1b1b]">
                {copy.curious}
              </p>
            </div>
            <p className="text-[15px] leading-[23px] text-[#4a4642]">
              {copy.replies}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex max-w-full items-center gap-2 break-all rounded-full bg-[#1b1b1b] px-[18px] py-3 text-[14px] font-semibold text-white">
              {EMAIL}
              <img
                loading="lazy"
                decoding="async"
                src="/memoroll-landing/faq-arrow.svg"
                alt=""
                width={16}
                height={16}
              />
            </a>
          </div>
        </div>

        <div className="min-w-0 flex-1 border-t-[1.5px] border-[#1b1b1b]">
          {copy.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-[#e8ded3]">
                <h3>
                  <button
                    type="button"
                    id={`faq-question-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-6 px-1 py-7 text-left">
                    <span
                      className={`text-[14px] font-medium tracking-[-0.28px] ${
                        isOpen ? 'text-[#ff3e09]' : 'text-[#8a847d]'
                      }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 text-[18px] leading-7 text-[#1b1b1b] ${
                        isOpen ? 'font-semibold' : 'font-medium'
                      }`}>
                      {f.q}
                    </span>
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                        isOpen ? 'bg-[#ff3e09]' : ''
                      }`}>
                      <img
                        loading="lazy"
                        decoding="async"
                        src={`/memoroll-landing/faq-${isOpen ? 'minus' : 'plus'}.svg`}
                        alt=""
                        width={18}
                        height={18}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen
                      ? 'visible grid-rows-[1fr] opacity-100'
                      : 'invisible grid-rows-[0fr] opacity-0'
                  }`}>
                  <div className="overflow-hidden">
                    <p className="pb-7 pl-[52px] pr-4 text-[16px] leading-6 text-[#4a4642] md:pr-[60px]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
