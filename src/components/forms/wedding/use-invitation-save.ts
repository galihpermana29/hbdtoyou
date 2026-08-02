'use client';

/**
 * Keeping what a couple has entered.
 *
 * The first save creates the invitation and every save after it updates the one
 * that was created, so the flow has to know whether it has an invitation yet.
 * That is the whole of what this holds: an identifier, or nothing, plus what
 * went wrong the last time it tried.
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
 * it already was for somebody who was never going to be able to save.
 */

import { useRef, useState } from 'react';

import type { FormInstance } from 'antd';

import { getAllTemplates } from '@/action/user-api';
import {
  createWeddingInvitation,
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

export interface InvitationSave {
  /** Keep what the couple has entered so far. */
  save: () => Promise<SaveOutcome>;
  /** Whether a save is in flight, so nothing can be pressed twice into one. */
  isSaving: boolean;
  /** What a couple is told about the last save, or nothing to tell them. */
  problem: string | null;
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
  /** Forget that message, for a step that is no longer the one it was about. */
  forgetProblem: () => void;
}

/** What a couple reads when their invitation did not reach the backend. */
export function saveProblemMessage(reason: string): string {
  return (
    `Your invitation was not saved: ${reason}. Nothing you have entered has ` +
    'been lost, so you can try again.'
  );
}

/** What they read when they asked to save and there is no account to save to. */
export const NOT_SIGNED_IN_PROBLEM =
  'You are not signed in, so there is nowhere to save your invitation yet. ' +
  'Sign in and try again.';

export function useInvitationSave(
  form: FormInstance<WeddingInvitationFormValues>
): InvitationSave {
  const session = useMemoifySession();
  const [isSaving, setIsSaving] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

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

  async function save(): Promise<SaveOutcome> {
    if (!session?.accessToken) return 'NOT_SIGNED_IN';

    setIsSaving(true);
    setProblem(null);

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
          setProblem(saveProblemMessage(updated.message));
          return 'FAILED';
        }
        return 'SAVED';
      }

      const template = await weddingTemplateId();
      if ('problem' in template) {
        setProblem(saveProblemMessage(template.problem));
        return 'FAILED';
      }

      const created = await createWeddingInvitation({
        template_id: template.id,
        ...payload,
      });
      if (!created.success || !created.data?.id) {
        setProblem(
          saveProblemMessage(
            created.message || 'the backend sent no invitation'
          )
        );
        return 'FAILED';
      }

      // Only now does this flow have an invitation. Until this line every retry
      // creates, which is what a couple whose first save failed needs.
      invitationId.current = created.data.id;
      return 'SAVED';
    } catch (error) {
      // The wedding calls answer with a result rather than throwing, including
      // for a network failure, but the template lookup does not: `user-api.ts`
      // fetches without catching, so a couple whose signal drops mid-save would
      // otherwise get a rejected promise, no message and no idea why the step
      // would not finish.
      setProblem(
        saveProblemMessage(
          error instanceof Error ? error.message : String(error)
        )
      );
      return 'FAILED';
    } finally {
      setIsSaving(false);
    }
  }

  return {
    save,
    isSaving,
    problem,
    sayThereIsNobodyToSaveFor: () => setProblem(NOT_SIGNED_IN_PROBLEM),
    forgetProblem: () => setProblem(null),
  };
}
