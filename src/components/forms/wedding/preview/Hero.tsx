'use client';

/**
 * Wedding Template 1 — Hero ("You're Invited to"). Figma node 312:1632.
 * Fixed 375x812 mobile composition, built pixel-accurate to the design.
 * The iOS status bar in the mockup (9:41 / battery) is intentionally omitted:
 * a real device renders its own, so a faux bar would double up.
 *
 * Interaction: while the invitation is sealed, the two cards are tucked DOWN
 * inside the envelope pocket (behind the pocket front, z-index below it).
 * Clicking "Open Invitation" slides the cards up and out (z-index above the
 * pocket). NOTE: the flap does not literally unfold - that needs a "closed
 * envelope" asset that Figma export is currently rate-limited on.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  pickPhoto,
  type WeddingTemplate1Content,
} from '../wedding-invitation-types';
import { FitText } from './FitText';
import { AutoFitText } from './AutoFitText';
import { EASE } from '@/components/wedding/wedding-template-1/variants';

const ASSET = '/templates/wedding-template-1';

function formatWeddingDateLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'May 3rd, 2026';
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';
  const month = d.toLocaleString('en-US', { month: 'long' });
  return `${month} ${day}${suffix}, ${d.getFullYear()}`;
}

const cardShadow = {
  filter:
    'drop-shadow(1.783px 0px 6.686px rgba(0,0,0,0.1)) drop-shadow(0px 1.783px 5.705px rgba(0,0,0,0.17))',
};

/** How far (px) the cards are tucked down into the envelope when closed. */
const TUCK = 58;

