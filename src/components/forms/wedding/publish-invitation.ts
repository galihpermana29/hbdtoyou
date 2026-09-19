'use client';

/**
 * Asking whether an invitation may go out, and publishing it if it may.
 *
 * Two calls rather than one, and deliberately so. The backend runs no check of
 * its own on publish - it says so in the contract - which is what lets a caller
 * show a couple what is still missing instead of letting a half-finished
 * invitation reach their families. So publishing is: ask, and then publish what
 * the answer permits.
 *
 * Here rather than inside the Create Flow's `useInvitation`, because two screens
 * publish now: the flow's Confirm Create, and the Publish beside an invitation
 * in the couple's own listing. The same two calls in the same order, refused in
 * the same words - a second copy would be a second set of words for the same
 * refusal, and the one a couple happened to read would decide what they thought
 * had gone wrong.
 *
 * Nothing here holds state or draws anything. What each screen does with an
 * answer is the screen's.
 */

// Browser-to-backend since 2026-08-30, for the reason wedding-client-api.ts
// records: a publish somebody is watching must not die on Vercel's clock.
import {
  publishCheckWeddingInvitationClient as publishCheckWeddingInvitation,
  publishWeddingInvitationClient as publishWeddingInvitation,
} from '@/action/wedding-client-api';
import { problemMessage, UNSTATED_ISSUE } from './invitation-problems';

/** What became of an attempt to publish one invitation. */
export type PublishAttempt =
  /** It is out: guests who have the address can read it. */
  | { outcome: 'PUBLISHED' }
  /** The backend named something still missing, in its own words. */
  | { outcome: 'NOT_READY'; outstanding: string[] }
  /** A call was refused or never reached, and this says so. */
  | { outcome: 'FAILED'; problem: string };

/**
 * Ask whether this invitation may go out, and publish it if it may.
 *
 * An invitation whose check comes back with anything outstanding is not
 * published and stays the draft it already was, which costs the couple nothing,
 * and what came back is theirs to read and act on.
 */
export async function attemptPublish(
  weddingId: string
): Promise<PublishAttempt> {
  try {
    const check = await publishCheckWeddingInvitation(weddingId);
    if (!check.success || !check.data) {
      return {
        outcome: 'FAILED',
        problem: problemMessage(
          'published',
          check.message || 'the backend did not answer the check'
        ),
      };
    }

    if (!check.data.OK) {
      // Whatever came back, and a line of our own only when nothing did. The
      // message alone: the contract's example pairs a field name with a whole
      // sentence naming it ("title", "Title must not be empty"), so printing
      // both would say it twice.
      const outstanding = (check.data.Issues ?? [])
        .map((issue) => issue.Message?.trim())
        .filter((message): message is string => Boolean(message));
      return {
        outcome: 'NOT_READY',
        outstanding: outstanding.length > 0 ? outstanding : [UNSTATED_ISSUE],
      };
    }

    const published = await publishWeddingInvitation(weddingId);
    if (!published.success) {
      return {
        outcome: 'FAILED',
        problem: problemMessage('published', published.message),
      };
    }

    // The backend answers a publish with the state it left the invitation in,
    // so a state that is not published is taken at its word rather than read as
    // one because the call itself came back. An answer with no state at all is
    // not disagreeing with anything, and the call succeeded.
    if (published.data && published.data.status !== 'published') {
      return {
        outcome: 'FAILED',
        problem: problemMessage(
          'published',
          `the backend left it a ${published.data.status}`
        ),
      };
    }

    return { outcome: 'PUBLISHED' };
  } catch (error) {
    // Both wedding calls answer with a result rather than throwing, so this is
    // only reached if one of them ever stops doing that. A couple is told
    // either way, because the alternative is a press that did nothing.
    return {
      outcome: 'FAILED',
      problem: problemMessage(
        'published',
        error instanceof Error ? error.message : String(error)
      ),
    };
  }
}
