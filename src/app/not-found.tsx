import Link from 'next/link';

/**
 * What a visitor sees at an address that has nothing: most often a gift
 * link whose gift was deleted, or a mistyped one. The gift viewers used to
 * answer these with the words "No data" and a success status, which a
 * search engine reads as a page worth keeping (Search Console called it a
 * "soft 404"). They now answer 404, and this is the page.
 *
 * It is drawn inside the root layout, so the fonts and the footer are the
 * site's own; it carries no navbar because a recipient is not a customer
 * yet and needs one way out, not a menu.
 */
export const metadata = {
  title: 'Page not found | Memoify',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-[#fbf4ec] px-6 py-20 text-center">
      <p className="rounded-full border border-[#e8ded3] bg-[#fffdfa] px-4 py-[6px] text-[14px] font-medium text-[#e34013]">
        404
      </p>
      <h1 className="mt-5 max-w-[560px] text-[34px] font-bold leading-[1.1] tracking-[-0.04em] text-[#1b1b1b] md:text-[48px]">
        This page isn&apos;t here anymore
      </h1>
      <p className="mt-4 max-w-[460px] text-[17px] leading-[1.6] text-[#4a4642]">
        The gift may have been removed, or the link may be incomplete. Ask the
        person who sent it for a fresh link.
      </p>
      <p className="mt-2 max-w-[460px] text-[15px] leading-[1.6] text-[#8a847d]">
        Halaman ini sudah tidak ada. Coba minta link baru ke pengirimnya.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-[52px] items-center rounded-full bg-[#ff3e09] px-7 text-[16px] font-semibold text-white transition-transform duration-150 ease-out active:scale-[0.97]">
        Go to Memoify
      </Link>
    </main>
  );
}
