'use server';

/**
 * The one place that knows how to talk to the wedding endpoints.
 *
 * The wedding invitation is its own backend domain at `/v1/wedding` rather than
 * a row in the generic content table, so the content actions in `user-api.ts`
 * do not cover it. `baseUri` already ends in `/api/v1`, so every path here is
 * written relative to `/wedding`.
 *
 * Three access scopes exist, and the backend tells them apart by the shape of
 * the identifier in the URL:
 *
 * - Owner. The identifier is the invitation's UUID, and the call carries the
 *   same auth headers every other owner call in this app carries.
 * - Public. The identifier is the invitation slug, the call carries no headers,
 *   and the backend answers only once the invitation is published. This is why
 *   an invitation's public identifier can never be its UUID.
 * - Guest. Public, plus the guest's token in `X-Guest-Token`.
 *
 * Only what a screen is coming for is wrapped. The dashboard, moderation, guest
 * photo upload, revoke and archival endpoints are real, and deliberately absent
 * until there is something to call them.
 */

import { getSession } from '@/store/get-set-session';
import type { Meta } from './interfaces';
import {
  IOwnedWeddingInvitationResponse,
  IPublicWeddingInvitationResponse,
  IWeddingCreatedResponse,
  IWeddingGuestPayload,
  IWeddingGuestResponse,
  IWeddingInvitationPayload,
  IWeddingInvitationUpdatePayload,
  IWeddingPublishCheckResponse,
  IWeddingPublishResponse,
  IWeddingRsvpPayload,
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
 *
 * These are server actions, so nothing about them reaches the browser's network
 * panel: a couple pressing Next sends one POST to the page they are on, and the
 * request to the wedding backend happens out of sight. Without this there is
 * nothing to look at when a save fails.
 *
 * Off in production, because a payload is a couple's own wedding and a log is
 * not the place for it. Headers are never printed either way: one of them is a
 * bearer token.
 *
 * A body is printed whole rather than trimmed. The one thing worth knowing when
 * a save is refused is exactly what was sent, and a truncated payload has a way
 * of hiding the field that caused it.
 *
 * The console is what a dev server prints to, which is the whole point of these
 * three, so the rule against it is turned off for them and nowhere else.
 */
const logging = process.env.APP_ENV !== 'production';

/* eslint-disable no-console */
function logRequest(method: string, url: string, body: unknown) {
  if (!logging) return;
  console.log(`\n[wedding] -> ${method} ${url}`);
  if (body !== undefined) {
    console.log(
      '[wedding] -> body',
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
  console.log(`[wedding] <- ${status} ${method} ${url}`);
  console.log(
    '[wedding] <- body',
    typeof body === 'string' ? body : JSON.stringify(body)
  );
}

function logFailure(method: string, url: string, reason: unknown) {
  if (!logging) return;
  console.log(`[wedding] !! ${method} ${url} never answered: ${reason}`);
}
/* eslint-enable no-console */

/**
 * What one call answered: the result every caller already handles, and what a
 * paginated endpoint said about the rest of the list.
 *
 * `meta` sits beside the data in the wire format rather than inside it, so it
 * cannot travel on `IGlobalResponse` itself. Null on every endpoint that is not
 * a list, which is most of them.
 */
type WeddingResult<T> = IGlobalResponse<null | T> & { meta: Meta | null };

/**
 * Every failure comes back as a result in the shape callers already handle,
 * including a network one, so nothing above this file has to catch.
 */
async function callWedding<T>(
  path: string,
  init: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> }
): Promise<WeddingResult<T>> {
  let res: Response;

  // A request that sends JSON says so, and one that sends nothing says nothing:
  // publish and the publish check take no body, and the backend is given the
  // same bare request the contract records for them.
  const headers = init.body
    ? { 'Content-Type': 'application/json', ...init.headers }
    : init.headers;

  const url = baseUri + '/wedding' + path;
  const method = init.method ?? 'GET';

  logRequest(method, url, init.body);

  try {
    res = await fetch(url, { ...init, headers });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    logFailure(method, url, reason);
    return { success: false, message: reason, data: null, meta: null };
  }

  // Read once, as text, so the same body can be both logged and parsed. Reading
  // a Response twice throws, and a body that failed to parse is exactly the one
  // worth seeing.
  const raw = await res.text().catch(() => '');
  logResponse(method, url, res.status, raw);

  let parsed: any = null;
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
    // An endpoint with nothing to answer sends `{}`, and a caller that asks
    // whether there is data should be told no rather than undefined.
    data: parsed?.data ?? null,
    meta: parsed?.meta ?? null,
  };
}

export async function createWeddingInvitation(
  payload: IWeddingInvitationPayload
): Promise<IGlobalResponse<null | IWeddingCreatedResponse>> {
  return callWedding<IWeddingCreatedResponse>('', {
    method: 'POST',
    headers: await ownerHeaders(),
    body: JSON.stringify(payload),
  });
}

/**
 * The invitation as its owner sees it, found by its UUID.
 *
 * This is how a flow that has just created an invitation learns the address it
 * was given. Nothing else can tell it: create answers with the identifier and
 * nothing else, and the public read answers only for a published invitation and
 * only when asked by slug, so a draft has no way of being asked about at all.
 *
 * Never cached. The answer changes every time the invitation does, and a cached
 * one would show a couple an address that is no longer theirs.
 */
export async function getOwnedWeddingInvitation(
  weddingId: string
): Promise<IGlobalResponse<null | IOwnedWeddingInvitationResponse>> {
  return callWedding<IOwnedWeddingInvitationResponse>(
    `/${encodeURIComponent(weddingId)}`,
    {
      method: 'GET',
      headers: await ownerHeaders(),
      cache: 'no-store',
    }
  );
}

export async function updateWeddingInvitation(
  payload: IWeddingInvitationUpdatePayload,
  weddingId: string
): Promise<IGlobalResponse<null>> {
  return callWedding<null>(`/${encodeURIComponent(weddingId)}`, {
    method: 'PUT',
    headers: await ownerHeaders(),
    body: JSON.stringify(payload),
  });
}

/**
 * A dry run of publishing. The backend does not run it for us on publish, so a
 * caller that wants to tell the couple what is missing has to ask first.
 */
export async function publishCheckWeddingInvitation(
  weddingId: string
): Promise<IGlobalResponse<null | IWeddingPublishCheckResponse>> {
  return callWedding<IWeddingPublishCheckResponse>(
    `/${encodeURIComponent(weddingId)}/publishcheck`,
    {
      method: 'POST',
      headers: await ownerHeaders(),
    }
  );
}

export async function publishWeddingInvitation(
  weddingId: string
): Promise<IGlobalResponse<null | IWeddingPublishResponse>> {
  return callWedding<IWeddingPublishResponse>(
    `/${encodeURIComponent(weddingId)}/publish`,
    {
      method: 'PUT',
      headers: await ownerHeaders(),
    }
  );
}

/**
 * Adds a whole guest list at once. The backend inserts them in one transaction
 * and mints each guest's personal-link token, which comes back on the response.
 */
export async function addWeddingGuests(
  guests: IWeddingGuestPayload[],
  weddingId: string
): Promise<IGlobalResponse<null | IWeddingGuestResponse[]>> {
  return callWedding<IWeddingGuestResponse[]>(
    `/${encodeURIComponent(weddingId)}/guests`,
    {
      method: 'POST',
      headers: await ownerHeaders(),
      body: JSON.stringify({ guests }),
    }
  );
}

/**
 * How many guests are asked for at once, and how many pages will be read.
 *
 * The endpoint pages, and a couple's Guest List is one list rather than a page
 * of one, so the whole of it is read here instead of every screen learning to
 * page. A hundred at a time because a wedding is hundreds of people rather than
 * thousands, and fifty pages so that a backend which miscounts its own pages
 * ends the loop rather than running it forever.
 */
const GUESTS_PER_PAGE = 100;
const MOST_GUEST_PAGES = 50;

/**
 * Everybody on a wedding's Guest List, with the token each personal link is
 * built from.
 *
 * This is what makes a Guest List something a couple can come back to. Without
 * it the list only ever exists in the browser that uploaded it, so a couple who
 * closes the tab has lost two hundred names that are sitting in the database.
 *
 * Never cached, for the same reason the invitation's own owner read is not: the
 * answer changes whenever the couple edits the list, and a cached one would show
 * them guests they have already removed.
 */
export async function listWeddingGuests(
  weddingId: string
): Promise<IGlobalResponse<null | IWeddingGuestResponse[]>> {
  const guests: IWeddingGuestResponse[] = [];

  for (let page = 1; page <= MOST_GUEST_PAGES; page += 1) {
    const answered = await callWedding<IWeddingGuestResponse[]>(
      `/${encodeURIComponent(weddingId)}/guests` +
        `?page=${page}&limit=${GUESTS_PER_PAGE}`,
      {
        method: 'GET',
        headers: await ownerHeaders(),
        cache: 'no-store',
      }
    );

    // A page that was refused is the whole read refused. Answering with the
    // guests gathered so far would be answering with part of a Guest List and
    // saying nothing about the part that is missing.
    if (!answered.success) return answered;

    guests.push(...(answered.data ?? []));

    // An answer with no meta at all is one page, which is what a backend that
    // has stopped paginating would be saying.
    if (page >= (answered.meta?.totalPage ?? 1)) {
      return { success: true, message: answered.message, data: guests };
    }
  }

  return {
    success: false,
    message:
      `this invitation has more than ${MOST_GUEST_PAGES * GUESTS_PER_PAGE} ` +
      'guests, which is more than the guest list can be read in one go',
    data: null,
  };
}

/**
 * Correct one guest, leaving the rest of the list alone.
 *
 * Every answer goes, including the ones the couple has emptied, because this
 * writes over a guest rather than adding to them: a field left out of the body
 * keeps whatever the backend already holds, so an omitted one would be a
 * correction that silently did not happen. The token does not change, so the
 * personal link a guest may already have been sent still opens the invitation.
 */
export async function updateWeddingGuest(
  guest: IWeddingGuestPayload,
  weddingId: string,
  guestId: string
): Promise<IGlobalResponse<null>> {
  return callWedding<null>(
    `/${encodeURIComponent(weddingId)}/guests/${encodeURIComponent(guestId)}`,
    {
      method: 'PATCH',
      headers: await ownerHeaders(),
      body: JSON.stringify(guest),
    }
  );
}

/**
 * Take one guest off the list for good.
 *
 * Permanent, and it cascades to whatever that guest had already sent: their
 * reply and their photographs go with them. That is the endpoint the couple's
 * Delete is asking for - the other one, revoke, keeps the row and only stops the
 * personal link working, which is a different thing and nothing on this screen
 * offers it.
 */
export async function deleteWeddingGuest(
  weddingId: string,
  guestId: string
): Promise<IGlobalResponse<null>> {
  return callWedding<null>(
    `/${encodeURIComponent(weddingId)}/guests/${encodeURIComponent(guestId)}`,
    {
      method: 'DELETE',
      headers: await ownerHeaders(),
    }
  );
}

/**
 * The invitation as a guest sees it, found by slug.
 *
 * Never cached: the backend counts a view on every one of these, and a cached
 * read is a view that never happened as well as a wedding frozen at whatever
 * the couple had written the first time somebody opened it.
 */
export async function getPublicWeddingInvitation(
  slug: string
): Promise<IGlobalResponse<null | IPublicWeddingInvitationResponse>> {
  return callWedding<IPublicWeddingInvitationResponse>(
    `/${encodeURIComponent(slug)}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );
}

/**
 * Who a personal link belongs to. Not cached for the same reason the public
 * read is not: the backend records the open and bumps the guest's open count.
 */
export async function resolveWeddingGuest(
  slug: string,
  guestToken: string
): Promise<IGlobalResponse<null | IWeddingGuestResponse>> {
  return callWedding<IWeddingGuestResponse>(
    `/${encodeURIComponent(slug)}/guest/${encodeURIComponent(guestToken)}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );
}

/**
 * A guest's answer. One guest may answer once, and the backend rate-limits by
 * IP, so both `GUEST_ALREADY_RESPONDED` and `RATE_LIMITED` arrive as messages
 * on an unsuccessful result rather than as thrown errors.
 */
export async function submitWeddingRsvp(
  payload: IWeddingRsvpPayload,
  slug: string,
  guestToken: string
): Promise<IGlobalResponse<null>> {
  return callWedding<null>(`/${encodeURIComponent(slug)}/rsvp`, {
    method: 'POST',
    headers: {
      'X-Source': 'web',
      'X-Guest-Token': guestToken,
    },
    body: JSON.stringify(payload),
  });
}
