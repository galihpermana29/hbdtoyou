import posthog from 'posthog-js';
import { useEffect } from 'react';

/**
 * Tell PostHog who is signed in (owner, 2026-11-23). Until this, nothing
 * ever did: every person in PostHog was "Anonymous", and there was no way to
 * look one guest up and read what happened to them.
 *
 * The person is the backend's own user id, so the same account is one person
 * on every phone it signs in on. The email and the name ride along as that
 * person's properties, which is what makes the list readable. What they did
 * before signing in (the Cover they saw, the button they pressed) is joined
 * to them by PostHog itself, so a funnel that starts signed out and ends
 * signed in stays whole.
 *
 * And the other half: once nobody is signed in, PostHog is told to forget.
 * Both ways out of an account here reload the page signed out, so this is
 * where the forgetting happens. Without it the next person on a shared
 * phone, which at a wedding is every other phone, would be filed under the
 * last one.
 */
export function usePostHogIdentity(
  who: { id?: string | null; email?: string | null; name?: string | null },
  signedIn: boolean
) {
  const { id, email, name } = who;
  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;
    // PostHog starts in its provider's effect, which runs after this one (a
    // child's effects come first), so wait for it rather than talk to nobody.
    const say = (tries = 0) => {
      if (cancelled) return;
      const ready = (posthog as unknown as { __loaded?: boolean }).__loaded;
      if (!ready) {
        if (tries < 50) timer = window.setTimeout(() => say(tries + 1), 200);
        return;
      }
      try {
        if (signedIn && id) {
          if (posthog.get_distinct_id() !== id) {
            posthog.identify(id, {
              ...(email ? { email } : {}),
              ...(name ? { name } : {}),
            });
          }
        } else if (!signedIn && posthog._isIdentified()) {
          posthog.reset();
        }
      } catch {
        // Blocked or broken: the app carries on, anonymous as before.
      }
    };
    say();
    return () => {
      cancelled = true;
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [id, email, name, signedIn]);
}

/**
 * Forget the person now, for the moment of signing out: said before the page
 * reloads, so not even the first view of the signed-out page is filed under
 * the account that just left. The hook above still catches any way out that
 * does not come through here.
 */
export function forgetPostHogPerson() {
  try {
    if ((posthog as unknown as { __loaded?: boolean }).__loaded) {
      posthog.reset();
    }
  } catch {
    // Nothing to forget, or nothing to tell.
  }
}
