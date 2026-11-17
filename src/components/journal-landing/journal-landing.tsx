'use client';

import { useMemo } from 'react';

import type { IContent } from '@/action/interfaces';
import { ClosingPanel, Steps, useStart } from '@/components/home/blocks';
import HomeOccasions from '@/components/home/occasions';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';

import JournalFeatures from './features';
import JournalHero from './hero';
import JournalPublished from './published';

/**
 * The journal product's landing, in the MemoRoll design system like the
 * home page (owner, 2026-11-17: "the same idea"). Its signature is the
 * paper that typesets itself in the hero (paper.tsx).
 *
 * Not carried over from the page it replaces: the laptop mock-up picture
 * and the newsletter form, which was never wired to anything.
 */

/** A journal is listed unless its author took it off the list. */
function isPublic(journal: IContent): boolean {
  try {
    return JSON.parse(journal.detail_content_json_text).isPublic !== false;
  } catch {
    return true;
  }
}

export default function JournalLanding({
  journalsData,
}: {
  journalsData: IContent[];
}) {
  // Memoised: the list below searches it, and a new array every render
  // would redo that work every render.
  const journals = useMemo(() => journalsData.filter(isPublic), [journalsData]);
  const start = useStart('/journal/create');

  return (
    <div className={`${memorollFonts} ${landingFonts}`}>
      <div className="fixed left-0 top-0 z-[1000] w-full isolate">
        <NavigationBar />
      </div>
      <main className="mt-[81px] overflow-x-clip">
        <JournalHero published={journals.length} />
        <HomeOccasions
          label="What people write"
          items={[
            'Love letters',
            'Apologies',
            'Birthday wishes',
            'Thank-yous',
            'Anniversaries',
            'Farewells',
            'Confessions',
          ]}
        />
        <JournalFeatures />
        <Steps
          eyebrow="How it works"
          title="Three steps to published"
          body="You bring the feeling. The format is already done."
          steps={[
            {
              title: 'Start from a feeling',
              body: 'Love, sorry, happy birthday, thank you. Decide who it is for and what you want to say.',
              art: (
                <div className="flex flex-wrap justify-center gap-2 px-5">
                  {[
                    'I love you',
                    'I’m sorry',
                    'Happy birthday',
                    'Thank you',
                  ].map((feeling, index) => (
                    <span
                      key={feeling}
                      className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
                        index === 0
                          ? 'bg-[#ff3e09] text-white'
                          : 'border border-[#e0d6ca] bg-white text-[#4a4642]'
                      }`}>
                      {feeling}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              title: 'Fill in the sections',
              body: 'A title, an abstract and the body of your letter. The layout of a paper is applied for you.',
              art: (
                <div className="flex w-[78%] flex-col gap-2">
                  {['Title', 'Abstract', 'Conclusion'].map((field) => (
                    <span
                      key={field}
                      className="flex items-center gap-3 rounded-[12px] border border-[#e0d6ca] bg-white px-3 py-2">
                      <span className="w-[72px] text-[11px] font-semibold text-[#1b1b1b]">
                        {field}
                      </span>
                      <span className="h-[5px] flex-1 rounded-full bg-[#ece6dd]" />
                    </span>
                  ))}
                </div>
              ),
            },
            {
              title: 'Publish and send the link',
              body: 'It opens as a page they can read on any phone. List it with the published journals, or keep it off the list.',
              art: (
                <div className="paper-serif w-[62%] rounded-[6px] bg-white px-4 py-3 shadow-[0_8px_18px_-10px_rgba(90,42,18,0.4)]">
                  <p className="text-center text-[12px] font-bold leading-[1.25] text-[#1b1b1b]">
                    On Loving You
                  </p>
                  <span className="mx-auto mt-2 block h-[5px] w-[90%] rounded-full bg-[#ece6dd]" />
                  <span className="mx-auto mt-[6px] block h-[5px] w-[76%] rounded-full bg-[#ece6dd]" />
                  <p
                    className="mt-3 text-center text-[10px] tracking-[1.2px] text-[#ff3e09]"
                    style={{ fontFamily: 'var(--font-mr-label)' }}>
                    PUBLISHED
                  </p>
                </div>
              ),
            },
          ]}
        />
        <JournalPublished journals={journals} />
        <ClosingPanel
          ground="#fbf4ec"
          title="Submit your feelings for review."
          body="It takes a few minutes to write, and it is the only paper they will read twice."
          action="Publish a journal"
          onAction={start}
        />
      </main>
    </div>
  );
}
