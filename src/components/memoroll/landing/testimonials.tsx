import { RevealHeading } from './reveal-words';
import RollingNumber from './rolling-number';

const SMALL_REVIEWS = [
  {
    quote:
      'The best part of my 30th (Dirty Thirty Baby!) was the next morning. Opening the roll felt like Christmas.',
    name: 'Nadia R.',
    meta: 'Birthday Party · 32 guests',
    avatar: '/memoroll-landing/testimonial-nadia.jpg',
  },
  {
    quote:
      'Zero setup. Guests just scanned the table card and started shooting. Our team still talks about the reveal.',
    name: 'Marcus T.',
    meta: 'Class of ‘18 Gathering · 58 guests',
    avatar: '/memoroll-landing/testimonial-marcus.jpg',
  },
];

const STATS = [
  { value: '1k+', label: 'rolls developed' },
  { value: '2.3k', label: 'photos revealed' },
  { value: '96%', label: 'of hosts would roll again' },
  { value: '0', label: 'apps to download' },
];

function Stars({ size }: { size: 14 | 16 }) {
  return (
    <div className="flex gap-[3px]" role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <img
          key={i}
          src={`/memoroll-landing/star-${size}.svg`}
          alt=""
          width={size}
          height={size}
        />
      ))}
    </div>
  );
}

/** "Stories from the roll" - what hosts said, and the numbers behind it. */
export default function MemorollTestimonials() {
  return (
    <section
      aria-label="Stories from the roll"
      className="bg-[#fbf4ec] px-4 py-16 md:px-10 md:py-[120px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 md:gap-14">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col items-start gap-5">
            <span className="inline-flex items-center rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium capitalize tracking-[-0.28px] text-[#e34013]">
              Stroies from the roll
            </span>
            <RevealHeading className="text-[28px] font-semibold leading-[1.2] tracking-[-0.72px] text-[#1b1b1b] md:text-[36px] md:leading-[44px]">
              Told by the people who were there.
            </RevealHeading>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[32px] font-bold leading-[48px] text-[#1b1b1b]">
              4.9
            </p>
            <div className="flex flex-col gap-1.5">
              <Stars size={16} />
              <p className="text-[14px] leading-5 text-[#4a4642]">
                from all Memoroll hosts
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <figure className="flex flex-col gap-8 rounded-[28px] bg-[#ff3e09] p-8 md:flex-row md:items-center md:gap-9 md:pb-11 md:pl-[52px] md:pr-12 md:pt-12 lg:min-h-[480px] lg:w-[800px] lg:shrink-0">
            <div className="flex flex-1 flex-col items-start justify-between gap-8 lg:h-[388px]">
              <img
                src="/memoroll-landing/quote-mark.svg"
                alt=""
                width={44}
                height={44}
              />
              <blockquote className="text-[18px] font-medium leading-[1.5] text-white md:text-[22px] md:leading-[33px]">
                We got 600 photos back the morning after our wedding, and half
                of them were moments we never saw. My grandma dancing. Our
                friends crying during the vows. It felt like reliving the whole
                night.
              </blockquote>
              <figcaption className="flex items-center gap-[14px]">
                <img
                  src="/memoroll-landing/testimonial-elias.jpg"
                  alt=""
                  className="size-12 rounded-full object-cover"
                />
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[16px] font-semibold leading-6 text-white">
                    Elias & Freya
                  </p>
                  <p className="text-[14px] font-medium leading-[21px] tracking-[-0.28px] text-[#ffe1d6]">
                    Wedding · 100 guests · 615 photos
                  </p>
                </div>
              </figcaption>
            </div>

            <div className="flex shrink-0 justify-center md:w-[257px]">
              <div className="flex w-[234px] rotate-4 flex-col gap-3 bg-white px-3 pb-4 pt-3 drop-shadow-[0_16px_15px_rgba(122,31,0,0.25)]">
                <img
                  src="/memoroll-landing/testimonial-elias.jpg"
                  alt="Elias and Freya with their wedding guests"
                  className="h-[270px] w-[210px] object-cover"
                />
                <p
                  className="text-[22px] text-[#4a4642]"
                  style={{ fontFamily: 'var(--font-mr-hand)' }}>
                  the whole gang ♡
                </p>
              </div>
            </div>
          </figure>

          <div className="flex flex-1 flex-col gap-5">
            {SMALL_REVIEWS.map((r) => (
              <figure
                key={r.name}
                className="flex flex-1 flex-col gap-[22px] rounded-[22px] bg-[#fffdfa] p-8">
                <Stars size={14} />
                <blockquote className="text-[16px] leading-6 text-[#1b1b1b]">
                  {r.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-[3px]">
                    <p className="text-[16px] font-semibold leading-6 text-[#1b1b1b]">
                      {r.name}
                    </p>
                    <p className="text-[14px] font-medium leading-[21px] tracking-[-0.28px] text-[#8a847d]">
                      {r.meta}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-5 gap-y-8 border-t border-[#e8ded3] pt-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1.5">
              <dt className="text-[16px] leading-6 text-[#4a4642]">
                {s.label}
              </dt>
              <dd className="text-[40px] font-semibold leading-[48px] text-[#1b1b1b] md:text-[48px]">
                <RollingNumber value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
