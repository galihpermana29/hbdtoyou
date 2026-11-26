'use client';

import { ownerEmailKey } from '@/lib/memoroll-owner';
import DeleteRoll from './delete-roll';
import { setMemoRollContext, trackMemoRoll } from '@/lib/memoroll-analytics';
import { Image } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

import type {
  IMemorollDashboardResponse,
  IMemorollEventResponse,
  IMemorollGalleryPhoto,
  IMemorollParticipant,
} from '@/action/interfaces';
// Browser-to-backend since 2026-08-30: a save or delete the owner watches
// must not die on Vercel's server-action clock - see memoroll-client-api.ts.
import {
  deleteMemorollPhotoClient as deleteMemorollPhoto,
  updateMemorollEventClient as updateMemorollEvent,
} from '@/action/memoroll-client-api';
import {
  COVER_STYLES,
  FEWEST_SHOTS,
  MOST_SHOTS,
  VIBES,
  type Vibe,
} from '@/components/memoroll/creator/draft';
import Cover, { type CoverStyle } from '@/components/memoroll/guest/cover';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import PhoneMock from '@/components/memoroll/ui/phone-mock';
import {
  memorollRecordFrom,
  serializeMemorollRecord,
} from '@/lib/memoroll-record';
import { buildRollZip } from '@/lib/memoroll-zip';
// The create flow's own path for a cover photograph (memoroll-create.tsx),
// so a photo replaced here is stored where the first ones were.
import { newUploadImageWithAPI } from '@/lib/upload';

const card =
  'rounded-[20px] border border-[#dadada] bg-white p-[20px] flex flex-col gap-[12px]';
const primaryAction =
  'rounded-full border border-[#E34013] bg-[#E34013] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-white hover:opacity-90 disabled:opacity-60';
const dangerAction =
  'rounded-full border border-[#B42318] px-[10px] py-[6px] text-[12px] font-[600] leading-[18px] text-[#B42318] hover:bg-[#FEF3F2] disabled:opacity-60';
const note = 'text-[14px] font-[400] leading-[20px] text-[#667085]';
const alert = 'text-[14px] font-[400] leading-[20px] text-[#B42318]';
const good = 'text-[14px] font-[400] leading-[20px] text-[#027A48]';
const label = 'text-[14px] font-[600] leading-[20px] text-[#344054]';
const quietAction =
  'rounded-full border border-[rgba(33,33,33,0.2)] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-60';
/** A settings field while the form is locked: there to read, not to type in. */
const lockedField =
  'rounded-full border border-transparent bg-[#F2F4F7] px-[12px] py-[8px] text-[14px] leading-[20px] text-[#475467] outline-none cursor-default';
const field =
  'rounded-full border border-[rgba(33,33,33,0.2)] px-[12px] py-[8px] text-[14px] leading-[20px] text-[#182230]';
/**
 * One of a few answers (cover style, vibe), in four states: the one chosen
 * or not, while the form can be changed or while it is locked. Locked, the
 * chosen one still has to read as chosen, because that is all there is to
 * read.
 */
const choiceOpen =
  'rounded-full border border-[rgba(33,33,33,0.2)] px-[14px] py-[8px] text-left text-[14px] font-[600] leading-[20px] text-[#344054] hover:bg-[#F9FAFB]';
const choiceOpenChosen =
  'rounded-full border border-[#E34013] bg-[#FFF4F1] px-[14px] py-[8px] text-left text-[14px] font-[600] leading-[20px] text-[#E34013]';
const choiceLocked =
  'rounded-full border border-transparent px-[14px] py-[8px] text-left text-[14px] font-[400] leading-[20px] text-[#98A2B3] cursor-default';
const choiceLockedChosen =
  'rounded-full border border-transparent bg-[#F2F4F7] px-[14px] py-[8px] text-left text-[14px] font-[600] leading-[20px] text-[#475467] cursor-default';
const slotAction =
  'rounded-full border border-[rgba(33,33,33,0.2)] px-[8px] py-[2px] text-[12px] font-[600] leading-[18px] text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-60';
const slotTile =
  'relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[12px] border border-[#dadada] bg-[#F9FAFB]';
const slotTileEmpty =
  'relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[rgba(33,33,33,0.2)] bg-[#F9FAFB] text-[12px] leading-[18px] text-[#98A2B3]';

/** How wide the phone is drawn in the card: the create flow's own preview. */
const PREVIEW_WIDTH = 154;

