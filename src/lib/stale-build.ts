/**
 * A page whose scripts have been replaced by a newer deploy.
 *
 * Production only serves the current build's script files: the ones an
 * older build named answer 404 (checked 2026-11-18). A page fetched before a
 * deploy and still open after it - or fetched by a crawler that renders
 * later, as Googlebot does - asks for a lazy script that is gone, the import
 * rejects inside React's render, and with nothing to catch it Next replaces
 * the whole document with "Application error: a client-side exception has
 * occurred". That sentence is what Google showed as memoify.live's title
 * after two days of many deploys (owner, 2026-11-18).
 *
 * The cure is a fresh copy of the page, which names scripts that exist. So
 * the error screens reload once when this is the error they caught - once,
 * remembered for this tab, so a page that is truly broken does not reload
 * for ever.
 */
export function isStaleBuildError(error: unknown): boolean {
  const name = (error as Error)?.name ?? '';
  const message = (error as Error)?.message ?? '';
  return (
    name === 'ChunkLoadError' ||
    /Loading (CSS )?chunk [\w-]+ failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message)
  );
}

const TRIED = 'memoify:reloaded-for-stale-build';
/** Long enough that one bad page cannot loop; short enough that the next
 *  deploy, hours later, gets its reload too. */
const AGAIN_AFTER_MS = 60_000;

/** Reloads for a stale build, at most once a minute. True if it did. */
export function reloadOnceForStaleBuild(error: unknown): boolean {
  if (typeof window === 'undefined' || !isStaleBuildError(error)) return false;
  try {
    const last = Number(window.sessionStorage.getItem(TRIED) ?? 0);
    if (Date.now() - last < AGAIN_AFTER_MS) return false;
    window.sessionStorage.setItem(TRIED, String(Date.now()));
  } catch {
    // No storage to remember with: reloading could loop, so do not.
    return false;
  }
  window.location.reload();
  return true;
}
