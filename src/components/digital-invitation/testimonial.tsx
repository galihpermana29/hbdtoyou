import SectionPill from './section-pill';

const STATS = [
  { value: '1,200', label: 'COUPLES ON MEMOIFY' },
  { value: '4.9', label: 'AVERAGE RATING FROM COUPLES' },
  { value: '2.3k', label: 'GUEST PHOTOS DEVELOPED' },
  { value: '0', label: 'APPS TO DOWNLOAD', accent: true },
];

const mono = { fontFamily: 'var(--font-mr-label)' };

export default function InvitationTestimonial() {
  return (
    <section
      aria-label="Kind words"
      className="px-4 pb-16 pt-16 sm:px-6 md:px-10 md:pb-[120px] md:pt-[140px] xl:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 md:gap-14">
        <figure className="flex flex-col items-center gap-10 md:flex-row md:gap-16 lg:gap-24">
          <div className="flex w-full max-w-[344px] shrink-0 flex-col items-center gap-4 md:w-[300px] lg:w-[400px] lg:max-w-none">
            <img
              src="/digital-invitation/testimonial.jpg"
              alt="Guests lifting the groom on the dance floor"
              className="aspect-[344/413] w-full max-w-[344px] rounded-t-[200px] object-cover"
            />
            <figcaption
              className="text-center text-[20px] text-[#4a4642] md:text-[24px]"
              style={{ fontFamily: 'var(--font-mr-hand)' }}>
              from Elias &amp; Freya&apos;s roll, 11:42pm
            </figcaption>
          </div>

          <div className="flex min-w-0 flex-col items-start gap-6">
            <SectionPill>Kind Words</SectionPill>
            <p
              aria-hidden="true"
              className="h-[60px] text-[120px] leading-[60px] text-[#ff3e09]"
              style={{ fontFamily: 'var(--font-mr-badge)' }}>
              “
            </p>
            <blockquote className="max-w-[784px] text-[22px] font-medium leading-[30px] tracking-[-0.8px] text-[#1b1b1b] md:text-[28px] md:leading-[38px] md:tracking-[-1.2px]">
              We got more than 600 photos back the morning after our wedding,
              and half of them were moments we never saw. My grandma dancing.
              Our friends crying during the vows.
            </blockquote>
            <div className="flex flex-col gap-1">
              <p className="text-[17px] font-bold text-[#1b1b1b]">
                Elias &amp; Freya
              </p>
              <p
                className="text-[11px] tracking-[1.2px] text-[#8a847d]"
                style={mono}>
                WEDDING · 100 GUESTS · 615 PHOTOS
              </p>
            </div>
          </div>
        </figure>

        <dl className="grid grid-cols-2 border-t border-[#e8ded3] lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 py-7 pr-4 lg:h-[142px] lg:pr-6 ${
                i % 2 === 1 ? 'border-l border-[#e8ded3] pl-6' : ''
              } ${i > 0 ? 'lg:border-l lg:border-[#e8ded3] lg:pl-6' : ''} ${
                i >= 2 ? 'border-t border-[#e8ded3] lg:border-t-0' : ''
              }`}>
              <dd
                className={`order-1 text-[36px] font-semibold leading-[40px] md:text-[48px] md:leading-[48px] ${
                  stat.accent ? 'text-[#ff3e09]' : 'text-[#1b1b1b]'
                }`}>
                {stat.value}
              </dd>
              <dt
                className="order-2 text-[11px] tracking-[1.2px] text-[#8a847d]"
                style={mono}>
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
