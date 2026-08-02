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
 * Every failure comes back as a result in the shape callers already handle,
 * including a network one, so nothing above this file has to catch.
 */
async function callWedding<T>(
  path: string,
  init: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> }
): Promise<IGlobalResponse<null | T>> {
  let res: Response;

  // A request that sends JSON says so, and one that sends nothing says nothing:
  // publish and the publish check take no body, and the backend is given the
  // same bare request the contract records for them.
  const headers = init.body
    ? { 'Content-Type': 'application/json', ...init.headers }
    : init.headers;

  try {
    res = await fetch(baseUri + '/wedding' + path, { ...init, headers });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      data: null,
    };
  }

  if (!res.ok) {
    try {
      const errorData = await res.json();
      const errorMessage =
        errorData.errors?.[0] || errorData.status || res.statusText;
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    } catch {
      return {
        success: false,
        message: res.statusText,
        data: null,
      };
    }
  }

  try {
    const data = await res.json();

    return {
      success: true,
      message: data.message,
      // An endpoint with nothing to answer sends `{}`, and a caller that asks
      // whether there is data should be told no rather than undefined.
      data: data.data ?? null,
    };
  } catch {
    // An endpoint that answers with no body at all still succeeded.
    return {
      success: true,
      message: res.statusText,
      data: null,
    };
  }
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
