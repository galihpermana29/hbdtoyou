'use server';

import { getSession } from '@/store/get-set-session';
import {
  IAllPaymentResponse,
  IAllTemplateResponse,
  IContentPayload,
  IDetailContentResponse,
  IGetDetailPayment,
  ILatestContentResponse,
  IOAuthResponse,
  IPaymentPayload,
  IProfileResponse,
  IQRISPaymentResponse,
} from './interfaces';

export interface IOAuthPayload {
  token_email: string;
}

export interface IGlobalResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const baseUri = process.env.API_URI;

export async function loginOAuth(
  payload: IOAuthPayload
): Promise<IGlobalResponse<null | IOAuthResponse>> {
  const res = await fetch(baseUri + `/auth/social`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
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

export async function getAllTemplates(): Promise<
  IGlobalResponse<null | IAllTemplateResponse[]>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/templates`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
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

export async function getUserProfile(): Promise<
  IGlobalResponse<null | IProfileResponse>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/users/${session.userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
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

export async function createContent(
  payload: IContentPayload
): Promise<IGlobalResponse<null | string>> {
  const session = await getSession();
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

export async function getDetailContent(
  id: string
): Promise<IGlobalResponse<null | IDetailContentResponse>> {
  const session = await getSession();
  const res = await fetch(baseUri + `/contents/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
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

export async function submitPaymentProof(
  payload: IPaymentPayload
): Promise<IGlobalResponse<null | string>> {
  const session = await getSession();
  const res = await fetch(baseUri + `/payments`, {
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

export async function getListPayment(): Promise<
  IGlobalResponse<null | IAllPaymentResponse[]>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/payments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
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

export async function approveRejectProof(
  payload: {
    status: string;
  },
  id: string
): Promise<IGlobalResponse<null | string>> {
  const session = await getSession();
  const res = await fetch(baseUri + `/payments/${id}`, {
    method: 'PATCH',
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

export async function generateQRIS(): Promise<
  IGlobalResponse<null | IQRISPaymentResponse>
> {
  const session = await getSession();
  const res = await fetch(baseUri?.replace('v1', 'v2') + `/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
    // body: JSON.stringify(payload),
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

export async function getDetailPayment(
  id: string
): Promise<IGlobalResponse<null | IGetDetailPayment>> {
  const session = await getSession();
  const res = await fetch(baseUri + `/payments/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
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

export async function getLatestInspiration(): Promise<
  IGlobalResponse<null | ILatestContentResponse>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/contents/latest`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
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
