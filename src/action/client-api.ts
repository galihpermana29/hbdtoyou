import { IContentPayload } from './interfaces';
import { IGlobalResponse } from './user-api';
const baseUri =
  process.env.NODE_ENV === 'production'
    ? process.env.API_URI
    : process.env.NEXT_PUBLIC_STAGING_API;

export async function createContentClientSide(
  payload: IContentPayload
): Promise<IGlobalResponse<null | string>> {
  const session = await fetch('/api/session').then((res) => res.json());

  if (!session) {
    return {
      success: false,
      message: 'Session not found',
      data: null,
    };
  }

  const res = await fetch(baseUri + `/contents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return {
      success: false,
      message: res.statusText,
      data: null,
    };
  }

  const data = await res.json();

  return {
    success: true,
    message: data.message,
    data: data.data,
  };
}
