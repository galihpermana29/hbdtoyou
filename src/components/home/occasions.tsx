/**
 * What people give these for, passing by at one steady speed. Constant
 * motion, so it is linear; it is the same line twice, moved by half its
 * width, so it never jumps. Reduced motion lays the words out still.
 */
const OCCASIONS = [
  'Birthdays',
  'Anniversaries',
  'Graduations',
  'Long-distance',
  'Farewells',
  "Mother's Day",
  'Just because',
];

function Line({
  hidden = false,
  items,
}: {
  hidden?: boolean;
  items: string[];
}) {
  return (
    <ul
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12">
      {items.map((occasion) => (
        <li
          key={occasion}
          className="flex items-center gap-8 whitespace-nowrap text-[18px] font-semibold tracking-[-0.02em] text-[#fbf4ec] md:gap-12 md:text-[22px]">
          {occasion}
          <span aria-hidden className="text-[#ff3e09]">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function HomeOccasions({
  items = OCCASIONS,
  label = 'Occasions',
}: {
  /** Another page's own words, passing by the same way. */
  items?: string[];
  label?: string;
}) {
  return (
    <section
      aria-label={label}
      className="overflow-hidden bg-[#1b1b1b] py-5 md:py-6"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="flex w-max animate-[home-marquee_32s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
        <Line items={items} />
        <span className="contents motion-reduce:hidden">
          <Line hidden items={items} />
        </span>
      </div>
    </section>
  );
}
