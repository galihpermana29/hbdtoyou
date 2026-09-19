/**
 * What a couple enters on the guest invites step, and the address they are
 * given.
 *
 * The address is not one of the things they enter. The backend generates the
 * Invitation Slug when an invitation is created without one, and there is no
 * endpoint to ask whether a name is taken - so a couple who picked their own
 * could only be told it was gone after failing. The field shows the slug and
 * takes no typing, and this module has no rules to hold it to: they would be
 * rules for something nobody types, checking a value nobody here produced.
 *
 * Nothing here reaches a network. Everything is composed from what the flow
 * already holds.
 */

import { INVITATION_APEX_HOST, invitationHostFor } from '@/lib/invitation-host';

/**
 * What a couple enters on the guest invites step.
 *
 * The Guest List is the other thing on this step and is not one of these. It is
 * not held by the step at all any more: the backend holds it, and
 * `use-guest-roster.ts` is what reads it back and sends every change to it. A
 * copy here would be a second answer to "who is invited", and the wrong one
 * every time a call was refused.
 */
export interface GuestInvitesValues {
  /**
   * The Invitation Slug the invitation is published under.
   *
   * Minted by the backend, and the couple's to change while the invitation is
   * unpublished: the step writes what they type here, and a save carries it.
   * From publish it is frozen and the field stops taking anything, because a
   * shared link must never die.
   */
  slug: string;
  /**
   * The message a guest receives, with placeholders still in it.
   *
   * Saved with the invitation rather than on each guest's row: it is one message
   * per invitation, the same words for everybody, and the two placeholders that
   * differ - the guest's name and their link - are resolved per guest when the
   * message goes out. On the row it would be the same paragraph stored two
   * hundred times and editing it would be two hundred writes.
   */
  greetingMessage: string;
}

/**
 * The fixed part of the address, printed after the slug, exactly as the design
 * draws it: the slug is served as the subdomain, per
 * `docs/adr/0005-an-invitation-answers-at-its-own-subdomain.md`. The address
 * no longer names the template, because which template draws a wedding is the
 * record's business rather than the URL's.
 */
export const SLUG_SUFFIX = `.${INVITATION_APEX_HOST}`;

/**
 * What an address is allowed to be, as the backend's own guide writes it:
 * lowercase letters and digits, single hyphens between them, three to
 * sixty-three characters. A subdomain label, in other words, which is what it
 * becomes.
 */
const SLUG_RULE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SLUG_SHORTEST = 3;
const SLUG_LONGEST = 63;

/**
 * The rules, printed under the box where a couple types.
 *
 * A couple who cannot see the rules can only find them by being refused, which
 * is what user story 34 on `hbd-byb` exists to prevent. The line was withdrawn
 * once, when the field stopped taking anything - see
 * `docs/adr/0002-figma-is-literal-truth.md` - and comes back with the typing.
 */
export const SLUG_RULE_HINT =
  'Letters, numbers and hyphens only, 3 to 63 characters, starting and ending with a letter or a number';

/**
 * Whether what a couple has typed could be an address at all, answered here
 * rather than by the backend.
 *
 * Nothing that breaks the rule is worth a request: the answer is already
 * known, and a couple learns it as they type rather than after a wait. True
 * only says the shape is right - whether the name is still free is the
 * backend's to say, and only until somebody else's save says otherwise.
 */
export function isSlugShaped(slug: string): boolean {
  const trimmed = slug.trim();
  return (
    trimmed.length >= SLUG_SHORTEST &&
    trimmed.length <= SLUG_LONGEST &&
    SLUG_RULE.test(trimmed)
  );
}

/**
 * The query parameter an invitation's slug can be supplied by, for a screen on
 * which no invitation can exist.
 *
 * No couple is ever shown an address from here. The slug is the backend's to
 * generate, `useInvitation` reads it back off the saved invitation, and that is
 * the only address the flow puts in front of anybody - it is the only one that
 * resolves.
 *
 * What this is for is the check. Saving needs an account, the check drives the
 * flow signed out, so nothing it does can create an invitation or be given a
 * slug - and the design draws a published screen whose whole subject is the
 * address. Without a way to hand that screen one there would be nothing there to
 * hold against the frame.
 *
 * The same scaffolding shape the Showcase uses to choose its Example Content:
 * opt-in, and drawn from nowhere by default, so a couple who has saved nothing
 * is shown no address rather than somebody else's.
 */
