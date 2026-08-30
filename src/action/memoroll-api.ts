'use server';

/**
 * The one place that knows how to talk to the memoroll endpoints.
 *
 * MemoRoll is its own backend domain at `/v1/memoroll`, the way the wedding
 * is, so the generic content actions in `user-api.ts` do not cover it.
 * `baseUri` already ends in `/api/v1`, so every path here is written relative
 * to `/memoroll`.
 *
 * Two access scopes exist, and the backend tells them apart by the shape of
 * the identifier in the URL:
 *
 * - Owner. The identifier is the event's UUID, and the call carries the same
 *   auth headers every other owner call in this app carries.
 * - Guest. The identifier is the event's 8-character code. The gallery answers
 *   without auth - the preview a guest reads before "Get me in" - and answers
 *   with more when the identity headers ride along, which is also the moment
 *   the caller is joined as a participant. Joining is deliberate here: the
 *   preview never sends identity even when the caller has one, because a
 *   signed-in person opening a link has not yet said they are coming in.
 *
 * Only what a screen is coming for is wrapped. Audited against
 * `integrations/memoroll-integrations.md` on 2026-08-29 and again on
 * 2026-08-30 when the owner console arrived, one endpoint it documents stays
 * deliberately uncalled:
 *
 * - `PUT /{id}/unpublish`. Unpublishing has no screen: an event whose QR is
 *   already on the tables going dark mid-party is a decision nobody has
 *   designed for yet.
 */

import { getSession } from '@/store/get-set-session';
import type {
  IMemorollCreatedResponse,
  IMemorollDashboardResponse,
  IMemorollEventResponse,
  IMemorollGalleryPhoto,
  IMemorollGalleryResponse,
  IMemorollParticipant,
  IMemorollPayload,
  IMemorollUpdatePayload,
  Meta,
} from './interfaces';
import { IGlobalResponse } from './user-api';

const baseUri =
  process.env.APP_ENV === 'production'
    ? process.env.API_URI
    : process.env.STAGING_API;

async function ownerHeaders(): Promise<Record<string, string>> {
  const session = await getSession();

  return {
    'X-Source': 'web',
    'X-UserID': session.userId!,
    Authorization: `Bearer ${session.accessToken}`,
  };
}

/**
 * What went out and what came back, for a person watching the dev server.
 * The same three loggers `wedding-api.ts` carries, for the same reason: these
 * are server actions, so nothing about them reaches the browser's network
 * panel, and a refused save with no trace is undebuggable. Off in production;
 * headers never printed - one of them is a bearer token.
 */
const logging = process.env.APP_ENV !== 'production';

/* eslint-disable no-console */
function logRequest(method: string, url: string, body: unknown) {
  if (!logging) return;
  if (body !== undefined) {
    console.log(
      '[memoroll] -> body',
      typeof body === 'string' ? body : JSON.stringify(body)
    );
  }
}

function logResponse(
  method: string,
  url: string,
  status: number,
  body: unknown
) {
  if (!logging) return;
  console.log(`[memoroll] <- ${status} ${method} ${url}`);
  console.log(
    '[memoroll] <- body',
    typeof body === 'string' ? body : JSON.stringify(body)
  );
}

function logFailure(method: string, url: string, reason: unknown) {
  if (!logging) return;
  console.log(`[memoroll] !! ${method} ${url} never answered: ${reason}`);
}
/* eslint-enable no-console */

type MemorollResult<T> = IGlobalResponse<null | T> & { meta: Meta | null };

/**
 * Every failure comes back as a result in the shape callers already handle,
 * including a network one, so nothing above this file has to catch.
 */
async function callMemoroll<T>(
  path: string,
  init: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> }
): Promise<MemorollResult<T>> {
  let res: Response;

  const headers = init.body
    ? { 'Content-Type': 'application/json', ...init.headers }
    : init.headers;

  const url = baseUri + '/memoroll' + path;
  const method = init.method ?? 'GET';

  logRequest(method, url, init.body);

  try {
    res = await fetch(url, { ...init, headers });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    logFailure(method, url, reason);
    return { success: false, message: reason, data: null, meta: null };
  }

  const raw = await res.text().catch(() => '');
  logResponse(method, url, res.status, raw);

  let parsed: {
    data?: T;
    meta?: Meta;
    message?: string;
    status?: string;
    errors?: string[];
  } | null = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    return {
      success: false,
      message: parsed?.errors?.[0] || parsed?.status || res.statusText,
      data: null,
      meta: null,
    };
  }

  return {
    success: true,
    message: parsed?.message ?? res.statusText,
    data: parsed?.data ?? null,
    meta: parsed?.meta ?? null,
  };
}

