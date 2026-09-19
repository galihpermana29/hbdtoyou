'use client';

/**
 * Wedding Template 1 - Holy Verse. Figma node 312:1645.
 * Paper-textured band with a centered scripture, fitted to the band: a couple
 * whose verse is longer than the designer's keeps all of it, at a smaller size,
 * rather than losing the end of it to the section's edge.
 * Animation: the text block reveals with a subtle fade-up on scroll. The
 * `-translate-x-1/2` centre is preserved via fadeUpCenter (x stays -50%).
 */

import { motion } from 'framer-motion';

import { fadeUpCenter } from './variants';
import { useWeddingReveal } from './use-wedding-reveal';
import { AutoFitText } from './AutoFitText';
import { PAPER_TINT } from './TornPaper';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

const ASSET = '/templates/wedding-template-1';

/**
 * What the verse and its citation may grow to before they step down.
 *
 * The design gives the block 149px of a 206px section, starting 24px down:
 * 112 for the verse, 20 between, 17 for the citation, and 33px left clear at
 * the foot (Figma node 312:1645, `Frame 22`). The verse may take the clearance
 * if it needs it, keeping 10px so it never runs to the section's own edge, so
 * its ceiling is 135 rather than the design's 112.
 *
 * The citation keeps the design's one line. It is a reference rather than
 * prose - "Q.S Ar-Rum : 21" - and giving it room for two would spend it out of
 * the verse, which is the part a couple actually chose.
 *
 * Neither is a guarantee. `AutoFitText` stops at its floor and lets the box
 * grow rather than shrinking scripture past reading, because a verse nobody can
 * read is a worse failure than a section that runs long.
 */
const VERSE_MAX_HEIGHT = 135;
const CITATION_MAX_HEIGHT = 17;

export default function HolyVerse({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
}: {
  content?: WeddingTemplate1Content;
}) {
  const reveal = useWeddingReveal(fadeUpCenter);

  return (
    <section className="relative h-[206px] w-full overflow-hidden">
      {/* paper background + subtle cream tint overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/paper.jpg`}
        />
        <div className="absolute inset-0" style={PAPER_TINT} />
      </div>

      <motion.div
        className="absolute left-1/2 top-[24px] flex w-[343px] flex-col items-center gap-[20px] text-center leading-[normal] text-[#090909]"
        {...reveal}>
        <AutoFitText
          maxFontSize={12}
          minFontSize={8}
          maxHeight={VERSE_MAX_HEIGHT}
          className="w-full font-[family-name:var(--font-wt1-mono)]">
          &ldquo;{content.verseText}&rdquo;
        </AutoFitText>
        <AutoFitText
          maxFontSize={14}
          minFontSize={8}
          maxHeight={CITATION_MAX_HEIGHT}
          className="w-full font-[family-name:var(--font-wt1-mono)] font-semibold">
          {content.verseCitation}
        </AutoFitText>
      </motion.div>
    </section>
  );
}
