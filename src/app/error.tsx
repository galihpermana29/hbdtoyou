'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { isStaleBuildError, reloadOnceForStaleBuild } from '@/lib/stale-build';

/**
 * What a page shows when something in it throws while rendering.
 *
 * Without this file Next swaps the entire document for "Application error:
 * a client-side exception has occurred" - title included, which is how that
 * sentence became memoify.live's title on Google (see lib/stale-build.ts).
 * With it, the site's layout, the page's own title and its description stay,
 * and only the page's body is replaced by this.
 *
 * The usual cause is a page older than the current deploy; for that the
 * screen reloads by itself, once, and the visitor never sees it.
 */
export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Until we know a reload is not coming, show nothing: a flash of an
  // error screen right before the page fixes itself helps nobody.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!reloadOnceForStaleBuild(error)) setSettled(true);
  }, [error]);

  if (!settled) return <div className="min-h-[60vh] bg-[#fbf4ec]" />;

  const stale = isStaleBuildError(error);
  return (
    <main
      className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fbf4ec] px-5 py-16 text-center"
      style={{ fontFamily: 'var(--font-mr-body, inherit)' }}>
      <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.035em] text-[#1b1b1b] md:text-[40px]">
        {stale ? 'This page needs a refresh' : 'Something went wrong here'}
      </h1>
      <p className="mt-3 max-w-[420px] text-[16px] leading-[1.6] text-[#4a4642]">
        {stale
          ? 'Memoify was updated while this page was open. Reload to get the new version.'
          : 'The page hit a problem while loading. Reloading usually fixes it, and nothing you made is lost.'}
      </p>
      <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff3e09] px-7 text-[16px] font-semibold text-white transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
          Reload the page
        </button>
        {stale ? null : (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] px-7 text-[16px] font-semibold text-[#1b1b1b] transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
            Try again
          </button>
        )}
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full px-5 text-[16px] font-semibold text-[#e34013] underline underline-offset-2">
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
