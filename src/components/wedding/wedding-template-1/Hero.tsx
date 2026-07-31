'use client';

/**
 * Wedding Template 1 — Hero ("You're Invited to"). Figma node 312:1632.
 * Fixed 375x812 mobile composition, built pixel-accurate to the design.
 * The iOS status bar in the mockup (9:41 / battery) is intentionally omitted:
 * a real device renders its own, so a faux bar would double up.
 *
 * Interaction: on load the two cards are tucked DOWN inside the envelope pocket
 * (behind the pocket front, z-index below it) and the page is scroll-locked.
 * Clicking "Open Invitation" slides the cards up and out (z-index above the
 * pocket) and unlocks scrolling. NOTE: the flap does not literally unfold — that
 * needs a "closed envelope" asset that Figma export is currently rate-limited on.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { EASE } from './variants';

const ASSET = '/templates/wedding-template-1';

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
}: {
  opened: boolean;
  reduce: boolean | null;
}) {
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
            <div className="relative h-[177.944px] w-[264.046px]" style={cardShadow}>
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                src={`${ASSET}/card-paper.jpg`}
              />
              <div className="absolute left-[4.7px] top-[4.7px] h-[167.769px] w-[255.436px] border-[1.044px] border-solid border-[#201e1f]" />
              <div className="absolute left-1/2 top-[11.74px] h-[132.023px] w-[232.736px] -translate-x-1/2">
                <img
                  alt="Elias & Freya"
                  className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                  src={`${ASSET}/couple-photo.png`}
                />
              </div>
              <p className="absolute left-[105.41px] top-[147.16px] whitespace-nowrap font-[family-name:var(--font-wt1-script)] text-[16.699px] leading-normal text-black">
                May 3rd, 2026
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
            <div className="relative h-[177.944px] w-[264.046px]" style={cardShadow}>
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

              <p className="absolute left-[calc(50%-51.14px)] top-[133.59px] whitespace-nowrap font-[family-name:var(--font-wt1-script)] text-[26.092px] text-black">
                Elias & Freya
              </p>
              <p className="absolute left-[calc(50%-44.88px)] top-[118.98px] whitespace-nowrap font-[family-name:var(--font-wt1-sans)] text-[6.262px] uppercase tracking-[0.1252px] text-black">
                Mandarin Hotel, Jakarta
              </p>
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

export default function Hero() {
  const reduce = useReducedMotion();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opened]);

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

      <EnvelopeCard opened={opened} reduce={reduce} />

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

      {/* Open Invitation */}
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
          As we begin our journey together, we&rsquo;d love for you to join us in
          celebrating our big day.
        </p>
      </motion.div>
    </section>
  );
}
