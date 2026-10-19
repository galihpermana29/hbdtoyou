import { FlipNumber } from '../ui/flip-counter';
import DevelopingPhoto from './developing-photo';
import StackedWordmark from './stacked-wordmark';

/**
 * "The Idea!": the one-line pitch, the gallery the guests end up in, and the
 * three rules that make the roll worth waiting for.
 *
 * The gallery is a white panel with the app drawn over it. Its pieces sit
 * where the design puts them, in the panel's own 608x460 pixels, which is why
 * they are placed by number: the card and the polaroid hang off the panel's
 * edges on purpose, and they drift (see `memoroll-float-*` in globals.css).
 */

const RULES = [
  {
    number: '01',
    title: 'No previews',
    body: 'Shots stay hidden until the roll develops. The surprise is the point.',
  },
  {
    number: '02',
    title: 'No retakes',
    body: 'A limited roll per guest means every frame is a choice, not a burst.',
  },
  {
    number: '03',
    title: 'One shared reveal',
    body: "Every guest's roll lands in one gallery, the morning after.",
  },
];

/** The card's own shadow: five stacked, so it falls off the way the design's does. */
const CARD_SHADOW = [
  'drop-shadow(40.395px 50.269px 8.977px rgba(132, 27, 1, 0))',
  'drop-shadow(26.032px 32.316px 8.079px rgba(132, 27, 1, 0.03))',
  'drop-shadow(14.363px 17.953px 6.732px rgba(132, 27, 1, 0.1))',
  'drop-shadow(6.284px 8.079px 4.937px rgba(132, 27, 1, 0.17))',
  'drop-shadow(1.795px 1.795px 2.693px rgba(132, 27, 1, 0.19))',
].join(' ');

const POLAROID_SHADOW = [
  'drop-shadow(13.453px 14.765px 2.789px rgba(0, 0, 0, 0))',
  'drop-shadow(8.531px 9.515px 2.625px rgba(0, 0, 0, 0.02))',
  'drop-shadow(4.922px 5.25px 2.133px rgba(0, 0, 0, 0.06))',
  'drop-shadow(2.297px 2.297px 1.641px rgba(0, 0, 0, 0.11))',
  'drop-shadow(0.656px 0.656px 0.82px rgba(0, 0, 0, 0.12))',
].join(' ');

/** The back button's pill, with the two inner shadows that make it read as raised. */
const PILL_SHADOW =
  'inset 0 -3.232px 4.668px 0.898px rgba(8, 9, 12, 0.17), inset 3.591px 3.591px 36.715px 10.772px rgba(255, 255, 255, 0.1)';

/** The same pill, kept for the title's balance: it is there and not seen. */
function BackPill({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden
      className={`relative flex items-center justify-center overflow-clip rounded-[89.767px] bg-[#ff3e09] px-[10.772px] py-[8.977px] ${
        hidden ? 'opacity-0' : ''
      }`}
      style={{ boxShadow: PILL_SHADOW }}>
      <img
        src="/memoroll-landing/idea-arrow-left.svg"
        alt=""
        className="size-[21.544px] max-w-none"
      />
    </div>
  );
}