export const SLUG_PARAM = 'slug';

/** The slug a query gave, or none, in which case there is no address yet. */
export function slugFrom(value: string | string[] | undefined): string {
  const slug = Array.isArray(value) ? value[0] : value;
  return slug?.trim() ?? '';
}

/** The placeholders the greeting message is written in terms of. */
export const GUEST_MESSAGE_PLACEHOLDERS = {
  brideNickname: '[Bride Nickname]',
  groomNickname: '[Groom Nickname]',
  guestName: '[Guest Name]',
  guestLink: '[Generated Guest Link]',
} as const;

/** The message the design starts a couple off with, placeholders and all. */
export const DEFAULT_GUEST_MESSAGE = [
  'The Wedding of [Bride Nickname] & [Groom Nickname]',
  '',
  'Dear [Guest Name],',
  '',
  'With joyful hearts, we would like to invite you to celebrate our wedding and be part of one of the most meaningful days of our lives.',
  '',
  'Your presence and blessings would mean so much to us as we begin this beautiful new chapter together.',
  '',
  'Please find the details of our wedding celebration through the invitation link below:',
  '',
  '[Generated Guest Link]',
  '',
  'We truly hope you can join us and share this special moment with our family and loved ones.',
  '',
  'With love and gratitude,',
  '[Bride Nickname] & [Groom Nickname]',
].join('\n');

/**
 * The greeting message written out with the couple's own names in it.
 *
 * Two of the four placeholders belong to the couple and are filled here. The
 * other two belong to the guest - their name and their personal link - and stay
 * as they are, because they are resolved per guest when the message goes out.
 *
 * A nickname that has not been given yet leaves its placeholder alone. Writing
 * an empty string into the message instead would leave "The Wedding of  & " and
 * read as a mistake rather than as a question not yet answered.
 */
export function greetingSeededWith(
  brideNickname: string,
  groomNickname: string
): string {
  let message = DEFAULT_GUEST_MESSAGE;
  const bride = brideNickname.trim();
  const groom = groomNickname.trim();
  if (bride !== '') {
    message = message
      .split(GUEST_MESSAGE_PLACEHOLDERS.brideNickname)
      .join(bride);
  }
  if (groom !== '') {
    message = message
      .split(GUEST_MESSAGE_PLACEHOLDERS.groomNickname)
      .join(groom);
  }
  return message;
}

/** The guest the preview addresses, so a couple sees a name rather than a slot. */
export const SAMPLE_GUEST_NAME = 'Johnny';

/**
 * The token the preview's link carries, which belongs to nobody.
 *
 * A real token is minted by the backend when the Guest List is saved, one per
 * guest, and there is no guest here: the preview is a picture of a message to a
 * guest called Johnny who does not exist. So this is the shape of a personal
 * link rather than one that opens anything, which is all the preview is drawing.
 */
export const SAMPLE_GUEST_TOKEN = 'sample-guest-token';

/**
 * The query parameter a guest's personal link carries their token in.
 *
 * The token rather than their name. It is the backend that says who a guest is
 * - `resolveWeddingGuest` hands it back the name on the Guest List - and a name
 * on the address would be a name anybody could type, which would put a
 * stranger's word on the one surface of the invitation meant to be that guest's
 * own. It is also what a reply will be signed with when replying is wired, so a
 * link that carries it is a link a guest will be able to answer from.
 */
export const GUEST_TOKEN_PARAM = 'guest';

/** The guest token a link carried, or none, in which case no guest opened it. */
export function guestTokenFrom(value: string | string[] | undefined): string {
  const token = Array.isArray(value) ? value[0] : value;
  return token?.trim() ?? '';
}

