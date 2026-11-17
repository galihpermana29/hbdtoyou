import type { ICoupon, IListPackageResponse } from '@/action/interfaces';

/**
 * Prices, and what a coupon does to one - in one place, so the pricing
 * cards on the home page and the checkout say the same number.
 *
 * The backend is the authority at checkout (`/coupons/preview`); this is
 * the same arithmetic done ahead of it so a card can show the price a
 * shopper will actually pay. Checked against the backend for a percent
 * coupon: 60.000 at 50% is 30.000 on both.
 */

/** A plan's price as a number. The backend sends "60.000". */
export function priceOf(plan: Pick<IListPackageResponse, 'price'>): number {
  return Number(String(plan.price ?? '').replace(/\D/g, '')) || 0;
}

/** 60000 -> "60.000", the way prices are written here. */
export function idr(amount: number): string {
  return Math.round(amount).toLocaleString('id-ID');
}

/** What is left to pay with this coupon. Never below zero. */
export function afterCoupon(price: number, coupon?: ICoupon | null): number {
  if (!coupon || price <= 0) return price;
  const off =
    coupon.discount_type === 'percent'
      ? Math.round((price * coupon.discount_value) / 100)
      : coupon.discount_value;
  return Math.max(0, price - off);
}

/** "50% off" or "IDR 10.000 off". */
export function couponSays(coupon: ICoupon): string {
  return coupon.discount_type === 'percent'
    ? `${coupon.discount_value}% off`
    : `IDR ${idr(coupon.discount_value)} off`;
}

/** Plans somebody pays for. The free plan has nothing to check out. */
export function isPaid(plan: Pick<IListPackageResponse, 'price'>): boolean {
  return priceOf(plan) > 0;
}

/**
 * What a plan puts in the account, from the plan's own numbers rather
 * than from a sentence somebody has to keep true: "10 gift credits and 10
 * scrapbook tokens, valid for 3 months".
 */
export function planGives(
  plan: Pick<
    IListPackageResponse,
    'quota_basic' | 'token_scrapbook' | 'duration_days'
  >
): string {
  const parts: string[] = [];
  if (plan.quota_basic > 0) {
    parts.push(
      `${plan.quota_basic} gift credit${plan.quota_basic === 1 ? '' : 's'}`
    );
  }
  if (plan.token_scrapbook > 0) {
    parts.push(
      `${plan.token_scrapbook} scrapbook token${plan.token_scrapbook === 1 ? '' : 's'}`
    );
  }
  if (parts.length === 0) return '';
  const months = Math.round(plan.duration_days / 30);
  const valid =
    plan.duration_days > 0
      ? months >= 1
        ? `, valid for ${months} month${months === 1 ? '' : 's'}`
        : `, valid for ${plan.duration_days} days`
      : '';
  return `${parts.join(' and ')}${valid}`;
}
