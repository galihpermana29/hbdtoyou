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
  /**
   * The address a wedding invitation answers at, when the row carries one.
   *
   * Two spellings, because the backend has used two. The v3 guide moved slug,
   * custom_domain and status into the content table as the single source of
   * truth and calls the field `slug` there; the wedding domain calls the same
   * thing `invitation_slug` everywhere else, which is what was asked for on
   * 2026-08-18. Both are read, so a listing draws an address whichever one
   * arrives, and neither has to be guessed at from here.
   *
   * The slug rather than the whole URL, so `invitation-host.ts` stays the only
   * place an address is composed - see
   * `docs/adr/0005-an-invitation-answers-at-its-own-subdomain.md`.
   *
   * Only weddings have one. Every other template type leaves them absent.
   */
  slug?: string;
  invitation_slug?: string;
  /**
   * A domain of the couple's own, when they have one.
   *
   * Read rather than sent: nothing in the flow asks a couple for one, because
   * ADR 0005 gives every published invitation `{slug}.memoify.live`. Typed so
   * a listing can prefer it over the subdomain the day somebody sells it.
   */
  custom_domain?: string | null;
}

export interface IProfileResponse {
  id: string;
  fullname: string;
  email: string;
  type: string;
  quota: number;
  token_scrapbook: number;
  /**
   * What is left of the credits each thing is made from.
   *
   * The v3 backend spends one on a successful create and refuses the call with
   * `INSUFFICIENT_QUOTA` when there is none, so these are the difference
   * between a couple who can make an invitation and a couple who cannot.
   * Optional because a profile read from an older backend carries neither, and
   * a missing balance is not a balance of zero: nothing here refuses a couple
   * on the strength of a field that was never sent.
   */
  token_wedding?: number;
  token_memoroll?: number;
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

// The wedding invitation is its own backend domain at /v1/wedding rather than a
// row in the generic content table, so it has its own payloads and responses.
// Field names below are the wire format the backend actually sends: snake_case
// for the invitation, PascalCase wherever the Go struct carries no JSON tag
// (the guest row and the publish check).

export interface IWeddingInvitationPayload {
  template_id: string;
  title: string;
  caption?: string;
  detail_content_json_text: string;
  // Left out, the backend mints `{title-slug}-{8-random-hex}`, so two couples
  // whose titles match still get addresses that do not (`hbd-vfu`).
  invitation_slug?: string;
  rsvp_enabled?: boolean;
  digital_gift_enabled?: boolean;
  // Kept, and no longer documented by the backend: the guide the backend wrote
  // on 2026-08-17 lists neither this nor a photo quota, and a published
  // invitation reads back without them. The couple's MemoRoll switch survives
  // either way, because `detail_content_json_text` carries `memoRollEnabled`
  // and that is the copy this app reads. Still sent rather than dropped on the
  // strength of an absence - `hbd-z4k` audited it and left the behaviour
  // alone; whether the backend still has a use for it is a question for them.
  pov_guest_photo_enabled?: boolean;
  song_request_enabled?: boolean;
  // Never sent. The quota moved to the Memoroll domain, which counts shots
  // rather than megabytes (`hbd-ox7.2`), and nothing here should hold a number
  // the side that refuses uploads is the one to hold.
  photo_storage_limit_mb?: number;
}

// An update sends only what changed, and cannot move an invitation to another
// template.
export type IWeddingInvitationUpdatePayload = Partial<
  Omit<IWeddingInvitationPayload, 'template_id'>
>;

export interface IWeddingCreatedResponse {
  id: string;
}

// Whether an address is still free. True is a courtesy rather than a promise:
// somebody else's save can take the name between the answer and the attempt,
// so `SLUG_TAKEN` on the save is what actually decides.
export interface IWeddingSlugAvailabilityResponse {
  available: boolean;
}

// What the backend refuses a save with when the address it carries belongs to
// somebody else already. Carried on the message of an unsuccessful result, the
// way the RSVP's two refusals are, because a couple whose chosen name was taken
// has not failed at anything and telling them so is different from telling them
// it went wrong.
export const SLUG_TAKEN = 'SLUG_TAKEN';

// What the v3 backend refuses a create with when the account has no credit
// left for it. Carried on the message of an unsuccessful result, like the
// other two refusals a caller can act on rather than only report: one credit
// is spent per invitation made, and a couple with none has run out rather
// than done something wrong.
export const INSUFFICIENT_QUOTA = 'INSUFFICIENT_QUOTA';

// The invitation as its owner sees it, whatever state it is in. This is the one
// answer that carries the Invitation Slug back to the couple who caused it: the
// create call answers with the identifier alone, and the public read answers
// only for a published invitation and only when asked by slug.
//
// The content is optional because the recorded example of this response omits
// it, on an invitation that had none yet.
//
// `full_url` is the backend's own answer to where the invitation lives, and it
// spells the address ADR 0005 already builds: `https://{slug}.memoify.live`.
// Read for confirmation rather than used - `invitation-host.ts` stays the one
// place that composes an address, because it can answer for a draft that the
// backend has no public URL for yet, and because one composer cannot disagree
// with itself. Optional here, and on the older recorded example absent.
export interface IOwnedWeddingInvitationResponse {
  id: string;
  invitation_slug: string;
  status: string;
  /**
   * The one memoroll this wedding holds, or null. The creator's door reads
   * it (2026-08-30): a wedding that already has its roll sends "Setup My
   * Memoroll" to that roll's console instead of into a wizard whose publish
   * could only be refused.
   */
  linked_memoroll?: { id: string; status: string } | null;
  rsvp_enabled: boolean;
  pov_guest_photo_enabled?: boolean;
  view_count: number;
  photo_storage_limit_mb?: number;
  full_url?: string;
  custom_domain?: string | null;
  digital_gift_enabled?: boolean;
  song_request_enabled?: boolean;
  title: string;
  caption?: string;
  detail_content_json_text?: string;
}

export interface IWeddingPublishIssue {
  Field: string;
  Message: string;
}

// Publishing is not gated on this check by the backend: the caller runs it,
// shows the couple what is still missing, and only then publishes.
export interface IWeddingPublishCheckResponse {
  OK: boolean;
  Issues: IWeddingPublishIssue[] | null;
}

export interface IWeddingPublishResponse {
  status: string;
}

export interface IWeddingGuestPayload {
  name: string;
  group_label?: string;
  phone?: string;
  email?: string;
  max_plus_ones?: number;
  notes?: string;
}

// Token is the guest's personal link. The backend mints it; nothing here does.
//
// Notes is written down even though the recorded example of this response omits
// it, because the batch insert and the edit both accept one: a column the couple
// fills in and the row never carries back is a column that empties itself the
// first time anybody reads the list.
export interface IWeddingGuestResponse {
  ID: string;
  WeddingID: string;
  Name: string;
  GroupLabel?: string | null;
  Phone?: string | null;
  Email?: string | null;
  Notes?: string | null;
  Token: string;
  MaxPlusOnes: number;
  RSVPStatus: string;
  OpenCount?: number;
  CreateTime: string;
}

// What the backend answers a public read with when the invitation exists but is
// still a draft, carried on the message of an unsuccessful result. It is the one
// refusal a caller can act on rather than only report: a link that has arrived
// ahead of its wedding is a link somebody should keep.
export const INVITATION_NOT_PUBLISHED = 'INVITATION_NOT_PUBLISHED';

// What a wedding guest sees. Only ever answered for a published invitation.
//
// Optional on the two fields the v2 backend stopped answering with: a live read
// of a published invitation on 2026-08-17 carried neither, and a type that
// promises a field the wire does not send is a type that lies to whoever
// reads it (`hbd-z4k`). Nothing here is worse off for it - the flags that
// decide what an invitation draws are the ones inside
// `detail_content_json_text`, which is where the Site Preview and the
// Showcase read them too.
export interface IPublicWeddingInvitationResponse {
  id: string;
  invitation_slug: string;
  status: string;
  rsvp_enabled: boolean;
  pov_guest_photo_enabled?: boolean;
  view_count: number;
  full_url?: string;
  title: string;
  detail_content_json_text: string;
}

// One Guest Message as the invitation is allowed to show it.
//
// The public read carries who wrote them, the words and when they were
// written, and hides the rest of what the RSVP holds: which row of the Guest
// List the guest is, whether they are coming and who they bring are the
// couple's business rather than the wall's.
//
// `invitee_name` is what the endpoint answers with. It is not in
// `integrations/FE_INTEGRATION_GUIDE-v3.md`, whose example payload for this
// endpoint still shows the three fields it carried before the name was added;
// the backend confirmed the field on 2026-08-24 and the guide has not caught
// up. The type is what the wire says rather than what the guide says, and this
// note is here so the next reader does not "fix" it back to the document.
export interface IWeddingPublicRsvpMessage {
  id: string;
  message: string;
  submitted_at: string;
  /** Who wrote it, as the Guest List holds their name. */
  invitee_name?: string;
  // Three older spellings, kept because they cost nothing and because the
  // guide's silence on this field means the wire is the only thing that says
  // which one is live. A deployment still answering an earlier way signs its
  // cards rather than leaving them blank.
  name?: string;
  guest_name?: string;
  sender_name?: string;
}

/** The name on a Guest Message, whichever way the backend spelled it. */
export function guestMessageName(
  entry: IWeddingPublicRsvpMessage
): string | null {
  const named =
    entry.invitee_name ??
    entry.name ??
    entry.guest_name ??
    entry.sender_name ??
    '';
  return named.trim() || null;
}

export interface IWeddingRsvpPayload {
  is_attending: boolean;
  plus_one_count?: number;
  plus_one_names?: string;
  message?: string;
}

// What the backend refuses a second reply with, carried on the message of an
// unsuccessful result. One guest may answer once - the table holds a unique
// constraint on the guest - and this is the other refusal a caller can act on
// rather than only report: a guest who has already replied has not failed at
// anything, and telling them so is different from telling them it went wrong.
export const GUEST_ALREADY_RESPONDED = 'GUEST_ALREADY_RESPONDED';

// What the backend refuses a reply with when its IP has sent too many too
// quickly, carried the same way. Also a refusal a caller can act on rather
// than only report: a rate-limited guest has a reply the couple will take,
// just not this second, and "try again shortly" is different from "it went
// wrong". Any message that is neither of these two constants stays generic -
// inventing reasons the backend has not named would be guessing.
export const RATE_LIMITED = 'RATE_LIMITED';

/* ------------------------------- MemoRoll ------------------------------- */

// What the backend refuses a memoroll create or update with when the wedding
// it names already has an active memoroll of its own. One wedding, one
// memoroll: the dashboard card knows this before it navigates, so meeting the
// refusal at save time means two tabs raced - carried on the message of an
// unsuccessful result so the flow can point at the existing memoroll rather
// than print an error nobody caused.
export const WEDDING_ALREADY_LINKED = 'WEDDING_ALREADY_LINKED';

// What the gallery answers for an event that is not published. Under
// create-published-or-nothing this is a stale or mistyped link, and the guest
// page reads it as not-found.
export const EVENT_NOT_PUBLISHED = 'EVENT_NOT_PUBLISHED';

// What a creator sends when the flow's last step publishes. `ends_at` is
// always `reveal_at`: shooting runs to the Reveal and there is no separate
// moment the cameras are collected (CONTEXT.md), so the backend's countdown
// phase never occurs.
export interface IMemorollPayload {
  template_id: string;
  title: string;
  host_name: string;
  caption?: string;
  wedding_id?: string;
  detail_content_json_text: string;
  starts_at: string;
  ends_at: string;
  reveal_at: string;
  shot_limit: number;
  cover_style: string;
  cover_photo_urls: string[];
}

export interface IMemorollCreatedResponse {
  id: string;
  /** Answered since 2026-08-30; optional so an older backend still parses. */
  code?: string;
  full_url?: string;
}

// One event as its owner reads it back. The listing rows carry the same shape
// with `title`, `caption` and `detail_content_json_text` empty - the listing
// does not join the content table - which is why the dashboard matches rows by
// `wedding_id` and never reads a name off one.
export interface IMemorollEventResponse {
  id: string;
  content_id: string;
  template_id: string;
  wedding_id: string | null;
  code: string;
  /** The backend's own answer for where the event lives. Read for the code
   *  beside it rather than followed: the guest page is `/memoroll/{code}`. */
  full_url: string;
  host_name: string;
  shot_limit: number;
  cover_style: string;
  cover_photo_urls: string[] | null;
  starts_at: string;
  ends_at: string;
  reveal_at?: string;
  status: string;
  title: string;
  caption: string;
  detail_content_json_text: string;
  create_time: string;
}

// The five words the gallery uses for where the event stands. `countdown`
// never occurs on events this app creates (ends_at = reveal_at) and `locked`
// arrives as a refusal rather than a phase, but both are read if a foreign
// event ever answers with them.
export type MemorollPhase =
  | 'locked'
  | 'upcoming'
  | 'ongoing'
  | 'countdown'
  | 'revealed';

export interface IMemorollGalleryEvent {
  code: string;
  host_name: string;
  starts_at: string;
  ends_at: string;
  shot_limit: number;
  cover_style: string;
  cover_photo_urls: string[] | null;
  full_url: string;
  /** Not in the recorded contract yet - asked for on 2026-08-29 so the venue
   *  screen has something to render. Read when the backend starts sending it. */
  detail_content_json_text?: string;
}

export interface IMemorollGalleryPhoto {
  id: string;
  photo_url: string;
  uploader_name: string;
  create_time: string;
  /**
   * Whether this photo belongs to the authenticated caller - stamped by the
   * backend (2026-08-30) so ownership never rides on name-matching, which
   * two guests picking the same handle would break. Since the same change
   * the pre-reveal gallery carries other guests' photos too; this flag is
   * what decides sharp from Veiled.
   */
  is_mine?: boolean;
}

// The gallery, shaped by who asked. Without auth only `phase` and `event`
// come back - the preview a guest reads before "Get me in". With auth the
// caller is joined as a participant and `participant` appears; `photos` is
// their own Shots until the Reveal and everybody's after.
export interface IMemorollGalleryResponse {
  phase: MemorollPhase;
  event: IMemorollGalleryEvent;
  participant?: {
    shots_used: number;
    shots_remaining: number;
  };
  photo_count?: number;
  reveal_at?: string;
  photos?: IMemorollGalleryPhoto[];
}

// The owner's numbers for one event, off `GET /v1/memoroll/{id}/dashboard`.
export interface IMemorollDashboardResponse {
  status: string;
  phase: MemorollPhase;
  participant_count: number;
  photo_count: number;
  shot_limit: number;
  starts_at: string;
  ends_at: string;
  full_url: string;
}

// One joined guest as the owner reads them. `display_name` is the handle the
// guest confirmed on "This you?" (sent with their photo registrations since
// 2026-08-30); null or empty when they never renamed themselves.
export interface IMemorollParticipant {
  id: string;
  user_id: string;
  user_name: string;
  display_name?: string | null;
  shots_used: number;
  photo_count: number;
  joined_at: string;
}

// A partial update to one event: send only what changed. `title`, `caption`
// and `detail_content_json_text` land on the content row, the rest on
// `memoroll_events`. `ends_at` must travel with `reveal_at` and equal it -
// shooting runs to the Reveal (CONTEXT.md).
export interface IMemorollUpdatePayload {
  title?: string;
  caption?: string;
  host_name?: string;
  detail_content_json_text?: string;
  shot_limit?: number;
  starts_at?: string;
  ends_at?: string;
  reveal_at?: string;
  cover_style?: string;
  cover_photo_urls?: string[];
}