/** The envelope with the two cards (save-the-date + couple photo) tucked inside. */
function EnvelopeCard({
  opened,
  reduce,
  content,
}: {
  opened: boolean;
  reduce: boolean | null;
  content: WeddingTemplate1Content;
}) {
  const couplePhoto = pickPhoto(
    content.heroPhotos,
    0,
    `${ASSET}/couple-photo.png`
  );
  const dateLabel = formatWeddingDateLabel(content.weddingDateIso);
  const coupleLabel = `${content.groomName} & ${content.brideName}`;
  return (
    <div className="absolute left-1/2 top-[31px] h-[442px] w-[387px] -translate-x-1/2">
      {/* envelope flap (back layer) */}
      <div className="absolute left-[7px] top-[25px] z-0 h-[171.869px] w-[370.514px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute left-0 top-[-34.32%] h-[323.37%] w-full max-w-none"
            src={`${ASSET}/envelope.png`}
          />
        </div>
      </div>

      {/* cards group — tucked inside when closed, slides up/out when opened */}
      <motion.div
        className="absolute left-[21px] top-[41.67px] h-[356.062px] w-[345px]"
        style={{ zIndex: opened ? 30 : -1 }}
        initial={false}
        animate={{ y: opened ? 0 : TUCK, scale: opened ? 1 : 0.82 }}
        transition={{ duration: reduce ? 0 : 0.95, ease: EASE }}>
        {/* couple photo card (tilted -8.41deg) */}
        <div className="absolute left-0 top-[141.41px] flex h-[214.646px] w-[287.231px] items-center justify-center">
          <motion.div
            className="flex-none"
            initial={false}
            animate={{ scale: 1, rotate: -8.41 }}
            transition={{
              duration: reduce ? 0 : 0.6,
              ease: EASE,
              delay: reduce ? 0 : 0.25,
            }}>
            <div
              className="relative h-[177.944px] w-[264.046px]"
              style={cardShadow}>
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                src={`${ASSET}/card-paper.jpg`}
              />
              <div className="absolute left-[4.7px] top-[4.7px] h-[167.769px] w-[255.436px] border-[1.044px] border-solid border-[#201e1f]" />
              <div className="absolute left-1/2 top-[11.74px] h-[132.023px] w-[232.736px] -translate-x-1/2">
                <img
                  alt={coupleLabel}
                  className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                  src={couplePhoto}
                />
              </div>
              <p className="absolute left-[105.41px] top-[147.16px] whitespace-nowrap font-[family-name:var(--font-wt1-script)] text-[16.699px] leading-normal text-black">
                {dateLabel}
              </p>
            </div>
          </motion.div>
        </div>

        {/* save the date card (tilted +6.05deg) */}
        <div className="absolute left-[63.66px] top-0 flex h-[204.793px] w-[281.337px] items-center justify-center">
          <motion.div
            className="flex-none"
            initial={false}
            animate={{ scale: 1, rotate: 6.05 }}
            transition={{
              duration: reduce ? 0 : 0.6,
              ease: EASE,
              delay: reduce ? 0 : 0.4,
            }}>
            <div
              className="relative h-[177.944px] w-[264.046px]"
              style={cardShadow}>
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                src={`${ASSET}/card-paper.jpg`}
              />
              <div className="absolute left-[4.7px] top-[4.7px] h-[167.769px] w-[255.436px] border-[1.044px] border-solid border-[#201e1f]" />

              {/* SAVE THE DATE lettering */}
              <div className="absolute left-[calc(50%-0.26px)] top-[-0.26px] flex -translate-x-1/2 flex-col items-center leading-normal text-black">
                <div className="relative mb-[-3.131px] h-[64.968px] w-[98.626px] whitespace-nowrap">
                  <p className="absolute left-0 top-[2.61px] font-[family-name:var(--font-wt1-script)] text-[62.62px]">
                    S
                  </p>
                  <p className="absolute left-[32.62px] top-[18.53px] font-[family-name:var(--font-wt1-serif)] text-[46.965px]">
                    AVE
                  </p>
                </div>
                <p className="w-[163.855px] font-[family-name:var(--font-wt1-serif)] text-[46.965px]">
                  THE DATE
                </p>
              </div>

              {/* Venue + couple name stacked and centered in the lower card.
                  Groom on one line, "& bride" on the next, at a fixed readable
                  size; long names wrap within the card rather than shrinking or
                  overflowing off the edge. */}
              <div className="absolute left-1/2 top-[110px] flex w-[240px] -translate-x-1/2 flex-col items-center text-center text-black">
                <FitText
                  maxWidth={210}
                  className="font-[family-name:var(--font-wt1-sans)] text-[6.262px] uppercase tracking-[0.1252px] text-black">
                  {content.venueName}
                </FitText>
                <AutoFitText
                  maxFontSize={24}
                  minFontSize={12}
                  maxHeight={48}
                  className="mt-[4px] w-[228px] leading-[1.05]">
                  <span className="block font-[family-name:var(--font-wt1-script)]">
                    {content.groomName}
                  </span>
                  <span className="block font-[family-name:var(--font-wt1-script)]">
                    &amp; {content.brideName}
                  </span>
                </AutoFitText>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* envelope body (front pocket) — hides the tucked cards */}
      <div className="absolute left-[7px] top-[194.87px] z-10 h-[247.13px] w-[370.514px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute left-0 top-[-91.8%] h-[224.89%] w-full max-w-none"
            src={`${ASSET}/envelope.png`}
          />
        </div>
      </div>

      {/* wax seal (front-most) */}
      <div className="absolute left-[17.91px] top-[101.04px] z-40 flex h-[69.913px] w-[69.18px] items-center justify-center">
        <div className="flex-none rotate-[-13.79deg]">
          <div className="relative h-[58px] w-[57px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-[-21.14%] top-[-36.63%] h-[174.45%] w-[142.11%] max-w-none"
                src={`${ASSET}/wax-seal.png`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  recipientMode = false,
}: {
  content?: WeddingTemplate1Content;
  recipientMode?: boolean;
}) {
  const reduce = useReducedMotion();
  const [opened, setOpened] = useState(!recipientMode);

  // The page's own scroll is deliberately left alone, unlike the published
  // viewer this composition mirrors. This copy of the template is only ever
  // shown inside something else - the panel beside the Create Flow, or the
  // player over it - and a preview that locked the page it sits on would take
  // the whole flow hostage until someone opened an envelope in a phone.
  const envelopeOpened = recipientMode ? opened : true;

  const fadeUpMount = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? undefined : { duration: 0.6, ease: EASE, delay },
  });

  return (
    <section className="relative h-[812px] w-full overflow-hidden bg-[#090909]">
      {/* faint decorative cards behind the envelope */}
      <div className="absolute left-[-32px] top-[16px] flex h-[313px] w-[235px] items-center justify-center">
        <div className="rotate-180 -scale-y-100">
          <div className="relative h-[313px] w-[235px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={`${ASSET}/hero-bg-card.png`}
            />
          </div>
        </div>
      </div>
      <div className="absolute left-[197px] top-[9px] h-[313px] w-[235px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/hero-bg-card.png`}
        />
      </div>

      <EnvelopeCard opened={envelopeOpened} reduce={reduce} content={content} />

      {/* torn paper edge at the bottom */}
      <div className="absolute left-1/2 top-[666px] flex h-[147px] w-[375px] -translate-x-1/2 items-center justify-center">
        <div className="flex-none -rotate-90">
          <div className="relative h-[375px] w-[147px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-[-81.51%] top-[-13.38%] h-[134.36%] w-[192.99%] max-w-none"
                src={`${ASSET}/torn-paper.png`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Open Invitation — published recipient flow only */}
      {recipientMode && (
        <div className="absolute left-1/2 top-[487px] z-40 -translate-x-1/2">
          <motion.button
            type="button"
            onClick={() => setOpened(true)}
            aria-label="Open invitation"
            className="flex items-center justify-center border border-solid border-[#fafafa] p-[10px]"
            initial={false}
            animate={{ opacity: opened ? 0 : 1 }}
            transition={reduce ? undefined : { duration: 0.5, ease: EASE }}
            style={{ pointerEvents: opened ? 'none' : 'auto' }}>
            <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] leading-normal text-[#fafafa]">
              Open Invitation
            </p>
          </motion.button>
        </div>
      )}

      {/* You're Invited heading + subtitle */}
      <motion.div
        className="absolute left-[16px] top-[545px] flex w-[343px] flex-col items-start gap-[2px]"
        {...fadeUpMount(0.35)}>
        <div className="relative h-[82px] w-full">
          <p className="absolute left-[43px] top-0 whitespace-nowrap font-[family-name:var(--font-wt1-script)] text-[64px] leading-normal text-[rgba(250,250,250,0.98)]">
            You&rsquo;re Invited
          </p>
          <div className="absolute left-0 top-[74px] h-[0.5px] w-[343px] bg-[#fafafa]" />
        </div>
        <p className="w-full text-center font-[family-name:var(--font-wt1-mono)] text-[12px] leading-normal text-white">
          As we begin our journey together, we&rsquo;d love for you to join us
          in celebrating our big day.
        </p>
      </motion.div>
    </section>
  );
}
