'use client';

/**
 * Wedding Template 1 - Event Details ("Venue & Details"). Figma node 312:1651.
 * Venue info, a tilted polaroid, a LIVE countdown, and the RSVP Now control a
 * guest replies to the invitation from.
 * The countdown ticks every second toward the wedding's own date and time and
 * clamps to 0 once past. To avoid an SSR/client hydration mismatch the digits
 * render the design's "08" placeholders until mounted, then go live. A wedding
 * whose date cannot be read - a draft opened before the couple picked one -
 * draws no countdown and no date line at all, because arithmetic against
 * nothing prints NaN and a guest should never read that.
 *
 * The venue's name and its written address are the couple's own words and are
 * fitted to the box the design draws them in rather than set at a fixed size:
 * see `VENUE_NAME_BOX_HEIGHT` below for why that box is the whole section's
 * business and not only theirs. Everything else here is the design's - the
 * countdown's units, the reception's lead, the two controls - or is derived
 * from an answer whose shape cannot vary, which is what the date and the
 * reception's times are.
 *
 * Animation: a subtle fade-up reveal on scroll, per section.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { fadeUp, fadeUpCenter } from './variants';
import { useWeddingReveal } from './use-wedding-reveal';
import { AutoFitText } from './AutoFitText';
import { formatWeddingDateLabel } from './wedding-date-label';
import { directionsTo } from '@/components/forms/wedding/wedding-map';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  pickPhoto,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

const ASSET = '/templates/wedding-template-1';

/**
 * The two boxes the design draws the venue's name and its written address in.
 *
 * Each is both the height its words are fitted to and the height its box is
 * held at, which is why one number says both rather than a maximum and a
 * minimum saying it twice. A line that has stepped down draws smaller inside
 * the same box rather than dragging everything under it up the page.
 *
 * The design draws the two of them in one 147px-wide frame 94px tall - 28 for
 * the name, 6 between, 60 for the address - and hangs that, the 16px under it
 * and the 34px View Location box off a column 144px tall, which it then centres
 * against the polaroid beside it (Figma node 312:1651, `Frame 32` inside
 * `Frame 33` inside `Frame 35`).
 *
 * Centring is why these two numbers are the whole section's business rather
 * than only their own. A column that changes height takes half of the change
 * upwards and half down, so before this the venue whose address ran to seven
 * lines had its name 31px higher up the page than the design draws it and its
 * View Location control 31px lower, and a column that merely stepped *down* a
 * size and came up short of its box moved everything the other way by 5. Both
 * are invisible to the check, which never asserts a position within a section,
 * and nothing overflowed to say so either.
 *
 * Held at 28 and 60, the column is the 144 the design draws whatever the couple
 * answered - unless a line has reached the floor below and its box has had to
 * grow, which is the one case that still moves anything and is deliberate.
 */
const VENUE_NAME_BOX_HEIGHT = 28;
const VENUE_ADDRESS_BOX_HEIGHT = 60;

/**
 * The largest either line is ever set in, and the smallest.
 *
 * The ceilings are the 12px and 10px the design sets them in, and they are
 * ceilings rather than sizes because both are the couple's own words: a venue
 * with a longer name or a longer address is set a little smaller rather than
 * shifted or cut. The floor is the 8px the design sets the smallest words on
 * the invitation in, and it is the same floor the Bride & Groom's Introduction
 * and the Love Story stop at.
 *
 * The floor is what makes the boxes above targets rather than guarantees.
 * `AutoFitText` stops there and lets the box grow rather than shrinking an
 * address past reading, because a guest who cannot read where to go cannot
 * come. The hostile set spends it: its address is still 3px over 60 at 8px, so
 * that column is 149 where the design draws 146, and legibility is what those
 * 3px bought.
 */
/**
 * How tall the section is, and how much taller a map makes it.
 *
 * The design draws 648px and places everything inside against it. Its contents
 * are absolutely positioned, so they add no height of their own - which is why
 * the map could not simply push the section open, and why RSVP Now, the one
 * control on this page that does anything, was cut in half by the section's own
 * edge instead.
 *
 * So the height says out loud what is in the section: the design's 648, plus
 * the map and the gap above it when there is a map. Nothing here is asserted -
 * the check never asserts a dimension - so it costs nothing but the reading.
 */
