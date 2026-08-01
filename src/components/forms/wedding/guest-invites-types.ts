/**
 * What a couple enters on the guest invites step, and the rules it is held to.
 *
 * Everything here is decided in the browser. There is no backend behind any of
 * it: the product has no per-content slug, no availability check and no
 * fetch-by-slug, so this module validates a slug's *format* and nothing else.
 * Whether a slug is still free is a question only a backend can answer, and
 * answering it here would mean inventing an answer. That is `hbd-byb.17`.
 */

import type { GuestList } from './guest-list';

/** What a couple enters on the guest invites step. */
export interface GuestInvitesValues {
  /** The Invitation Slug, as typed. Not yet checked for availability. */
  slug: string;
  /** The message a guest receives, with placeholders still in it. */
  greetingMessage: string;
  /**
   * The Guest List, as read from the CSV they uploaded and then corrected, or
   * null until they have uploaded one.
   *
   * Which of those it is decides which of the two states the design draws for
   * this step is showing.
   */
  guestList: GuestList | null;
}

/**
 * The suffix the design prints after the slug.
 *
 * The design draws the chosen name as a subdomain, and the shareable link is a
 * path instead: see `docs/adr/0001-path-urls-not-subdomains.md`. The field keeps
 * the design's suffix, because that is what the couple was shown; only the link
 * the preview composes follows the ADR.
 */
export const SLUG_PREFIX = 'memoify.live/wedding/';

export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 63;

/**
 * The rules, written for the couple rather than as a regular expression.
 *
 * The design shows no hint under this field. It is here because a couple who
 * cannot see the rules can only discover them by failing, which is the whole
 * point of user story 34 on the epic.
 */
export const SLUG_RULES =
  `Letters, numbers and hyphens only, ${SLUG_MIN_LENGTH} to ${SLUG_MAX_LENGTH} ` +
  'characters, starting and ending with a letter or a number';

const ALLOWED_CHARACTERS = /^[A-Za-z0-9-]+$/;
const STARTS_WELL = /^[A-Za-z0-9]/;
const ENDS_WELL = /[A-Za-z0-9]$/;

/**
 * What is wrong with a slug, in words a couple can act on, or null when it is
 * well formed.
 *
 * One problem is reported rather than all of them, in the order a person hits
 * them while typing, so the message under the field changes as they fix it
 * instead of listing everything they have not done yet.
 */
export function slugProblem(slug: string): string | null {
  const value = slug.trim();

  if (value === '') {
    return 'Choose a web domain for your invitation';
  }
  if (!ALLOWED_CHARACTERS.test(value)) {
    return 'Use letters, numbers and hyphens only';
  }
  if (value.length < SLUG_MIN_LENGTH || value.length > SLUG_MAX_LENGTH) {
    return `Use between ${SLUG_MIN_LENGTH} and ${SLUG_MAX_LENGTH} characters`;
  }
  if (!STARTS_WELL.test(value) || !ENDS_WELL.test(value)) {
    return 'Start and end with a letter or a number';
  }
  return null;
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

/** The guest the preview addresses, so a couple sees a name rather than a slot. */
export const SAMPLE_GUEST_NAME = 'Johnny';

/**
 * Where a published invitation lives, or null while the slug is not usable yet.
 *
 * Null rather than a link built from an empty slug: an address showing
 * `https://memoify.live/wedding/` would be telling the couple something untrue
 * about what they are about to send.
 *
 * The shape is a path, per `docs/adr/0001-path-urls-not-subdomains.md`, and the
 * field the couple types into shows the same path ahead of the box rather than a
 * subdomain after it. The design draws a subdomain, which the product cannot
 * serve; showing it would promise an address that does not resolve.
 */
export function invitationLinkFor(slug: string): string | null {
  if (slugProblem(slug)) return null;
  return `https://${SLUG_PREFIX}${slug.trim()}`;
}

/**
 * The link one guest would receive, or null while the slug is not usable yet.
 *
 * The same address as the invitation itself, naming the guest it was written
 * for, so the invitation can greet them.
 */
export function guestLinkFor(slug: string, guestName: string): string | null {
  const invitation = invitationLinkFor(slug);
  if (!invitation) return null;
  return `${invitation}?name=${guestName.trim().toLowerCase()}`;
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
