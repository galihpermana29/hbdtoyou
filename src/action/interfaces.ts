export interface IOAuthResponse {
  user_id: string;
  fullname: string;
  email: string;
  token: string;
}

export interface IFeedback {
  id: string;
  email: string;
  message: string;
  type: string;
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

export interface ITemplatePayload {
  name: string;
  label: string;
  thumbnail_uri: string;
  type: string;
  category: string;
  slug: string;
  tag?: string[];
  frame_data?: Record<string, unknown>;
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
  token_scrapbook: number;
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

export interface IPaypalPaymentResponse {
  payment_id: string;
  qris_resp: string;
  price?: number;
  order_id?: string;
}

export interface IPaymentPayload {
  package_id: string;
  payment_method: 'qris' | 'paypal';
  coupon_code?: string;
}

export interface ICouponPreviewPayload {
  code: string;
  package_id: string;
}

export interface ICouponPreviewResponse {
  original_price: number;
  discount_amount: number;
  final_price: number;
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

export interface IListPackageResponse {
  id: string;
  name: string;
  description: string;
  price: string;
  price_paypal: string;
  price_midtrans: string;
  quota_basic: number;
  token_scrapbook: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
}

export interface IPackagePayload {
  name: string;
  description: string;
  price: string;
  price_paypal: string;
  price_midtrans: string;
  quota_basic: number;
  token_scrapbook: number;
  duration_days?: number;
  features: string[];
  is_active?: boolean;
  is_popular?: boolean;
}

export interface IDashboardOverview {
  total_users: number;
  total_premium_users: number;
  total_contents: number;
  total_payments: number;
  total_revenue: number;
}

export interface IDashboardCloudinary {
  plan: string;
  last_updated: string;
  storage_usage: number;
  storage_limit: number;
  bandwidth_usage: number;
  bandwidth_limit: number;
  transform_usage: number;
  transform_limit: number;
  requests: number;
  resources: number;
  derived_resources: number;
}

export interface IDashboardBrevo {
  provider: string;
  sent: number;
  limit: number;
  remaining: number;
}

export interface IDashboardScheduledBreakdown {
  date: string;
  count: number;
}

export interface IDashboardScheduled {
  total_scheduled: number;
  breakdown: IDashboardScheduledBreakdown[];
}

export interface IDashboardTransactions {
  total_transactions: number;
  total_amount: number;
  total_discount: number;
}

export interface IDashboardTransactionsParams {
  method?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: string;
  limit?: string;
}

export interface ICoupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number;
  used_count: number;
  expired_at: string | null;
  is_active: boolean;
  create_time: string;
  update_time: string;
}

export interface ICouponCreatePayload {
  code?: string;
  discount_type: string;
  discount_value: number;
  max_uses: number;
  expired_at?: string | null;
}

export interface ICouponUpdatePayload {
  code?: string;
  discount_type?: string;
  discount_value?: number;
  max_uses?: number;
  is_active?: boolean;
  expired_at?: string | null;
}

export interface ICouponListParams {
  is_active?: string;
  page?: string;
  limit?: string;
}
