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
 * ## Opening one that already exists
 *
 * A flow opened on a saved invitation is handed its identifier and starts
 * holding it, which is the whole of what editing needs: every branch here
 * already asks whether there is one, so a save from an editor updates for the
 * same reason a couple's second press does. Nothing else changes - the same
 * calls, the same failures, the same words - and there is no second code path
 * that could drift from the first.
 *
 * A published invitation is not a special case either. `PUT /{uuid}` does not
 * ask what state an invitation is in, so a change to one guests are already
 * holding is live the moment it saves, and there is no draft copy and no
 * republish step for there to be. The screen that offers the edit is where that
 * is said, because it is the only place a couple can still decide not to.
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
 * Once, the flow sends a slug instead of reading one. The title now names the
 * couple, so a couple whose nicknames exist by their first save is minted a
 * name-derived slug by the backend's own generator; a couple who drafted first
 * got a generic one. On the save where both nicknames first exist - and only
 * while the invitation is unpublished - one more write goes out carrying the
 * slug their names spell, so their URL says who they are. Refused or not,
 * nothing is said: the pretty address is a courtesy, not a promise. From the
 * moment the invitation is published the slug is frozen forever, because a
 * shared link must never die - see `offerANamedAddress`.
 *
 * ## What a save carries, and what it does not
 *
 * Everything on the antd form, plus the greeting message, which is not on it:
 * the guest invites step is not a form and holds its own words, so they are
 * handed to `save` rather than fished out of a store they were never put in.
 *
 * The Guest List is not carried here at all. Guests are their own rows on the
 * backend with their own endpoints, and each one gets a token minted for them
 * when they are inserted, so a list is not a field of the invitation and cannot
 * ride along with one. What this owes the Guest List is the invitation to hang
 * it on, which is `weddingId`. Sending it is `use-guest-roster.ts`.
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
 * The route no longer lets that visitor in: it asks them to sign in first, by
 * sending them to the landing page whose own control signs them in and brings
 * them back - see the flow's `page.tsx`. So nobody reaches this hook without an
 * account except on a server whose gate was deliberately stood down, which is
 * one server: the one the check starts, because the check drives the flow
 * signed out. `NOT_SIGNED_IN` is what a save answers there, so that a control
 * pressed on purpose - Save as draft - can say why nothing happened, while Next
 * stays a step and not a save. Publishing answers `NOTHING_TO_PUBLISH` for the
 * same drive and for the same reason: there is no invitation, so there is
 * nothing to ask the backend about, and Confirm Create carries the check on to
 * the published screen it is there to hold against the design.
 */

import { useRef, useState } from 'react';

import type { FormInstance } from 'antd';

import {
  INSUFFICIENT_QUOTA,
  SLUG_TAKEN,
  type IWeddingInvitationPayload,
} from '@/action/interfaces';
import { getAllTemplates } from '@/action/user-api';
// The saves a couple actively waits on go browser-to-backend: a server
// action on Vercel is a serverless function with a ten-second ceiling, and
// the backend has been seen honouring a save in ninety (2026-08-30). The
// listing-cache purge rides inside the client calls themselves.
import {
  createWeddingInvitationClient as createWeddingInvitation,
  getOwnedWeddingInvitationClient as getOwnedWeddingInvitation,
  updateWeddingInvitationClient as updateWeddingInvitation,
} from '@/action/wedding-client-api';
import { useMemoifySession } from '@/app/session-provider';
import {
  NO_WEDDING_CREDIT_PROBLEM,
  NOT_SIGNED_IN_PROBLEM,
  problemMessage,
  SLUG_TAKEN_PROBLEM,
} from './invitation-problems';
import { attemptPublish } from './publish-invitation';
import {
  formValuesToInvitationPayload,
  invitationSlugFrom,
  namesTheCouple,
  WEDDING_TEMPLATE_SLUG,
  type WeddingInvitationFormValues,
} from './wedding-invitation-types';

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
  /**
   * Keep what the couple has entered so far, greeting message included.
   *
   * The message is passed in rather than read out of the form, because the guest
   * invites step is not an antd form and never put it there. It is asked for on
   * every save so that no caller can leave it behind: a couple who writes the
   * words their families will read and then publishes an invitation without them
   * has lost the one thing on that step that is theirs to write.
   */
  save: (
    greetingMessage: string,
    /**
     * The address the couple chose, when it is theirs rather than the minted
     * one. Left out on an invitation that has already gone out: the step stops
     * offering it, and the save refuses it again.
     */
    chosenSlug?: string
  ) => Promise<SaveOutcome>;
  /**
   * The invitation this flow has created, or null while it has none.
   *
   * What the Guest List is hung on. Guests belong to an invitation, so there is
   * nowhere to put one until a save has made it - see `use-guest-roster.ts`,
   * which reads this and does nothing at all while it is null.
   */
  weddingId: string | null;
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
   * empty title, which a couple cannot cause - an invitation whose nicknames
   * are still empty is titled the fixed stand-in rather than nothing - so
   * every other one would be a string invented here for a fault nobody can
   * describe.
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
 * An invitation this flow was opened on rather than one it is about to make.
 *
 * Everything a save needs to update the existing invitation instead of creating
 * a second one. What the couple entered is not here: that is the form's, and it
 * is seeded through the form's own initial values.
 */
