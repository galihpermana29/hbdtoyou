import Link from 'next/link';

import {
  createHref,
  templateSteps,
  type TemplatePage,
} from '@/lib/template-pages';

/**
 * The words under a template's sample: what the gift is, how to make it in
 * three steps, a few questions, and a button into the Create Flow with this
 * template chosen. Fed by lib/template-pages.ts.
 *
 * It starts below the sample, so the sample looks exactly as it did on
 * arrival; the guide is what a reader scrolls on to, and what a search
 * engine reads. It renders on the server, with no script, and the questions
 * are plain text, the same words the page's FAQPage data carries.
 *
 * The extra room at the bottom is for the controls some samples pin to the
 * bottom of the window (Spotify's player, the floating music button), so the
 * last answer and the button are never under them. It is stacked above a
 * sample's own fixed side panels (Spotify's sidebar is z-40) and below its
 * player bar, so once scrolled to, it is read whole and the player stays.
 */
export default function TemplateGuide({ page }: { page: TemplatePage }) {
  const steps = templateSteps(page);
  return (
    <section
      aria-labelledby="template-guide-title"
      className="relative z-[45] border-t border-[#e8ded3] bg-[#fbf4ec] px-5 pb-32 pt-14 text-[#1b1b1b] md:pt-20">
      <div className="mx-auto max-w-[880px]">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#e34013]">
          About this template
        </p>
        <h2
          id="template-guide-title"
          className="mt-3 text-[30px] font-bold leading-[1.1] tracking-[-0.03em] md:text-[42px]">
          {page.name}
        </h2>
        <div className="mt-5 flex max-w-[680px] flex-col gap-4 text-[16px] leading-[1.65] text-[#4a4642] md:text-[17px]">
          {page.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {page.notAffiliated && (
            <p className="text-[14px] text-[#8a847d]">{page.notAffiliated}</p>
          )}
        </div>
        <div className="mt-8">
          <Link
            href={createHref(page)}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff3e09] px-6 text-[16px] font-semibold text-white no-underline transition hover:bg-[#e63607] md:h-14 md:px-7 md:text-[17px]">
            Create this gift
          </Link>
        </div>

        <h3 className="mt-16 text-[22px] font-bold tracking-[-0.02em] md:text-[26px]">
          How to make it
        </h3>
        <ol className="mt-6 grid list-none gap-4 p-0 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-[20px] border border-[#e8ded3] bg-[#fffdfa] p-5">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#1b1b1b] text-[14px] font-semibold text-white">
                {index + 1}
              </span>
              <p className="mt-4 text-[17px] font-semibold">{step.title}</p>
              <p className="mt-2 text-[15px] leading-[1.6] text-[#4a4642]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <h3 className="mt-16 text-[22px] font-bold tracking-[-0.02em] md:text-[26px]">
          Questions
        </h3>
        <dl className="mt-6 divide-y divide-[#e8ded3] border-y border-[#e8ded3]">
          {page.faq.map((item) => (
            <div key={item.q} className="py-5">
              <dt className="text-[17px] font-semibold">{item.q}</dt>
              <dd className="ml-0 mt-2 text-[15px] leading-[1.65] text-[#4a4642] md:text-[16px]">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href={createHref(page)}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff3e09] px-6 text-[16px] font-semibold text-white no-underline transition hover:bg-[#e63607] md:h-14 md:px-7 md:text-[17px]">
            Create this gift
          </Link>
          <Link
            href="/templates"
            className="text-[15px] font-semibold text-[#1b1b1b] underline underline-offset-4">
            See every template
          </Link>
        </div>
      </div>
    </section>
  );
}
