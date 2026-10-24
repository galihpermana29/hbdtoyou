'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { RevealHeading } from '@/components/memoroll/landing/reveal-words';
import SectionPill from './section-pill';
import StartInvitationLink from './start-invitation-link';

type Template = {
  id: string;
  name: string;
  tags: string;
  /** What the caption under a collapsed card says it is. */
  shortTags: string;
  available: boolean;
  /** Made to order: drawn in code and sold by email, not by an image. */
  custom?: boolean;
  src: string;
  /** The tint the card takes when it is the open one. */
  accent: string;
  features: string[];
  /** Where a collapsed card sits in its 600px column, and how tall it is. */
  top: number;
  height: number;
};

const TEMPLATES: Template[] = [
  {
    id: 'noir',
    name: 'Noir Keepsake',
    tags: 'SAVE THE DATE · BLACK TIE',
    shortTags: 'SAVE THE DATE',
    available: true,
    src: '/digital-invitation/template-noir.jpg',
    accent: '#1b1b1b',
    features: [
      'Wax-seal opening',
      'Guest name greeting',
      'RSVP + schedule',
      'Memoroll camera',
    ],
    top: 40,
    height: 500,
  },
  {
    id: 'linen',
    name: 'Custom Design',
    tags: 'BESPOKE · BY REQUEST',
    shortTags: 'BESPOKE · BY REQUEST',
    available: false,
    custom: true,
    src: '',
    accent: '#ff3e09',
    features: [
      'Designed around your theme',
      'Your photos, colors & fonts',
      'RSVP + schedule',
      'MemoRoll camera',
    ],
    top: 40,
    height: 500,
  },
  {
    id: 'olive',
    name: 'Olive Garden',
    tags: 'GARDEN · EDITORIAL',
    shortTags: 'GARDEN · EDITORIAL',
    available: false,
    src: '/digital-invitation/template-olive.jpg',
    accent: '#47441f',
    features: [
      'Pressed-botanical cover',
      'Guest name greeting',
      'RSVP + schedule',
      'Memoroll camera',
    ],
    top: 40,
    height: 500,
  },
  {
    id: 'harlequin',
    name: 'Harlequin Gold',
    tags: 'BAROQUE · BOLD',
    shortTags: 'BAROQUE · BOLD',
    available: false,
    src: '/digital-invitation/template-harlequin.jpg',
    accent: '#380505',
    features: [
      'Gilded mirror frame',
      'Guest name greeting',
      'RSVP + schedule',
      'Memoroll camera',
    ],
    top: 40,
    height: 500,
  },
];

/** How long a card stays open before the next one takes over. */
const AUTOPLAY_MS = 4500;

const mono = { fontFamily: 'var(--font-mr-label)' };

/** One easing for every part of the switch so the pieces move as one. */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURATION = '700ms';

const move = (properties: string): CSSProperties => ({
  transitionProperty: properties,
  transitionDuration: DURATION,
  transitionTimingFunction: EASE,
});

const CTA_CLASS =
  'flex h-[47px] items-center justify-between rounded-lg px-5 text-[15px] font-semibold transition-[transform,background-color] duration-150 ease-out active:scale-[0.97]';

const SWATCHES = ['#1B1B1B', '#FF3E09', '#7A7A3A', '#C9A55A', '#E9C9C0'];

type CanvasSize = 'open' | 'closed';

/** The two sizes the card is drawn at; the values move with the card. */
const CANVAS = {
  open: {
    pad: 14,
    radius: 16,
    inner: '48px 20px 24px',
    arch: '110px 110px 10px 10px',
    script: 44,
    scriptLine: 46,
    sub: 12,
    subLine: 18,
  },
  closed: {
    pad: 10,
    radius: 10,
    inner: '40px 14px 20px',
    arch: '90px 90px 8px 8px',
    script: 36,
    scriptLine: 38,
    sub: 11,
    subLine: 17,
  },
} as const;

