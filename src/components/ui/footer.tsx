import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { badge as wordmark, mono as label } from './brand-fonts';
import ElasticWordmark from './elastic-wordmark';
import type { LanguageVersions } from '@/lib/page-language';

import { SITE_COPY, type SiteCopy, type SiteLanguage } from './navbar-copy';

/**
 * The site footer. Its faces are applied on the footer's own element, so the
 * rest of the product keeps the typeface it already has. The label and
 * wordmark faces come from `brand-fonts.ts`, shared with the MemoRoll landing.
 *
 * It speaks the page's language: Indonesian on `/id` and below, English
 * everywhere else (navbar-copy.ts). On an Indonesian page "See our pricing"
 * goes to the Indonesian home page's pricing.
 *
 * On a page written in both languages it also links the two (`versions`):
 * the navbar's EN / ID switch is the one people use, and this line is the
 * plain link pair in the body of every such page, for crawlers and for
 * anyone who reads to the end.
 */
const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

/** The footer's columns, in the page's language. */
function columns(t: SiteCopy['footer']) {
  return [
    {
      key: 'contact',
      title: t.contact,
      items: [
        { text: 'memoify@memoify.live', href: 'mailto:memoify@memoify.live' },
        { text: '+62 895 3832 33303', href: 'tel:+62895383233303' },
        { text: 'Batam, Kepulauan Riau, Indonesia' },
      ],
    },
    {
      key: 'products',
      title: t.products,
      items: [
        { text: t.invitations, href: '/wedding-invitation' },
        { text: 'MemoRoll', href: '/memoroll' },
        { text: 'Photobox', href: '/photobox' },
        { text: t.gift, href: '/templates' },
      ],
    },
    {
      key: 'follow',
      title: t.follow,
      items: [
        {
          text: 'Instagram',
          href: 'https://instagram.com/memoify.live',
          external: true,
        },
        {
          text: 'TikTok',
          href: 'https://www.tiktok.com/@memoify.live',
          external: true,
        },
      ],
    },
  ];
}

const linkClass = 'transition-colors hover:text-[#ff3e09]';

const LANGUAGES = [
  ['en', 'ENGLISH'],
  ['id', 'BAHASA INDONESIA'],
] as const;

export function Footer({
  lang = 'en',
  versions = null,
}: {
  lang?: SiteLanguage;
  /** The page's two addresses, when it has both. */
  versions?: LanguageVersions | null;
}) {
  const t = SITE_COPY[lang].footer;
  const pricing = lang === 'id' ? '/id#pricing' : '/#pricing';
  return (
    <footer
      className={`${body.className} overflow-hidden bg-[#1b1b1b] text-[#fbf4ec]`}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-6 pt-14 md:px-10 lg:gap-[72px] lg:px-20 lg:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex flex-col items-start justify-between gap-8 lg:w-[420px]">
            <p className="text-[24px] font-semibold leading-[1.25] tracking-[-0.8px] md:text-[28px] md:leading-[35px]">
              {t.tagline}
            </p>
            <Link
              href={pricing}
              className="flex h-14 items-center gap-[10px] rounded-full bg-[#ff3e09] px-7 text-[16px] font-semibold text-[#fffdfa] transition-colors hover:bg-[#e63508]">
              {t.pricing}
              <Image
                src="/footer-arrow.svg"
                alt=""
                width={18}
                height={18}
                unoptimized
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:flex lg:gap-24">
            {columns(t).map((column) => (
              <div
                key={column.key}
                className={`flex flex-col items-start gap-[14px] text-[15px] leading-[normal] ${
                  column.key === 'contact' ? 'col-span-2 sm:col-span-1' : ''
                }`}>
                <p
                  style={label.style}
                  className="text-[11px] tracking-[1.2px] text-[#fbf4ec]/50">
                  {column.title}
                </p>
                {column.items.map((item) =>
                  item.href ? (
                    item.external ? (
                      <a
                        key={item.text}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}>
                        {item.text}
                      </a>
                    ) : item.href.startsWith('/') ? (
                      <Link
                        key={item.text}
                        href={item.href}
                        className={linkClass}>
                        {item.text}
                      </Link>
                    ) : (
                      <a key={item.text} href={item.href} className={linkClass}>
                        {item.text}
                      </a>
                    )
                  ) : (
                    <p key={item.text} className="max-w-[200px]">
                      {item.text}
                    </p>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          style={label.style}
          className={`flex flex-col gap-2 border-t border-[#fbf4ec]/15 pt-6 text-[11px] tracking-[1.2px] text-[#fbf4ec]/50 sm:flex-row sm:justify-between`}>
          <p style={label.style}>
            {/* The year Memoify started, fixed on purpose (owner,
                2026-11-18); it used to follow the calendar. */}
            © 2024 MEMOIFY. {t.rights}
          </p>
          {versions ? (
            <nav aria-label={t.language} className="flex items-center gap-2">
              {LANGUAGES.map(([code, name], index) => (
                <span key={code} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden>·</span> : null}
                  <a
                    href={versions[code]}
                    hrefLang={code}
                    lang={code}
                    aria-current={code === lang ? 'page' : undefined}
                    style={label.style}
                    className={
                      code === lang
                        ? 'text-[#fbf4ec]'
                        : 'transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#ff3e09]'
                    }>
                    {name}
                  </a>
                </span>
              ))}
            </nav>
          ) : null}
          <p style={label.style}>{t.madeIn}</p>
        </div>

        {/* The wordmark is cropped at the foot of the page, as in the design:
            the box is 0.605em tall, short of the 0.9em line it is set in. */}
        <ElasticWordmark
          text="MEMOIFY"
          style={wordmark.style}
          className="-mx-2 flex h-[0.605em] select-none justify-center whitespace-pre text-[26.39vw] leading-[0.9] tracking-[-0.0105em] text-[#ff3e09] min-[1440px]:text-[380px]"
        />
      </div>
    </footer>
  );
}
