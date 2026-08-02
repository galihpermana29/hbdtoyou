'use client';

/**
 * The invitation this flow is making: keeping it, learning where it lives, and
 * publishing it.
 *
 * The first save creates the invitation and every save after it updates the one
 * that was created, so the flow has to know whether it has an invitation yet.
 * That is the whole of what this holds: an identifier, or nothing, plus what the
 * last attempt at either had to say.
 *
 * A failure leaves the identifier exactly as it was. A create that failed leaves
 * nothing, so the next attempt creates again rather than updating an invitation
 * that was never made; an update that failed leaves the identifier, so the next
 * attempt updates the same one rather than making a second.
 *
 * Nothing here is silent. A save that did not happen comes back as a message the
 * step prints and refuses to go on past, because a couple who believes their
 * evening is saved and finds out otherwise has lost more than a step.
 *
 * ## The address is read back, never guessed
 *
 * The Invitation Slug is the backend's. It generates one when an invitation is
 * created without a name, and the create call answers with the identifier alone,
 * so the flow that caused the slug cannot see it. Reading the invitation back is
 * the only way, and a save is the only moment there is anything to read - so
 * that is where it happens, straight after the first one and again after any
 * later one while the address is still unknown.
 *
 * ## Publishing asks first
 *
 * The backend does not validate on publish. It says so deliberately, so that a
 * frontend can show a couple what is missing rather than letting a half-finished
 * invitation go out. So publishing here is two calls: the check, and then the
 * publish it permits. An invitation whose check came back with anything
 * outstanding is not published and stays a draft, which costs the couple nothing
 * because it was a draft already, and the control stays pressable so that
 * fixing what was named and trying again is one press.
 *
 * ## A visitor with no account
 *
 * Saving needs an owner, and an owner is somebody signed in: the backend answers
 * an unauthenticated create with `UNAUTHORIZED_ACCESS`. A visitor who is not
 * signed in therefore has no invitation to write to, and pressing Next leaves
 * them exactly where this flow left them before it saved anything - looking
 * through it, keeping nothing. They cannot fill it in either way, because every
 * photograph they upload is refused for the same reason.
 *
 * Asking them to sign in instead is the right answer and is not this bead's:
 * the flow is reachable at its own URL by anybody, which is `hbd-d6z`.
 * `NOT_SIGNED_IN` is what a save answers instead, so that a control pressed on
 * purpose - Save as draft - can say why nothing happened, while Next stays what
 * it already was for somebody who was never going to be able to save. Publishing
 * answers `NOTHING_TO_PUBLISH` for the same visitor and for the same reason:
 * there is no invitation, so there is nothing to ask the backend about, and
 * Confirm Create carries them on exactly as it did before any of this saved.
 */

import { useRef, useState } from 'react';

import type { FormInstance } from 'antd';

import { getAllTemplates } from '@/action/user-api';
import {
  createWeddingInvitation,
  getOwnedWeddingInvitation,
  publishCheckWeddingInvitation,
  publishWeddingInvitation,
  updateWeddingInvitation,
} from '@/action/wedding-api';
import { useMemoifySession } from '@/app/session-provider';
import {
  formValuesToInvitationPayload,
  type WeddingInvitationFormValues,
} from './wedding-invitation-types';

/**
 * The backend template this flow fills in, found by its slug.
 *
 * By slug rather than by the UUID itself, because the UUID differs between
 * environments and a literal one would save into whichever wedding happened to
 * carry that id elsewhere. This is the same lookup the photobox flow does for
 * the same reason, and it goes away when a couple can choose between wedding
 * templates and the choice carries the id.
 */
const WEDDING_TEMPLATE_SLUG = 'wedding-inv';

/** What became of a save. */
export type SaveOutcome =
  /** The backend has it. */
  | 'SAVED'
  /** It was refused or never reached, and `problem` says so. */
  | 'FAILED'
  /** There was nobody to save for, so nothing was sent. */
  | 'NOT_SIGNED_IN';

/** What became of an attempt to publish. */
export type PublishOutcome =
  /** It is out: guests who have the address can read it. */
  | 'PUBLISHED'
  /** The backend named something still missing, and `outstanding` lists it. */
  | 'NOT_READY'
  /** A call was refused or never reached, and `problem` says so. */
  | 'FAILED'
  /** There is no invitation, so nothing was asked and nothing was sent. */
  | 'NOTHING_TO_PUBLISH';

