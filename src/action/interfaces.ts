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
  slug: string;
  tag: string[];
  type: string;
  category: string;
}

export interface ILatestContentResponse {
  contents: IContent[];
  total_content: number;
  total_registered: number;
}

export interface ILatestContentResponse2 {
  data: Daum[];
  meta: Meta;
}

export interface Daum {
  id: string;
  user_id: string;
  user_type: string;
  user_name: string;
  template_id: string;
  template_name: string;
  template_label: string;
  template_type: string;
  template_category: string;
  detail_content_json_text: string;
  status: string;
  title: string;
  caption: string;
  is_scheduled: boolean;
  date_scheduled: string;
  dest_email: string;
  create_date: string;
}

export interface Meta {
  page: number;
  limit: number;
  totalPage: number;
  totalData: number;
}

export interface IContent {
  id: string;
  user_id: string;
  user_name: string;
  template_id: string;
  template_name: string;
  template_label: string;
  template_type: string;
  detail_content_json_text: string;
  status: string;
  title: string;
  caption: string;
  create_date: string;
  jumbotronImage?: string;
  link?: string;
  desc?: string;
  type?: string;
  is_scheduled: boolean;
  date_scheduled: string;
  dest_email: string;
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
  user_type: string;
  template_name: string;
  template_label: string;
  detail_content_json_text: string;
  status: string;
  caption?: string;
  title?: string;
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

export interface IContentStats {
  contents: {
    total_registered_user: number;
    total_premium_user: number;
    total_gift_content: number;
    total_photo_box_content: number;
  };
}

export interface IResponsePaypal {
  order_id: string;
  payment_id: string;
  price: string;
}