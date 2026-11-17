import RollingNumber from '@/components/memoroll/landing/rolling-number';

import { Rise } from './ui';

/**
 * Three figures, rolling into place like an odometer when they are seen
 * (MemoRoll's own RollingNumber). The labels do not move: only the number
 * is the news.
 */
const FIGURES = [
  {
    value: '9,000+',
    label: 'people have joined',
    note: 'and made something for someone',
  },
  {
    value: '1,000+',
    label: 'went Premium',
    note: 'to make more, on every style',
  },
  {
    value: '15+',
    label: 'styles to start from',
    note: 'with new ones added often',
  },
];

export default function HomeStats() {
  return (
    <section
      aria-label="Memoify in numbers"
      className="bg-[#fffdfa] px-5 py-16 md:py-[96px]"
      style={{ fontFamily: 'var(--font-mr-body)' }}>
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 border-y border-[#e8ded3] py-12 md:grid-cols-3 md:gap-6 md:py-14">
        {FIGURES.map((figure, index) => (
          <Rise
            key={figure.label}
            delay={[0, 80, 140][index]}
            distance={0}
            className="flex flex-col items-center text-center">
            <RollingNumber
              value={figure.value}
              className="text-[48px] font-bold tracking-[-0.04em] text-[#1b1b1b]"
            />
            <p className="mt-2 text-[17px] font-semibold text-[#1b1b1b]">
              {figure.label}
            </p>
            <p className="mt-1 text-[14px] text-[#8a847d]">{figure.note}</p>
          </Rise>
        ))}
      </div>
    </section>
  );
}