export interface OpenedInvitation {
  weddingId: string;
  /** The address it already has, or empty when the read did not carry one. */
  slug: string;
  /**
   * Whether guests can already read it.
   *
   * What freezes the address: a published invitation's slug is forever,
   * because a shared link must never die, so no save on one may carry a slug -
   * see `offerANamedAddress`, the one code path that sends one.
   */
  isPublished: boolean;
  /**
   * Whether the saved record already carries both nicknames.
   *
   * True is a couple whose one chance at a name-derived address has already
   * come and gone: the save where their names first existed is behind them,
   * whether it made the offer, never needed to because the title named them at
   * create, or predates there being an offer at all. See `offerANamedAddress`.
   */
  namesTheCouple: boolean;
}

export function useInvitation(
  form: FormInstance<WeddingInvitationFormValues>,
  /**
   * The invitation being opened again, or nothing for one being made.
   *
   * Read once, at the first render, because it is where this flow started
   * rather than something that changes under it: an invitation cannot become a
   * different invitation while a couple is editing it.
   */
  opened?: OpenedInvitation
): Invitation {
  const session = useMemoifySession();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [outstanding, setOutstanding] = useState<string[] | null>(null);
  const [slug, setSlug] = useState<string | null>(opened?.slug || null);

  /**
   * The invitation this flow has created, or nothing while it has none.
   *
   * A ref rather than state because nothing on the screen is drawn from it, and
   * because a save reads it at the moment it runs: state read out of a callback
   * that was made before the create came back would still be the `null` it was
   * then, and the couple would get a second invitation for their second press.
   *
   * A flow opened on an invitation starts holding it, which is the whole of what
   * makes editing update rather than create: every branch below already asks
   * this one question, so an identifier put here before the first save is an
   * identifier every save updates.
   */
  const invitationId = useRef<string | null>(opened?.weddingId ?? null);

  /**
   * The same identifier, for the parts of the screen that are drawn from it.
   *
   * The ref is what a save reads mid-flight and the state is what a render
   * reads, and they are written together in the one place an invitation comes
   * into existence. A ref alone would never re-render the Guest List into
   * knowing it now has somewhere to go.
   */
  const [weddingId, setWeddingId] = useState<string | null>(
    opened?.weddingId ?? null
  );

  /**
   * Whether guests can already read this invitation.
   *
   * A ref for the same reason `invitationId` is: a save reads it at the moment
   * it runs, and nothing on the screen is drawn from it. From the moment this
   * is true no save may carry a slug, forever - a shared link must never die -
   * and publishing is the only thing that sets it.
   */
  const published = useRef(opened?.isPublished ?? false);

  /**
   * Whether this invitation has had its one chance at a name-derived address.
   *
   * The offer is made on the save where both nicknames first exist and never
   * again: a slug does not chase a couple who corrects a name later, because
   * an address that keeps moving is worse than one that says slightly less. A
   * flow opened on a record that already names them both starts with this
   * spent: the save where their names first existed is behind it, whether it
   * made the offer or predates there being one.
   */
  const namedAddressOffered = useRef(opened?.namesTheCouple ?? false);

  /**
   * Whether the couple has chosen an address of their own.
   *
   * What stops the automatic offer from writing over somebody who typed one,
   * and what stops the flow reading the minted address back over the top of
   * theirs. A ref rather than state: nothing renders from it, and it has to be
   * true for the rest of the same save that set it.
   */
  const chosenAddress = useRef(false);

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

  /**
   * Write the invitation's own identifier into the record it holds.
   *
   * Only ever after a create. The record is the one place a couple's listing can
   * read which invitation a content row belongs to - see `WEDDING_ID_KEY` - and
   * the create that wrote it did not know the identifier yet, because the
   * identifier is what the create answered with.
   *
   * The same values as the save that just ran, read from the form again rather
   * than passed along, so the two writes cannot disagree about anything except
   * the one key this adds.
   */
  async function nameTheRecord(weddingId: string, greetingMessage: string) {
    await updateWeddingInvitation(
      formValuesToInvitationPayload(
        form.getFieldsValue(true),
        greetingMessage,
        weddingId
      ),
      weddingId
    );
  }

  /**
   * Send the invitation the address its couple's names spell, once, silently.
   *
   * The backend mints a slug at create from the title it is given and never
   * changes it unless a new one is explicitly sent. A couple whose nicknames
   * were in the title by their first save therefore already has a named
   * address and this never runs for them; a couple who drafted before typing
   * names got a generic one. So on the save where both nicknames first exist,
   * while the invitation is still unpublished, one more write goes out: the
   * same payload the save that just landed carried, plus the slug the names
   * spell, so their URL says who they are.
   *
   * One offer, whatever comes of it. Refused as taken - or refused at all -
   * the minted slug stands and nothing is said, because the couple's save
   * already landed and the pretty address is a courtesy, not a promise. And
   * never on or after publish: a shared link must never die, so from that
   * moment no code path sends a slug.
   */
  async function offerANamedAddress(
    weddingId: string,
    payload: Omit<IWeddingInvitationPayload, 'template_id'>,
    values: WeddingInvitationFormValues
  ) {
    // A couple who chose their own address outranks the offer: the whole
    // point of the offer is to spare people who do not care about URLs from
    // a hex suffix, and somebody who typed one has said they care.
    if (published.current || namedAddressOffered.current) return;
    if (chosenAddress.current) return;
    if (!namesTheCouple(values.groomName, values.brideName)) return;

    // This save is the one where both nicknames first exist, so the offer is
    // spent here whatever comes of it - including on names that spell nothing
    // a URL can carry, where the minted slug stands and nothing is sent.
    namedAddressOffered.current = true;

    const named = invitationSlugFrom(values.groomName, values.brideName);
    if (!named) return;

    const renamed = await updateWeddingInvitation(
      { ...payload, invitation_slug: named },
      weddingId
    );
    // The one way the flow ever knows a slug without reading it back: the
    // backend was sent this one by name and took it.
    if (renamed.success) setSlug(named);
  }

  /** Drop whatever the last press had to say, whichever press it was. */
  function forgetWhatWentWrong() {
    setProblem(null);
    setOutstanding(null);
  }

  async function save(
    greetingMessage: string,
    /**
     * The address the couple typed, when it is theirs rather than the one the
     * backend minted.
     *
     * Carried on the update that saves everything else, so choosing an address
     * is not a second press and cannot half-happen. A published invitation
     * never sends one: the step stops taking it, and this refuses it again
     * here, because the rule that a shared link must never die is worth
     * keeping in both places.
     */
    chosenSlug?: string
  ): Promise<SaveOutcome> {
    if (!session?.accessToken) return 'NOT_SIGNED_IN';

    setIsSaving(true);
    // Everything the last press had to say, because this one is what the line
    // under the row is about now.
    forgetWhatWentWrong();

    try {
      // Every field, including the ones a couple has not touched, because the
      // backend is sent the whole invitation rather than a diff and an untouched
      // switch is still an answer.
      //
      // The identifier goes in with it, so that the saved record says which
      // invitation it is - see `WEDDING_ID_KEY`, which is what a couple's
      // listing reads to find its way back here. A create has none yet.
      const values = form.getFieldsValue(true);
      const payload = formValuesToInvitationPayload(
        values,
        greetingMessage,
        invitationId.current
      );

      if (invitationId.current) {
        const chosen =
          chosenSlug && !published.current ? chosenSlug.trim() : undefined;
        const updated = await updateWeddingInvitation(
          chosen ? { ...payload, invitation_slug: chosen } : payload,
          invitationId.current
        );
        if (!updated.success) {
          // A name somebody else got to first is not a fault: the couple is
          // told which of the two things went wrong, so that "try another"
          // and "try again" are not the same sentence.
          setProblem(
            updated.message === SLUG_TAKEN
              ? SLUG_TAKEN_PROBLEM
              : problemMessage('saved', updated.message)
          );
          return 'FAILED';
        }
        // Theirs from the moment the backend took it, so the flow stops
        // reading the minted one back over the top of it.
        if (chosen) {
          chosenAddress.current = true;
          setSlug(chosen);
        }
        await learnTheAddress(invitationId.current);
        // If this was the save where both nicknames first existed, their
        // invitation can now be offered an address that says who they are.
        // After the update rather than inside it, so a save can never be
        // refused over a slug the couple did not ask for.
        await offerANamedAddress(invitationId.current, payload, values);
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
        // A couple out of credit has not failed at anything, and telling them
        // to try again would be telling them to fail again - the create is
        // what spends the credit, so there is nothing to retry until they have
        // one. Named the way the taken address is named, and for the reason.
        setProblem(
          created.message === INSUFFICIENT_QUOTA
            ? NO_WEDDING_CREDIT_PROBLEM
            : problemMessage(
                'saved',
                created.message || 'the backend sent no invitation'
              )
        );
        return 'FAILED';
      }

      // Only now does this flow have an invitation. Until this line every retry
      // creates, which is what a couple whose first save failed needs. And only
      // now is there anywhere to put a guest, which is what the state says.
      invitationId.current = created.data.id;
      setWeddingId(created.data.id);
      // A couple whose nicknames were in the title has been minted a slug
      // from it by the backend's own generator, and nothing else happens:
      // their one offer is spent at the moment it was never needed.
      if (namesTheCouple(values.groomName, values.brideName)) {
        namedAddressOffered.current = true;
      }
      // And only now is there an invitation to have an address, so this is the
      // earliest the couple can be told where their wedding is going to live.
      await learnTheAddress(created.data.id);
      // And only now can the record say which invitation it is, which the create
      // above could not: the identifier is the backend's answer to it. So a
      // first save is two writes, and the second one is what makes this
      // invitation findable again from the couple's own listing.
      //
      // Silent when it does not land, exactly as `learnTheAddress` is and for
      // the same reason: the invitation is saved either way, every later save
      // carries the identifier too, and every way out of this flow saves. What
      // it costs in the meantime is a row the listing can show and cannot open,
      // which that screen says plainly rather than hiding.
      await nameTheRecord(created.data.id, greetingMessage);
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
      // The same two calls the couple's own listing makes, in the same order and
      // refused in the same words - see `publish-invitation.ts`. What this adds
      // is where the answer is printed, which is the only part that is the
      // flow's.
      const attempt = await attemptPublish(weddingId);
      if (attempt.outcome === 'FAILED') {
        setProblem(attempt.problem);
        return 'FAILED';
      }
      if (attempt.outcome === 'NOT_READY') {
        setOutstanding(attempt.outstanding);
        return 'NOT_READY';
      }
      // Guests can hold the link from this moment, so the address is frozen:
      // no save from here on may carry a slug - see `offerANamedAddress`.
      published.current = true;
      return 'PUBLISHED';
    } finally {
      setIsPublishing(false);
    }
  }

  return {
    save,
    weddingId,
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
