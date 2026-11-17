import { Link2, Printer } from 'lucide-react';
import type { ReactNode } from 'react';

import { Rise, SectionHead } from '@/components/home/ui';

/**
 * What makes it a paper, on ink so the white sheets stand out. Three cards,
 * one wave (lead first, shrinking gaps); the small drawings inside are
 * still - the page's motion budget went to the hero.
 */

function Card({
  title,
  body,
  children,
  delay,
  distance,
}: {
  title: string;
  body: string;
  children: ReactNode;
  delay: number;
  distance: number;
}) {
  return (
    <Rise delay={delay} distance={distance} className="flex-1">
      <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[#232323] p-6 md:p-7">
        <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-[20px] bg-[#fbf4ec] px-5">
          {children}
        </div>
        <h3 className="mt-6 text-[22px] font-bold leading-[1.2] tracking-[-0.03em] text-[#fbf4ec]">
          {title}
        </h3>
        <p className="mt-2 text-[15px] leading-[1.6] text-[#cfc7bd]">{body}</p>
      </div>
    </Rise>
  );
}

export default function JournalFeatures() {
  return (
    <section
      className="bg-[#1b1b1b] px-5 py-16 md:py-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto max-w-[1180px]">
        <SectionHead
          tone="paper"
          eyebrow="Features"
          title="Serious format. Unserious amount of feelings."
          body="Everything a real paper has, pointed at one person."
        />
        <div className="mt-12 flex flex-col gap-5 md:mt-16 lg:flex-row">
          <Card
            delay={0}
            distance={20}
            title="Abstract-level emotions"
            body="Open with an abstract: your deepest feelings in two or three lines that sound peer-reviewed.">
            <div className="paper-serif w-full rounded-[6px] bg-white px-4 py-3 shadow-[0_8px_18px_-10px_rgba(90,42,18,0.4)]">
              <p className="text-center text-[11px] font-bold text-[#1b1b1b]">
                Abstract
              </p>
              <p className="mt-1 text-[11px] leading-[1.65] text-[#35302b]">
                Results show the author is{' '}
                <span className="rounded-[2px] bg-[#ffd9cb] px-[2px]">
                  still in love
                </span>
                , with a confidence interval of forever.
              </p>
            </div>
          </Card>
          <Card
            delay={90}
            distance={14}
            title="Structured like a thesis"
            body="From Preamble to Conclusion, every part of your letter follows a research paper’s format.">
            <ol className="paper-serif w-full rounded-[6px] bg-white px-4 py-3 text-[11px] text-[#35302b] shadow-[0_8px_18px_-10px_rgba(90,42,18,0.4)]">
              {['Abstract', 'Preamble', 'Conclusion'].map((part, index) => (
                <li
                  key={part}
                  className="flex items-baseline gap-2 py-[5px] [&+li]:border-t [&+li]:border-dashed [&+li]:border-[#e0d6ca]">
                  <span className="font-bold text-[#ff3e09]">{index + 1}.</span>
                  <span className="font-bold text-[#1b1b1b]">{part}</span>
                  <span className="ml-auto h-[5px] w-[38%] rounded-full bg-[#ece6dd]" />
                </li>
              ))}
            </ol>
          </Card>
          <Card
            delay={150}
            distance={10}
            title="Print, publish, or present"
            body="Publish it online and send the link, or print it like a final submission.">
            <div className="flex w-full flex-col items-center gap-3">
              <span className="flex w-full items-center gap-2 rounded-full border border-[#e0d6ca] bg-white px-4 py-2 text-[12px] font-medium text-[#4a4642]">
                <Link2 aria-hidden className="size-4 shrink-0 text-[#ff3e09]" />
                <span className="truncate">memoify.live/journal/for-you</span>
              </span>
              <span className="flex items-center gap-2 rounded-full bg-[#1b1b1b] px-4 py-2 text-[12px] font-semibold text-[#fbf4ec]">
                <Printer aria-hidden className="size-4" />
                Print
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
