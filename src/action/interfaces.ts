export interface IOAuthResponse {
  user_id: string;
  fullname: string;
  email: string;
  token: string;
}

export interface IAllTemplateResponse {
  id: string;
  name: string;
  label: string;
  thumbnail_uri: string;
}

export interface IProfileResponse {
  id: string;
  fullname: string;
  email: string;
  type: string;
  quota: number;
}

export interface IContentPayload {
  template_id: string;
  detail_content_json_text: string;
}

export interface IDetailContentResponse {
  id: string;
  user_id: string;
  user_name: string;
  template_id: string;
  template_name: string;
  template_label: string;
  detail_content_json_text: string;
  status: string;
}

export interface IPaymentPayload {
  content_id: string;
  amount: number;
  proof_payment_url: string;
}

export interface IAllPaymentResponse {
  id: string;
  user_id: string;
  user_name: string;
  user_type: string;
  user_quota: number;
  proof_payment_url: string;
  date: string;
  status: string;
}

export interface IQRISPaymentResponse {
  payment_id: string;
  qris_resp: string;
  price?: number;
}

export interface IGetDetailPayment {
  id: string;
  user_id: string;
  user_name: string;
  user_type: string;
  user_quota: number;
  template_id: string;
  template_name: string;
  template_label: string;
  content_id: string;
  amount: number;
  proof_payment_url: string;
  date: string;
  status: string;
}
