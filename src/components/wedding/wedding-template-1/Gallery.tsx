'use client';

/**
 * Wedding Template 1 - Gallery. Figma node 312:1807.
 *
 * The couple's pre-wedding photographs, and the one section on the invitation
 * with no words at all.
 *
 * ## Why this is not the collage the design draws
 *
 * The design places five photographs by hand, each its own size, overlapping
 * the section's edges inside a fixed 570px band. That is a composition rather
 * than a rule, and it does not generalise: the Photo Collection now asks a
 * couple for between five and fifteen photographs, and there is no honest way
 * to read a sixth slot out of an arrangement that has five.
 *
 * Two alternatives were rejected. Capping the couple at five throws away the
 * ask. Drawing the collage once per group of five forces the count onto a
 * multiple of five, so a couple with seven photographs would be told to find
 * three more or drop two. Both are recorded in
 * `docs/adr/0002-figma-is-literal-truth.md`, along with this.
 *
 * So the section is two columns of varying heights that grow with the count.
 * That keeps what the collage was actually doing - photographs of different
 * sizes, read down the page - without pretending to know where a fifteenth one
 * goes.
 *
 * Two columns rather than three because the invitation is phone width; three
 * would leave wedding photographs about 130px wide. The section grows rather
 * than holding the design's fixed band, because the invitation already scrolls
 * and a fixed band would either crop a couple's photographs or strand a gap
 * beneath them.
 *
 * The ground stays `#fafafa`, which is the one thing the design states about
 * this section and the one thing the check asserts about it.
 *
 * Animation: the photographs reveal in sequence on scroll, as every other
 * section's contents do.
 */

import { motion } from 'framer-motion';

import { fadeUp, staggerContainer } from './variants';
import { useWeddingReveal } from './use-wedding-reveal';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

/**
 * How the photographs are dealt into the two columns.
 *
 * Alternating rather than split down the middle, so the columns stay about the
 * same length whatever the count is: an odd number leaves one column a single
 * photograph longer, where splitting would put the first eight in one column
 * and the last seven in the other and lean the section to one side.
 *
 * Reading order follows the columns rather than the page, which is what masonry
 * is. That is also the order of the markup, so nothing has to be told about it.
 */
function intoColumns(photos: string[]): [string[], string[]] {
  const left: string[] = [];
  const right: string[] = [];
  photos.forEach((photo, index) => {
    (index % 2 === 0 ? left : right).push(photo);
  });
  return [left, right];
}

export default function Gallery({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: {
  content?: WeddingTemplate1Content;
}) {
  const staggerReveal = useWeddingReveal(staggerContainer);

  // Only the photographs a couple actually gave. Nothing stands in for one they
  // did not: an empty box in a wedding album is worse than a shorter album.
  const photos = (content.galleryPhotos ?? []).filter(
    (photo) => typeof photo === 'string' && photo.length > 0
  );
  const [left, right] = intoColumns(photos);

  // A couple who has added none gets no section at all, rather than a band of
  // empty ground with nothing in it.
  if (photos.length === 0) return null;

  return (
    <motion.section
      className="relative w-full overflow-hidden bg-[#fafafa]"
      {...staggerReveal}>
      <div className="flex w-full items-start gap-[2px]">
        {[left, right].map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex min-w-0 flex-1 flex-col gap-[2px]">
            {column.map((photo) => (
              <motion.img
                key={photo}
                alt=""
                variants={fadeUp}
                src={photo}
                // The height follows the photograph rather than the layout,
                // which is the whole point of masonry: a portrait stays a
                // portrait and a landscape stays a landscape, and neither is
                // cropped to make a grid line up.
                className="pointer-events-none block h-auto w-full max-w-none"
              />
            ))}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
