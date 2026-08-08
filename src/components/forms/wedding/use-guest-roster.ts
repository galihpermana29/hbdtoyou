'use client';

/**
 * The Guest List as the backend holds it: read back, added to, corrected and
 * cut down.
 *
 * ## Why this exists
 *
 * The list used to be parsed in the browser and dropped. A couple uploaded two
 * hundred names and none of them existed anywhere once the tab closed - which is
 * worse than losing a list, because the backend mints each guest a token when
 * they are saved and that token *is* their personal link. Nothing that resolves
 * a personal link could be exercised while nothing ever saved a guest.
 *
 * ## Every change goes before it shows
 *
 * Nothing here draws a guest the backend has not agreed to. An upload sends the
 * batch and then shows what came back; a correction is sent and then shown; a
 * deletion is sent and then the row goes. A refusal leaves the screen exactly as
 * it was and says what the backend said.
 *
 * The alternative - change the screen first and undo it if the call fails - was
 * rejected because the guarantee the couple needs is that the list in front of
 * them is the list their guests are on. Doing it this way makes that true by
 * construction rather than by remembering to undo everything correctly, and the
 * cost is that a press waits for the call it is making.
 *
 * ## Uploading replaces, so it also removes
 *
 * The design's only way to change a list wholesale is to upload again, and a
 * couple doing that after fixing their spreadsheet means the new file rather
 * than the new file added to the old one. The backend has no endpoint that
 * replaces, so this inserts the new batch and then deletes the guests the file
 * replaced.
 *
 * That order and not the other one. Insert-then-delete means a refused insert
 * changes nothing at all - the old list is still on the screen and still on the
 * backend - where delete-then-insert would leave a couple whose insert failed
 * with no guests anywhere. If a deletion then fails, the invitation carries a
 * guest the screen does not show, and that is said plainly and by name, because
 * a stale row holds a live personal link.
 *
 * ## A visitor with no invitation
 *
 * Saving needs an owner, so somebody who is not signed in has no invitation and
 * therefore nowhere to put a guest. Their list is held in the browser exactly as
 * it always was: they can upload, correct and delete, and none of it goes
 * anywhere, which is the same deal the rest of the flow already gives them. See
 * `use-invitation.ts` for why that is not this bead's to fix.
 */

import { useEffect, useRef, useState } from 'react';

import {
  addWeddingGuests,
  deleteWeddingGuest,
  listWeddingGuests,
  updateWeddingGuest,
} from '@/action/wedding-api';
import type { IWeddingGuestResponse } from '@/action/interfaces';
import {
  guestAsUpdated,
  guestFromRow,
  guestToPayload,
  guestToUpdatePayload,
  readGuestList,
  type Guest,
  type GuestList,
} from './guest-list';

export interface GuestRoster {
  /**
   * The Guest List as it stands, or null while the couple has uploaded none.
   *
   * Which of those it is decides which of the two states the design draws for
   * the Add Guest List Section is showing.
   */
  guestList: GuestList | null;
  /** Read a chosen file and let the guests it names replace the whole list. */
  upload: (file: File) => Promise<void>;
  /**
   * Correct one guest, leaving the rest of the list alone, and say whether the
   * backend took it.
   *
   * The answer is what lets the table keep a refused row open with the couple's
   * typing still in it, rather than closing it over the guest as they were.
   */
  correct: (guest: Guest) => Promise<boolean>;
  /** Take one guest off the list. */
  remove: (id: string) => Promise<void>;
  /** What a couple is told about the last of those, or nothing to tell them. */
  problem: string | null;
  /**
   * Whether one of them is in flight, so that a press cannot be made twice and
   * a couple can tell a slow one from a dead one.
   */
  isBusy: boolean;
}

/**
 * What a couple reads when the backend refused something they did to the list.
 *
 * The backend's reason, and then what is still true, because the shape of the
 * damage differs every time and a couple who is only told "that failed" has to
 * guess whether the guest they were looking at is on their invitation.
 */
function refused(whatDidNotHappen: string, reason: string): string {
  return `${whatDidNotHappen}: ${reason}.`;
}

const uploadProblem = (reason: string) =>
  refused('Your guest list was not saved', reason) +
  ' Everybody on it is still here, so you can try again.';

const correctProblem = (name: string, reason: string) =>
  refused(`${name} was not changed`, reason) +
  ' Your invitation still has them as they were.';

const removeProblem = (name: string, reason: string) =>
  refused(`${name} was not removed`, reason) +
  ' They are still on your invitation, so you can try again.';

/**
 * What a couple reads when the new list went on and the old one would not come
 * off.
 *
 * By name, because each of these is a guest holding a working personal link to
 * an invitation whose list no longer shows them, and the couple is the only
 * person who can tell whether that matters.
 *
 * A few names and then a count, rather than all of them. A replaced list can be
 * two hundred people, and a sentence carrying two hundred names is one nobody
 * reads at all - which would lose the count as well as the names.
 */
const NAMES_WORTH_LISTING = 3;

const stranded = (names: string[]) => {
  if (names.length <= NAMES_WORTH_LISTING) return names.join(', ');
  const rest = names.length - NAMES_WORTH_LISTING;
  return `${names.slice(0, NAMES_WORTH_LISTING).join(', ')} and ${rest} others`;
};

const staleProblem = (names: string[]) =>
  `Your new guest list is saved, but ${stranded(names)} could not be removed ` +
  'from the old one. They are still on your invitation and still have a link, ' +
  'so upload the file again to try removing them.';

const readProblem = (reason: string) =>
  refused('Your guest list could not be read back', reason) +
  ' It is safe; try again in a moment.';

