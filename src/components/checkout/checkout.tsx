'use client';

import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Lock, Tag, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

import type {
  ICouponPreviewResponse,
  IGetDetailPayment,
  IQRISPaymentResponse,
} from '@/action/interfaces';
import {
  generatePaypal,
  generateQRIS,
  getDetailPayment,
  getListPackages,
  getPromotedCoupon,
  previewCoupon,
} from '@/action/user-api';
import { useMemoifySession } from '@/app/session-provider';
import qrisImage from '@/assets/qris-logo.png';
import { press } from '@/components/home/ui';
import { landingFonts } from '@/components/memoroll/landing/fonts';
import { memorollFonts } from '@/components/memoroll/ui/fonts';
import NavigationBar from '@/components/ui/navbar';
import { peekAfterPayment, takeAfterPayment } from '@/lib/after-payment';
import { idr, isPaid, planGives, priceOf } from '@/lib/pricing';
import { useCalmMotion } from '@/lib/use-calm-motion';

import { NotPaidView, PaidView, QrView, SignedOut, card } from './views';

/**
 * The checkout (`/payment`): where a plan that has been chosen is paid for.
 * Comparing plans is the pricing section on the home page (owner,
 * 2026-11-17); this page is the order and the payment, in the MemoRoll
 * design system.
 *
 * What it does is what the page before it did - the same backend calls,
 * the same query string (`type`, `plan_id`, `id`), the same return to the
 * gift the paywall sent the buyer from - with these differences:
 * - the plans are two cards to pick from, each saying what it adds to the
 *   account from its own numbers, instead of a dropdown of names. The free
 *   plan is not offered: there is nothing to pay for;
 * - the running promotion is applied on arrival, not just typed into the
 *   box, so the total matches the price the pricing cards showed;
 * - the QR screen says how much, for what, how to pay, how long is left,
 *   and offers the way back;
 * - a payment the backend says failed gets a screen; it used to get a
 *   blank panel;
 * - the Google Pay and Apple Pay buttons are gone: they never worked.
 *
 * Motion (emilkowalski/skills): a place people come to pay, so little of
 * it. One entrance wave; the screens trade places with a short fade; the
 * total changes with a fade when a coupon lands; press feedback; and one
 * small celebration when the payment is confirmed (views.tsx).
 */

