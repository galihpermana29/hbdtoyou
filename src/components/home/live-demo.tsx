import HeroGiftPreview from '@/components/newlanding/HeroGiftPreview';

import { Rise, SectionHead } from './ui';

/**
 * The real product, running in the page: not a recording. The window enters
 * once, as a whole - what is inside it is the product's own motion.
 */
export default function HomeLiveDemo() {
  return (
    <section
      className="bg-[#fbf4ec] px-5 py-16 md:py-[112px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto max-w-[1180px]">
        <SectionHead
          eyebrow="Try it here"
          title="Don't take our word for it. Open one."
          body="Click around inside. This is the real gift your person would get, not a video of it."
        />
        <Rise distance={24} className="mt-10 md:mt-14">
          <HeroGiftPreview />
        </Rise>
      </div>
    </section>
  );
}
