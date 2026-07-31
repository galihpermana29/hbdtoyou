'use client';

/**
 * Wedding Template 1 — Holy Verse. Figma node 312:1645.
 * Paper-textured band with a centered scripture (Q.S Ar-Rum : 21).
 * Animation: the text block reveals with a subtle fade-up on scroll. The
 * `-translate-x-1/2` centre is preserved via fadeUpCenter (x stays -50%).
 */

import { motion, useReducedMotion } from 'framer-motion';

import { fadeUpCenter, inView } from './variants';

const ASSET = '/templates/wedding-template-1';

const VERSE_TEXT =
  'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir';

export default function HolyVerse() {
  const reduce = useReducedMotion();

  return (
    <section className="relative h-[206px] w-full overflow-hidden">
      {/* paper background + subtle cream tint overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/holy-verse-bg.jpg`}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.04) 100%), linear-gradient(90deg, rgba(239,233,226,0.3) 0%, rgba(239,233,226,0.3) 100%)',
          }}
        />
      </div>

      <motion.div
        className="absolute left-1/2 top-[24px] flex w-[343px] flex-col items-center gap-[20px] text-center leading-normal text-[#090909]"
        {...inView(reduce, fadeUpCenter)}>
        <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[12px]">
          &ldquo;{VERSE_TEXT}&rdquo;
        </p>
        <p className="w-full font-[family-name:var(--font-wt1-mono)] text-[14px] font-semibold">
          Q.S Ar-Rum : 21
        </p>
      </motion.div>
    </section>
  );
}