/** The stored cover style as the Cover reads it: anything unknown is Collage. */
function coverStyleFrom(stored: string): CoverStyle {
  return stored === 'taped' || stored === 'simple' ? stored : 'collage';
}

/** An ISO stamp as a `datetime-local` value in this browser's zone. */
function localInputFrom(iso: string): string {
  const at = new Date(Date.parse(iso));
  if (isNaN(at.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(
    at.getDate()
  )}T${pad(at.getHours())}:${pad(at.getMinutes())}`;
}

/** A `datetime-local` value as the ISO stamp the backend stores. */
function isoFrom(local: string): string | null {
  const at = new Date(local);
  return isNaN(at.getTime()) ? null : at.toISOString();
}

/** A moment said the way the dashboard says dates. */
function said(iso: string): string {
  const at = new Date(Date.parse(iso));
  return isNaN(at.getTime())
    ? ''
    : at.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
}

/**
 * The owner's console for one event, in three cards: the numbers, the
 * settings that can still change, and the photo wall the Reveal never hides
 * from the person answerable for the event.
 */
export default function MemorollConsole({
  event,
  adminView = null,
  canDelete = false,
  participantsProblem = null,
  dashboard,
  participants,
  moreParticipants,
  photos,
  morePhotos,
}: {
  event: IMemorollEventResponse;
  /**
   * Set when the administrator has opened a roll that is not theirs
   * (2026-11-25), with its owner's email where the backend sent one.
   */
  adminView?: { ownerEmail: string | null } | null;
  /** Offer to delete the whole roll. An administrator's, for now. */
  canDelete?: boolean;
  /** Why the guest list could not be read, when it could not. */
  participantsProblem?: string | null;
  dashboard: IMemorollDashboardResponse | null;
  participants: IMemorollParticipant[];
  moreParticipants: boolean;
  photos: IMemorollGalleryPhoto[];
  morePhotos: boolean;
}) {
  const router = useRouter();
  const record = memorollRecordFrom(event.detail_content_json_text);

  /**
   * Mission control breathes while the event runs (owner's call,
   * 2026-08-30): guests and shots arrive on their own every half minute,
   * and on coming back to the tab - a `router.refresh()` re-runs the page's
   * server reads while everything typed into the settings form stays put.
   * The polling retires at the Reveal, when the upload window shuts with
   * it: from there the wall only changes by the owner's own hand.
   */
  // Without the numbers there is nothing to say the roll has been revealed,
  // and in somebody else's roll the administrator never gets them: polling
  // there would ask the backend four things every half minute for ever, two
  // of them refused each time.
  const live = dashboard ? dashboard.phase !== 'revealed' : !adminView;

  // Whose roll, by email: from the event where it says, else from what the
  // list left in this tab on the way here (the event alone gives an id).
  const [ownerEmail, setOwnerEmail] = useState(adminView?.ownerEmail ?? null);
  useEffect(() => {
    if (!adminView || adminView.ownerEmail) return;
    try {
      setOwnerEmail(window.sessionStorage.getItem(ownerEmailKey(event.id)));
    } catch {
      // No store to read: the banner says "another account".
    }
  }, [adminView, event.id]);

  // The owner's side of the analytics (memoroll-analytics.ts).
  setMemoRollContext({
    surface: 'product',
    role: adminView ? 'admin' : 'creator',
    roll_code: event.code,
    phase: dashboard?.phase,
  });
  useEffect(() => {
    trackMemoRoll('memoroll_console_opened', {
      photos: photos.length,
      guests: participants.length,
    });
    // Once per visit; the counts are whatever they were on arrival.
  }, []);
  /**
   * And by hand, any time (owner, 2026-11-23): half a minute is long when a
   * guest at your elbow has just pressed the shutter, and after the Reveal
   * nothing refreshes on its own at all. The same `router.refresh()`, so the
   * settings form keeps what was typed; the transition is how the button
   * knows the new wall has landed.
   */
  /**
   * A shot, opened large (owner, 2026-11-23): the wall's tiles are small and
   * cropped to 3:4, and an owner deciding what to delete wants to see the
   * whole photograph. Ant's own viewer, the one the gift templates use, with
   * the wall as its group so the arrows walk it.
   */
  const [viewing, setViewing] = useState<number | null>(null);

  const [refreshing, startRefresh] = useTransition();
  const refresh = () => {
    trackMemoRoll('memoroll_console_refreshed');
    startRefresh(() => router.refresh());
  };
  useEffect(() => {
    if (!live) return;
    const timer = setInterval(() => router.refresh(), 30_000);
    const onFocus = () => router.refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [live, router]);

  /**
   * The settings as they are stored, in the form's own terms. What the form
   * shows while it is locked, what Edit starts from, what Cancel goes back
   * to, and what Save compares against to send only what changed.
   */
  const stored = {
    name: event.host_name,
    shots: event.shot_limit,
    opens: localInputFrom(event.starts_at),
    reveal: localInputFrom(event.reveal_at || event.ends_at),
    venue: record?.venue ?? '',
    address: record?.address ?? '',
    coverStyle: coverStyleFrom(event.cover_style),
    photos: (event.cover_photo_urls ?? []).filter(
      (photo) => typeof photo === 'string' && photo !== ''
    ),
    vibe: record?.vibe ?? ('wedding' as Vibe),
    onlyAtTheVenue: record?.onlyAtTheVenue ?? false,
  };
  const storedKey = JSON.stringify(stored);

  const [name, setName] = useState(stored.name);
  const [shots, setShots] = useState(stored.shots);
  const [opens, setOpens] = useState(stored.opens);
  const [reveal, setReveal] = useState(stored.reveal);
  const [venue, setVenue] = useState(stored.venue);
  const [address, setAddress] = useState(stored.address);
  const [coverStyle, setCoverStyle] = useState<CoverStyle>(stored.coverStyle);
  /**
   * The cover's photographs exactly as they would be sent: in slot order,
   * with no gaps. The backend replaces the whole list and cannot store a
   * hole, so the form never holds one either - taking a photo out closes the
   * row up at once, here and in the preview, instead of at the next visit.
   */
  const [coverPhotos, setCoverPhotos] = useState<string[]>(stored.photos);
  const [vibe, setVibe] = useState<Vibe>(stored.vibe);
  const [onlyAtTheVenue, setOnlyAtTheVenue] = useState(stored.onlyAtTheVenue);

  /** The one photograph on its way to storage, and the slot it is for. */
  const [uploading, setUploading] = useState<{
    slot: number;
    preview: string;
  } | null>(null);
  const [uploadProblem, setUploadProblem] = useState<string | null>(null);
  /**
   * Counts every time the form is put back to what is stored. An upload
   * remembers the count it started under, so one that lands after Cancel is
   * not written into a form that has moved on.
   */
  const fills = useRef(0);
  const picker = useRef<HTMLInputElement>(null);
  const pickingFor = useRef(0);

  /**
   * The form is read-only until somebody asks to edit it (owner,
   * 2026-11-25). It used to be live the moment the page opened, with one
   * button that rewrote the whole event; now that the administrator can be
   * standing in another person's roll, changing something takes saying so
   * first.
   */
  const [editing, setEditing] = useState(false);
  const fill = () => {
    setName(stored.name);
    setShots(stored.shots);
    setOpens(stored.opens);
    setReveal(stored.reveal);
    setVenue(stored.venue);
    setAddress(stored.address);
    setCoverStyle(stored.coverStyle);
    setCoverPhotos(stored.photos);
    setVibe(stored.vibe);
    setOnlyAtTheVenue(stored.onlyAtTheVenue);
    fills.current += 1;
    setUploading(null);
    setUploadProblem(null);
  };

  const slots =
    COVER_STYLES.find((option) => option.key === coverStyle)?.slots ?? 1;
  /** Photographs the roll holds beyond what this style has room to show. */
  const beyond = Math.max(0, coverPhotos.length - slots);

  /**
   * A picked photograph goes to storage first and into the form only once
   * it has an address there: a cover saved with a blob: URL is a cover no
   * guest can see. One at a time, so two landings cannot disagree about
   * which slot is which. If it fails, the slot is left as it was.
   */
  const uploadPhoto = (slot: number, file: File) => {
    if (uploading) return;
    const started = fills.current;
    const preview = URL.createObjectURL(file);
    const failed = () => {
      if (fills.current !== started) return;
      setUploadProblem(
        'That photograph could not be uploaded, so the cover is as it was. Pick it again to retry.'
      );
    };
    setUploadProblem(null);
    setUploading({ slot, preview });

    const body = new FormData();
    body.append('file', file);
    newUploadImageWithAPI(body)
      .then((result) => {
        const url = result.success ? result.data?.data : null;
        if (typeof url !== 'string' || !url) {
          failed();
          return;
        }
        if (fills.current !== started) return;
        setCoverPhotos((list) =>
          slot < list.length
            ? list.map((photo, index) => (index === slot ? url : photo))
            : [...list, url]
        );
      })
      .catch(failed)
      .finally(() => {
        URL.revokeObjectURL(preview);
        if (fills.current === started) setUploading(null);
      });
  };
  const pick = (slot: number) => {
    pickingFor.current = slot;
    picker.current?.click();
  };
  // While locked, the form follows the event: the page refreshes itself, and
  // an owner editing on their phone should see it here too.
  useEffect(() => {
    if (!editing) fill();
    // `storedKey` is the stored settings by value; `fill` only reads them.
  }, [storedKey, editing]);

  const [saving, setSaving] = useState(false);
  const [said_, setSaid] = useState<
    | { kind: 'saved' }
    | { kind: 'unchanged' }
    | { kind: 'failed'; problem: string }
    | null
  >(null);

  /** Download all: what it is doing now, or null when idle. */
  const [zipStatus, setZipStatus] = useState<string | null>(null);
  const [zipNote, setZipNote] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  /**
   * Every photo of the roll as one ZIP - all of them, not just the hundred
   * shown here (owner, 2026-11-12). Built in this browser; see
   * src/lib/memoroll-zip.ts for why.
   */
  const downloadAll = async () => {
    setZipNote(null);
    setZipStatus('Preparing…');
    try {
      const { blob, count, missed } = await buildRollZip(event.id, (progress) =>
        setZipStatus(
          progress.stage === 'listing'
            ? 'Preparing…'
            : progress.stage === 'fetching'
              ? `Fetching ${progress.done} of ${progress.total}…`
              : 'Zipping…'
        )
      );
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `memoroll-${event.code}.zip`;
      trackMemoRoll('memoroll_zip_downloaded', { photos: photos.length });
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setZipNote(
        missed > 0
          ? {
              ok: false,
              text: `Saved ${count} photos. ${missed} could not be fetched - try again to get them.`,
            }
          : { ok: true, text: `Saved all ${count} photos.` }
      );
    } catch (error) {
      setZipNote({
        ok: false,
        text: `The photos could not be downloaded: ${
          error instanceof Error ? error.message : String(error)
        }.`,
      });
    } finally {
      setZipStatus(null);
    }
  };

  /** Which photo's Delete has been pressed once, waiting for the second. */
  const [armed, setArmed] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteProblem, setDeleteProblem] = useState<string | null>(null);

  const save = async () => {
    // A photograph still travelling is not in the form yet; saving now would
    // save the cover without it.
    if (saving || uploading) return;
    setSaid(null);

    const startsAt = isoFrom(opens);
    const revealAt = isoFrom(reveal);
    if (!startsAt || !revealAt) {
      setSaid({ kind: 'failed', problem: 'Both times need a valid moment.' });
      return;
    }
    if (Date.parse(revealAt) < Date.parse(startsAt) + 5 * 60_000) {
      setSaid({
        kind: 'failed',
        problem:
          'The reveal has to be at least five minutes after the roll opens.',
      });
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) {
      setSaid({ kind: 'failed', problem: 'The roll needs a name.' });
      return;
    }

    /**
     * Only what changed is sent. The endpoint keeps what it is not sent, and
     * this used to send everything on every press: the title was replaced by
     * the name, the times were rounded to the minute and written back, and
     * the stored record was rebuilt from the four fields this form knows -
     * harmless to a roll this form made, not to one it did not.
     */
    const changes: Parameters<typeof updateMemorollEvent>[1] = {};
    if (trimmed !== stored.name.trim()) {
      changes.title = trimmed;
      changes.host_name = trimmed;
    }
    if (shots !== stored.shots) changes.shot_limit = shots;
    if (opens !== stored.opens) changes.starts_at = startsAt;
    if (reveal !== stored.reveal) {
      // Shooting runs to the Reveal (CONTEXT.md): the two travel together.
      changes.ends_at = revealAt;
      changes.reveal_at = revealAt;
    }
    if (coverStyle !== stored.coverStyle) changes.cover_style = coverStyle;
    // The whole list or nothing: the backend replaces the array it is sent.
    if (JSON.stringify(coverPhotos) !== JSON.stringify(stored.photos)) {
      changes.cover_photo_urls = coverPhotos;
    }
    if (
      venue.trim() !== stored.venue.trim() ||
      address.trim() !== stored.address.trim() ||
      vibe !== stored.vibe ||
      onlyAtTheVenue !== stored.onlyAtTheVenue
    ) {
      // Laid over what is stored, so a key this form does not know survives.
      let kept: Record<string, unknown> = {};
      try {
        const parsed = JSON.parse(event.detail_content_json_text || '{}');
        if (parsed && typeof parsed === 'object') kept = parsed;
      } catch {
        kept = {};
      }
      changes.detail_content_json_text = JSON.stringify({
        ...kept,
        ...JSON.parse(
          serializeMemorollRecord({
            vibe,
            venue: venue.trim(),
            address: address.trim(),
            onlyAtTheVenue,
          })
        ),
      });
    }
    if (Object.keys(changes).length === 0) {
      setSaid({ kind: 'unchanged' });
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      const saved = await updateMemorollEvent(event.id, changes);
      if (!saved.success) {
        setSaid({
          kind: 'failed',
          problem: saved.message || 'the backend sent no answer',
        });
        return;
      }
      setSaid({ kind: 'saved' });
      setEditing(false);
      router.refresh();
    } catch (error) {
      // The client call answers with an envelope, so a throw is transport
      // trouble - and a press that says nothing is the one outcome banned.
      setSaid({
        kind: 'failed',
        problem: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Two presses, deliberately: the first arms this one photo, the second
   * deletes it for good. A deleted Shot is somebody's photograph and there
   * is no undo, so the control never fires on a single tap.
   */
  const removePhoto = async (photoId: string) => {
    if (armed !== photoId) {
      setArmed(photoId);
      setDeleteProblem(null);
      return;
    }
    setDeleting(photoId);
    try {
      const gone = await deleteMemorollPhoto(event.id, photoId);
      if (!gone.success) {
        setDeleteProblem(
          `That photo could not be deleted: ${gone.message || 'no answer'}.`
        );
        return;
      }
      trackMemoRoll('memoroll_photo_deleted');
      router.refresh();
    } catch (error) {
      setDeleteProblem(
        `That photo could not be deleted: ${
          error instanceof Error ? error.message : String(error)
        }.`
      );
    } finally {
      setDeleting(null);
      setArmed(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-[24px] px-[32px] py-[32px] 2xl:max-w-7xl">
      <div>
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
            {event.host_name || 'Not named'}
          </h1>
          <span
            className={`rounded-full px-[10px] py-[2px] text-[12px] font-[600] leading-[18px] ${
              event.status === 'published'
                ? 'bg-[#ECFDF3] text-[#027A48]'
                : 'bg-[#F2F4F7] text-[#344054]'
            }`}>
            {event.status === 'published' ? 'Published' : 'Draft'}
          </span>
          {dashboard ? (
            <span className={note}>
              {dashboard.phase} · {dashboard.participant_count} joined ·{' '}
              {dashboard.photo_count} shots
            </span>
          ) : null}
        </div>
        <p className={`mt-[8px] ${note}`}>
          Opens {said(event.starts_at)} · reveals{' '}
          {said(event.reveal_at || event.ends_at)} · guests scan into{' '}
          <a
            href={`/memoroll/${event.code}`}
            target="_blank"
            rel="noreferrer"
            className="font-[600] text-[#E34013] underline">
            /memoroll/{event.code}
          </a>
        </p>
        <p className={`mt-[4px] ${note}`}>
          <Link href="/dashboard/memoroll" className="underline">
            Back to all rolls
          </Link>
        </p>
      </div>

      {adminView ? (
        <div
          role="note"
          className="rounded-[16px] border border-[#FEDF89] bg-[#FFFAEB] px-[16px] py-[12px] text-[14px] leading-[20px] text-[#93370D]">
          <strong className="font-[600]">Admin view.</strong> This roll belongs
          to{' '}
          {ownerEmail ? (
            <strong className="font-[600]">{ownerEmail}</strong>
          ) : (
            'another account'
          )}
          . Anything you save or delete here changes their event, and a deleted
          photo cannot be brought back.
        </div>
      ) : null}

      {/* Settings: what can still change after publishing. */}
      <div className={card}>
        <div>
          <h2 className="text-[18px] font-[600] leading-[28px] text-[#182230]">
            Settings
          </h2>
          <p className={note}>
            {editing
              ? adminView
                ? 'You are editing another account’s roll. Only what you change is saved.'
                : 'Only what you change is saved.'
              : 'Locked. Press Edit settings to change anything.'}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
          <label className="flex flex-col gap-[6px]">
            <span className={label}>Event name</span>
            <input
              className={editing ? field : lockedField}
              readOnly={!editing}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className={label}>
              Shots per guest ({FEWEST_SHOTS}-{MOST_SHOTS})
            </span>
            <input
              className={editing ? field : lockedField}
              readOnly={!editing}
              type="number"
              min={FEWEST_SHOTS}
              max={MOST_SHOTS}
              value={shots}
              onChange={(e) =>
                setShots(
                  Math.max(
                    FEWEST_SHOTS,
                    Math.min(MOST_SHOTS, Number(e.target.value) || FEWEST_SHOTS)
                  )
                )
              }
            />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className={label}>Opens at</span>
            <input
              className={editing ? field : lockedField}
              readOnly={!editing}
              type="datetime-local"
              value={opens}
              onChange={(e) => setOpens(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className={label}>Reveals at</span>
            <input
              className={editing ? field : lockedField}
              readOnly={!editing}
              type="datetime-local"
              value={reveal}
              onChange={(e) => setReveal(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className={label}>Venue</span>
            <input
              className={editing ? field : lockedField}
              readOnly={!editing}
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className={label}>Address</span>
            <input
              className={editing ? field : lockedField}
              readOnly={!editing}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
        </div>

        {/* The cover, the vibe and the venue rule (owner, 2026-11-26): until
            now a roll's cover could only be chosen while making it. */}
        <div className="flex flex-col gap-[16px] border-t border-[#dadada] pt-[16px] md:flex-row md:items-start md:justify-between md:gap-[24px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
            <div
              role="group"
              aria-label="Cover style"
              className="flex flex-col gap-[6px]">
              <span className={label}>Cover style</span>
              <div className="flex flex-wrap gap-[8px]">
                {COVER_STYLES.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={option.key === coverStyle}
                    disabled={!editing}
                    onClick={() => setCoverStyle(option.key)}
                    className={
                      editing
                        ? option.key === coverStyle
                          ? choiceOpenChosen
                          : choiceOpen
                        : option.key === coverStyle
                          ? choiceLockedChosen
                          : choiceLocked
                    }>
                    {option.copy}
                  </button>
                ))}
              </div>
            </div>

            <div
              role="group"
              aria-label="Cover photos"
              className="flex flex-col gap-[6px]">
              <span className={label}>
                {slots === 1 ? 'Cover photo' : `Cover photos (up to ${slots})`}
              </span>
              <div className="flex flex-wrap gap-[12px]">
                {Array.from({ length: slots }, (unused, slot) => {
                  const photo = coverPhotos[slot] ?? null;
                  const arriving = uploading?.slot === slot;
                  // Only the first empty slot takes a photograph: the list
                  // has no gaps, so that is where the next one lands.
                  const next = !photo && slot === coverPhotos.length;
                  return (
                    <div
                      key={slot}
                      data-cover-slot={slot + 1}
                      className="flex w-[72px] flex-col items-center gap-[6px]">
                      <div
                        className={
                          photo || arriving ? slotTile : slotTileEmpty
                        }>
                        {arriving ? (
                          <>
                            <img
                              src={uploading.preview}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover opacity-40"
                            />
                            <span
                              role="status"
                              className="relative text-[12px] font-[600] leading-[18px] text-[#182230]">
                              Uploading…
                            </span>
                          </>
                        ) : photo ? (
                          <img
                            src={photo}
                            alt={`Cover photo ${slot + 1}`}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <span>Empty</span>
                        )}
                      </div>
                      {editing ? (
                        photo ? (
                          <>
                            <button
                              type="button"
                              aria-label={`Replace cover photo ${slot + 1}`}
                              disabled={uploading !== null || saving}
                              onClick={() => pick(slot)}
                              className={slotAction}>
                              Replace
                            </button>
                            <button
                              type="button"
                              aria-label={`Remove cover photo ${slot + 1}`}
                              disabled={uploading !== null || saving}
                              onClick={() =>
                                setCoverPhotos((list) =>
                                  list.filter((kept, index) => index !== slot)
                                )
                              }
                              className={slotAction}>
                              Remove
                            </button>
                          </>
                        ) : next ? (
                          <button
                            type="button"
                            aria-label={`Add cover photo ${slot + 1}`}
                            disabled={uploading !== null || saving}
                            onClick={() => pick(slot)}
                            className={slotAction}>
                            Add
                          </button>
                        ) : null
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {editing ? (
                <input
                  ref={picker}
                  type="file"
                  accept="image/*"
                  aria-label="Cover photo file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhoto(pickingFor.current, file);
                    // The same file picked twice fires no second change.
                    e.target.value = '';
                  }}
                />
              ) : null}
              {beyond > 0 ? (
                <p data-cover-kept className={note}>
                  {slots === 1
                    ? `This style shows one photo. The other ${beyond} ${
                        beyond === 1 ? 'stays' : 'stay'
                      } saved with the roll and ${
                        beyond === 1 ? 'comes' : 'come'
                      } back if you choose Collage again. Remove this one and the next takes its place.`
                    : `${beyond} more ${
                        beyond === 1 ? 'photo is' : 'photos are'
                      } saved with the roll than this style shows.`}
                </p>
              ) : coverPhotos.length > 0 && coverPhotos.length < slots ? (
                <p className={note}>
                  With fewer than {slots}, guests see these repeated around the
                  cover.
                </p>
              ) : null}
              {uploadProblem ? (
                <p role="alert" className={alert}>
                  {uploadProblem}
                </p>
              ) : null}
            </div>

            <div
              role="group"
              aria-label="Vibe"
              className="flex flex-col gap-[6px]">
              <span className={label}>Vibe</span>
              <div className="flex flex-wrap gap-[8px]">
                {VIBES.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={option.key === vibe}
                    disabled={!editing}
                    onClick={() => setVibe(option.key)}
                    className={
                      editing
                        ? option.key === vibe
                          ? choiceOpenChosen
                          : choiceOpen
                        : option.key === vibe
                          ? choiceLockedChosen
                          : choiceLocked
                    }>
                    {option.copy}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-[12px]">
              <button
                type="button"
                role="switch"
                aria-checked={onlyAtTheVenue}
                aria-label="Only at the venue"
                disabled={!editing}
                onClick={() => setOnlyAtTheVenue((on) => !on)}
                className={
                  onlyAtTheVenue
                    ? editing
                      ? 'flex h-[24px] w-[44px] shrink-0 items-center justify-end rounded-full bg-[#E34013] p-[2px]'
                      : 'flex h-[24px] w-[44px] shrink-0 cursor-default items-center justify-end rounded-full bg-[#98A2B3] p-[2px]'
                    : editing
                      ? 'flex h-[24px] w-[44px] shrink-0 items-center justify-start rounded-full bg-[#D0D5DD] p-[2px]'
                      : 'flex h-[24px] w-[44px] shrink-0 cursor-default items-center justify-start rounded-full bg-[#EAECF0] p-[2px]'
                }>
                <span className="block h-[20px] w-[20px] rounded-full bg-white shadow" />
              </button>
              <div className="flex flex-col">
                <span className={label}>
                  Only at the venue: {onlyAtTheVenue ? 'on' : 'off'}
                </span>
                {/* Stored and enforced by nothing yet (memoroll-record.ts);
                    the card says so rather than promise a fence. */}
                <span className={note}>
                  Saved with the roll. Nothing checks where a guest is yet.
                </span>
              </div>
            </div>
          </div>

          {/* The Cover itself, as a guest gets it: not a draft, so a short
              collage repeats its photos the way theirs does, and with no
              entrance, which is a guest's alone. */}
          <div className="flex shrink-0 flex-col items-center gap-[6px]">
            <span className={label}>What guests see</span>
            <div className={memorollFonts}>
              <PhoneMock width={PREVIEW_WIDTH}>
                <Cover
                  eventName={name}
                  photos={coverPhotos}
                  style={coverStyle}
                  // The guest page's own words for the button.
                  ctaLabel="Get me in"
                  onEnter={() => {}}
                />
              </PhoneMock>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-[12px]">
          {editing ? (
            <>
              <button
                type="button"
                onClick={save}
                disabled={saving || uploading !== null}
                aria-busy={saving}
                className={primaryAction}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  fill();
                  setSaid(null);
                  setEditing(false);
                }}
                className={quietAction}>
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                fill();
                setSaid(null);
                setEditing(true);
              }}
              className={quietAction}>
              Edit settings
            </button>
          )}
          {said_?.kind === 'saved' ? (
            <p role="status" className={good}>
              Saved. Guests see the change on their next visit.
            </p>
          ) : null}
          {said_?.kind === 'unchanged' ? (
            <p role="status" className={note}>
              Nothing was changed, so nothing was sent.
            </p>
          ) : null}
          {said_?.kind === 'failed' ? (
            <p role="alert" className={alert}>
              {said_.problem}
            </p>
          ) : null}
        </div>
      </div>

      {/* Who joined. */}
      <div className={card}>
        <h2 className="text-[18px] font-[600] leading-[28px] text-[#182230]">
          Participants
        </h2>
        {participantsProblem ? (
          <p className={note}>
            The guest list could not be read: {participantsProblem}.
          </p>
        ) : participants.length === 0 ? (
          <p className={note}>Nobody has joined yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] leading-[20px]">
              <thead>
                <tr className="text-[#667085]">
                  <th className="py-[8px] pr-[16px] font-[600]">Guest</th>
                  <th className="py-[8px] pr-[16px] font-[600]">Account</th>
                  <th className="py-[8px] pr-[16px] font-[600]">Shots used</th>
                  <th className="py-[8px] pr-[16px] font-[600]">Joined</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((guest) => (
                  <tr key={guest.id} className="border-t border-[#dadada]">
                    <td className="py-[8px] pr-[16px] font-[600] text-[#182230]">
                      {guest.display_name || guest.user_name}
                    </td>
                    <td className="py-[8px] pr-[16px] text-[#667085]">
                      {guest.user_name}
                    </td>
                    <td className="py-[8px] pr-[16px] text-[#182230]">
                      {guest.shots_used}
                    </td>
                    <td className="py-[8px] pr-[16px] text-[#667085]">
                      {said(guest.joined_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {moreParticipants ? (
          <p className={note}>
            This shows the first hundred guests and there are more.
          </p>
        ) : null}
      </div>

      {/* Every shot, reveal or no reveal. */}
      <div className={card}>
        <div className="flex flex-wrap items-start justify-between gap-[12px]">
          <h2 className="text-[18px] font-[600] leading-[28px] text-[#182230]">
            Photos
          </h2>
          <div className="flex flex-wrap items-center gap-[8px]">
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              aria-busy={refreshing}
              className="rounded-full border border-[rgba(33,33,33,0.2)] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-60">
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            {photos.length > 0 ? (
              <button
                type="button"
                onClick={downloadAll}
                disabled={zipStatus !== null}
                aria-busy={zipStatus !== null}
                className={primaryAction}>
                {zipStatus ?? 'Download all (ZIP)'}
              </button>
            ) : null}
          </div>
        </div>
        <p className={note}>
          Everything guests have shot, including what the reveal still hides
          from them. Deleting removes a photo for everyone, for good.
        </p>
        {zipNote ? (
          <p role="status" className={zipNote.ok ? good : alert}>
            {zipNote.text}
          </p>
        ) : null}
        {deleteProblem ? (
          <p role="alert" className={alert}>
            {deleteProblem}
          </p>
        ) : null}
        {photos.length === 0 ? (
          <p className={note}>No shots yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 lg:grid-cols-5">
            {photos.map((photo, index) => (
              <figure key={photo.id} className="flex flex-col gap-[6px]">
                <button
                  type="button"
                  aria-label={`Open the shot ${photo.uploader_name} took`}
                  onClick={() => setViewing(index)}
                  className="block w-full cursor-zoom-in">
                  <img
                    src={photo.photo_url}
                    alt={`A shot ${photo.uploader_name} took`}
                    className="aspect-[3/4] w-full rounded-[12px] border border-[#dadada] object-cover"
                    loading="lazy"
                  />
                </button>
                <figcaption className="flex items-center justify-between gap-[8px]">
                  <span className="truncate text-[12px] font-[600] leading-[18px] text-[#344054]">
                    {photo.uploader_name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    disabled={deleting === photo.id}
                    aria-busy={deleting === photo.id}
                    className={dangerAction}>
                    {deleting === photo.id
                      ? 'Deleting…'
                      : armed === photo.id
                        ? 'Sure?'
                        : 'Delete'}
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
        {/* Nothing of its own on the page: only the viewer, when asked. */}
        <div className="hidden">
          <Image.PreviewGroup
            items={photos.map((photo) => photo.photo_url)}
            preview={{
              visible: viewing !== null,
              current: viewing ?? 0,
              onVisibleChange: (open) => {
                if (!open) setViewing(null);
              },
              onChange: (current) => setViewing(current),
            }}
          />
        </div>
        {morePhotos ? (
          <p className={note}>
            This shows the first hundred shots and there are more.
          </p>
        ) : null}
      </div>

      {canDelete ? (
        <DeleteRoll
          eventId={event.id}
          name={event.host_name}
          code={event.code}
          ownerEmail={adminView ? (ownerEmail ?? 'another account') : null}
          guests={dashboard?.participant_count ?? null}
          shots={dashboard?.photo_count ?? null}
        />
      ) : null}
    </div>
  );
}
