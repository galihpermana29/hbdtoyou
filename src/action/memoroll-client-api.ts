/**
 * The memoroll calls a browser makes for itself.
 *
 * Same reason and same shape as `wedding-client-api.ts` (2026-08-30): a
 * person actively waiting - a creator publishing, a guest joining, a Shot
 * registering - must not have their call ride a Vercel server action with a
 * ten-second ceiling against a backend we have twice clocked hanging for
 * ninety. Browser to backend, `/api/session` for the bearer, no middleman
 * with a clock.
 *
 * The server actions in `memoroll-api.ts` stay for what renders on the
 * server: the dashboard listings, the console's page load, the guest page's
 * unauthenticated preview.
 */

import type {
  IMemorollCreatedResponse,
  IMemorollEventResponse,
  IMemorollGalleryPhoto,
  IMemorollGalleryResponse,
  IMemorollPayload,
  IMemorollUpdatePayload,
  Meta,
} from './interfaces';
import type { IGlobalResponse } from './user-api';

const baseUri =
  process.env.NEXT_PUBLIC_APP_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URI
    : process.env.NEXT_PUBLIC_STAGING_API;

type MemorollResult<T> = IGlobalResponse<null | T> & { meta: Meta | null };

/**
 * One memoroll call, browser to backend, every failure an answer.
 *
 * `auth: false` is the unauthenticated preview's mode; everything else
 * carries the session, and a browser without one gets a refusal in the
 * envelope rather than a throw.
 */
async function callMemoroll<T>(
  path: string,
  init?: {
    method?: string;
    body?: unknown;
    auth?: boolean;
    /** Abort after this long; the caller owns what happens next. */
    timeoutMs?: number;
  }
): Promise<MemorollResult<T>> {
  const headers: Record<string, string> = { 'X-Source': 'web' };
  if (init?.body !== undefined) headers['Content-Type'] = 'application/json';

  if (init?.auth !== false) {
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
        meta: null,
      };
    }
    headers['X-UserID'] = session.userId!;
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  let res: Response;
  try {
    res = await fetch(`${baseUri}/memoroll${path}`, {
      method: init?.method ?? 'GET',
      headers,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal:
        init?.timeoutMs !== undefined
          ? AbortSignal.timeout(init.timeoutMs)
          : undefined,
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      data: null,
      meta: null,
    };
  }

  let parsed: {
    data?: T;
    meta?: Meta;
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

export async function createMemorollEventClient(
  payload: IMemorollPayload
): Promise<IGlobalResponse<null | IMemorollCreatedResponse>> {
  // Twenty seconds of patience, not ninety: the backend's create has hung
  // for ~90s three times (2026-08-30) while making the event anyway, so a
  // create that outlives this window is abandoned as ambiguous and the
  // caller's orphan hunt takes over - the listing answers in a second.
  return callMemoroll<IMemorollCreatedResponse>('', {
    method: 'POST',
    body: payload,
    timeoutMs: 20_000,
  });
}

export async function publishMemorollEventClient(
  eventId: string
): Promise<IGlobalResponse<null | { status: string }>> {
  return callMemoroll<{ status: string }>(
    `/${encodeURIComponent(eventId)}/publish`,
    { method: 'PUT' }
  );
}

export async function getOwnedMemorollEventClient(
  eventId: string
): Promise<IGlobalResponse<null | IMemorollEventResponse>> {
  return callMemoroll<IMemorollEventResponse>(
    `/${encodeURIComponent(eventId)}`
  );
}

export async function listOwnedMemorollEventsClient(
  limit: string,
  page: string
): Promise<MemorollResult<IMemorollEventResponse[]>> {
  return callMemoroll<IMemorollEventResponse[]>(
    `?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`
  );
}

/**
 * The gallery as this signed-in guest - the join, the refresh, the poll.
 * The unauthenticated preview stays a server-side read on the guest page;
 * nothing in the browser asks for it.
 */
export async function readMemorollGalleryClient(
  code: string,
  page = 1,
  limit = 100
): Promise<MemorollResult<IMemorollGalleryResponse>> {
  return callMemoroll<IMemorollGalleryResponse>(
    `/${encodeURIComponent(code)}/gallery?page=${page}&limit=${limit}`
  );
}

export async function submitMemorollPhotoClient(
  code: string,
  photoUrl: string,
  displayName?: string
): Promise<IGlobalResponse<null | IMemorollGalleryPhoto>> {
  return callMemoroll<IMemorollGalleryPhoto>(
    `/${encodeURIComponent(code)}/photos`,
    {
      method: 'POST',
      body: displayName
        ? { photo_url: photoUrl, display_name: displayName }
        : { photo_url: photoUrl },
    }
  );
}

export async function updateMemorollEventClient(
  eventId: string,
  payload: IMemorollUpdatePayload
): Promise<IGlobalResponse<null>> {
  return callMemoroll<null>(`/${encodeURIComponent(eventId)}`, {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteMemorollPhotoClient(
  eventId: string,
  photoId: string
): Promise<IGlobalResponse<null>> {
  return callMemoroll<null>(
    `/${encodeURIComponent(eventId)}/photos/${encodeURIComponent(photoId)}`,
    { method: 'DELETE' }
  );
}