/**
 * Where a published invitation lives, or null while it has no slug.
 *
 * Null rather than a link built from an empty slug: an address showing
 * `https://.memoify.live` would be telling the couple something untrue about
 * what they are about to send. Nothing else is checked, because nothing else
 * is ours to check - the slug comes from the backend, and a malformed one is
 * neither something a couple caused nor something they could fix.
 *
 * The shape is the slug as a subdomain, which is what the design always drew
 * and what the middleware now serves: see
 * `docs/adr/0005-an-invitation-answers-at-its-own-subdomain.md`. The old path
 * address still answers, with a redirect to this one.
 */
export function invitationLinkFor(slug: string): string | null {
  const value = slug.trim();
  if (value === '') return null;
  // The subdomain is production's alone: only the deployment serving
  // memoify.live runs the middleware that resolves it, so on staging and in
  // dev the pretty address opens the wrong site's landing page (found live,
  // 2026-08-31). Everywhere that is not production links the path route the
  // middleware itself rewrites to - the same viewer, an address that
  // actually answers here.
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
    return `/w/${value}`;
  }
  return `https://${invitationHostFor(value)}`;
}

/**
 * The link one guest would receive, or null while there is no address yet.
 *
 * The same address as the invitation itself, carrying the token that guest was
 * minted, so the invitation they open knows who opened it and can greet them by
 * the name the Guest List holds.
 *
 * The design writes this link as `?name=guest`, which cannot work: a name is
 * something anybody can type, and the invitation would have to take a stranger's
 * word for who they were. See `docs/adr/0002-figma-is-literal-truth.md`.
 */
export function guestLinkFor(slug: string, guestToken: string): string | null {
  const invitation = invitationLinkFor(slug);
  const token = guestToken.trim();
  if (!invitation || token === '') return null;
  return `${invitation}?${GUEST_TOKEN_PARAM}=${encodeURIComponent(token)}`;
}

/**
 * Where to open one guest's invitation from a screen the couple is on.
 *
 * The address a guest is *sent* is always the subdomain - see `guestLinkFor`,
 * which is what the message carries and what ADR 0005 settles. This is the
 * other thing: a couple pressing "open" on their own screen, who wants to see
 * the invitation rather than send it.
 *
 * Off production that address does not resolve. There is no wildcard DNS on a
 * laptop, so `{slug}.memoify.live` reaches nothing, while the route behind it
 * answers perfectly well at `/w/{slug}` - the same page, which is what the
 * middleware rewrites a subdomain to in the first place. So the couple is sent
 * to the path locally and to their real address in production, and either way
 * they are looking at the invitation.
 *
 * Carries the guest's token when there is one, because the row this is pressed
 * from is a guest: the couple sees the envelope with that guest's name on it,
 * which is the thing they are checking.
 */
export function invitationPreviewLinkFor(
  slug: string,
  guestToken?: string
): string | null {
  const address = slug.trim();
  if (address === '') return null;

  const inProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';
  const base = inProduction
    ? `https://${invitationHostFor(address)}`
    : `/w/${encodeURIComponent(address)}`;

  const token = guestToken?.trim() ?? '';
  return token === ''
    ? base
    : `${base}?${GUEST_TOKEN_PARAM}=${encodeURIComponent(token)}`;
}

export interface GuestMessageSubstitutions {
  brideNickname: string;
  groomNickname: string;
  guestName: string;
  guestLink: string | null;
}

/**
 * The greeting message as one guest will actually receive it.
 *
 * A placeholder with nothing to put in its place is left standing rather than
 * blanked, so the couple can see which part of their message is still waiting
 * on them.
 */
export function renderGuestMessage(
  message: string,
  {
    brideNickname,
    groomNickname,
    guestName,
    guestLink,
  }: GuestMessageSubstitutions
): string {
  const replacements: [string, string | null][] = [
    [GUEST_MESSAGE_PLACEHOLDERS.brideNickname, brideNickname],
    [GUEST_MESSAGE_PLACEHOLDERS.groomNickname, groomNickname],
    [GUEST_MESSAGE_PLACEHOLDERS.guestName, guestName],
    [GUEST_MESSAGE_PLACEHOLDERS.guestLink, guestLink],
  ];

  return replacements.reduce(
    (text, [placeholder, value]) =>
      value ? text.split(placeholder).join(value) : text,
    message
  );
}