/**
 * One act: the event, created published, or the refusal.
 *
 * The create is what spends the memoroll credit, so a refusal with
 * `INSUFFICIENT_QUOTA` on its message is a creator out of credit rather than
 * a failure, and `WEDDING_ALREADY_LINKED` is a wedding whose one memoroll
 * already exists - both are the caller's to say something better about than
 * an error.
 */
export async function createMemorollEvent(
  payload: IMemorollPayload
): Promise<IGlobalResponse<null | IMemorollCreatedResponse>> {
  return callMemoroll<IMemorollCreatedResponse>('', {
    method: 'POST',
    headers: await ownerHeaders(),
    body: JSON.stringify(payload),
  });
}

/**
 * Open the event to its guests.
 *
 * The 2026-08-30 backend publishes at create, so on it this is a confirmation
 * that costs one call; the 2026-08-29 backend created drafts the gallery
 * refused to answer for, and on such a backend this call is what opens the
 * doors. The creator keeps making it because assuming the newest backend
 * strands creators on the older one.
 */
export async function publishMemorollEvent(
  eventId: string
): Promise<IGlobalResponse<null | { status: string }>> {
  return callMemoroll<{ status: string }>(
    `/${encodeURIComponent(eventId)}/publish`,
    {
      method: 'PUT',
      headers: await ownerHeaders(),
    }
  );
}

/**
 * The event as its owner reads it back, found by its UUID.
 *
 * This is how the flow that has just created an event learns the code it was
 * given: create answers with the identifier and nothing else, and the code is
 * what every QR and guest link carries.
 */
export async function getOwnedMemorollEvent(
  eventId: string
): Promise<IGlobalResponse<null | IMemorollEventResponse>> {
  return callMemoroll<IMemorollEventResponse>(
    `/${encodeURIComponent(eventId)}`,
    {
      method: 'GET',
      headers: await ownerHeaders(),
      cache: 'no-store',
    }
  );
}

/**
 * Every memoroll event the signed-in person owns.
 *
 * The rows come back with `title`, `caption` and `detail_content_json_text`
 * empty - the listing does not join the content table - so nothing reads a
 * name off one. What the wedding dashboard reads off them is `wedding_id`
 * and `code`: one call answers which wedding already has its memoroll, and
 * where that memoroll's guests go.
 */
export async function listOwnedMemorollEvents(
  limit: string,
  page: string
): Promise<MemorollResult<IMemorollEventResponse[]>> {
  return callMemoroll<IMemorollEventResponse[]>(
    `?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
    {
      method: 'GET',
      headers: await ownerHeaders(),
      cache: 'no-store',
    }
  );
}

/**
 * The gallery, asked as one of two people.
 *
 * `preview` sends no identity even when the caller has one: it is the cover
 * and the closed door, read before a guest has said they are coming in, and
 * the backend answers with `phase` and `event` alone. `participant` sends the
 * identity headers, which joins the caller to the event on first ask and
 * answers with their shot counts and whatever Shots the phase allows -
 * their own before the Reveal, everybody's after.
 *
 * A gallery asked about an unpublished event refuses with
 * `EVENT_NOT_PUBLISHED` on the message, which the guest page reads as
 * not-found: events from this app are created published or not at all.
 */
export async function readMemorollGallery(
  code: string,
  as: 'preview' | 'participant',
  page = 1,
  limit = 100
): Promise<MemorollResult<IMemorollGalleryResponse>> {
  const headers: Record<string, string> =
    as === 'participant'
      ? await ownerHeaders()
      : { 'X-Source': 'web' };

  return callMemoroll<IMemorollGalleryResponse>(
    `/${encodeURIComponent(code)}/gallery?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers,
      cache: 'no-store',
    }
  );
}

