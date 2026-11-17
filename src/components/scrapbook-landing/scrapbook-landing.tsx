'use client';

import { Sparkles } from 'lucide-react';

import { ClosingPanel, Steps, useStart } from '@/components/home/blocks';
import HomeOccasions from '@/components/home/occasions';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';

import ScrapbookHero from './hero';
import ScrapbookStyles from './styles';

/**
 * The scrapbook product's landing, in the MemoRoll design system like the
 * home page (owner, 2026-11-17: "the same idea"). Its signature is the
 * scrapbook that turns its own pages in the hero (book.tsx).
 *
 * Not carried over from the page it replaces: "hundreds of scrapbook
 * templates, updated every month" (there are eight), the three-cover
 * carousel, and the newsletter form, which was never wired to anything.
 */
export default function ScrapbookLanding() {
  const start = useStart('/scrapbook/create');
  return (
    <div className={`${memorollFonts} ${landingFonts}`}>
      <div className="fixed left-0 top-0 z-[1000] w-full isolate">
        <NavigationBar />
      </div>
      <main className="mt-[81px] overflow-x-clip">
        <ScrapbookHero />
        <HomeOccasions
          label="What people make scrapbooks of"
          items={[
            'Anniversaries',
            'Birthdays',
            'Trips',
            'Graduations',
            'Best friends',
            'First years',
            'Family',
          ]}
        />
        <ScrapbookStyles />
        <Steps
          ground="#fbf4ec"
          eyebrow="How it works"
          title="Three steps. Memo-AI does the gluing."
          body="No cutting, no arranging, no glue on the table."
          steps={[
            {
              title: 'Add your photos',
              body: 'Choose the ones that tell the story. They do not need to match.',
              art: (
                <div className="relative h-[120px] w-[190px]">
                  {[
                    ['garden', 'l', 'left-0 top-3 -rotate-[9deg]'],
                    ['rose', 'l', 'left-[58px] top-0 rotate-[4deg]'],
                    ['retro', 'r', 'left-[112px] top-4 rotate-[11deg]'],
                  ].map(([key, side, pose]) => (
                    <img
                      key={key}
                      src={`/landing/page-${key}-${side}.webp`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={`absolute h-[104px] w-[78px] rounded-[4px] border-[4px] border-white object-cover shadow-[0_8px_16px_-8px_rgba(90,42,18,0.5)] ${pose}`}
                    />
                  ))}
                </div>
              ),
            },
            {
              title: 'Pick a style, say a few words',
              body: 'Choose how it should look and describe the moment. Memo-AI arranges every page from there.',
              art: (
                <div className="flex w-[80%] flex-col gap-2">
                  <span className="rounded-[12px] border border-[#e0d6ca] bg-white px-3 py-2 text-[12px] text-[#4a4642]">
                    Our first year together, mostly food and bad selfies
                  </span>
                  <span className="flex items-center gap-2 self-end rounded-full bg-[#ff3e09] px-4 py-2 text-[12px] font-semibold text-white">
                    <Sparkles aria-hidden className="size-4" />
                    Generate
                  </span>
                </div>
              ),
            },
            {
              title: 'Open it, send the link',
              body: 'Your scrapbook opens like a book on any phone. Share one link, no app needed.',
              art: (
                <span className="flex w-[68%] overflow-hidden rounded-[8px] border-[5px] border-[#1b1b1b]">
                  <img
                    src="/landing/page-sweet-l.webp"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="block w-1/2"
                  />
                  <img
                    src="/landing/page-sweet-r.webp"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="block w-1/2"
                  />
                </span>
              ),
            },
          ]}
        />
        <ClosingPanel
          ground="#fbf4ec"
          title="Start the scrapbook they will keep."
          body="A few photos and a few minutes. Memo-AI handles the rest."
          action="Make a scrapbook"
          onAction={start}
          second={{ label: 'See what others made', href: '/inspiration' }}
          tucked={[
            [
              '/landing/page-garden-l.webp',
              'left-[2%] top-[10%] w-[150px] -rotate-[10deg]',
            ],
            [
              '/landing/page-rose-l.webp',
              'right-[3%] top-[6%] w-[150px] rotate-[9deg]',
            ],
            [
              '/landing/page-retro-r.webp',
              'left-[8%] bottom-[-20%] w-[150px] rotate-[6deg]',
            ],
            [
              '/landing/page-folder-r.webp',
              'right-[8%] bottom-[-22%] w-[150px] -rotate-[7deg]',
            ],
          ]}
        />
      </main>
    </div>
  );
}
