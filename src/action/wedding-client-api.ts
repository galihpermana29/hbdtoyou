/**
 * The wedding calls a browser makes for itself.
 *
 * The Create Flow's saves used to travel through server actions, and on
 * Vercel a server action is a serverless function with a hard duration
 * ceiling - a save the backend honoured in ninety seconds died at ten as
 * FUNCTION_INVOCATION_FAILED (found live, 2026-08-30). So every call a
 * person is actively waiting on goes from the browser straight to the
 * backend, the way `client-api.ts` already does it: `/api/session` for the
 * bearer, then the backend itself, no middleman with a clock.
 *
 * This file mirrors exactly the calls the Create Flow and the listing's
 * Publish fire interactively: create, update, read-back, the slug check,
 * the publish check and publish. The guest-list management calls and the
 * viewer's RSVP still ride server actions and carry the same latent risk -
 * migrating them is a known follow-up, not an oversight.
 *
 * Results keep the exact envelope the server actions answered with, so the
 * call sites change import and nothing else.
 */

import type {
  IOwnedWeddingInvitationResponse,
  IWeddingCreatedResponse,
  IWeddingInvitationPayload,
  IWeddingInvitationUpdatePayload,
  IWeddingPublishCheckResponse,
  IWeddingPublishResponse,
  IWeddingSlugAvailabilityResponse,
} from './interfaces';
import type { IGlobalResponse } from './user-api';
import { forgetOwnedListings } from './wedding-api';

const baseUri =
  process.env.NEXT_PUBLIC_APP_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URI
    : process.env.NEXT_PUBLIC_STAGING_API;

/**
 * One wedding call, browser to backend, every failure an answer.
 *
 * The session comes from `/api/session` per call - a fast same-origin read -
 * and a browser with none gets a refusal in the envelope rather than a
 * throw, so a signed-out press reads as "sign in" and never as a crash.
 */
async function callWedding<T>(
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<IGlobalResponse<null | T>> {
  let session: { userId?: string; accessToken?: string } | null = null;
  try {
    session = await fetch('/api/session').then((res) => res.json());
  } catch {
    session = null;
  }
  if (!session?.accessToken) {
    return {
      success: false,
      message: 'You are not signed in',
      data: null,
    };
  }

  let res: Response;
  try {
    res = await fetch(`${baseUri}/wedding${path}`, {
      method: init?.method ?? 'GET',
      headers: {
        ...(init?.body !== undefined
          ? { 'Content-Type': 'application/json' }
          : {}),
        'X-Source': 'web',
        'X-UserID': session.userId!,
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      data: null,
    };
  }

  let parsed: {
    data?: T;
    message?: string;
    status?: string;
    errors?: string[];
  } | null = null;
  try {
    parsed = await res.json();
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    return {
      success: false,
      message: parsed?.errors?.[0] || parsed?.status || res.statusText,
      data: null,
    };
  }

  return {
    success: true,
    message: parsed?.message ?? res.statusText,
    data: parsed?.data ?? null,
  };
}

export async function checkInvitationSlugClient(
  slug: string
): Promise<IGlobalResponse<null | IWeddingSlugAvailabilityResponse>> {
  return callWedding<IWeddingSlugAvailabilityResponse>(
    `/slug-availability?slug=${encodeURIComponent(slug)}`
  );
}

export async function createWeddingInvitationClient(
  payload: IWeddingInvitationPayload
): Promise<IGlobalResponse<null | IWeddingCreatedResponse>> {
  const created = await callWedding<IWeddingCreatedResponse>('', {
    method: 'POST',
    body: payload,
  });
  // The server actions purged the couple's cached listing themselves; the
  // browser cannot, so it asks the one server action the Vercel ceiling
  // cannot hurt. Fire-and-forget: a purge that fails costs one stale minute.
  if (created.success) void forgetOwnedListings().catch(() => undefined);
  return created;
}

export async function updateWeddingInvitationClient(
  payload: IWeddingInvitationUpdatePayload,
  weddingId: string
): Promise<IGlobalResponse<null>> {
  const updated = await callWedding<null>(
    `/${encodeURIComponent(weddingId)}`,
    {
      method: 'PUT',
      body: payload,
    }
  );
  if (updated.success) void forgetOwnedListings().catch(() => undefined);
  return updated;
}

export async function getOwnedWeddingInvitationClient(
  weddingId: string
): Promise<IGlobalResponse<null | IOwnedWeddingInvitationResponse>> {
  return callWedding<IOwnedWeddingInvitationResponse>(
    `/${encodeURIComponent(weddingId)}`
  );
}

export async function publishCheckWeddingInvitationClient(
  weddingId: string
): Promise<IGlobalResponse<null | IWeddingPublishCheckResponse>> {
  return callWedding<IWeddingPublishCheckResponse>(
    `/${encodeURIComponent(weddingId)}/publishcheck`,
    { method: 'POST' }
  );
}

export async function publishWeddingInvitationClient(
  weddingId: string
): Promise<IGlobalResponse<null | IWeddingPublishResponse>> {
  return callWedding<IWeddingPublishResponse>(
    `/${encodeURIComponent(weddingId)}/publish`,
    { method: 'PUT' }
  );
}