export interface Invitation {
  /** Keep what the couple has entered so far. */
  save: () => Promise<SaveOutcome>;
  /**
   * The Invitation Slug this invitation was given, or null while the flow has
   * not been able to learn one.
   *
   * Null covers three cases and tells them apart nowhere, because none of them
   * is an address: nothing has been saved, the read that would have learned it
   * did not come back, or there is nobody signed in to save for. Every screen
   * that shows an address already draws nothing when there is none.
   */
  slug: string | null;
  /** Whether a save is in flight, so nothing can be pressed twice into one. */
  isSaving: boolean;
  /**
   * Ask whether the invitation may go out, and publish it if it may.
   *
   * Two calls rather than one, because the backend runs no check of its own on
   * publish. A couple whose invitation is not ready is told and keeps a draft.
   */
  publish: () => Promise<PublishOutcome>;
  /** Whether that is in flight, for the same reason `isSaving` exists. */
  isPublishing: boolean;
  /** What a couple is told about the last attempt, or nothing to tell them. */
  problem: string | null;
  /**
   * What the backend says is still missing, in its own words, or nothing.
   *
   * Its words rather than ours: the only issue the contract documents is an
   * empty title, which this flow hardcodes and a couple cannot cause, so every
   * other one would be a string invented here for a fault nobody can describe.
   */
  outstanding: string[] | null;
  /**
   * Say that there is no account to save to.
   *
   * A save answers `NOT_SIGNED_IN` without saying anything, because the press
   * that carries a couple to the next step is not a request to save and a
   * visitor who cannot save anything should not be stopped by a message on every
   * one of them. A press that asked for a save and nothing else is a request, so
   * the control behind it says this rather than appearing to have done nothing.
   */
  sayThereIsNobodyToSaveFor: () => void;
  /**
   * Forget all of that, for a step that is no longer the one it was about.
   *
   * Both at once, because both are printed in the same place under the row that
   * was pressed, and a couple who has gone elsewhere pressed neither.
   */
  forgetWhatWentWrong: () => void;
}

/**
 * What a couple reads when a press of theirs did not reach the backend.
 *
 * One sentence for both, because both say the same thing: what did not happen,
 * what the backend gave as the reason, and that nothing they entered is gone.
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
 * What a couple reads when the check refused and named nothing.
 *
 * The contract says a refusal carries its reasons, so this is the shape being
 * broken rather than a case the product has. It is still written down, because
 * a couple whose invitation will not publish and who is shown an empty list has
 * been told less than nothing.
 */
export const UNSTATED_ISSUE =
  'The backend refused to publish this invitation and did not say why.';