/**
 * When the guests the backend holds were put there.
 *
 * The earliest row's own timestamp, which is when the batch that inserted them
 * ran, which is when the couple uploaded the file. Read from the rows rather
 * than remembered, because the browser that uploaded the file is not the browser
 * that reads it back.
 *
 * A set of rows carrying no timestamp this can read falls back to now. The
 * design draws a date on this card and there is nothing else to draw, and unlike
 * every other value in this flow it is neither a couple's answer nor anything a
 * guest ever sees.
 */
function uploadedAtOf(rows: IWeddingGuestResponse[]): Date {
  const stamps = rows
    .map((row) => new Date(row.CreateTime ?? '').getTime())
    .filter((stamp) => Number.isFinite(stamp));
  return stamps.length > 0 ? new Date(Math.min(...stamps)) : new Date();
}

export function useGuestRoster(weddingId: string | null): GuestRoster {
  const [guestList, setGuestList] = useState<GuestList | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  /**
   * The invitation whose guests have already been asked for.
   *
   * Once each, because the read is only ever about what somebody else's session
   * left behind: everything this flow does to the list afterwards, it already
   * knows about. Asking again would overwrite the couple's own screen with a
   * slower answer to an older question.
   */
  const readBack = useRef<string | null>(null);

  useEffect(() => {
    if (!weddingId || readBack.current === weddingId) return;
    readBack.current = weddingId;

    let abandoned = false;

    (async () => {
      const answered = await listWeddingGuests(weddingId);
      if (abandoned) return;

      if (!answered.success) {
        setProblem(readProblem(answered.message));
        return;
      }

      const rows = answered.data ?? [];
      // No guests is the empty state rather than a Guest List with nobody on
      // it, which is also every invitation this flow has just created.
      if (rows.length === 0) return;

      // Only where the couple has no list in front of them. This read is about
      // what an earlier session left behind, and it can land after they have
      // already uploaded one - at which point their file is the newer answer and
      // the read is a slow reply to a question that has been overtaken.
      setGuestList(
        (existing) =>
          existing ?? {
            guests: rows.map(guestFromRow),
            uploadedAt: uploadedAtOf(rows),
          }
      );
    })();

    return () => {
      abandoned = true;
    };
  }, [weddingId]);

  /** The list with these guests on it, or the empty state when there are none. */
  function setList(guests: Guest[], uploadedAt: Date) {
    // Nobody left is the empty state again rather than a Guest List with nobody
    // on it: an upload date belongs to a file that still names someone.
    setGuestList(guests.length > 0 ? { guests, uploadedAt } : null);
  }

  async function upload(file: File) {
    setProblem(null);

    // Busy from the moment the file is taken rather than from the moment it is
    // sent, so that reading a large one cannot be interrupted by a second file
    // chosen while the first was still being read.
    setIsBusy(true);
    try {
      const { guests, problem: fileProblem } = await readGuestList(file);
      if (!guests) {
        setProblem(fileProblem);
        return;
      }

      // Nowhere to send them. Held in the browser, as the whole list was before
      // any of this - see the note at the top of this file.
      if (!weddingId) {
        setList(guests, new Date());
        return;
      }

      const replaced = (guestList?.guests ?? []).filter(
        (guest) => guest.token !== null
      );

      const sent = await addWeddingGuests(
        guests.map(guestToPayload),
        weddingId
      );
      if (!sent.success || !sent.data) {
        setProblem(
          uploadProblem(sent.message || 'the backend sent no guests back')
        );
        return;
      }

      // The backend's own rows, not the guests that were sent: each one carries
      // the identifier and the token minted for it, and only the row it came on
      // says which guest that token belongs to.
      setList(sent.data.map(guestFromRow), new Date());

      // And now the ones this file replaced. After the insert rather than
      // before it, so that a refused insert costs the couple nothing.
      const couldNotRemove: string[] = [];
      for (const guest of replaced) {
        const removed = await deleteWeddingGuest(weddingId, guest.id);
        if (!removed.success) couldNotRemove.push(guest.name);
      }
      if (couldNotRemove.length > 0) setProblem(staleProblem(couldNotRemove));
    } finally {
      setIsBusy(false);
    }
  }

  async function correct(corrected: Guest): Promise<boolean> {
    setProblem(null);
    if (!guestList) return false;

    const before = guestList.guests.find((guest) => guest.id === corrected.id);
    if (!before) return false;

    const replaceGuest = (guest: Guest) =>
      setList(
        guestList.guests.map((existing) =>
          existing.id === guest.id ? guest : existing
        ),
        guestList.uploadedAt
      );

    // A guest the backend has never held is one this flow is still holding on
    // its own, so correcting them is correcting what is in front of the couple.
    if (!weddingId || corrected.token === null) {
      replaceGuest(corrected);
      return true;
    }

    setIsBusy(true);
    try {
      const changed = await updateWeddingGuest(
        guestToUpdatePayload(corrected),
        weddingId,
        corrected.id
      );
      if (!changed.success) {
        setProblem(correctProblem(before.name, changed.message));
        return false;
      }
      replaceGuest(guestAsUpdated(corrected, before));
      return true;
    } finally {
      setIsBusy(false);
    }
  }

  async function remove(id: string) {
    setProblem(null);
    if (!guestList) return;

    const going = guestList.guests.find((guest) => guest.id === id);
    if (!going) return;

    const left = guestList.guests.filter((guest) => guest.id !== id);

    if (!weddingId || going.token === null) {
      setList(left, guestList.uploadedAt);
      return;
    }

    setIsBusy(true);
    try {
      const removed = await deleteWeddingGuest(weddingId, id);
      if (!removed.success) {
        setProblem(removeProblem(going.name, removed.message));
        return;
      }
      setList(left, guestList.uploadedAt);
    } finally {
      setIsBusy(false);
    }
  }

  return { guestList, upload, correct, remove, problem, isBusy };
}