/** The Custom Design card: an arched keepsake with the palette it is made of. */
function CustomCanvas({ size }: { size: CanvasSize }) {
  const c = CANVAS[size];
  const t = move('padding,border-radius,font-size,line-height');

  return (
    <div
      className="flex size-full flex-col bg-[#fbf4ec]"
      style={{ padding: c.pad, ...t }}>
      <div
        className="flex min-h-0 flex-1 flex-col items-center justify-between overflow-hidden border border-[#1b1b1b]/[0.18]"
        style={{ padding: c.inner, borderRadius: c.arch, ...t }}>
        <div className="flex w-full flex-col items-center gap-3.5">
          <p
            className="whitespace-nowrap text-[10px] tracking-[1.6px] text-[#8a847d]"
            style={mono}>
            YOUR NAMES HERE
          </p>
          <p
            className="w-full text-center text-[#1b1b1b]"
            style={{
              fontFamily: 'var(--font-mr-script)',
              fontSize: c.script,
              lineHeight: `${c.scriptLine}px`,
              ...t,
            }}>
            Made just
            <br />
            for you
          </p>
          <span className="h-px w-8 bg-[#1b1b1b]/25" />
          <p
            className="w-full text-center text-[#4a4642]"
            style={{ fontSize: c.sub, lineHeight: `${c.subLine}px`, ...t }}>
            Your theme, photos, colors and fonts - designed from scratch.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex -space-x-1.5">
            {SWATCHES.map((color) => (
              <span
                key={color}
                className="size-[22px] rounded-full border-2 border-[#fbf4ec]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p
            className="whitespace-nowrap text-[9px] tracking-[1.4px] text-[#8a847d]"
            style={mono}>
            PALETTE · TYPE · STORY
          </p>
        </div>
      </div>
    </div>
  );
}

/** What a card shows of the invitation: its image, or the drawn custom card. */
function Preview({
  template,
  size,
  className,
}: {
  template: Template;
  size: CanvasSize;
  className?: string;
}) {
  if (template.custom) return <CustomCanvas size={size} />;

  return (
    <img
      src={template.src}
      alt={`${template.name} invitation preview`}
      className={className}
    />
  );
}

function Details({ template }: { template: Template }) {
  const { available, custom } = template;

  return (
    <div className="flex h-full min-w-0 flex-col justify-between gap-8 py-2">
      <div className="flex flex-col items-start gap-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] tracking-[1.2px] text-[#fbf4ec] ${
            custom
              ? 'bg-[#fbf4ec] !text-[#1b1b1b]'
              : available
                ? 'bg-[#ff3e09] text-[#fffdfa]'
                : 'bg-[#fbf4ec]/[0.08]'
          }`}
          style={mono}>
          <span
            className={`size-1.5 rounded-[3px] ${
              available && !custom ? 'bg-[#fffdfa]' : 'bg-[#ff3e09]'
            }`}
          />
          {custom
            ? 'MADE TO ORDER'
            : available
              ? 'AVAILABLE NOW'
              : 'COMING SOON'}
        </span>
        <h3 className="text-[28px] font-semibold leading-[normal] tracking-[-1px] text-[#fbf4ec]">
          {template.name}
        </h3>
        <p
          className="text-[11px] tracking-[1.2px] text-[#fbf4ec]/50"
          style={mono}>
          {template.tags}
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {template.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2.5 whitespace-nowrap border-b border-[#fbf4ec]/[0.12] pb-3 text-[14px] text-[#fbf4ec]/80">
            <img
              src={
                custom
                  ? '/digital-invitation/check-cream.svg'
                  : '/digital-invitation/check.svg'
              }
              alt=""
              width={14}
              height={14}
            />
            {feature}
          </li>
        ))}
      </ul>
      {available ? (
        <StartInvitationLink
          className={`${CTA_CLASS} bg-[#fbf4ec] text-[#1b1b1b] hover:bg-white`}>
          Use this template
          <img
            src="/digital-invitation/arrow-up-right.svg"
            alt=""
            width={18}
            height={18}
          />
        </StartInvitationLink>
      ) : custom ? (
        <a
          href={`mailto:memoify@memoify.live?subject=${encodeURIComponent(
            'Custom Design request'
          )}`}
          className={`${CTA_CLASS} bg-[#faf3eb] text-[#1b1b1b] hover:bg-white`}>
          Email us to request
          <img
            src="/digital-invitation/mail.svg"
            alt=""
            width={18}
            height={18}
          />
        </a>
      ) : (
        <a
          href={`mailto:memoify@memoify.live?subject=${encodeURIComponent(
            `Notify me when ${template.name} launches`
          )}`}
          className={`${CTA_CLASS} text-[#fbf4ec] hover:bg-[#fbf4ec]/10`}>
          Notify me at launch
          <img
            src="/digital-invitation/bell.svg"
            alt=""
            width={18}
            height={18}
          />
        </a>
      )}
    </div>
  );
}

/** Large screens: the open card widens and its neighbours fold to thumbnails. */
function Accordion({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="hidden h-[600px] gap-6 lg:grid"
      style={{
        // `fr` on every track, so the widths interpolate. 560 + 3 x 216 plus
        // the gaps is the design's 1280px.
        gridTemplateColumns: TEMPLATES.map((_, i) =>
          i === active ? '560fr' : '216fr'
        ).join(' '),
        ...move('grid-template-columns'),
      }}>
      {TEMPLATES.map((template, i) => {
        const open = i === active;
        const hidden = open ? {} : { inert: '' };

        return (
          <div key={template.id} className="relative h-[600px] min-w-0">
            <div
              className="absolute inset-x-0 overflow-hidden"
              style={{
                top: open ? 0 : template.top,
                height: open ? 600 : template.height,
                backgroundColor: open ? template.accent : '#fffdfa',
                borderRadius: open ? 24 : 16,
                outline:
                  open || !template.custom ? 'none' : '1px solid #e8ded3',
                outlineOffset: -0.5,
                ...move('top,height,background-color,border-radius'),
              }}>
              <div
                className="absolute overflow-hidden"
                style={{
                  left: open ? 28 : 10,
                  top: open ? 28 : 10,
                  width: open ? 262 : 'calc(100% - 20px)',
                  height: open ? 544 : template.height - 20,
                  borderRadius: open ? 16 : 10,
                  ...move('left,top,width,height,border-radius'),
                }}>
                <Preview
                  template={template}
                  size={open ? 'open' : 'closed'}
                  className="size-full object-cover"
                />
              </div>

              <div
                {...(hidden as object)}
                className="absolute bottom-7 left-[322px] top-7 w-[210px]"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'none' : 'translateX(20px)',
                  transitionProperty: 'opacity,transform',
                  transitionDuration: open ? '500ms' : '200ms',
                  transitionTimingFunction: EASE,
                  transitionDelay: open ? '280ms' : '0ms',
                }}>
                <Details template={template} />
              </div>
            </div>

            <div
              aria-hidden={open}
              className="absolute inset-x-0 bottom-0 flex items-start justify-between gap-2"
              style={{
                opacity: open ? 0 : 1,
                transitionProperty: 'opacity',
                transitionDuration: open ? '200ms' : '400ms',
                transitionDelay: open ? '0ms' : '300ms',
              }}>
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="whitespace-nowrap text-[18px] font-semibold leading-[23px] text-[#1b1b1b]">
                  {template.name}
                </p>
                <p
                  className="whitespace-nowrap text-[10px] leading-[13px] tracking-[1.2px] text-[#8a847d]"
                  style={mono}>
                  {template.shortTags}
                </p>
              </div>
              <p
                className={`whitespace-nowrap text-[10px] leading-[13px] tracking-[1px] ${
                  template.available || template.custom
                    ? 'text-[#ff3e09]'
                    : 'text-[#4a4642]'
                }`}
                style={mono}>
                {template.custom
                  ? 'EMAIL US ↗'
                  : template.available
                    ? 'AVAILABLE'
                    : 'COMING SOON'}
              </p>
            </div>

            {!open && (
              <button
                type="button"
                aria-label={`Show ${template.name}`}
                onClick={() => onSelect(i)}
                className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e34013]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Below lg there is no room to fold four cards: a thumbnail selector with one
 * open card under it. The selector sits above the card so a tap changes what
 * is right below the finger, instead of a card scrolled out of view.
 */
function Stack({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  const template = TEMPLATES[active];

  return (
    <div className="flex flex-col gap-4 lg:hidden">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {TEMPLATES.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.name}`}
            aria-pressed={i === active}
            onClick={() => onSelect(i)}
            className={`rounded-xl bg-[#fffdfa] p-1.5 text-left outline-offset-2 transition-[box-shadow,opacity,transform] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e34013] active:scale-[0.97] ${
              i === active
                ? 'shadow-[0_0_0_2px_#e34013]'
                : 'opacity-70 hover:opacity-100'
            }`}>
            {item.custom ? (
              <div className="aspect-[196/320] w-full overflow-hidden rounded-lg bg-[#fbf4ec] p-[8%]">
                <div className="flex size-full flex-col items-center justify-center rounded-t-[999px] rounded-b-[4px] border border-[#1b1b1b]/[0.18] px-1 text-center font-[family-name:var(--font-mr-script)] text-[12px] leading-[1.1] text-[#1b1b1b] sm:text-[18px]">
                  Made just for you
                </div>
              </div>
            ) : (
              <img
                src={item.src}
                alt=""
                className="aspect-[196/320] w-full rounded-lg object-cover"
              />
            )}
            <span className="mt-2 line-clamp-2 block min-h-[2.4em] px-0.5 text-[11px] font-semibold leading-[1.2] text-[#1b1b1b] sm:text-[12px]">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      <div
        className="overflow-hidden rounded-3xl p-5 sm:p-7"
        style={{
          backgroundColor: template.accent,
          ...move('background-color'),
        }}>
        <div
          key={template.id}
          className="flex animate-template-in flex-col gap-6 motion-reduce:animate-none sm:flex-row sm:gap-8">
          <div className="mx-auto aspect-[262/544] w-full max-w-[262px] overflow-hidden rounded-2xl sm:mx-0 sm:w-[262px] sm:shrink-0">
            <Preview
              template={template}
              size="open"
              className="size-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 sm:min-h-[544px]">
            <Details template={template} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvitationTemplates() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Keyed on `active`, so a click restarts the countdown from the chosen card.
  useEffect(() => {
    if (paused || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % TEMPLATES.length),
      AUTOPLAY_MS
    );
    return () => window.clearTimeout(timer);
  }, [active, paused, inView]);

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      id="templates"
      aria-label="Our templates"
      className="bg-[#fffdfa] px-4 py-16 sm:px-6 md:px-10 lg:pb-[120px] lg:pt-[140px] xl:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 lg:gap-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[720px] flex-col items-start gap-5">
            <SectionPill>Our Templates</SectionPill>
            <RevealHeading className="text-[36px] font-semibold leading-[1.05] tracking-[-1.4px] text-[#1b1b1b] md:text-[56px] md:leading-[59px] md:tracking-[-2px]">
              Pick the first page of your love story.
            </RevealHeading>
          </div>
          <p className="max-w-[380px] text-[16px] leading-[26px] text-[#4a4642] md:text-[17px]">
            Invitation websites designed for modern celebrations. Every template
            includes Memoroll, free with the Wedding Plan.
          </p>
        </div>

        <Accordion active={active} onSelect={setActive} />
        <Stack active={active} onSelect={setActive} />
      </div>
    </section>
  );
}
