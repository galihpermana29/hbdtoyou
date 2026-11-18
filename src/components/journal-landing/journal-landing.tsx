'use client';

import { useMemo } from 'react';

import type { IContent } from '@/action/interfaces';
import { ClosingPanel, Steps, useStart } from '@/components/home/blocks';
import HomeOccasions from '@/components/home/occasions';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';
import { languageVersions, type PageLanguage } from '@/lib/page-language';

import { JOURNAL_COPY } from './copy';

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
 *
 * English at `/journal`, Indonesian at `/id/journal`: the page passes the
 * language, and the words are in copy.ts. The published journals are what
 * people wrote, in whatever language they wrote them.
 */

const VERSIONS = languageVersions('/journal');

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
  lang = 'en',
}: {
  journalsData: IContent[];
  lang?: PageLanguage;
}) {
  const t = JOURNAL_COPY[lang];
  // Memoised: the list below searches it, and a new array every render
  // would redo that work every render.
  const journals = useMemo(() => journalsData.filter(isPublic), [journalsData]);
  const start = useStart('/journal/create');

  return (
    <div lang={lang} className={`${memorollFonts} ${landingFonts}`}>
      <div className="fixed left-0 top-0 z-[1000] w-full isolate">
        <NavigationBar lang={lang} languageSwitch={VERSIONS} />
      </div>
      <main className="mt-[81px] overflow-x-clip">
        <JournalHero published={journals.length} lang={lang} />
        <HomeOccasions label={t.occasions.label} items={t.occasions.items} />
        <JournalFeatures lang={lang} />
        <Steps
          eyebrow={t.steps.eyebrow}
          title={t.steps.title}
          body={t.steps.body}
          steps={[
            {
              title: t.steps.feeling.title,
              body: t.steps.feeling.body,
              art: (
                <div className="flex flex-wrap justify-center gap-2 px-5">
                  {t.steps.feeling.feelings.map((feeling, index) => (
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
              title: t.steps.sections.title,
              body: t.steps.sections.body,
              art: (
                <div className="flex w-[78%] flex-col gap-2">
                  {t.steps.sections.fields.map((field) => (
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
              title: t.steps.publish.title,
              body: t.steps.publish.body,
              art: (
                <div className="paper-serif w-[62%] rounded-[6px] bg-white px-4 py-3 shadow-[0_8px_18px_-10px_rgba(90,42,18,0.4)]">
                  <p className="text-center text-[12px] font-bold leading-[1.25] text-[#1b1b1b]">
                    {t.steps.publish.paper}
                  </p>
                  <span className="mx-auto mt-2 block h-[5px] w-[90%] rounded-full bg-[#ece6dd]" />
                  <span className="mx-auto mt-[6px] block h-[5px] w-[76%] rounded-full bg-[#ece6dd]" />
                  <p
                    className="mt-3 text-center text-[10px] tracking-[1.2px] text-[#ff3e09]"
                    style={{ fontFamily: 'var(--font-mr-label)' }}>
                    {t.steps.publish.stamp}
                  </p>
                </div>
              ),
            },
          ]}
        />
        <JournalPublished journals={journals} lang={lang} />
        <ClosingPanel
          ground="#fbf4ec"
          title={t.closing.title}
          body={t.closing.body}
          action={t.closing.action}
          onAction={start}
        />
      </main>
    </div>
  );
}
