import Image from 'next/image';
import Link from 'next/link';

/** The dark strip above the navigation: Memoroll now ships with the wedding plan. */
export default function MemorollAnnouncementStrip() {
  return (
    <Link
      href="/wedding-invitation"
      className="flex min-h-10 items-center justify-center gap-3 bg-[#1b1b1b] px-4 py-2 transition-colors hover:bg-black">
      <span className="size-[6px] shrink-0 rounded-[3px] bg-[#ff3e09]" />
      <p
        className="text-[11px] leading-[normal] tracking-[1.2px] text-[#fbf4ec] md:whitespace-nowrap"
        style={{ fontFamily: 'var(--font-mr-label)' }}>
        NEW - MEMOROLL IS NOW INCLUDED FREE WITH THE WEDDING PLAN
      </p>
      <Image
        src="/memoroll-landing/banner-arrow.svg"
        alt=""
        width={14}
        height={14}
        unoptimized
        className="shrink-0"
      />
    </Link>
  );
}
