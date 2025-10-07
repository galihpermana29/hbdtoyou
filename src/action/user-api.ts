'use server';

import { getSession } from '@/store/get-set-session';
import { revalidateTag } from 'next/cache';
import {
  IAllPaymentResponse,
  IAllTemplateResponse,
  IContent,
  IContentPayload,
  IContentStats,
  IDetailContentResponse,
  IFeedback,
  IGetDetailPayment,
  ILatestContentResponse2,
  IListPackageResponse,
  IOAuthResponse,
  IPaymentPayload,
  IPaypalPaymentResponse,
  IProfileResponse,
  IQRISPaymentResponse,
  IResponsePaypal,
} from './interfaces';
import { SessionData } from '@/store/iron-session';

export interface IOAuthPayload {
  token_email: string;
}

export interface IGlobalResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const baseUri =
  process.env.NODE_ENV === 'production'
    ? process.env.API_URI
    : process.env.STAGING_API;

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

export async function getGraduationTemplates(): Promise<
  IGlobalResponse<null | IAllTemplateResponse[]>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/templates?category=graduation`, {
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

export async function getPopularTemplates(): Promise<
  IGlobalResponse<null | IAllTemplateResponse[]>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/templates?category=popular`, {
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

export async function getOriginalTemplates(): Promise<
  IGlobalResponse<null | IAllTemplateResponse[]>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/templates?category=original`, {
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

export async function getUserProfile(overrideSession?: {
  userId: string;
  accessToken: string;
}): Promise<IGlobalResponse<null | IProfileResponse>> {
  const session = overrideSession || (await getSession());
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

  revalidateTag('dashboard-content');

  const data = await res.json();

  return {
    success: true,
    message: data.message,
    data: data.data,
  };
}

export async function editContent(
  payload: IContentPayload,
  contentId: string
): Promise<IGlobalResponse<null | string>> {
  const session = await getSession();
  const res = await fetch(baseUri + `/contents/${contentId}`, {
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

  revalidateTag('dashboard-content');

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
    next: {
      tags: ['netflix-graduation-content'],
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

export async function addWishesContent(
  id: string,
  payload: {
    name: string;
    message: string;
  }
): Promise<
  IGlobalResponse<null | {
    data: string;
  }>
> {
  // const session = await getSession();
  const res = await fetch(baseUri + `/contents/${id}/wish`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      // 'X-UserID': session.userId!,
      // Authorization: `Bearer ${session.accessToken}`,
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

  revalidateTag('netflix-graduation-content');

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

export async function generateQRIS(
  payload: IPaymentPayload
): Promise<IGlobalResponse<null | IQRISPaymentResponse>> {
  const session = await getSession();
  const res = await fetch(baseUri?.replace('v1', 'v2') + `/payments`, {
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

export async function generatePaypal(
  payload: IPaymentPayload
): Promise<IGlobalResponse<null | IPaypalPaymentResponse>> {
  const session = await getSession();
  const res = await fetch(baseUri?.replace('v1', 'v2') + `/payments`, {
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

export async function getLatestInspiration(
  limit: number,
  page: number,
  templateId?: string,
  keyword?: string
): Promise<IGlobalResponse<null | ILatestContentResponse2>> {
  const session = await getSession();
  const res = await fetch(
    baseUri +
      `/contents/latest?limit=${limit}&page=${page}${
        templateId ? `&template_id=${templateId}` : ''
      }${keyword ? `&keyword=${keyword}` : ''}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'web',
        'X-UserID': session.userId!,
        Authorization: `Bearer ${session.accessToken}`,
      },
      next: {
        revalidate: 60,
      },
    }
  );

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
    data: data,
  };
}

export async function getContentByUserId(
  userId?: string,
  limit?: string,
  page?: string,
  template_id?: string
): Promise<IGlobalResponse<null | IContent[]>> {
  const session = await getSession();

  const objParams = {
    user_id: userId || '',
    limit: limit || '10',
    page: page || '1',
    template_id: template_id || '',
  };

  if (userId === '') delete objParams.user_id;
  if (template_id === '') delete objParams.template_id;

  const params = new URLSearchParams(objParams).toString();
  const res = await fetch(baseUri + `/contents?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
    next: {
      revalidate: 60,
      tags: ['dashboard-content'],
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

export async function submitFeedback(payload: {
  email: string;
  type: string;
  message: string;
}): Promise<IGlobalResponse<null | string>> {
  const session = await getSession();
  const res = await fetch(baseUri + `/feedbacks`, {
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

export async function getListFeedbacks(): Promise<
  IGlobalResponse<IFeedback[] | null>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/feedbacks`, {
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

export async function getContentStatsByUserId(): Promise<
  IGlobalResponse<null | IContentStats>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/contents/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'web',
      'X-UserID': session.userId!,
      Authorization: `Bearer ${session.accessToken}`,
    },
    next: {
      revalidate: 60,
      tags: ['dashboard-content'],
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

export async function deleteContentById(
  contentId: string
): Promise<IGlobalResponse<null | IContentStats>> {
  const session = await getSession();
  const res = await fetch(baseUri + `/contents/${contentId}`, {
    method: 'DELETE',
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

  revalidateTag('dashboard-content');

  const data = await res.json();

  return {
    success: true,
    message: data.message,
    data: data.data,
  };
}

export async function paymentByPaypal(): Promise<
  IGlobalResponse<null | IResponsePaypal>
> {
  const session = await getSession();
  const res = await fetch(baseUri?.replace('v1', 'v2') + '/payments/paypal', {
    method: 'POST',
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

export async function paymentPaypalCapture({
  order_id,
  payment_id,
}: {
  order_id: string;
  payment_id: string;
}): Promise<IGlobalResponse<null | { status: string }>> {
  const session = await getSession();
  const res = await fetch(
    baseUri?.replace('v1', 'v2') + '/payments/paypal/capture',
    {
      method: 'POST',
      body: JSON.stringify({ order_id, payment_id }),
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'web',
        'X-UserID': session.userId!,
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

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

export async function getListPackages(): Promise<
  IGlobalResponse<null | IListPackageResponse[]>
> {
  const session = await getSession();
  const res = await fetch(baseUri + `/packages`, {
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

export async function warmUpAIModel(): Promise<IGlobalResponse<null | any>> {
  const session = await getSession();
  const res = await fetch(baseUri + `/warm-up-model`, {
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

  return {
    success: true,
    message: 'success',
    data: null,
  };
}
