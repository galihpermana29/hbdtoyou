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

/**
 * What a couple reads when the address they chose belongs to somebody else.
 *
 * Its own sentence rather than the general one, because a name that was taken
 * is not a failure they should try again at: trying again with the same
 * address fails the same way, and the thing to do is pick another. The rest of
 * the save is not lost either, which is the half they would otherwise worry
 * about.
 */
export const SLUG_TAKEN_PROBLEM =
  'That web address is already taken, so your invitation was not saved with ' +
  'it. Everything else you entered is still here - choose another address and ' +
  'try again.';

/**
 * What a couple reads when they have no credit left to make an invitation.
 *
 * Its own sentence rather than the general one, for the same reason a taken
 * address has its own: trying again changes nothing, and what to do next is
 * somewhere else entirely. The backend spends a credit on the create that
 * succeeds and refuses the one that cannot, so this is a couple who has run
 * out rather than a couple who did something wrong - and nothing they typed is
 * lost while they sort it out.
 */
export const NO_WEDDING_CREDIT_PROBLEM =
  'Your account has no wedding invitation credits left, so this one could not ' +
  'be created. Everything you have entered is still here - add credits to ' +
  'your plan and press save again.';

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
