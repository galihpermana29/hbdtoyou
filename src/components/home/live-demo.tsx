import HeroGiftPreview from '@/components/newlanding/HeroGiftPreview';

import { HOME_COPY, type HomeLanguage } from './copy';
import { Rise, SectionHead } from './ui';

/**
 * The real product, running in the page: not a recording. The window enters
 * once, as a whole - what is inside it is the product's own motion.
 */
export default function HomeLiveDemo({ lang = 'en' }: { lang?: HomeLanguage }) {
  const t = HOME_COPY[lang].demo;
  return (
    <section
      className="bg-[#fbf4ec] px-5 py-16 md:py-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto max-w-[1180px]">
        <SectionHead eyebrow={t.eyebrow} title={t.title} body={t.body} />
        <Rise distance={24} className="mt-10 md:mt-14">
          <HeroGiftPreview lang={lang} />
        </Rise>
      </div>
    </section>
  );
}