/** "Ends in 00 : 00 : 28": the app's own flip counter, at the card's small size. */
function EndsIn() {
  const groups = [0, 0, 28];
  return (
    <div className="flex items-center gap-[3.591px]">
      {groups.map((value, index) => (
        <div key={index} className="flex items-center gap-[3.591px]">
          <div className="h-[16.158px] w-[26.055px]">
            <div className="origin-top-left scale-[0.7071]">
              <FlipNumber value={value} size="small" label="" />
            </div>
          </div>
          {index < groups.length - 1 && (
            <p className="text-center text-[10.772px] font-bold capitalize leading-[1.5] text-[#212121]">
              :
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function GalleryCard() {
  return (
    <div
      className="memoroll-float-card absolute left-[205.84px] top-[-25.1px] w-[337.523px]"
      style={{ filter: CARD_SHADOW }}>
      <div className="flex flex-col gap-[10.772px] rounded-[17.953px] bg-[#f7f5f3] py-[10.772px]">
        <div className="flex items-center justify-between px-[14.363px]">
          <BackPill />
          <p className="w-[223.519px] text-center text-[17.953px] font-bold leading-[1.5] tracking-[-0.1975px] text-[#232323]">
            Gallery
          </p>
          <BackPill hidden />
        </div>

        <div className="relative flex flex-col gap-[7.181px]">
          <div className="absolute left-[221.72px] top-[-52.51px] flex h-[162.414px] w-[153.67px] items-center justify-center">
            <div className="-scale-y-100 rotate-[53.34deg]">
              <img
                src="/memoroll-landing/idea-trade.svg"
                alt=""
                className="h-[91.632px] w-[134.262px] max-w-none"
              />
            </div>
          </div>

          <div className="px-[14.363px] py-[8.977px]">
            <div className="flex w-[207.361px] flex-col gap-[3.591px]">
              <div className="flex items-center gap-[5.386px]">
                <p className="whitespace-nowrap text-[10.772px] font-bold leading-[1.5] tracking-[-0.1185px] text-[#232323]">
                  Ends in
                </p>
                <EndsIn />
              </div>
              <p className="text-[17.953px] font-extrabold leading-[1.5] tracking-[-0.1975px] text-[#232323]">
                Elias &amp; Freya’s Wedding
              </p>
              <p className="flex items-center gap-[3.591px] whitespace-nowrap text-[10.772px] font-medium leading-[1.5] tracking-[-0.1185px] text-[#232323]">
                615 Photos
                <span className="text-[12.567px] tracking-[-0.1382px]">・</span>
                100 Participants
              </p>
            </div>
          </div>

          <img
            src="/memoroll-landing/idea-union.svg"
            alt=""
            className="h-[1.796px] w-full"
          />
        </div>
      </div>
    </div>
  );
}

/** The paper print the guests' photographs land on, turned 3.79 degrees. */
function Polaroid() {
  return (
    <div className="memoroll-float-polaroid absolute left-[79.6px] top-[248.9px]">
      <div
        className="relative flex h-[206.35px] w-[157.927px] rotate-[3.79deg] flex-col p-[4.127px]"
        style={{ filter: POLAROID_SHADOW }}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src="/memoroll-landing/idea-paper.png"
            alt=""
            className="absolute left-0 top-[-25.99%] h-[152.47%] w-[99.95%] max-w-none"
          />
        </div>
        <div className="relative min-h-px w-full flex-1">
          <DevelopingPhoto />
        </div>
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <div
      role="img"
      aria-label="The MemoRoll gallery for Elias & Freya's Wedding: 615 photos from 100 participants, with a countdown to the reveal"
      className="relative h-[460px] w-[608px] origin-top-left scale-[0.55] rounded-[28px] bg-white md:scale-[0.85] lg:scale-100">
      <div className="absolute left-[160px] top-[-9.11px] h-[469px] w-[289px] overflow-hidden">
        <img
          src="/memoroll-landing/idea-phone.png"
          alt=""
          className="absolute left-[0.15%] top-[0.02%] h-[125.89%] w-[99.92%] max-w-none"
        />
      </div>

      <GalleryCard />
      <Polaroid />

      <div className="absolute left-[354px] top-[365.5px] flex h-[35.5px] w-[267.3px] items-center gap-2 rounded-full bg-[#ff3e09] px-[14px] py-[10px]">
        <span className="memoroll-live-dot size-2 shrink-0 rounded-[4px] bg-[#e8e1d9]" />
        <p
          className="whitespace-pre text-[12px] leading-[normal] tracking-[0.5px] text-[#e8e1d9]"
          style={{ fontFamily: 'var(--font-mr-label)' }}>
          100 guests shooting right now
        </p>
      </div>

      <div className="absolute left-6 top-[23.5px]">
        <StackedWordmark scale={0.425} />
      </div>
    </div>
  );
}

export default function MemorollIdea() {
  return (
    <section
      className="flex flex-col items-center bg-[#1b1b1b] px-6 py-16 md:px-10 lg:px-20 lg:py-28"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="flex w-full max-w-[1280px] flex-col gap-12 lg:gap-[72px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-20">
          <div className="flex flex-col items-start gap-5 lg:w-[800px] lg:shrink-0">
            <span className="inline-flex items-center rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium capitalize leading-[normal] tracking-[-0.28px] text-[#e34013]">
              The Idea!
            </span>
            <h2 className="text-[28px] font-semibold leading-[36px] tracking-[-0.72px] text-white md:text-[36px] md:leading-[44px]">
              Everyone gets a camera. Nobody gets a preview. Then, the reveal.
            </h2>
          </div>
          <p className="text-[16px] font-normal leading-[26px] text-[#b9b2aa] md:text-[18px] md:leading-[29px] lg:w-[400px] lg:shrink-0">
            No reviewing, deleting, or missing the party to stare at a screen.
            Capture the raw moments as they happen and leave the magic on the
            roll.
          </p>
        </div>

        <div className="flex flex-col items-center gap-12 lg:h-[531px] lg:flex-row lg:gap-16">
          <div className="mt-8 h-[253px] w-[334px] shrink-0 md:h-[391px] md:w-[517px] lg:mt-0 lg:h-[460px] lg:w-[608px]">
            <Gallery />
          </div>

          <ol className="flex w-full flex-col lg:min-w-0 lg:flex-1">
            {RULES.map((rule, index) => (
              <li
                key={rule.number}
                className={`flex gap-6 border-b border-[#3a3633] py-7 lg:h-[177px] ${
                  index === 0 ? 'border-t' : ''
                }`}>
                <p className="text-[14px] font-medium leading-[21px] tracking-[-0.28px] text-[#ff3e09]">
                  {rule.number}
                </p>
                <div className="flex min-w-0 flex-col gap-2">
                  <h3 className="text-[22px] font-semibold leading-[33px] text-white">
                    {rule.title}
                  </h3>
                  <p className="text-[16px] font-normal leading-6 text-[#a39c94]">
                    {rule.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
