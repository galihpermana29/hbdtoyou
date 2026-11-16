/**
 * Where to take a buyer once a payment is verified. The paywall at Create
 * sets it, so somebody who bought Premium to publish a gift lands back on
 * that gift - with what they wrote restored - not on the dashboard. Kept in
 * localStorage because the payment provider's redirect drops any query.
 */
const KEY = 'memoify:after-payment';
const KEPT_FOR_MS = 24 * 60 * 60 * 1000;

export function setAfterPayment(path: string) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), path }));
  } catch {
    // Without storage the buyer lands on the dashboard, as before.
  }
}

/** The path to return to, once; null when there is none (or it is stale). */
export function takeAfterPayment(): string | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    window.localStorage.removeItem(KEY);
    const { at, path } = JSON.parse(raw) as { at: number; path: string };
    // Only a path on this site, never somewhere else.
    if (
      Date.now() - at > KEPT_FOR_MS ||
      !path.startsWith('/') ||
      path.startsWith('//')
    )
      return null;
    return path;
  } catch {
    return null;
  }
}

export function peekAfterPayment(): boolean {
  try {
    return Boolean(window.localStorage.getItem(KEY));
  } catch {
    return false;
  }
}