/**
 * Register one uploaded Shot with the event.
 *
 * The pixels are already at Cloudinary - the camera uploads the baked JPEG
 * through the generic upload service the moment the shutter fires - and this
 * is the half that makes the photo the event's. Refused outside the `ongoing`
 * phase, which under ends_at = reveal_at means after the Reveal: a queued
 * Shot that misses the window stays the guest's own, on their phone.
 *
 * `displayName` is the handle the guest confirmed on "This you?". The backend
 * (2026-08-30) stores it on the participant's event profile and answers it as
 * `uploader_name` everywhere from then on - so the name that signs a print is
 * the one the guest chose, not their account's. Sent with every registration,
 * which also means a corrected handle renames the prints already sent.
 */
export async function submitMemorollPhoto(
  code: string,
  photoUrl: string,
  displayName?: string
): Promise<IGlobalResponse<null | IMemorollGalleryPhoto>> {
  return callMemoroll<IMemorollGalleryPhoto>(
    `/${encodeURIComponent(code)}/photos`,
    {
      method: 'POST',
      headers: await ownerHeaders(),
      body: JSON.stringify(
        displayName
          ? { photo_url: photoUrl, display_name: displayName }
          : { photo_url: photoUrl }
      ),
    }
  );
}

/* ------------------------- Owner console (dashboard) ------------------------- */

/**
 * The owner's numbers for one event: status, phase, who joined, how many
 * Shots landed. The dashboard console's header.
 */
export async function getMemorollDashboard(
  eventId: string
): Promise<IGlobalResponse<null | IMemorollDashboardResponse>> {
  return callMemoroll<IMemorollDashboardResponse>(
    `/${encodeURIComponent(eventId)}/dashboard`,
    {
      method: 'GET',
      headers: await ownerHeaders(),
      cache: 'no-store',
    }
  );
}

/** Every guest who joined, with the handle their prints carry. */
export async function listMemorollParticipants(
  eventId: string,
  limit: string,
  page: string
): Promise<MemorollResult<IMemorollParticipant[]>> {
  return callMemoroll<IMemorollParticipant[]>(
    `/${encodeURIComponent(eventId)}/participants?page=${encodeURIComponent(
      page
    )}&limit=${encodeURIComponent(limit)}`,
    {
      method: 'GET',
      headers: await ownerHeaders(),
      cache: 'no-store',
    }
  );
}

/**
 * Every photo at the event, any time - the owner's view is not gated by the
 * Reveal. This is what makes the console a moderation surface: what a guest
 * cannot see yet, the person answerable for the event already can.
 */
export async function listMemorollPhotos(
  eventId: string,
  limit: string,
  page: string
): Promise<MemorollResult<IMemorollGalleryPhoto[]>> {
  return callMemoroll<IMemorollGalleryPhoto[]>(
    `/${encodeURIComponent(eventId)}/photos?page=${encodeURIComponent(
      page
    )}&limit=${encodeURIComponent(limit)}`,
    {
      method: 'GET',
      headers: await ownerHeaders(),
      cache: 'no-store',
    }
  );
}

/**
 * Take one photo off the event for good. The owner's moderation tool; the
 * guest's Roll count is the backend's business, and what this must never be
 * used for is tidying - a deleted Shot is somebody's photograph.
 */
export async function deleteMemorollPhoto(
  eventId: string,
  photoId: string
): Promise<IGlobalResponse<null>> {
  return callMemoroll<null>(
    `/${encodeURIComponent(eventId)}/photos/${encodeURIComponent(photoId)}`,
    {
      method: 'DELETE',
      headers: await ownerHeaders(),
    }
  );
}

/**
 * Change what an event says or allows, after it is published. Partial: send
 * only what changed. Callers changing the reveal send `ends_at` and
 * `reveal_at` together and equal - shooting runs to the Reveal (CONTEXT.md),
 * and an update that split them would reopen the countdown phase nothing
 * renders.
 */
export async function updateMemorollEvent(
  eventId: string,
  payload: IMemorollUpdatePayload
): Promise<IGlobalResponse<null>> {
  return callMemoroll<null>(`/${encodeURIComponent(eventId)}`, {
    method: 'PUT',
    headers: await ownerHeaders(),
    body: JSON.stringify(payload),
  });
}
