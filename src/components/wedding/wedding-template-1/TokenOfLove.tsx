'use client';

/**
 * Wedding Template 1 — Send a Token of Love (gift / Thank You card). Figma node 312:1786.
 * Dark band with a paper-textured "Thank You" photo card, a bank-transfer card
 * with a working copy button, and a torn-paper decorative strip.
 * Animation: heading + content fade up on scroll. The copy button writes the
 * account number to the clipboard and briefly swaps its label to "copied".
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

import { fadeUpCenter } from './variants';
import { useWeddingReveal } from './use-wedding-reveal';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  joinAccountHolder,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

const ASSET = '/templates/wedding-template-1';

/**
 * The sample invitation, which is what an unanswered photograph falls back to.
 *
 * The section names artwork and never a photograph, because a photograph
 * belongs to whoever is getting married. Where a couple has not given one, the
 * one the sample holds stands in, the same as an unanswered name does.
 */
const SAMPLE = DEFAULT_WEDDING_TEMPLATE_1_CONTENT;

export default function TokenOfLove({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: {
  content?: WeddingTemplate1Content;
}) {
  const fadeUpCenterReveal = useWeddingReveal(fadeUpCenter);
  const [copied, setCopied] = useState(false);
  const tokenPhoto = content.tokenPhoto || SAMPLE.tokenPhoto;

  const handleCopy = () => {
    navigator.clipboard?.writeText(content.accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <section className="relative h-[605px] w-full overflow-hidden bg-[#292929]">
      {/* heading + underline */}
      <motion.div
        className="absolute left-[calc(50%+0.5px)] top-[60px] h-[31px] w-[196px]"
        {...fadeUpCenterReveal}>
        <p className="absolute left-[calc(50%-145px)] top-0 w-[290px] font-[family-name:var(--font-wt1-script)] text-[48px] leading-[normal] text-[rgba(250,250,250,0.98)]">
          Send a Token of Love
        </p>
        <div className="absolute left-[-49px] top-[50px] h-px w-[298px] bg-[#fafafa]" />
      </motion.div>

      {/* content column */}
      <motion.div
        className="absolute left-1/2 top-[131px] flex w-[343px] flex-col items-center gap-[24px]"
        {...fadeUpCenterReveal}>
        <p className="w-full text-center font-[family-name:var(--font-wt1-mono)] text-[12px] leading-[normal] text-white">
          {content.tokenMessage}
        </p>

        <div className="relative flex w-full flex-col items-start gap-[16px]">
          {/* Thank You photo card */}
          <div className="relative h-[241px] w-full">
            <div className="absolute left-0 top-0 h-[241px] w-[343px]">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  alt=""
                  className="absolute left-0 top-[-57.5%] h-[210.91%] w-full max-w-none"
                  src={`${ASSET}/paper.jpg`}
                />
              </div>
            </div>
            <div className="absolute left-[6.1px] top-[6.1px] h-[217.934px] w-[331.815px] border-[1.356px] border-solid border-[#201e1f]" />
            <p className="absolute left-[calc(50%-45.5px)] top-[185.72px] whitespace-nowrap font-[family-name:var(--font-wt1-script)] text-[32px] leading-[normal] text-black">
              Thank You
            </p>
            <div className="absolute left-1/2 top-[15.25px] h-[171.5px] w-[302.328px] -translate-x-1/2">
              <img
                alt="Couple"
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                src={tokenPhoto}
              />
            </div>
          </div>

          {/* bank transfer card */}
          <div className="relative flex w-full flex-col items-start rounded-[2px] px-[12px] pb-[12px] pt-[24px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[2px] object-cover"
              src={`${ASSET}/paper.jpg`}
            />
            <div className="relative flex w-full items-center gap-[8px]">
              <div className="relative flex min-w-px flex-[1_0_0] items-start">
                <div className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px] leading-[normal] text-black">
                  <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[12px] font-medium">
                    {joinAccountHolder(
                      content.accountHolder,
                      content.bankProvider
                    )}
                  </p>
                  <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[16px] font-semibold">
                    {content.accountNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="relative flex cursor-pointer items-center justify-center border border-solid border-[#fafafa] bg-black gap-[10px] p-[10px]">
                <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] leading-[normal] text-[#fafafa]">
                  {copied ? 'copied' : 'copy'}
                </p>
              </button>
            </div>
          </div>

          {/* torn-paper decorative strip */}
          <div className="absolute left-0 top-[221px] h-[53px] w-[343px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-[-0.18%] top-[-26.42%] h-[150.94%] w-[100.35%] max-w-none"
                src={`${ASSET}/token-decor.png`}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
