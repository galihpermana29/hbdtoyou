'use client';

import { Sparkles } from 'lucide-react';

import { ClosingPanel, Steps, useStart } from '@/components/home/blocks';
import HomeOccasions from '@/components/home/occasions';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';
import { languageVersions, type PageLanguage } from '@/lib/page-language';

import { SCRAPBOOK_COPY } from './copy';

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
 *
 * English at `/scrapbook`, Indonesian at `/id/scrapbook`: the page passes
 * the language, and the words are in copy.ts.
 */
const VERSIONS = languageVersions('/scrapbook');

export default function ScrapbookLanding({
  lang = 'en',
}: {
  lang?: PageLanguage;
}) {
  const t = SCRAPBOOK_COPY[lang];
  const start = useStart('/scrapbook/create');
  return (
    <div lang={lang} className={`${memorollFonts} ${landingFonts}`}>
      <div className="fixed left-0 top-0 z-[1000] w-full isolate">
        <NavigationBar lang={lang} languageSwitch={VERSIONS} />
      </div>
      <main className="mt-[81px] overflow-x-clip">
        <ScrapbookHero lang={lang} />
        <HomeOccasions label={t.occasions.label} items={t.occasions.items} />
        <ScrapbookStyles lang={lang} />
        <Steps
          ground="#fbf4ec"
          eyebrow={t.steps.eyebrow}
          title={t.steps.title}
          body={t.steps.body}
          steps={[
            {
              title: t.steps.photos.title,
              body: t.steps.photos.body,
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
              title: t.steps.style.title,
              body: t.steps.style.body,
              art: (
                <div className="flex w-[80%] flex-col gap-2">
                  <span className="rounded-[12px] border border-[#e0d6ca] bg-white px-3 py-2 text-[12px] text-[#4a4642]">
                    {t.steps.style.prompt}
                  </span>
                  <span className="flex items-center gap-2 self-end rounded-full bg-[#ff3e09] px-4 py-2 text-[12px] font-semibold text-white">
                    <Sparkles aria-hidden className="size-4" />
                    {t.steps.style.generate}
                  </span>
                </div>
              ),
            },
            {
              title: t.steps.send.title,
              body: t.steps.send.body,
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
          title={t.closing.title}
          body={t.closing.body}
          action={t.closing.action}
          onAction={start}
          second={{ label: t.closing.second, href: '/inspiration' }}
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
