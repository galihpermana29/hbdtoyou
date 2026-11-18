'use client';

import { ArrowRight, ImagePlus, Link2, MousePointerClick } from 'lucide-react';

import { ClosingPanel, Steps, useStart } from '@/components/home/blocks';
import { Rise, SectionHead, ctaGhost, ctaPrimary } from '@/components/home/ui';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';
import type { IntentPage } from '@/lib/intent-pages';

/**
 * A page that answers one search (lib/intent-pages.ts), in the MemoRoll
 * design system like the product landings, and made of their blocks.
 *
 * The order is the searcher's, not the product's: what it is and that it is
 * free to start, then what it looks like (the template previews, which they
 * can open), how to make one, why this rather than a parcel, and their
 * questions answered in plain text a search engine can quote.
 *
 * Everything above the fold is in the server's HTML and nothing waits for
 * script to be seen: the hero does not animate in.
 */

const STEP_ICONS = [MousePointerClick, ImagePlus, Link2];

export default function IntentLanding({ page }: { page: IntentPage }) {
  const start = useStart('/create');
  const [first, second, third] = page.templates;
  return (
    <div lang="id" className={`${memorollFonts} ${landingFonts}`}>
      <div className="fixed left-0 top-0 z-[1000] w-full isolate">
        <NavigationBar lang="id" />
      </div>
      <main className="mt-[81px] overflow-x-clip">
        {/* Hero */}
        <section
          className="bg-[#fbf4ec] px-5 pb-14 pt-12 md:pb-20 md:pt-20"
          style={{ fontFamily: 'var(--font-mr-body)' }}>
          <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-10 lg:flex-row lg:gap-14">
            <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e8ded3] bg-[#fffdfa] px-4 py-[6px] text-[14px] font-medium text-[#e34013]">
                <span className="size-[6px] rounded-full bg-[#ff3e09]" />
                {page.hero.pill}
              </span>
              <h1 className="mt-5 max-w-[620px] text-[38px] font-bold leading-[1.05] tracking-[-0.045em] text-[#1b1b1b] md:text-[60px]">
                {page.hero.title}
              </h1>
              <p className="mt-5 max-w-[540px] text-[17px] leading-[1.6] text-[#4a4642] md:text-[19px]">
                {page.hero.body}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <button
                  type="button"
                  onClick={() => start()}
                  className={ctaPrimary}>
                  {page.actions.make}
                  <ArrowRight aria-hidden className="size-5" />
                </button>
                <a href="#contoh" className={ctaGhost}>
                  {page.actions.examples}
                </a>
              </div>
              <p className="mt-4 text-[14px] text-[#8a847d]">
                {page.hero.note}
              </p>
            </div>
            {/* Three of the gifts, fanned. Decoration: the grid below names them. */}
            <div
              aria-hidden
              className="relative h-[250px] w-full max-w-[420px] flex-none md:h-[330px] md:max-w-[520px]">
              <img
                src={second.image}
                alt=""
                width={640}
                height={400}
                decoding="async"
                className="absolute left-0 top-[14%] w-[58%] -rotate-[7deg] rounded-[14px] border border-black/10 object-cover shadow-[0_24px_48px_-24px_rgba(90,42,18,0.45)]"
              />
              <img
                src={third.image}
                alt=""
                width={640}
                height={400}
                decoding="async"
                className="absolute right-0 top-0 w-[58%] rotate-[6deg] rounded-[14px] border border-black/10 object-cover shadow-[0_24px_48px_-24px_rgba(90,42,18,0.45)]"
              />
              <img
                src={first.image}
                alt=""
                width={640}
                height={400}
                decoding="async"
                fetchPriority="high"
                className="absolute bottom-0 left-[16%] w-[68%] rounded-[16px] border border-black/10 object-cover shadow-[0_28px_56px_-24px_rgba(90,42,18,0.5)]"
              />
            </div>
          </div>
        </section>

        {/* Examples: the template previews, each one a link to open. */}
        <section
          id="contoh"
          className="scroll-mt-[81px] bg-[#fffdfa] px-5 py-16 md:py-[112px]"
          style={{ fontFamily: 'var(--font-mr-body)' }}>
          <div className="mx-auto max-w-[1180px]">
            <SectionHead
              eyebrow={page.examples.eyebrow}
              title={page.examples.title}
              body={page.examples.body}
            />
            <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.templates.map((template, index) => (
                <li key={template.href}>
                  <Rise delay={(index % 4) * 60} distance={14}>
                    <a
                      href={template.href}
                      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e8ded3] bg-[#fffdfa] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1">
                      <span className="block aspect-[16/10] overflow-hidden bg-[#f4f1ed]">
                        <img
                          src={template.image}
                          alt={`Contoh kado digital: ${template.name}`}
                          width={640}
                          height={400}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-top"
                        />
                      </span>
                      <span className="flex flex-1 flex-col gap-2 p-5">
                        <span className="text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1b1b1b]">
                          {template.name}
                        </span>
                        <span className="text-[14px] leading-[1.55] text-[#4a4642]">
                          {template.line}
                        </span>
                        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[14px] font-semibold text-[#e34013]">
                          {page.examples.see}
                          <ArrowRight aria-hidden className="size-4" />
                        </span>
                      </span>
                    </a>
                  </Rise>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Steps
          ground="#fbf4ec"
          eyebrow={page.steps.eyebrow}
          title={page.steps.title}
          body={page.steps.body}
          steps={page.steps.items.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Link2;
            return {
              ...step,
              art: (
                <span className="flex size-[88px] items-center justify-center rounded-full bg-[#fffdfa] text-[#ff3e09] shadow-[0_12px_24px_-14px_rgba(90,42,18,0.5)]">
                  <Icon aria-hidden className="size-9" strokeWidth={1.75} />
                </span>
              ),
            };
          })}
        />

        {/* Why a digital gift */}
        <section
          className="bg-[#fffdfa] px-5 py-16 md:py-[112px]"
          style={{ fontFamily: 'var(--font-mr-body)' }}>
          <div className="mx-auto max-w-[1180px]">
            <SectionHead
              eyebrow={page.reasons.eyebrow}
              title={page.reasons.title}
            />
            <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
              {page.reasons.items.map((reason, index) => (
                <li key={reason.title}>
                  <Rise delay={(index % 2) * 70} distance={14}>
                    <div className="h-full rounded-[24px] border border-[#e8ded3] bg-[#fbf4ec] p-6 md:p-8">
                      <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.03em] text-[#1b1b1b]">
                        {reason.title}
                      </h3>
                      <p className="mt-3 text-[16px] leading-[1.65] text-[#4a4642]">
                        {reason.body}
                      </p>
                    </div>
                  </Rise>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Questions, as text that is there whether or not one is opened. */}
        <section
          className="bg-[#fbf4ec] px-5 py-16 md:py-[112px]"
          style={{ fontFamily: 'var(--font-mr-body)' }}>
          <div className="mx-auto max-w-[820px]">
            <SectionHead eyebrow={page.faq.eyebrow} title={page.faq.title} />
            <div className="mt-10 flex flex-col gap-3">
              {page.faq.items.map((item, index) => (
                <details
                  key={item.q}
                  open={index === 0}
                  className="group rounded-[20px] border border-[#e8ded3] bg-[#fffdfa] px-5 py-4 md:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold leading-[1.35] text-[#1b1b1b] [&::-webkit-details-marker]:hidden">
                    <h3 className="text-[17px] font-semibold">{item.q}</h3>
                    <span
                      aria-hidden
                      className="flex size-7 flex-none items-center justify-center rounded-full border border-[#e8ded3] text-[18px] leading-none text-[#e34013] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[16px] leading-[1.65] text-[#4a4642]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <ClosingPanel
          ground="#fbf4ec"
          title={page.closing.title}
          body={page.closing.body}
          action={page.closing.action}
          onAction={start}
          second={{ label: page.closing.second, href: '/inspiration' }}
        />
      </main>
    </div>
  );
}
