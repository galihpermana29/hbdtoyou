import Link from 'next/link';

import HeroCarousel from './hero-carousel';
import StackedWordmark from './stacked-wordmark';

/**
 * The peach glow behind the hero. The design puts it on the whole 1440x1090
 * frame, navbar included, as a radial gradient from #FFBEAC to the same hue
 * at zero opacity, centred 214px down: 134px below the navbar, which is where
 * this section starts. Figma stores it as a transform on a unit square; worked
 * through for this frame it is an ellipse 1118px wide and 846px tall.
 *
 * In pixels rather than percentages, because the design is a 1440 frame and a
 * wider screen should show more white around the glow, not a larger glow.
 */
const GLOW =
  'radial-gradient(1118px 846px at 50% 134px, #FFBEAC 0%, rgba(255, 243, 240, 0) 100%)';

/**
 * The MemoRoll landing's first screen: the arc of prints, the logo, the line
 * and the one action. The heading sits over the bottom of the arc, which is
 * why the content is pulled up by the same amount the hero is overscanned.
 */
export default function MemorollHero() {
  return (
    <section
      className="relative flex flex-col items-center bg-white"
      style={{ fontFamily: 'var(--font-mr-body)', backgroundImage: GLOW }}>
      <div className="relative h-[338px] w-full overflow-hidden sm:h-[525px] lg:h-[750px]">
        <HeroCarousel />
      </div>

      <div className="relative -mt-[135px] flex w-full flex-col items-center pt-7 sm:-mt-[210px] lg:-mt-[300px]">
        <div className="flex w-full flex-col items-center gap-12 px-6 md:px-[120px]">
          <div className="flex w-full flex-col items-center gap-8">
            <div className="flex w-full flex-col items-center gap-16">
              <StackedWordmark />
              <div className="flex w-full flex-col items-center gap-5 text-center">
                <h1 className="w-full text-[36px] font-semibold leading-[normal] text-[#1b1b1b] md:text-[56px]">
                  Some days deserves more than one perspective
                </h1>
                <p className="w-full text-[16px] font-normal leading-[30px] text-[#393838] md:text-[18px]">
                  Give every guest a disposable camera and collect the moments
                  you couldn&apos;t be there to see.
                </p>
              </div>
            </div>

            <Link
              href="/memoroll/create"
              className="inline-flex items-center justify-center gap-[10px] overflow-clip rounded-lg bg-[#e34013] px-[22px] py-4 text-[18px] font-semibold leading-7 text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors hover:bg-[#C9340E]">
              <span className="px-0.5">Create Memoroll</span>
            </Link>
          </div>
        </div>
        <div className="h-16 w-full" />
      </div>
    </section>
  );
}
