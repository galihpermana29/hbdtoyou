import { DM_Mono, Passion_One, Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import ElasticWordmark from './elastic-wordmark';

/**
 * The site footer. Its three faces are loaded here and applied on the footer's
 * own element, so the rest of the product keeps the typeface it already has.
 */
const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

const label = DM_Mono({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const wordmark = Passion_One({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const COLUMNS = [
  {
    title: 'CONTACT',
    items: [
      { text: 'memoify@memoify.live', href: 'mailto:memoify@memoify.live' },
      { text: '+62 895 3832 33303', href: 'tel:+62895383233303' },
      { text: 'Batam, Kepulauan Riau, Indonesia' },
    ],
  },
  {
    title: 'PRODUCTS',
    items: [
      { text: 'Digital Invitations', href: '/wedding-invitation' },
      { text: 'MemoRoll', href: '/memoroll' },
      { text: 'Photobox', href: '/photobox' },
      { text: 'Digital Gift', href: '/templates' },
    ],
  },
  {
    title: 'FOLLOW',
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

/** The padding grows the tap area to ~33px; the negative margin keeps the layout. */
const linkClass = '-my-[7px] py-[7px] transition-colors hover:text-[#ff3e09]';

export function Footer() {
  return (
    <footer
      className={`${body.className} overflow-hidden bg-[#1b1b1b] text-[#fbf4ec]`}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-6 pt-14 md:px-10 lg:gap-[72px] lg:px-20 lg:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex flex-col items-start justify-between gap-8 lg:w-[420px]">
            <p className="text-[24px] font-semibold leading-[1.25] tracking-[-0.8px] md:text-[28px] md:leading-[35px]">
              Add personal touches and let your memories feels YOU!
            </p>
            <Link
              href="/payment?type=premium"
              className="flex h-14 items-center gap-[10px] rounded-full bg-[#ff3e09] px-7 text-[16px] font-semibold text-[#fffdfa] transition-colors hover:bg-[#e63508]">
              See our pricing
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
            {COLUMNS.map((column) => (
              <div
                key={column.title}
                className={`flex flex-col items-start gap-[14px] text-[15px] leading-[normal] ${
                  column.title === 'CONTACT' ? 'col-span-2 sm:col-span-1' : ''
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
            © {new Date().getFullYear()} MEMOIFY. ALL RIGHTS RESERVED.
          </p>
          <p style={label.style}>MADE IN INDONESIA WITH LOVE ♡</p>
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
