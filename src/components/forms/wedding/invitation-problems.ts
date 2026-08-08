/**
 * What a couple reads when something they pressed did not happen.
 *
 * All of it in one place because a couple reads these in one place: under the
 * row they just pressed, whichever press it was and whichever screen they were
 * on. Two screens save and two screens publish, and a sentence kept beside one
 * of them would be the sentence the other did not use.
 *
 * Their own module rather than either caller's, so that neither has to import
 * the other's words: saving lives in `use-invitation.ts`, publishing in
 * `publish-invitation.ts`, and saving already asks publishing to do the work.
 */

/**
 * What a couple reads when a press of theirs did not reach the backend.
 *
 * One sentence for both kinds, because both say the same thing: what did not
 * happen, what the backend gave as the reason, and that nothing they entered is
 * gone.
 */
export function problemMessage(
  whatDidNotHappen: 'saved' | 'published',
  reason: string
): string {
  return (
    `Your invitation was not ${whatDidNotHappen}: ${reason}. Nothing you have ` +
    'entered has been lost, so you can try again.'
  );
}

/** What they read when they asked to save and there is no account to save to. */
export const NOT_SIGNED_IN_PROBLEM =
  'You are not signed in, so there is nowhere to save your invitation yet. ' +
  'Sign in and try again.';

/**
 * What a couple reads when the publish check refused and named nothing.
 *
 * The contract says a refusal carries its reasons, so this is the shape being
 * broken rather than a case the product has. It is still written down, because
 * a couple whose invitation will not publish and who is shown an empty list has
 * been told less than nothing.
 */
export const UNSTATED_ISSUE =
  'The backend refused to publish this invitation and did not say why.';