export function useInvitation(
  form: FormInstance<WeddingInvitationFormValues>
): Invitation {
  const session = useMemoifySession();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [outstanding, setOutstanding] = useState<string[] | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  /**
   * The invitation this flow has created, or nothing while it has none.
   *
   * A ref rather than state because nothing on the screen is drawn from it, and
   * because a save reads it at the moment it runs: state read out of a callback
   * that was made before the create came back would still be the `null` it was
   * then, and the couple would get a second invitation for their second press.
   */
  const invitationId = useRef<string | null>(null);

  /** The backend's id for the template this flow fills in. */
  async function weddingTemplateId(): Promise<
    { id: string } | { problem: string }
  > {
    const templates = await getAllTemplates();
    if (!templates.success) {
      return {
        problem: templates.message || 'the templates could not be read',
      };
    }

    const template = templates.data?.find(
      (candidate) => candidate.slug === WEDDING_TEMPLATE_SLUG
    );
    if (!template) {
      return { problem: 'this wedding template is not available right now' };
    }

    return { id: template.id };
  }

  /**
   * Find out what address this invitation was given, if it is not known yet.
   *
   * The slug belongs to the backend - it generates one when an invitation is
   * created without a name - and the create call answers with the identifier
   * alone, so the only way to learn it is to read the invitation back.
   *
   * A read that does not come back says nothing to the couple. The save it
   * followed worked, their invitation is kept, and the one thing missing is the
   * address, which every screen that shows one already draws nothing for. The
   * next save asks again, so a couple who carries on filling the flow in is
   * likely to be told the address before they reach the screen that needs it.
   */
  async function learnTheAddress(weddingId: string) {
    if (slug) return;

    const invitation = await getOwnedWeddingInvitation(weddingId);
    const learned = invitation.data?.invitation_slug?.trim();
    if (learned) setSlug(learned);
  }

  /** Drop whatever the last press had to say, whichever press it was. */
  function forgetWhatWentWrong() {
    setProblem(null);
    setOutstanding(null);
  }

  async function save(): Promise<SaveOutcome> {
    if (!session?.accessToken) return 'NOT_SIGNED_IN';

    setIsSaving(true);
    // Everything the last press had to say, because this one is what the line
    // under the row is about now.
    forgetWhatWentWrong();

    try {
      // Every field, including the ones a couple has not touched, because the
      // backend is sent the whole invitation rather than a diff and an untouched
      // switch is still an answer.
      const payload = formValuesToInvitationPayload(form.getFieldsValue(true));

      if (invitationId.current) {
        const updated = await updateWeddingInvitation(
          payload,
          invitationId.current
        );
        if (!updated.success) {
          setProblem(problemMessage('saved', updated.message));
          return 'FAILED';
        }
        await learnTheAddress(invitationId.current);
        return 'SAVED';
      }

      const template = await weddingTemplateId();
      if ('problem' in template) {
        setProblem(problemMessage('saved', template.problem));
        return 'FAILED';
      }

      const created = await createWeddingInvitation({
        template_id: template.id,
        ...payload,
      });
      if (!created.success || !created.data?.id) {
        setProblem(
          problemMessage(
            'saved',
            created.message || 'the backend sent no invitation'
          )
        );
        return 'FAILED';
      }

      // Only now does this flow have an invitation. Until this line every retry
      // creates, which is what a couple whose first save failed needs.
      invitationId.current = created.data.id;
      // And only now is there an invitation to have an address, so this is the
      // earliest the couple can be told where their wedding is going to live.
      await learnTheAddress(created.data.id);
      return 'SAVED';
    } catch (error) {
      // The wedding calls answer with a result rather than throwing, including
      // for a network failure, but the template lookup does not: `user-api.ts`
      // fetches without catching, so a couple whose signal drops mid-save would
      // otherwise get a rejected promise, no message and no idea why the step
      // would not finish.
      setProblem(
        problemMessage(
          'saved',
          error instanceof Error ? error.message : String(error)
        )
      );
      return 'FAILED';
    } finally {
      setIsSaving(false);
    }
  }

  async function publish(): Promise<PublishOutcome> {
    // Nothing has ever been saved, so there is nothing to ask about and nothing
    // to publish. That is a visitor with no account, who was never able to save
    // a word of this - see the note at the top of this file.
    const weddingId = invitationId.current;
    if (!weddingId) return 'NOTHING_TO_PUBLISH';

    setIsPublishing(true);
    forgetWhatWentWrong();

    try {
      const check = await publishCheckWeddingInvitation(weddingId);
      if (!check.success || !check.data) {
        setProblem(
          problemMessage(
            'published',
            check.message || 'the backend did not answer the check'
          )
        );
        return 'FAILED';
      }

      if (!check.data.OK) {
        // Whatever came back, and a line of our own only when nothing did. The
        // message alone: the contract's example pairs a field name with a whole
        // sentence naming it ("title", "Title must not be empty"), so printing
        // both would say it twice.
        const issues = (check.data.Issues ?? [])
          .map((issue) => issue.Message?.trim())
          .filter((message): message is string => Boolean(message));
        setOutstanding(issues.length > 0 ? issues : [UNSTATED_ISSUE]);
        return 'NOT_READY';
      }

      const published = await publishWeddingInvitation(weddingId);
      if (!published.success) {
        setProblem(problemMessage('published', published.message));
        return 'FAILED';
      }

      // The backend answers a publish with the state it left the invitation in,
      // so a state that is not published is taken at its word rather than read
      // as one because the call itself came back. An answer with no state at all
      // is not disagreeing with anything, and the call succeeded.
      if (published.data && published.data.status !== 'published') {
        setProblem(
          problemMessage(
            'published',
            `the backend left it a ${published.data.status}`
          )
        );
        return 'FAILED';
      }

      return 'PUBLISHED';
    } catch (error) {
      // Both wedding calls answer with a result rather than throwing, so this
      // is only reached if one of them ever stops doing that. A couple is told
      // either way, because the alternative is a press that did nothing.
      setProblem(
        problemMessage(
          'published',
          error instanceof Error ? error.message : String(error)
        )
      );
      return 'FAILED';
    } finally {
      setIsPublishing(false);
    }
  }

  return {
    save,
    slug,
    isSaving,
    publish,
    isPublishing,
    problem,
    outstanding,
    sayThereIsNobodyToSaveFor: () => setProblem(NOT_SIGNED_IN_PROBLEM),
    forgetWhatWentWrong,
  };
}