function isUuid(value: string | null): value is string {
  return (
    !!value &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

/**
 * The page before this one wrote the literal strings `null` and `undefined`
 * into its own query string; links like that are still out there. Read as a
 * plan id they would make an absent plan look present.
 */
function readQueryValue(raw: string | null): string | null {
  if (!raw || raw === 'null' || raw === 'undefined') return null;
  return raw;
}

/**
 * The QR in progress, kept for this tab while it is still good.
 *
 * Starting a payment with a coupon claims that coupon for the account, paid
 * or not: asking for a second QR with the same code is refused
 * (COUPON_ALREADY_CLAIMED). So a QR is never thrown away while it can still
 * be paid - going back to the order, or reloading, and paying the same order
 * again shows the same QR instead of asking for a new one.
 */
const QR_KEY = 'memoify:checkout-qr';
const QR_GOOD_FOR_MS = 10 * 60 * 1000;
interface KeptQr {
  qris: IQRISPaymentResponse;
  planId: string;
  coupon: string;
  at: number;
}
function keptQr(): KeptQr | null {
  try {
    const kept = JSON.parse(
      window.sessionStorage.getItem(QR_KEY) ?? 'null'
    ) as KeptQr | null;
    // Not worth showing with under half a minute left on it.
    if (!kept || Date.now() - kept.at > QR_GOOD_FOR_MS - 30_000) return null;
    return kept;
  } catch {
    return null;
  }
}
function keepQr(kept: KeptQr | null) {
  try {
    if (kept) window.sessionStorage.setItem(QR_KEY, JSON.stringify(kept));
    else window.sessionStorage.removeItem(QR_KEY);
  } catch {
    // Without storage a second QR is simply asked for, as before.
  }
}

/** The backend's refusals a shopper can do something about, in words. */
function refusal(code: string | undefined, fallback: string): string {
  if (code === 'COUPON_ALREADY_CLAIMED') {
    return 'This coupon was already used on a payment you started earlier. Remove it to pay the full price.';
  }
  return code || fallback;
}

const at = (ms: number, rise: number): CSSProperties =>
  ({ '--at': `${ms}ms`, '--rise': `${rise}px` }) as CSSProperties;

const POLL_MS = 7000;

/**
 * The statuses that mean a payment will never be paid. Only `pending` and
 * `done` have been seen from the backend for a QR payment (and an empty
 * status on other records), so anything not named here is treated as still
 * waiting rather than as a failure: telling someone who is about to pay
 * that their payment failed is the worse mistake.
 */
const FAILED = ['failed', 'rejected', 'expired', 'cancelled', 'canceled'];
const hasFailed = (status?: string | null) =>
  FAILED.includes((status ?? '').toLowerCase());

export default function Checkout() {
  const session = useMemoifySession();
  const router = useRouter();
  const query = useSearchParams();
  const reduce = useCalmMotion();

  const paymentId = readQueryValue(query.get('id'));
  const type = readQueryValue(query.get('type'));
  const planId = readQueryValue(query.get('plan_id'));

  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => (await getListPackages()).data,
  });
  const { data: promoted } = useQuery({
    queryKey: ['promoted-coupon'],
    queryFn: async () => (await getPromotedCoupon()).data ?? null,
  });

  const plans = useMemo(() => (packages ?? []).filter(isPaid), [packages]);
  const plan = plans.find((entry) => entry.id === planId) ?? null;
  const price = plan ? priceOf(plan) : 0;

  const [qris, setQris] = useState<IQRISPaymentResponse | null>(null);
  const [qrisAt, setQrisAt] = useState(0);
  const [status, setStatus] = useState<IGetDetailPayment | null>(null);
  const [paying, setPaying] = useState<'qris' | 'paypal' | null>(null);
  const [paypalOpened, setPaypalOpened] = useState(false);

  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<{
    code: string;
    preview: ICouponPreviewResponse;
  } | null>(null);
  const [applying, setApplying] = useState(false);
  // The code this order should carry when the plan changes: the running
  // promotion at first, then whatever the shopper applied, or nothing once
  // they removed it.
  const wanted = useRef<string | null>(null);
  const asked = useRef(0);

  const address = useCallback(
    (parts: { plan?: string | null; id?: string | null }) => {
      const next = new URLSearchParams();
      const chosen = parts.plan === undefined ? planId : parts.plan;
      const name = plans.find((entry) => entry.id === chosen)?.name ?? '';
      next.set(
        'type',
        name.toLowerCase().startsWith('advanced')
          ? 'advanced'
          : name
            ? 'premium'
            : (type ?? 'premium')
      );
      if (chosen) next.set('plan_id', chosen);
      if (parts.id) next.set('id', parts.id);
      return `/payment?${next.toString()}`;
    },
    [planId, plans, type]
  );

  // Arriving with no plan (or the free one, or an id that no longer exists)
  // is a supported way in: the plan is resolved from `type`, and the URL is
  // pinned to it so `plan_id` stays the one source of truth.
  useEffect(() => {
    if (plan || plans.length === 0) return;
    const named = (type ?? 'premium').toLowerCase();
    const match =
      plans.find((entry) => entry.name?.toLowerCase().startsWith(named)) ??
      plans[0];
    router.replace(address({ plan: match.id }));
  }, [plan, plans, type, router, address]);

  const apply = useCallback(
    async (raw: string, quiet: boolean) => {
      const wantedCode = raw.trim().toUpperCase();
      if (!wantedCode || !plan) return;
      const mine = ++asked.current;
      setApplying(true);
      const res = await previewCoupon({
        code: wantedCode,
        package_id: plan.id,
      });
      if (mine !== asked.current) return;
      setApplying(false);
      if (res.success && res.data) {
        setApplied({ code: wantedCode, preview: res.data });
        wanted.current = wantedCode;
        if (!quiet) message.success('Coupon applied');
      } else {
        setApplied(null);
        if (!quiet) message.error(res.message || 'That code is not valid');
      }
    },
    [plan]
  );

  // A coupon is priced per plan, so a new plan asks again - quietly: the
  // shopper did not press anything.
  const planKey = plan?.id;
  const promotedCode = promoted?.code;
  useEffect(() => {
    if (!planKey || !session?.accessToken) return;
    if (wanted.current === null && promotedCode) wanted.current = promotedCode;
    setApplied(null);
    if (wanted.current) {
      setCode(wanted.current);
      apply(wanted.current, true);
    }
    // `apply` is left out on purpose: it changes with the plan, which
    // `planKey` already stands for.
  }, [planKey, promotedCode, session?.accessToken]);

  const removeCoupon = () => {
    // Any check still on its way is no longer wanted, or waited for.
    asked.current++;
    setApplying(false);
    wanted.current = '';
    setApplied(null);
    setCode('');
  };

  const total = applied ? applied.preview.final_price : price;

  const payWithQris = async () => {
    if (!plan) return;
    const coupon = applied?.code ?? '';
    // The same order again, with its QR still good: show that one.
    const kept = keptQr();
    if (kept && kept.planId === plan.id && kept.coupon === coupon) {
      setStatus(null);
      setQrisAt(kept.at);
      setQris(kept.qris);
      router.replace(address({ id: kept.qris.payment_id }));
      return;
    }
    setPaying('qris');
    const res = await generateQRIS({
      package_id: plan.id,
      payment_method: 'qris',
      ...(coupon ? { coupon_code: coupon } : {}),
    });
    setPaying(null);
    if (res.success && res.data) {
      const now = Date.now();
      keepQr({ qris: res.data, planId: plan.id, coupon, at: now });
      setStatus(null);
      setQrisAt(now);
      setQris(res.data);
      router.replace(address({ id: res.data.payment_id }));
    } else {
      message.error(refusal(res.message, 'Could not start the payment'));
    }
  };

  const payWithPaypal = async () => {
    if (!plan) return;
    setPaying('paypal');
    const res = await generatePaypal({
      package_id: plan.id,
      payment_method: 'paypal',
      ...(applied ? { coupon_code: applied.code } : {}),
    });
    setPaying(null);
    if (res.success && res.data) {
      window.open(
        `https://www.paypal.com/checkoutnow?token=${res.data.order_id}&type=${type}&plan_id=${plan.id}`,
        '_blank'
      );
      localStorage.setItem('paypal_payment', JSON.stringify(res.data));
      setPaypalOpened(true);
    } else {
      message.error(refusal(res.message, 'Could not start the PayPal payment'));
    }
  };

  // A payment id in the address with no QR on the page: a reload brings the
  // QR back if it is this tab's and still good; anything else (an old link)
  // is not a payment in progress here, and the id is dropped.
  const restoring = useRef(false);
  useEffect(() => {
    // Once, on arrival. Later the id only ever leaves the address ("Pay
    // another way"), and must not bring the QR straight back.
    const kept = keptQr();
    if (paymentId && kept && kept.qris.payment_id === paymentId) {
      restoring.current = true;
      setQrisAt(kept.at);
      setQris(kept.qris);
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (qris) {
      restoring.current = false;
      return;
    }
    if (!paymentId || restoring.current) return;
    router.replace(address({ id: null }));
  }, [qris, paymentId, router, address]);

  const backToOrder = useCallback(() => {
    setQris(null);
    setStatus(null);
    router.replace(address({ id: null }));
  }, [router, address]);

  // While a QR is up, keep asking whether it has been paid.
  const watching = qris && isUuid(paymentId) && status?.status !== 'done';
  useEffect(() => {
    if (!watching) return;
    const timer = setInterval(async () => {
      const res = await getDetailPayment(paymentId as string);
      if (res.success && res.data) {
        // Settled either way: this QR is not one to come back to.
        if (res.data.status === 'done' || hasFailed(res.data.status)) {
          keepQr(null);
        }
        setStatus(res.data);
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [watching, paymentId]);

  const gone = useRef(false);
  const go = useCallback(() => {
    // Once. The countdown and the button can both ask, and a second ask
    // would find the "back to my gift" note already taken and send the
    // buyer to the dashboard instead.
    if (gone.current) return;
    gone.current = true;
    // A full load, so the account's new balance is read everywhere. Back to
    // the gift the paywall sent them from, when it did.
    window.location.href = takeAfterPayment() ?? '/dashboard';
  }, []);

  const expired = useCallback(() => {
    keepQr(null);
    backToOrder();
    message.info('That QR code expired. Start the payment again.');
  }, [backToOrder]);

  const state = !session?.accessToken
    ? 'signed-out'
    : status?.status === 'done'
      ? 'paid'
      : hasFailed(status?.status)
        ? 'not-paid'
        : qris
          ? 'qr'
          : 'order';

  const swap = {
    initial: reduce
      ? { opacity: 0 }
      : { opacity: 0, transform: 'translateY(10px)' },
    animate: reduce
      ? { opacity: 1 }
      : { opacity: 1, transform: 'translateY(0px)' },
    exit: { opacity: 0 },
    transition: { duration: 0.26, ease: [0.23, 1, 0.32, 1] as const },
  };

  return (
    <div className={`${memorollFonts} ${landingFonts}`}>
      <div className="fixed left-0 top-0 z-[1000] w-full isolate">
        <NavigationBar />
      </div>
      <main
        className="mt-[81px] min-h-[calc(100vh-81px)] bg-[#fbf4ec] px-5 py-10 md:py-14"
        style={{ fontFamily: 'var(--font-mr-body)' }}>
        <AnimatePresence initial={false} mode="wait">
          {state === 'signed-out' ? (
            <motion.div key="signed-out" {...swap}>
              <SignedOut />
            </motion.div>
          ) : state === 'paid' ? (
            <motion.div key="paid" {...swap}>
              <PaidView plan={plan} backToGift={peekAfterPayment()} onGo={go} />
            </motion.div>
          ) : state === 'not-paid' ? (
            <motion.div key="not-paid" {...swap}>
              <NotPaidView onRetry={backToOrder} />
            </motion.div>
          ) : state === 'qr' && qris ? (
            <motion.div key="qr" {...swap}>
              <QrView
                qr={qris.qris_resp}
                amount={qris.price ?? total}
                startedAt={qrisAt}
                plan={plan}
                onBack={backToOrder}
                onExpired={expired}
              />
            </motion.div>
          ) : (
            <motion.div
              key="order"
              {...swap}
              className="mx-auto max-w-[1040px]">
              <div className="home-enter" style={at(0, 14)}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-[14px] font-medium tracking-[-0.28px] text-[#e34013]">
                  <span className="size-[6px] rounded-full bg-[#ff3e09]" />
                  Checkout
                </span>
                <h1 className="mt-4 text-[32px] font-bold leading-[1.06] tracking-[-0.04em] text-[#1b1b1b] md:text-[44px]">
                  Complete your upgrade
                </h1>
                <p className="mt-2 text-[16px] leading-[1.6] text-[#4a4642]">
                  One payment, no subscription.{' '}
                  <Link
                    href="/#pricing"
                    className="font-semibold text-[#e34013] underline underline-offset-2">
                    Compare the plans
                  </Link>
                </p>
              </div>

              {/* In the source: plan, order, what it includes - the order a
                  phone shows them in, so the pay button is not below a list.
                  A wide screen puts the order in its own column. */}
              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
                {/* The plan */}
                <div
                  className={`home-enter lg:col-start-1 lg:row-start-1 ${card}`}
                  style={at(80, 12)}>
                  <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#1b1b1b]">
                    Your plan
                  </h2>
                  <div
                    role="radiogroup"
                    aria-label="Plan"
                    className="mt-4 flex flex-col gap-3">
                    {plans.length === 0
                      ? [0, 1].map((row) => (
                          <span
                            key={row}
                            aria-hidden
                            className="h-[84px] animate-pulse rounded-[20px] bg-[#f1e8dd] motion-reduce:animate-none"
                          />
                        ))
                      : plans.map((entry) => {
                          const on = entry.id === plan?.id;
                          return (
                            <button
                              key={entry.id}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              onClick={() =>
                                !on &&
                                router.replace(address({ plan: entry.id }))
                              }
                              className={`flex items-center gap-4 rounded-[20px] border p-4 text-left transition-colors duration-200 ${press} ${
                                on
                                  ? 'border-[#ff3e09] bg-[#fff0e9]'
                                  : 'border-[rgba(33,33,33,0.16)] bg-[#fffdfa]'
                              }`}>
                              <span
                                aria-hidden
                                className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                                  on
                                    ? 'border-[#ff3e09] bg-[#ff3e09]'
                                    : 'border-[rgba(33,33,33,0.3)] bg-white'
                                }`}>
                                {on ? (
                                  <Check
                                    className="size-3 text-white"
                                    strokeWidth={3}
                                  />
                                ) : null}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[16px] font-bold text-[#1b1b1b]">
                                  {entry.name}
                                </span>
                                <span className="mt-0.5 block text-[14px] leading-[1.45] text-[#4a4642]">
                                  {planGives(entry) || entry.description}
                                </span>
                              </span>
                              <span className="shrink-0 text-[16px] font-bold text-[#1b1b1b]">
                                IDR {idr(priceOf(entry))}
                              </span>
                            </button>
                          );
                        })}
                  </div>
                </div>

                {/* The order */}
                <div
                  className={`home-enter lg:sticky lg:top-[105px] lg:col-start-2 lg:row-span-2 lg:row-start-1 ${card}`}
                  style={at(140, 10)}>
                  <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#1b1b1b]">
                    Order summary
                  </h2>

                  <dl className="mt-4 flex flex-col gap-2.5 text-[15px]">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[#4a4642]">{plan?.name ?? 'Plan'}</dt>
                      <dd className="font-semibold text-[#1b1b1b]">
                        IDR {idr(price)}
                      </dd>
                    </div>
                    {applied ? (
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-[#4a4642]">
                          Coupon {applied.code}
                        </dt>
                        <dd className="font-semibold text-[#e34013]">
                          − IDR {idr(applied.preview.discount_amount)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-4 border-t border-dashed border-[#e0d6ca] pt-4">
                    {applied ? (
                      <p className="flex items-center justify-between gap-3 rounded-[12px] bg-[#fff0e9] px-3 py-2.5 text-[14px] font-semibold text-[#7b4034]">
                        <span className="flex min-w-0 items-center gap-2">
                          <Tag
                            aria-hidden
                            className="size-4 shrink-0 text-[#e34013]"
                          />
                          <span className="truncate">
                            {applied.code} applied
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          aria-label={`Remove coupon ${applied.code}`}
                          className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[#7b4034] ${press}`}>
                          <X aria-hidden className="size-4" />
                        </button>
                      </p>
                    ) : (
                      <form
                        className="flex gap-2"
                        onSubmit={(event) => {
                          event.preventDefault();
                          if (!code.trim()) {
                            message.warning('Enter a coupon code first');
                            return;
                          }
                          apply(code, false);
                        }}>
                        <label className="min-w-0 flex-1">
                          <span className="sr-only">Coupon code</span>
                          <input
                            value={code}
                            onChange={(event) =>
                              setCode(event.target.value.toUpperCase())
                            }
                            placeholder="Coupon code"
                            autoCapitalize="characters"
                            autoComplete="off"
                            className="h-11 w-full rounded-[12px] border border-[rgba(33,33,33,0.2)] bg-white px-3 text-[16px] text-[#1b1b1b] outline-none placeholder:text-[#a3a3a3] focus:border-[#ff3e09]"
                          />
                        </label>
                        <button
                          type="submit"
                          disabled={applying || !plan}
                          className={`h-11 shrink-0 rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] px-5 text-[15px] font-semibold text-[#1b1b1b] disabled:opacity-60 ${press}`}>
                          {applying ? 'Checking…' : 'Apply'}
                        </button>
                      </form>
                    )}
                    {!applied && promoted && code.trim() !== promoted.code ? (
                      <p className="mt-2 text-[13px] text-[#6b655f]">
                        Running now:{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setCode(promoted.code);
                            apply(promoted.code, false);
                          }}
                          className="font-bold text-[#e34013] underline underline-offset-2">
                          {promoted.code}
                        </button>
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#e8ded3] pt-4">
                    <span className="text-[16px] font-bold text-[#1b1b1b]">
                      Total
                    </span>
                    <span className="text-right" aria-live="polite">
                      {applied ? (
                        <span className="block text-[14px] text-[#8a847d] line-through">
                          IDR {idr(price)}
                        </span>
                      ) : null}
                      <span
                        key={total}
                        className="home-enter block text-[28px] font-bold leading-none tracking-[-0.03em] text-[#1b1b1b]"
                        style={at(0, 6)}>
                        IDR {idr(total)}
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={payWithQris}
                    disabled={!plan || paying !== null}
                    className={`mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#ff3e09] text-[17px] font-semibold text-white shadow-[inset_2px_3px_3.2px_rgba(255,255,255,0.25)] disabled:opacity-60 ${press}`}>
                    <Image src={qrisImage} alt="" width={22} height={22} />
                    {paying === 'qris' ? 'Preparing your QR…' : 'Pay with QRIS'}
                  </button>
                  <button
                    type="button"
                    onClick={payWithPaypal}
                    disabled={!plan || paying !== null}
                    className={`mt-3 flex h-12 w-full items-center justify-center rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] text-[16px] font-semibold text-[#1b1b1b] disabled:opacity-60 ${press}`}>
                    {paying === 'paypal'
                      ? 'Opening PayPal…'
                      : 'Pay with PayPal'}
                  </button>
                  {paypalOpened ? (
                    <p className="mt-3 rounded-[12px] bg-[#fbf4ec] px-3 py-2.5 text-[13px] leading-[1.5] text-[#4a4642]">
                      PayPal opened in a new tab. Finish there and your plan is
                      added when PayPal confirms it.
                    </p>
                  ) : null}

                  <p className="mt-4 flex items-start gap-2 text-[13px] leading-[1.5] text-[#6b655f]">
                    <Lock aria-hidden className="mt-[2px] size-3.5 shrink-0" />
                    QRIS works with any Indonesian banking or e-wallet app. Your
                    plan is added as soon as the payment is confirmed.
                  </p>
                </div>

                {plan?.features?.length ? (
                  <div
                    className={`home-enter lg:col-start-1 lg:row-start-2 ${card}`}
                    style={at(180, 8)}>
                    <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#1b1b1b]">
                      What {plan.name} includes
                    </h2>
                    <ul key={plan.id} className="mt-3 flex flex-col gap-2.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-[15px] leading-[1.5] text-[#35302b]">
                          <span className="mt-[2px] flex size-5 shrink-0 items-center justify-center rounded-full bg-[#ff3e09]">
                            <Check
                              aria-hidden
                              className="size-3 text-white"
                              strokeWidth={3}
                            />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
