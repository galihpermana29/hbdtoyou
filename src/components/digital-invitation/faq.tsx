'use client';

import { useState } from 'react';

import { RevealHeading } from '@/components/memoroll/landing/reveal-words';
import SectionPill from './section-pill';

/**
 * Only the questions are in the design, and only the first answer is written.
 * Answers 2 to 6 are placeholders written to match the product and need
 * sign-off from the team before launch.
 */
const FAQS = [
  {
    q: 'How do digital invitations work?',
    a: 'A digital invitation is an online event page you share by email or message. Guests open the link to see the details and, where available, send their RSVP.',
  },
  {
    q: 'Can I customize the invitation design?',
    a: 'Yes. Pick a template, then change the photos, story, schedule, maps and music to make it yours.',
  },
  {
    q: 'Can I update event details after sending?',
    a: 'Yes. Edit your invitation from the dashboard at any time and guests see the latest version the next time they open their link.',
  },
  {
    q: 'How do guests RSVP?',
    a: 'Each guest opens their personal link and replies on the page. Every response arrives in your RSVP dashboard.',
  },
  {
    q: 'Do guests need an app or account to access?',
    a: 'No. The invitation opens in any phone or desktop browser, with no app and no sign-up.',
  },
  {
    q: 'How is guest privacy handled?',
    a: 'Only people with a guest’s personal link can open the invitation, and RSVP details are visible only to you.',
  },
];

const EMAIL = 'memoify@memoify.live';

export default function InvitationFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-label="FAQ"
      className="bg-[#fffdfa] px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:py-[120px] xl:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 lg:flex-row lg:gap-24">
        <div className="flex w-full shrink-0 flex-col items-start gap-6 lg:w-[420px]">
          <SectionPill>FAQ</SectionPill>
          <RevealHeading className="text-[30px] font-semibold leading-[1.2] tracking-[-0.72px] text-[#1b1b1b] md:text-[36px] md:leading-[44px]">
            Questions, answered
          </RevealHeading>
          <p className="text-[17px] leading-[28px] text-[#4a4642] md:text-[18px] md:leading-[30px]">
            Everything you need to know about Memoify digital invitation.
          </p>
          <div className="flex w-full flex-col items-start gap-[18px] rounded-[20px] bg-[#fbf4ec] p-6 md:p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1b1b1b]">
                <img
                  src="/digital-invitation/faq-chat.svg"
                  alt=""
                  width={18}
                  height={18}
                />
              </span>
              <p className="text-[18px] font-bold text-[#1b1b1b]">
                Need a custom template?
              </p>
            </div>
            <p className="text-[15px] leading-[23px] text-[#4a4642]">
              Our team replies within a day, usually much faster.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex max-w-full items-center gap-2 break-all rounded-full bg-[#1b1b1b] px-[18px] py-3 text-[14px] font-semibold text-white">
              {EMAIL}
              <img
                src="/digital-invitation/faq-arrow.svg"
                alt=""
                width={16}
                height={16}
              />
            </a>
          </div>
        </div>

        <div className="min-w-0 flex-1 border-t-[1.5px] border-[#1b1b1b]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-[#e8ded3]">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`invitation-faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 px-1 py-6 text-left md:gap-6 md:py-7">
                    <span
                      className={`text-[14px] font-medium tracking-[-0.28px] ${
                        isOpen ? 'text-[#ff3e09]' : 'text-[#8a847d]'
                      }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 text-[16px] leading-6 text-[#1b1b1b] md:text-[18px] md:leading-7 ${
                        isOpen ? 'font-semibold' : 'font-medium'
                      }`}>
                      {f.q}
                    </span>
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                        isOpen ? 'bg-[#ff3e09]' : ''
                      }`}>
                      <img
                        src={`/digital-invitation/faq-${isOpen ? 'minus' : 'plus'}.svg`}
                        alt=""
                        width={18}
                        height={18}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`invitation-faq-${i}`}
                  role="region"
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen
                      ? 'visible grid-rows-[1fr] opacity-100'
                      : 'invisible grid-rows-[0fr] opacity-0'
                  }`}>
                  <div className="overflow-hidden">
                    <p className="pb-7 pl-8 pr-2 text-[15px] leading-6 text-[#4a4642] md:pl-[52px] md:pr-[60px] md:text-[16px]">
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
