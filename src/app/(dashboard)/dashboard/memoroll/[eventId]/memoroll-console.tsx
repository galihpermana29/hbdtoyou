'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  FEWEST_SHOTS,
  MOST_SHOTS,
} from '@/components/memoroll/creator/draft';
import {
  memorollRecordFrom,
  serializeMemorollRecord,
} from '@/lib/memoroll-record';

const card =
  'rounded-[12px] border border-[#EAECF0] bg-white p-[20px] flex flex-col gap-[12px]';
const primaryAction =
  'rounded-[8px] border border-[#E34013] bg-[#E34013] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-white hover:opacity-90 disabled:opacity-60';
const dangerAction =
  'rounded-[8px] border border-[#B42318] px-[10px] py-[6px] text-[12px] font-[600] leading-[18px] text-[#B42318] hover:bg-[#FEF3F2] disabled:opacity-60';
const note = 'text-[14px] font-[400] leading-[20px] text-[#667085]';
const alert = 'text-[14px] font-[400] leading-[20px] text-[#B42318]';
const good = 'text-[14px] font-[400] leading-[20px] text-[#027A48]';
const label = 'text-[14px] font-[600] leading-[20px] text-[#344054]';
const field =
  'rounded-[8px] border border-[#D0D5DD] px-[12px] py-[8px] text-[14px] leading-[20px] text-[#182230]';

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
  dashboard,
  participants,
  moreParticipants,
  photos,
  morePhotos,
}: {
  event: IMemorollEventResponse;
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
  const live = dashboard?.phase !== 'revealed';
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

  const [name, setName] = useState(event.host_name);
  const [shots, setShots] = useState(event.shot_limit);
  const [opens, setOpens] = useState(localInputFrom(event.starts_at));
  const [reveal, setReveal] = useState(
    localInputFrom(event.reveal_at || event.ends_at)
  );
  const [venue, setVenue] = useState(record?.venue ?? '');
  const [address, setAddress] = useState(record?.address ?? '');

  const [saving, setSaving] = useState(false);
  const [said_, setSaid] = useState<
    { kind: 'saved' } | { kind: 'failed'; problem: string } | null
  >(null);

  /** Which photo's Delete has been pressed once, waiting for the second. */
  const [armed, setArmed] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteProblem, setDeleteProblem] = useState<string | null>(null);

  const save = async () => {
    if (saving) return;
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

    setSaving(true);
    try {
      const saved = await updateMemorollEvent(event.id, {
        title: trimmed,
        host_name: trimmed,
        shot_limit: shots,
        starts_at: startsAt,
        // Shooting runs to the Reveal (CONTEXT.md): the two travel together.
        ends_at: revealAt,
        reveal_at: revealAt,
        detail_content_json_text: serializeMemorollRecord({
          vibe: record?.vibe ?? 'wedding',
          venue: venue.trim(),
          address: address.trim(),
          onlyAtTheVenue: record?.onlyAtTheVenue ?? false,
        }),
      });
      if (!saved.success) {
        setSaid({
          kind: 'failed',
          problem: saved.message || 'the backend sent no answer',
        });
        return;
      }
      setSaid({ kind: 'saved' });
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
            className={`rounded-[16px] px-[10px] py-[2px] text-[12px] font-[600] leading-[18px] ${
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

      {/* Settings: what can still change after publishing. */}
      <div className={card}>
        <h2 className="text-[18px] font-[600] leading-[28px] text-[#182230]">
          Settings
        </h2>
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
          <label className="flex flex-col gap-[6px]">
            <span className={label}>Event name</span>
            <input
              className={field}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className={label}>
              Shots per guest ({FEWEST_SHOTS}-{MOST_SHOTS})
            </span>
            <input
              className={field}
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
              className={field}
              type="datetime-local"
              value={opens}
              onChange={(e) => setOpens(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className={label}>Reveals at</span>
            <input
              className={field}
              type="datetime-local"
              value={reveal}
              onChange={(e) => setReveal(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className={label}>Venue</span>
            <input
              className={field}
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className={label}>Address</span>
            <input
              className={field}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
        </div>
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            aria-busy={saving}
            className={primaryAction}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
          {said_?.kind === 'saved' ? (
            <p role="status" className={good}>
              Saved. Guests see the change on their next visit.
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
        {participants.length === 0 ? (
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
                  <tr key={guest.id} className="border-t border-[#EAECF0]">
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
        <h2 className="text-[18px] font-[600] leading-[28px] text-[#182230]">
          Photos
        </h2>
        <p className={note}>
          Everything guests have shot, including what the reveal still hides
          from them. Deleting removes a photo for everyone, for good.
        </p>
        {deleteProblem ? (
          <p role="alert" className={alert}>
            {deleteProblem}
          </p>
        ) : null}
        {photos.length === 0 ? (
          <p className={note}>No shots yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-3 lg:grid-cols-5">
            {photos.map((photo) => (
              <figure key={photo.id} className="flex flex-col gap-[6px]">
                <img
                  src={photo.photo_url}
                  alt={`A shot ${photo.uploader_name} took`}
                  className="aspect-[3/4] w-full rounded-[8px] border border-[#EAECF0] object-cover"
                  loading="lazy"
                />
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
        {morePhotos ? (
          <p className={note}>
            This shows the first hundred shots and there are more.
          </p>
        ) : null}
      </div>
    </div>
  );
}
