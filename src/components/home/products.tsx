import { ArrowUpRight } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import c1 from '@/assets/c1.png';
import c2 from '@/assets/c2.png';
import c3 from '@/assets/c3.png';

import { Rise, SectionHead, press } from './ui';

/**
 * Everything Memoify makes, as one board. Each card is a door to a product.
 *
 * Cards rise in as a wave in reading order with shrinking gaps. A card's
 * picture leans in 3% under a real pointer (hover is gated: a tap on a phone
 * must not leave it stuck), and the whole card gives 3% when pressed.
 */

const lean =
  'transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03]';

function Door({
  href,
  title,
  body,
  tag,
  tone = 'paper',
  className = '',
  children,
}: {
  href: string;
  title: string;
  body: string;
  tag?: string;
  tone?: 'paper' | 'ink' | 'flame';
  className?: string;
  children?: ReactNode;
}) {
  const ground =
    tone === 'ink'
      ? 'bg-[#1b1b1b] text-[#fbf4ec]'
      : tone === 'flame'
        ? 'bg-[#ff3e09] text-white'
        : 'bg-[#fbf4ec] text-[#1b1b1b]';
  const soft =
    tone === 'ink'
      ? 'text-[#cfc7bd]'
      : tone === 'flame'
        ? 'text-white/85'
        : 'text-[#4a4642]';
  return (
    <Link
      href={href}
      prefetch
      className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] ${ground} ${press} ${className}`}>
      <div className="flex items-start justify-between gap-4 p-6 md:p-7">
        <div>
          <h3 className="flex items-center gap-2 text-[22px] font-bold leading-[1.2] tracking-[-0.03em] md:text-[26px]">
            {title}
            {tag ? (
              <span className="rounded-full bg-[#ff3e09] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] text-white">
                {tag}
              </span>
            ) : null}
          </h3>
          <p
            className={`mt-2 max-w-[380px] text-[15px] leading-[1.55] ${soft}`}>
            {body}
          </p>
        </div>
        <span
          aria-hidden
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
            tone === 'paper'
              ? 'bg-[#1b1b1b] text-white'
              : 'bg-white text-[#1b1b1b]'
          }`}>
          <ArrowUpRight className="size-[18px] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-[2px] [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-[2px]" />
        </span>
      </div>
      {children}
    </Link>
  );
}

function Picture({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div className="mt-auto overflow-hidden px-6 pb-6 md:px-7 md:pb-7">
      <div className="overflow-hidden rounded-[20px]">
        <Image
          src={src}
          alt={alt}
          sizes="(min-width: 1024px) 360px, 90vw"
          className={`h-[200px] w-full object-cover object-top md:h-[220px] ${lean}`}
        />
      </div>
    </div>
  );
}

export default function HomeProducts() {
  return (
    <section
      className="bg-[#fffdfa] px-5 pb-16 md:pb-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto max-w-[1180px]">
        <SectionHead
          eyebrow="What you can make"
          title="One place for every kind of keepsake"
          body="A gift to open, a book to flip through, a letter to keep, a party to shoot."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 lg:grid-cols-12">
          <Rise delay={0} distance={20} className="lg:col-span-7">
            <Door
              href="/templates"
              tone="ink"
              title="Website gifts"
              body="Their story as a series, a playlist, a magazine, a front page or a game. One link, opened on any phone.">
              <div className="mt-auto overflow-hidden px-6 md:px-7">
                <div className="overflow-hidden rounded-t-[16px] border border-b-0 border-white/15">
                  <img
                    src="/home/gift-series.webp"
                    alt="A website gift made as a streaming series page"
                    loading="lazy"
                    decoding="async"
                    className={`h-[220px] w-full origin-top object-cover object-left-top md:h-[300px] ${lean}`}
                  />
                </div>
              </div>
            </Door>
          </Rise>

          <Rise delay={90} distance={14} className="lg:col-span-5">
            <Door
              href="/memoroll"
              tone="flame"
              tag="New"
              title="MemoRoll"
              body="A shared disposable camera for your party. Guests shoot, the photos develop when the night is over.">
              <div className="relative mt-auto h-[220px] overflow-hidden md:h-[300px]">
                {[
                  [
                    '/memoroll-landing/arc-2.webp',
                    'left-[8%] top-[18%] -rotate-[9deg]',
                  ],
                  [
                    '/memoroll-landing/arc-4.webp',
                    'right-[8%] top-[22%] rotate-[8deg]',
                  ],
                  [
                    '/memoroll-landing/arc-3.webp',
                    'left-1/2 top-[6%] -translate-x-1/2 rotate-[1deg]',
                  ],
                ].map(([src, pose]) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`absolute w-[42%] max-w-[190px] rounded-[6px] border-[5px] border-b-[18px] border-white object-cover shadow-[0_12px_24px_rgba(90,42,18,0.25)] ${pose}`}
                  />
                ))}
              </div>
            </Door>
          </Rise>

          <Rise delay={0} distance={16} className="lg:col-span-4">
            <Door
              href="/scrapbook"
              title="Scrapbooks"
              body="Upload your photos and let the AI lay out a book you can flip through.">
              <Picture
                src={c1}
                alt="Scrapbook pages made from a couple's photos"
              />
            </Door>
          </Rise>
          <Rise delay={80} distance={12} className="lg:col-span-4">
            <Door
              href="/journal"
              title="Journals"
              body="A love letter written like a research paper: abstract, preamble and all.">
              <Picture
                src={c2}
                alt="A letter laid out as an academic journal"
              />
            </Door>
          </Rise>
          <Rise delay={140} distance={10} className="lg:col-span-4">
            <Door
              href="/photobox"
              title="Photobox"
              body="A photo booth in the browser, with frames worth printing.">
              <Picture src={c3} alt="Photo-booth strips with playful frames" />
            </Door>
          </Rise>
        </div>
      </div>
    </section>
  );
}