const SECTION_HEIGHT = 648;
const MAP_HEIGHT = 180;
const MAP_GAP = 24;

const VENUE_NAME_CEILING = 12;
const VENUE_ADDRESS_CEILING = 10;
const VENUE_FLOOR = 8;

export default function EventDetails({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  onReply,
}: {
  content?: WeddingTemplate1Content;
  /**
   * Open the RSVP a guest replies with.
   *
   * Required, unlike everything else here, because RSVP Now is the one control
   * on the invitation that does something: left unwired it would be a button
   * that says it takes a reply and takes none, and nothing would report it.
   */
  onReply: () => void;
}) {
  const fadeUpCenterReveal = useWeddingReveal(fadeUpCenter);
  const fadeUpReveal = useWeddingReveal(fadeUp);
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const target = new Date(content.weddingDateIso).getTime();
  // No usable date, no countdown: subtracting from NaN prints NaN in every
  // digit, and a countdown to nothing should not be drawn rather than drawn
  // wrong. Deterministic from the content, so the server and the client agree.
  const hasDate = !Number.isNaN(target);

  useEffect(() => {
    if (!hasDate) return;
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    setMounted(true);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target, hasDate]);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  // Placeholder "08" (matching the design) until the client clock is live.
  const cd = (n: number) => (mounted ? pad(n) : '08');
  const polaroidPhoto = pickPhoto(content.eventPhotos, 0);
  const directions = directionsTo(content.address);
  const dateLabel = formatWeddingDateLabel(content.weddingDateIso, {
    beforeYear: ' ',
  });
  // Both ends or neither. "19.00 -  WIB" is worse than no line at all: it reads
  // as a reception that starts and never finishes, rather than as a couple who
  // has not said yet.
  const timeLabel =
    content.eventStartTime && content.eventEndTime
      ? `${content.eventStartTime.replace(':', '.')} - ${content.eventEndTime.replace(':', '.')} WIB`
      : '';

  return (
    <section
      className="relative w-full overflow-hidden bg-[#292929]"
      style={{
        height: content.mapsUrl
          ? SECTION_HEIGHT + MAP_HEIGHT + MAP_GAP
          : SECTION_HEIGHT,
      }}>
      {/* Section title */}
      <motion.div
        className="absolute left-1/2 top-[60px] h-[31px] w-[245px]"
        {...fadeUpCenterReveal}>
        <p className="absolute left-[12px] top-0 w-[228px] font-[family-name:var(--font-wt1-script)] text-[48px] leading-[normal] text-[rgba(250,250,250,0.98)]">
          Venue &amp; Details
        </p>
        <div className="absolute left-0 top-[50px] h-px w-[245px] bg-[#fafafa]" />
      </motion.div>

      {/* Main content stack */}
      <motion.div
        className="absolute left-[16px] top-[131px] flex w-[343px] flex-col items-center gap-[24px]"
        {...fadeUpReveal}>
        <div className="flex w-full flex-col items-start gap-[28px]">
          {/* Venue text + polaroid row */}
          <div className="flex w-full items-center gap-[8px]">
            <div className="flex w-[147px] flex-col items-start gap-[16px]">
              <div className="flex w-full flex-col items-start gap-[6px] leading-[normal] text-white">
                <AutoFitText
                  maxFontSize={VENUE_NAME_CEILING}
                  minFontSize={VENUE_FLOOR}
                  maxHeight={VENUE_NAME_BOX_HEIGHT}
                  style={{ minHeight: VENUE_NAME_BOX_HEIGHT }}
                  className="w-full font-[family-name:var(--font-wt1-mono)] font-semibold">
                  {content.venueName}
                </AutoFitText>
                <AutoFitText
                  maxFontSize={VENUE_ADDRESS_CEILING}
                  minFontSize={VENUE_FLOOR}
                  maxHeight={VENUE_ADDRESS_BOX_HEIGHT}
                  style={{ minHeight: VENUE_ADDRESS_BOX_HEIGHT }}
                  className="w-full font-[family-name:var(--font-wt1-mono)] font-normal">
                  {content.address}
                </AutoFitText>
              </div>
              {/* Directions, which the embed cannot give: an embed address
                  opens a stripped map with no way to start a route. Built from
                  the written address instead, so it opens in whichever maps
                  application the guest already uses. */}
              {directions ? (
                <a
                  href={directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center border border-solid border-[#fafafa] gap-[10px] p-[10px]">
                  <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#fafafa]">
                    View Location
                  </p>
                </a>
              ) : (
                <div className="flex items-center justify-center border border-solid border-[#fafafa] gap-[10px] p-[10px]">
                  <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#fafafa]">
                    View Location
                  </p>
                </div>
              )}
            </div>

            {/* Tilted polaroid */}
            <div className="flex h-[224.703px] w-[179.712px] items-center justify-center">
              <div className="flex-none rotate-[-3.56deg]">
                <div className="relative h-[214.775px] w-[166.709px]">
                  <div
                    className="absolute left-[0.01px] top-0 h-[214.887px] w-[166.622px]"
                    style={{ boxShadow: '0px 2px 3.1px 0px rgba(0,0,0,0.17)' }}>
                    <img
                      alt=""
                      className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                      src={`${ASSET}/polaroid-frame.png`}
                    />
                  </div>
                  {/* The polaroid frame is the design's; what is inside it is
                      the couple's. An empty frame is the honest answer before
                      they have chosen a venue photograph. */}
                  <div className="absolute left-[9.43px] top-[10.34px] h-[163.363px] w-[146.022px]">
                    {polaroidPhoto ? (
                      <img
                        alt=""
                        className="pointer-events-none absolute inset-0 block size-full max-w-none object-cover"
                        src={polaroidPhoto}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown + reception details */}
          {/* The map, across the whole column rather than squeezed beside the
              address.
              
              It was drawn in the venue row first, which put a map, a written
              address and a tilted polaroid into 343px and made all three too
              small to read. Full width above the countdown is where a guest
              looks for it anyway: they have just read where the wedding is and
              the next thing they want is to see it.
              
              Built from the address extracted out of what the couple pasted,
              never from the paste itself - a guest opens this page, and putting
              somebody else's markup into it would run their script in every
              guest's browser. */}
          {content.mapsUrl ? (
            <iframe
              src={content.mapsUrl}
              title="Wedding location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ height: MAP_HEIGHT }}
              className="w-full border-0"
            />
          ) : null}

          <div className="flex w-full flex-col items-start gap-[10px] p-[10px] leading-[normal] text-white [word-break:break-word]">
            {hasDate && (
              <div className="flex w-full items-center justify-between py-[8px] text-center font-[family-name:var(--font-wt1-mono)] font-semibold">
                <div className="relative flex min-w-px flex-[1_0_0] flex-col items-center gap-[2px]">
                  <p className="w-full text-[24px]">{cd(days)}</p>
                  <p className="text-[16px]">days</p>
                </div>
                <div className="relative flex min-w-px flex-[1_0_0] flex-col items-center gap-[2px]">
                  <p className="w-full text-[24px]">{cd(hours)}</p>
                  <p className="whitespace-nowrap text-[16px]">hours</p>
                </div>
                <div className="relative flex min-w-px flex-[1_0_0] flex-col items-center gap-[2px]">
                  <p className="w-full text-[24px]">{cd(minutes)}</p>
                  <p className="whitespace-nowrap text-[16px]">minutes</p>
                </div>
                <div className="relative flex min-w-px flex-[1_0_0] flex-col items-center gap-[2px]">
                  <p className="w-full text-[24px]">{cd(seconds)}</p>
                  <p className="whitespace-nowrap text-[16px]">seconds</p>
                </div>
              </div>
            )}
            {/* The date line agrees with the countdown above it: a date the
                formatter could not read is an empty label, and no line is
                drawn rather than an empty one. */}
            {dateLabel && (
              <p className="w-full text-center font-[family-name:var(--font-wt1-mono)] text-[14px] font-normal">
                {dateLabel}
              </p>
            )}
            <div className="flex w-full items-start justify-center gap-[6px] text-[12px]">
              <p className="w-[113px] font-[family-name:var(--font-wt1-mono)] font-semibold">
                Reception Starts
              </p>
              <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] font-normal">
                {timeLabel}
              </p>
            </div>
          </div>
        </div>

        {/* RSVP button */}
        <button
          type="button"
          onClick={onReply}
          aria-haspopup="dialog"
          className="flex items-center justify-center border border-solid border-[#fafafa] gap-[10px] p-[10px]">
          <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#fafafa]">
            RSVP Now
          </p>
        </button>
      </motion.div>
    </section>
  );
}
